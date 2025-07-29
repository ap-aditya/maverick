import os
import json
import time
import random
import re
from urllib.parse import urljoin
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from langchain_groq import ChatGroq
from sqlmodel import Session, select
from psycopg2 import errors

from .models import Job, UserProfile, JobListing
from .database import engine

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise Exception("GROQ_API_KEY not found in environment variables")

llm = ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama3-8b-8192")


def initialize_agent(state):
    print("🚀 Initializing JobBot Agent")
    targets = []
    try:
        with open("config.json", "r") as f:
            config = json.load(f)
            targets = config.get("target_urls", [])
        print(f"📂 Loaded {len(targets)} target URLs")
    except FileNotFoundError:
        print("❌ Configuration file not found")
        return None
    except json.JSONDecodeError:
        print("❌ Invalid configuration format")
        return None

    state["targets"] = targets
    state["job_listings"] = []
    state["processed_jobs"] = []
    state["visited_urls"] = set()
    state["target_stats"] = {}

    with Session(engine) as session:
        user_profile = session.exec(select(UserProfile)).first()
        state["user_profile"] = user_profile

    if not state["user_profile"]:
        print("❌ User profile not found in database")
        return None

    print("✅ Agent initialization complete")
    return state


def get_next_target(state):
    print(f"\n🎯 Processing next target")
    if not state["targets"]:
        print("✅ All targets processed successfully")
        state["current_target"] = None
        state["current_page_url"] = None
        return state

    current_target = state["targets"].pop(0)
    state["current_target"] = current_target
    state["current_page_url"] = current_target
    state["pages_processed_for_target"] = 1
    state["visited_urls"] = set()
    state["target_stats"] = {"recent_job_counts": []}

    company_type = "Unknown"
    if any(
        domain in current_target
        for domain in [
            "google.com",
            "metacareers.com",
            "apple.com",
            "amazon.jobs",
            "netflix.com",
        ]
    ):
        company_type = "MAANG"
    elif any(
        domain in current_target
        for domain in ["microsoft.com", "adobe.com", "uber.com", "atlassian.com"]
    ):
        company_type = "Product"
    elif any(
        domain in current_target
        for domain in [
            "accenture.com",
            "ibm.com",
            "tcs.com",
            "infosys.com",
            "wipro.com",
        ]
    ):
        company_type = "Service"
    elif any(
        domain in current_target
        for domain in ["wellfound.com", "startup.jobs", "builtin.com", "ycombinator"]
    ):
        company_type = "Startup"
    elif any(
        domain in current_target for domain in ["naukri.com", "shine.com", "dice.com"]
    ):
        company_type = "Job Board"

    print(f"🏢 Target: {company_type} | URL: {current_target[:80]}...")
    return state


def navigate_to_page(state):
    url = state["current_page_url"]
    page_num = state.get("pages_processed_for_target", 1)
    print(f"🌐 Navigating to page {page_num}")

    max_retries = 3
    retry_delays = [2, 5, 10]

    for attempt in range(max_retries):
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-web-security",
                        "--disable-blink-features=AutomationControlled",
                        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    ],
                )
                page = browser.new_page()

                page.set_extra_http_headers(
                    {
                        "Accept-Language": "en-US,en;q=0.9",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                        "Sec-Fetch-Dest": "document",
                        "Sec-Fetch-Mode": "navigate",
                        "Sec-Fetch-Site": "none",
                    }
                )

                page.goto(url, timeout=30000, wait_until="domcontentloaded")
                time.sleep(random.uniform(2, 4))
                page.wait_for_timeout(3000)

                try:
                    page.evaluate("window.scrollTo(0, document.body.scrollHeight/3)")
                    page.wait_for_timeout(1000)
                    page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
                    page.wait_for_timeout(1000)
                except:
                    pass

                page_content = page.content()
                browser.close()

                if page_content and len(page_content) > 1000:
                    soup = BeautifulSoup(page_content, "html.parser")
                    for script in soup(["script", "style", "noscript", "iframe"]):
                        script.decompose()

                    state["page_content"] = soup.get_text(separator="\n", strip=True)
                    print(f"✅ Page loaded ({len(state['page_content'])} chars)")
                    return state
                else:
                    raise Exception("Insufficient page content")

        except Exception as e:
            print(f"⚠️ Navigation attempt {attempt + 1} failed: {str(e)[:50]}...")
            if attempt < max_retries - 1:
                delay = retry_delays[attempt]
                print(f"🔄 Retrying in {delay}s")
                time.sleep(delay)
            else:
                print(f"❌ Navigation failed after {max_retries} attempts")
                state["page_content"] = ""
                return state

    return state


def analyze_page(state):
    print("🔍 Analyzing page content")
    if not state["page_content"]:
        print("⚠️ No content to analyze")
        state["job_listings"] = []
        state["next_page_url"] = None
        return state

    try:
        prompt = f"""
        Extract job listings and pagination from this webpage. Return ONLY valid JSON.

        Current page: {state['current_page_url']}
        Page {state.get('pages_processed_for_target', 1)} in sequence

        Extract:
        1. Job listings with title, company, location, and job detail URL
        2. Next page URL (look for "Next", page numbers, "Load More", "View More Jobs")

        Make all URLs absolute using base: {state['current_page_url']}

        Return JSON format:
        {{
            "jobs": [
                {{"title": "Software Engineer", "company": "Company Name", "location": "City, State", "url": "https://absolute-job-url"}}
            ],
            "next_page_url": "https://absolute-next-page-url-or-null"
        }}

        WEBPAGE CONTENT:
        {state['page_content'][:12000]}
        """

        response = llm.invoke(prompt)

        json_match = re.search(r"\{.*\}", response.content, re.DOTALL)
        if json_match:
            parsed_data = json.loads(json_match.group())

            jobs = []
            for job_data in parsed_data.get("jobs", []):
                try:
                    if (
                        job_data.get("title")
                        and job_data.get("company")
                        and job_data.get("url")
                    ):
                        job = JobListing(
                            title=job_data.get("title", "Unknown"),
                            company=job_data.get("company", "Unknown"),
                            location=job_data.get("location", "Not specified"),
                            url=job_data.get("url", ""),
                        )
                        jobs.append(job)
                except Exception:
                    continue

            state["job_listings"] = jobs

            next_page_url = parsed_data.get("next_page_url")
            if next_page_url and next_page_url != "null" and next_page_url.strip():
                absolute_next_url = urljoin(state["current_page_url"], next_page_url)
                visited_urls = state.get("visited_urls", set())
                if (
                    absolute_next_url in visited_urls
                    or absolute_next_url == state["current_page_url"]
                ):
                    print("🔄 Pagination cycle detected")
                    state["next_page_url"] = None
                else:
                    state["next_page_url"] = absolute_next_url
                    visited_urls.add(state["current_page_url"])
                    state["visited_urls"] = visited_urls
            else:
                state["next_page_url"] = None

            print(f"📋 Extracted {len(state['job_listings'])} job listings")
            if state.get("next_page_url"):
                print(f"📄 Next page available")

        else:
            raise Exception("No valid JSON in LLM response")

    except Exception as e:
        print(f"⚠️ LLM extraction failed, using fallback: {str(e)[:50]}...")

        jobs = []
        content = state["page_content"].lower()

        job_indicators = [
            "software engineer",
            "developer",
            "programmer",
            "engineer",
            "analyst",
        ]
        company_indicators = [
            "careers",
            "jobs",
            "opportunities",
            "positions",
            "openings",
        ]

        if any(indicator in content for indicator in job_indicators) and any(
            indicator in content for indicator in company_indicators
        ):
            jobs.append(
                JobListing(
                    title="Software Engineer (Auto-detected)",
                    company="Unknown Company",
                    location="Not specified",
                    url=state["current_page_url"],
                )
            )

        state["job_listings"] = jobs
        state["next_page_url"] = None
        print(f"📋 Fallback extracted {len(jobs)} potential jobs")

    return state


def filter_new_jobs(state):
    print("🔎 Filtering new jobs")
    job_listings_from_page = state.get("job_listings", [])
    if not job_listings_from_page:
        print("⚠️ No jobs to filter")
        state["unique_job_listings"] = []
        return state

    urls_from_page = set()
    for listing in job_listings_from_page:
        url = listing.url
        if url:
            if not url.startswith(("http://", "https://")):
                url = urljoin(state["current_page_url"], url)
            url = url.split("?")[0].split("#")[0]
            urls_from_page.add(url)

    with Session(engine) as session:
        statement = select(Job.url).where(Job.url.in_(urls_from_page))
        existing_urls = set(session.exec(statement).all())

    new_job_listings = []
    for listing in job_listings_from_page:
        normalized_url = listing.url
        if not normalized_url.startswith(("http://", "https://")):
            normalized_url = urljoin(state["current_page_url"], normalized_url)
        normalized_url = normalized_url.split("?")[0].split("#")[0]

        if normalized_url not in existing_urls:
            new_job_listings.append(listing)

    filtered_count = len(job_listings_from_page) - len(new_job_listings)
    print(
        f"✅ Found {len(new_job_listings)} new jobs (filtered {filtered_count} duplicates)"
    )
    state["unique_job_listings"] = new_job_listings
    return state


def analyze_job_fit(state):
    print("🎯 Analyzing job fit")
    job_listings = state.get("unique_job_listings", [])
    user_profile = state.get("user_profile")
    processed_jobs = []

    if not job_listings:
        print("⚠️ No new jobs to analyze")
        state["processed_jobs"] = []
        stats = state.get("target_stats", {})
        recent_counts = stats.get("recent_job_counts", [])
        recent_counts.append(0)
        stats["recent_job_counts"] = recent_counts[-3:]
        state["target_stats"] = stats
        return state

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"]
            )
            page = browser.new_page()

            page.set_extra_http_headers(
                {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept-Language": "en-US,en;q=0.9",
                }
            )

            for i, listing in enumerate(job_listings):
                print(
                    f"📊 Analyzing job {i+1}/{len(job_listings)}: {listing.title[:30]}..."
                )

                try:
                    job_url = listing.url
                    if not job_url.startswith(("http://", "https://")):
                        job_url = urljoin(state["current_page_url"], job_url)

                    page.goto(job_url, timeout=20000, wait_until="domcontentloaded")
                    time.sleep(random.uniform(1.0, 2.0))

                    content = page.content()
                    soup = BeautifulSoup(content, "html.parser")
                    for element in soup(
                        ["script", "style", "nav", "footer", "header", "aside"]
                    ):
                        element.decompose()

                    job_description = soup.get_text(separator="\n", strip=True)

                    if len(job_description.strip()) < 100:
                        print(f"⚠️ Insufficient job description content")
                        continue

                    analysis_prompt = f"""
                    Analyze this job for the candidate. Return JSON format.

                    CANDIDATE:
                    Summary: {user_profile.summary[:400] if user_profile.summary else 'N/A'}
                    Skills: {user_profile.skills[:300] if user_profile.skills else 'N/A'}
                    Experience: {user_profile.experience[:200] if user_profile.experience else 'N/A'}
                    
                    JOB DESCRIPTION:
                    {job_description[:4000]}
                    
                    Return JSON:
                    {{
                        "match_score": 7,
                        "match_summary": "Good match because candidate has relevant experience...",
                        "matching_skills": ["Python", "Django", "React"],
                        "missing_skills": ["Kubernetes", "AWS"],
                        "salary_range": "80k-120k USD",
                        "company_info": {{"industry": "Technology", "size": "Large"}}
                    }}
                    """

                    analysis_response = llm.invoke(analysis_prompt)

                    try:
                        json_match = re.search(
                            r"\{.*\}", analysis_response.content, re.DOTALL
                        )
                        if json_match:
                            analysis_data = json.loads(json_match.group())
                            match_score = analysis_data.get("match_score", 5)
                            match_summary = analysis_data.get(
                                "match_summary", "Analysis completed"
                            )
                            matching_skills = analysis_data.get("matching_skills", [])
                            missing_skills = analysis_data.get("missing_skills", [])
                            salary_range = analysis_data.get("salary_range")
                            company_info = analysis_data.get("company_info")
                        else:
                            raise Exception("No JSON in analysis response")
                    except Exception:
                        print(f"⚠️ Using fallback analysis")

                        content_lower = job_description.lower()
                        user_skills_lower = (
                            user_profile.skills.lower() if user_profile.skills else ""
                        )

                        user_skill_list = [
                            skill.strip()
                            for skill in user_skills_lower.split(",")
                            if skill.strip()
                        ]
                        matches = sum(
                            1 for skill in user_skill_list if skill in content_lower
                        )

                        if matches >= 3:
                            match_score = 8
                        elif matches >= 2:
                            match_score = 6
                        elif matches >= 1:
                            match_score = 4
                        else:
                            match_score = 3

                        match_summary = (
                            f"Skill alignment analysis: {matches} matches found"
                        )
                        matching_skills = [
                            skill for skill in user_skill_list if skill in content_lower
                        ]
                        missing_skills = []
                        salary_range = None
                        company_info = None

                    processed_jobs.append(
                        Job(
                            title=listing.title,
                            company=listing.company,
                            location=listing.location,
                            url=job_url,
                            raw_description=job_description[:5000],
                            match_score=min(max(match_score, 1), 10),
                            match_summary=match_summary,
                            matching_skills=json.dumps(matching_skills),
                            missing_skills=json.dumps(missing_skills),
                            salary_range=salary_range,
                            company_info=(
                                json.dumps(company_info) if company_info else None
                            ),
                        )
                    )

                except Exception as e:
                    print(f"❌ Job analysis failed: {str(e)[:50]}...")
                    continue

            browser.close()

    except Exception as e:
        print(f"❌ Browser initialization failed: {e}")

    print(f"✅ Successfully analyzed {len(processed_jobs)} jobs")
    state["processed_jobs"] = processed_jobs

    stats = state.get("target_stats", {})
    recent_counts = stats.get("recent_job_counts", [])
    recent_counts.append(len(processed_jobs))
    stats["recent_job_counts"] = recent_counts[-3:]
    state["target_stats"] = stats

    return state


def save_jobs_to_db(state):
    print("💾 Saving jobs to database")
    jobs_to_save = state.get("processed_jobs", [])
    if not jobs_to_save:
        print("⚠️ No jobs to save")
        return state

    new_jobs_count = 0
    failed_jobs_count = 0
    duplicate_count = 0

    for job in jobs_to_save:
        try:
            with Session(engine) as session:
                existing = session.exec(select(Job).where(Job.url == job.url)).first()
                if not existing:
                    session.add(job)
                    session.commit()
                    new_jobs_count += 1
                else:
                    duplicate_count += 1

        except errors.UniqueViolation:
            duplicate_count += 1
        except Exception as e:
            print(f"❌ Save error: {str(e)[:50]}...")
            failed_jobs_count += 1

    print(
        f"✅ Database update complete: {new_jobs_count} saved, {duplicate_count} duplicates, {failed_jobs_count} failed"
    )
    return state


def prepare_for_next_page(state):
    print("📄 Preparing next page")

    if not state.get("next_page_url"):
        print("❌ No next page URL available")
        return state

    state["current_page_url"] = state["next_page_url"]
    state["pages_processed_for_target"] += 1

    current_url = state["current_page_url"]
    if any(
        domain in current_url
        for domain in ["google.com", "metacareers.com", "apple.com"]
    ):
        delay = random.uniform(3, 5)
    elif any(domain in current_url for domain in ["wellfound.com", "startup.jobs"]):
        delay = random.uniform(2, 3)
    else:
        delay = random.uniform(1, 2)

    time.sleep(delay)

    print(f"✅ Ready for page {state['pages_processed_for_target']}")
    return state
