import os
from dotenv import load_dotenv
from sqlmodel import Session, select, delete
import datetime
from typing import Dict

from app.models import Job
from app.database import engine

load_dotenv()


class JobCleanupConfig:
    LOW_MATCH_RETENTION = 14
    STANDARD_RETENTION = 30
    HIGH_MATCH_RETENTION = 60
    APPLIED_RETENTION = None
    VIEWED_RETENTION = 45
    MIN_MATCH_SCORE_TO_KEEP = 3
    MAX_JOBS_PER_COMPANY = 15


def get_cleanup_stats(session: Session) -> Dict:
    stats = {}
    stats["total_jobs"] = len(session.exec(select(Job)).all())

    statuses = session.exec(select(Job.status).distinct()).all()
    for status in statuses:
        count = len(session.exec(select(Job).where(Job.status == status)).all())
        stats[f'status_{status.lower().replace(" ", "_")}'] = count

    stats["high_match"] = len(
        session.exec(select(Job).where(Job.match_score >= 8)).all()
    )
    stats["medium_match"] = len(
        session.exec(select(Job).where(Job.match_score.between(5, 7))).all()
    )
    stats["low_match"] = len(session.exec(select(Job).where(Job.match_score < 5)).all())

    return stats


def cleanup_by_retention_policy(session: Session) -> Dict[str, int]:
    current_time = datetime.datetime.now(datetime.timezone.utc)
    deleted_counts = {}

    very_low_cutoff = current_time - datetime.timedelta(days=7)
    very_low_stmt = delete(Job).where(
        Job.match_score < JobCleanupConfig.MIN_MATCH_SCORE_TO_KEEP,
        Job.date_found < very_low_cutoff,
        Job.status == "New",
    )
    result = session.exec(very_low_stmt)
    deleted_counts["very_low_match"] = result.rowcount

    low_match_cutoff = current_time - datetime.timedelta(
        days=JobCleanupConfig.LOW_MATCH_RETENTION
    )
    low_match_stmt = delete(Job).where(
        Job.match_score.between(3, 4),
        Job.date_found < low_match_cutoff,
        Job.status == "New",
    )
    result = session.exec(low_match_stmt)
    deleted_counts["low_match"] = result.rowcount

    standard_cutoff = current_time - datetime.timedelta(
        days=JobCleanupConfig.STANDARD_RETENTION
    )
    standard_stmt = delete(Job).where(
        Job.date_found < standard_cutoff,
        Job.status.in_(["New"]),
        ~Job.match_score.between(8, 10),
    )
    result = session.exec(standard_stmt)
    deleted_counts["standard"] = result.rowcount

    viewed_cutoff = current_time - datetime.timedelta(
        days=JobCleanupConfig.VIEWED_RETENTION
    )
    viewed_stmt = delete(Job).where(
        Job.status == "Viewed", Job.date_found < viewed_cutoff
    )
    result = session.exec(viewed_stmt)
    deleted_counts["viewed_old"] = result.rowcount

    high_match_cutoff = current_time - datetime.timedelta(
        days=JobCleanupConfig.HIGH_MATCH_RETENTION
    )
    high_match_stmt = delete(Job).where(
        Job.match_score >= 8,
        Job.date_found < high_match_cutoff,
        Job.status.in_(["New", "Viewed"]),
    )
    result = session.exec(high_match_stmt)
    deleted_counts["high_match_old"] = result.rowcount

    session.commit()
    return deleted_counts


def cleanup_company_spam(session: Session) -> int:
    companies = session.exec(select(Job.company).distinct()).all()
    total_deleted = 0

    for company in companies:
        company_jobs = session.exec(
            select(Job)
            .where(Job.company == company)
            .order_by(Job.match_score.desc(), Job.date_found.desc())
        ).all()

        if len(company_jobs) > JobCleanupConfig.MAX_JOBS_PER_COMPANY:
            jobs_to_delete = company_jobs[JobCleanupConfig.MAX_JOBS_PER_COMPANY :]
            for job in jobs_to_delete:
                if job.status == "New":
                    session.delete(job)
                    total_deleted += 1

    session.commit()
    return total_deleted


def cleanup_duplicate_urls(session: Session) -> int:
    url_counts = {}
    all_jobs = session.exec(select(Job)).all()

    for job in all_jobs:
        if job.url in url_counts:
            url_counts[job.url].append(job)
        else:
            url_counts[job.url] = [job]

    deleted_count = 0
    for url, jobs in url_counts.items():
        if len(jobs) > 1:
            jobs.sort(
                key=lambda x: (
                    x.status != "Applied",
                    x.status != "Interested",
                    x.date_found,
                ),
                reverse=True,
            )

            for job_to_delete in jobs[1:]:
                session.delete(job_to_delete)
                deleted_count += 1

    session.commit()
    return deleted_count


def run_cleanup():
    print("🚀 JobBot Database Cleanup initiated")
    print(
        f"⏰ Process started: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}"
    )

    with Session(engine) as session:
        print("📊 Analyzing current database state")
        pre_stats = get_cleanup_stats(session)

        print(f"Database contains {pre_stats['total_jobs']} total jobs")
        print(f"High-value jobs (match ≥8): {pre_stats.get('high_match', 0)}")
        print(f"Medium-value jobs (match 5-7): {pre_stats.get('medium_match', 0)}")
        print(f"Low-value jobs (match <5): {pre_stats.get('low_match', 0)}")

        if pre_stats["total_jobs"] == 0:
            print("✅ Database empty - no cleanup required")
            return

        print("🔍 Executing cleanup operations")

        print("Removing duplicate entries")
        duplicates_deleted = cleanup_duplicate_urls(session)

        print("Applying retention policies")
        deleted_counts = cleanup_by_retention_policy(session)

        print("Managing company job limits")
        spam_deleted = cleanup_company_spam(session)

        policy_total = sum(deleted_counts.values())
        total_deleted = policy_total + spam_deleted + duplicates_deleted

        post_stats = get_cleanup_stats(session)

        print("✅ Cleanup operations completed successfully")
        print("📈 Cleanup summary:")

        if duplicates_deleted > 0:
            print(f"Duplicate URLs removed: {duplicates_deleted}")

        for category, count in deleted_counts.items():
            if count > 0:
                category_name = category.replace("_", " ").title()
                print(f"{category_name} jobs removed: {count}")

        if spam_deleted > 0:
            print(f"Company limit excess removed: {spam_deleted}")

        print(
            f"Database size reduced from {pre_stats['total_jobs']} to {post_stats['total_jobs']} jobs"
        )
        print(f"Total jobs processed: {total_deleted}")

        if pre_stats["total_jobs"] > 0:
            space_saved = (total_deleted / pre_stats["total_jobs"]) * 100
            print(f"Storage optimization: {space_saved:.1f}%")

        if post_stats["total_jobs"] > 1000:
            print(
                "⚠️ Database size exceeds 1,000 jobs - consider adjusting retention policies"
            )
        elif post_stats["total_jobs"] > 500:
            print("💡 Database approaching 500 jobs - monitoring recommended")

        print(
            f"🏁 Process completed: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}"
        )


if __name__ == "__main__":
    try:
        run_cleanup()
    except Exception as e:
        print(f"❌ Cleanup process failed: {e}")
        import traceback

        traceback.print_exc()
        exit(1)
