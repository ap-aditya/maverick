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
from typing import Set, List

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
    state["all_collected_urls"] = set()
    state["filtered_job_urls"] = []
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
        print("✅ All targets processed, moving to URL aggregation")
        state["current_target"] = None
        state["current_page_url"] = None
        return state

    current_target = state["targets"].pop(0)
    state["current_target"] = current_target
    state["current_page_url"] = current_target
    state["pages_processed_for_target"] = 1
    state["visited_urls"] = set()
    state["target_stats"] = {"recent_job_counts": []}
    state["current_target_urls"] = set()

    company_type = "Unknown"
    if any(domain in current_target for domain in ["google.com", "metacareers.com", "apple.com", "amazon.jobs", "netflix.com"]):
        company_type = "MAANG"
    elif any(domain in current_target for domain in ["microsoft.com", "adobe.com", "uber.com", "atlassian.com"]):
        company_type = "Product"
    elif any(domain in current_target for domain in ["accenture.com", "ibm.com", "tcs.com", "infosys.com", "wipro.com"]):
        company_type = "Service"
    elif any(domain in current_target for domain in ["wellfound.com", "startup.jobs", "builtin.com", "ycombinator"]):
        company_type = "Startup"
    elif any(domain in current_target for domain in ["naukri.com", "shine.com", "dice.com"]):
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

                page.set_extra_http_headers({
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                })

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

def extract_job_urls(state):
    print("🔗 Extracting job URLs from page")
    if not state["page_content"]:
        print("⚠️ No content to analyze")
        state["next_page_url"] = None
        return state

    try:
        prompt = f"""
        Extract job URLs and pagination from this job listing webpage. Return ONLY valid JSON.

        Current page: {state['current_page_url']}
        Page {state.get('pages_processed_for_target', 1)} in sequence

        TASK: Extract ONLY the job URLs - do NOT analyze job content.
        
        Extract:
        1. Job detail URLs (individual job page links, not listing page)
        2. Next page URL for pagination

        Make all URLs absolute using base: {state['current_page_url']}

        Return JSON format:
        {{
            "job_urls": [
                "https://absolute-job-detail-url-1",
                "https://absolute-job-detail-url-2"
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

            job_urls = parsed_data.get("job_urls", [])
            
            current_target_urls = state.get("current_target_urls", set())
            original_count = len(current_target_urls)
            
            new_urls_added = 0
            for url in job_urls:
                if url and url.startswith(("http://", "https://")):
                    normalized_url = url.split("?")[0].split("#")[0]
                    if normalized_url not in current_target_urls:
                        current_target_urls.add(normalized_url)
                        new_urls_added += 1
            
            state["current_target_urls"] = current_target_urls

            next_page_url = parsed_data.get("next_page_url")
            if next_page_url and next_page_url != "null" and next_page_url.strip():
                absolute_next_url = urljoin(state["current_page_url"], next_page_url)
                visited_urls = state.get("visited_urls", set())
                if absolute_next_url in visited_urls or absolute_next_url == state["current_page_url"]:
                    print("🔄 Pagination cycle detected")
                    state["next_page_url"] = None
                else:
                    state["next_page_url"] = absolute_next_url
                    visited_urls.add(state["current_page_url"])
                    state["visited_urls"] = visited_urls
            else:
                state["next_page_url"] = None

            print(f"🔗 Extracted {len(job_urls)} job URLs from this page")
            print(f"📊 New URLs added: {new_urls_added} | Total for target: {len(current_target_urls)}")
            
            if state.get("next_page_url"):
                print(f"📄 Next page available")

        else:
            raise Exception("No valid JSON in LLM response")

    except Exception as e:
        print(f"⚠️ URL extraction failed: {str(e)[:50]}...")
        if "rate limit" in str(e).lower() or "429" in str(e):
            print("⏸️ Rate limit hit, adding delay...")
            time.sleep(60)
        state["next_page_url"] = None

    return state

def finalize_target_urls(state):
    current_target_urls = state.get("current_target_urls", set())
    all_collected_urls = state.get("all_collected_urls", set())
    
    urls_added = len(current_target_urls)
    all_collected_urls.update(current_target_urls)
    state["all_collected_urls"] = all_collected_urls
    
    print(f"✅ Target complete: {urls_added} URLs collected")
    print(f"📈 Total collected URLs: {len(all_collected_urls)}")
    
    return state

def aggregate_and_filter_urls(state):
    print("🔍 Aggregating and filtering collected URLs")
    
    all_urls = state.get("all_collected_urls", set())
    print(f"📊 Total URLs collected: {len(all_urls)}")
    
    if not all_urls:
        print("⚠️ No URLs collected for analysis")
        state["filtered_job_urls"] = []
        return state
    
    print("🔍 Checking against database for existing URLs...")
    
    try:
        all_urls_list = list(all_urls)
        existing_urls = set()
        
        batch_size = 100
        
        for i in range(0, len(all_urls_list), batch_size):
            batch = all_urls_list[i:i + batch_size]
            
            try:
                with Session(engine) as session:
                    statement = select(Job.url).where(Job.url.in_(batch))
                    batch_existing = set(session.exec(statement).all())
                    existing_urls.update(batch_existing)
                    print(f"🔍 Batch {i//batch_size + 1}/{(len(all_urls_list)-1)//batch_size + 1}: {len(batch_existing)} existing URLs")
                    
            except Exception as e:
                print(f"⚠️ Batch {i//batch_size + 1} failed: {str(e)[:50]}...")
                continue
                
            time.sleep(0.5)
    
    except Exception as e:
        print(f"⚠️ Database check failed: {str(e)[:100]}...")
        print("🔄 Proceeding with all URLs (no deduplication)")
        existing_urls = set()
    
    new_urls = all_urls - existing_urls
    state["filtered_job_urls"] = list(new_urls)
    
    print(f"✅ URL filtering complete:")
    print(f"   • Total collected: {len(all_urls)}")
    print(f"   • Already in database: {len(existing_urls)}")
    print(f"   • New URLs for analysis: {len(new_urls)}")
    
    return state

def deep_job_analysis(state):
    print("🎯 Starting deep job analysis")
    
    job_urls = state.get("filtered_job_urls", [])
    user_profile = state.get("user_profile")
    processed_jobs = []

    if not job_urls:
        print("⚠️ No URLs for deep analysis")
        state["processed_jobs"] = []
        return state

    print(f"🔍 Analyzing {len(job_urls)} unique job URLs")

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"]
            )
            page = browser.new_page()

            page.set_extra_http_headers({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            })

            for i, job_url in enumerate(job_urls):
                print(f"📊 Analyzing job {i+1}/{len(job_urls)}: {job_url[:60]}...")

                try:
                    page.goto(job_url, timeout=20000, wait_until="domcontentloaded")
                    time.sleep(random.uniform(2.0, 4.0))

                    content = page.content()
                    soup = BeautifulSoup(content, "html.parser")
                    for element in soup(["script", "style", "nav", "footer", "header", "aside"]):
                        element.decompose()

                    job_description = soup.get_text(separator="\n", strip=True)

                    if len(job_description.strip()) < 100:
                        print(f"⚠️ Insufficient job description content")
                        continue

                    title = soup.find("title")
                    job_title = title.get_text().strip() if title else "Unknown Position"
                    
                    company_name = "Unknown Company"
                    for selector in [".company-name", ".employer", ".company", "[data-company]"]:
                        company_elem = soup.select_one(selector)
                        if company_elem:
                            company_name = company_elem.get_text().strip()
                            break

                    analysis_prompt = f"""
                    CRITICAL: This is a STRICT qualification-based job analysis.

                    CANDIDATE PROFILE:
                    Education: {user_profile.education if user_profile.education else 'Bachelor of Technology in Computer Science'}
                    Experience: {user_profile.experience if user_profile.experience else 'Entry-level with internship experience'}
                    Skills: {user_profile.skills if user_profile.skills else 'Python, JavaScript, SQL'}
                    Summary: {user_profile.summary if user_profile.summary else 'Software engineering student'}
                    Projects: {user_profile.projects if user_profile.projects else 'None'}

                    JOB REQUIREMENTS:
                    {job_description[:4000]}

                    STRICT SCORING RULES (MANDATORY):
                    1. If job requires PhD but candidate has Bachelor's: MAX SCORE = 2
                    2. If job requires Master's but candidate has Bachelor's: MAX SCORE = 4
                    3. If job requires 5+ years experience but candidate is entry-level: MAX SCORE = 3
                    4. If job requires 3+ years experience but candidate has <1 year: MAX SCORE = 4
                    5. If job requires specific degree (e.g., EE, ME) but candidate has different field: -2 points
                    6. Missing 3+ required technical skills: MAX SCORE = 4
                    7. Job is for "Senior" or "Lead" roles but candidate is entry-level: MAX SCORE = 3

                    ONLY jobs where candidate meets basic educational and experience requirements can score 5+.

                    Focus on REQUIRED vs PREFERRED qualifications. Be harsh on requirements, lenient on preferences.

                    Return JSON:
                    {{
                        "match_score": 3,
                        "match_summary": "Low match due to experience gap: requires 5+ years, candidate has <1 year",
                        "matching_skills": ["Python", "SQL"],
                        "missing_skills": ["AWS", "Docker", "5+ years experience"],
                        "salary_range": "80k-120k USD",
                        "company_info": {{"industry": "Technology", "size": "Large"}}
                    }}
                    
                    Be realistic and harsh with scoring to save candidate's time.
                    """

                    analysis_response = llm.invoke(analysis_prompt)

                    try:
                        json_match = re.search(r"\{.*\}", analysis_response.content, re.DOTALL)
                        if json_match:
                            analysis_data = json.loads(json_match.group())
                            match_score = analysis_data.get("match_score", 3)
                            match_summary = analysis_data.get("match_summary", "Analysis completed")
                            matching_skills = analysis_data.get("matching_skills", [])
                            missing_skills = analysis_data.get("missing_skills", [])
                            salary_range = analysis_data.get("salary_range")
                            company_info = analysis_data.get("company_info")
                        else:
                            raise Exception("No JSON in analysis response")
                    except Exception:
                        print(f"⚠️ Using strict fallback analysis")

                        content_lower = job_description.lower()
                        
                        experience_keywords = ["5+ years", "5 years", "senior", "lead", "principal", "staff"]
                        if any(keyword in content_lower for keyword in experience_keywords):
                            match_score = 2
                            match_summary = "Low match: Position requires senior-level experience"
                        else:
                            user_skills_lower = user_profile.skills.lower() if user_profile.skills else ""
                            user_skill_list = [skill.strip() for skill in user_skills_lower.split(",") if skill.strip()]
                            matches = sum(1 for skill in user_skill_list if skill in content_lower)

                            if matches >= 3:
                                match_score = 6
                            elif matches >= 2:
                                match_score = 5
                            elif matches >= 1:
                                match_score = 4
                            else:
                                match_score = 3

                            match_summary = f"Entry-level position: {matches} skill matches found"

                        matching_skills = []
                        missing_skills = []
                        salary_range = None
                        company_info = None

                    processed_jobs.append(Job(
                        title=job_title,
                        company=company_name,
                        location="Not specified",
                        url=job_url,
                        raw_description=job_description[:5000],
                        match_score=min(max(match_score, 1), 10),
                        match_summary=match_summary,
                        matching_skills=json.dumps(matching_skills),
                        missing_skills=json.dumps(missing_skills),
                        salary_range=salary_range,
                        company_info=json.dumps(company_info) if company_info else None,
                    ))

                    score_emoji = "🔥" if match_score >= 7 else "✅" if match_score >= 5 else "⚠️"
                    print(f"   {score_emoji} Score: {match_score}/10")

                except Exception as e:
                    if "rate limit" in str(e).lower() or "429" in str(e):
                        print(f"⏸️ Rate limit hit, pausing analysis...")
                        time.sleep(60)
                    print(f"❌ Job analysis failed: {str(e)[:50]}...")
                    continue

            browser.close()

    except Exception as e:
        print(f"❌ Browser initialization failed: {e}")

    print(f"✅ Deep analysis complete: {len(processed_jobs)} jobs analyzed")
    
    if processed_jobs:
        high_scores = len([j for j in processed_jobs if j.match_score >= 7])
        medium_scores = len([j for j in processed_jobs if 5 <= j.match_score < 7])
        low_scores = len([j for j in processed_jobs if j.match_score < 5])
        print(f"📊 Score distribution: {high_scores} high (7+), {medium_scores} medium (5-6), {low_scores} low (<5)")
    
    state["processed_jobs"] = processed_jobs
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

    batch_size = 10
    
    for i in range(0, len(jobs_to_save), batch_size):
        batch = jobs_to_save[i:i + batch_size]
        
        try:
            with Session(engine) as session:
                for job in batch:
                    try:
                        existing = session.exec(select(Job).where(Job.url == job.url)).first()
                        if not existing:
                            session.add(job)
                            new_jobs_count += 1
                        else:
                            duplicate_count += 1
                    except Exception as e:
                        print(f"❌ Job save error: {str(e)[:30]}...")
                        failed_jobs_count += 1
                
                session.commit()
                print(f"💾 Saved batch {i//batch_size + 1}: {len(batch)} jobs processed")
                
        except Exception as e:
            print(f"❌ Batch save failed: {str(e)[:50]}...")
            failed_jobs_count += len(batch)
        
        time.sleep(0.2)

    print(f"✅ Database update complete: {new_jobs_count} saved, {duplicate_count} duplicates, {failed_jobs_count} failed")
    return state

def prepare_for_next_page(state):
    print("📄 Preparing next page")

    if not state.get("next_page_url"):
        print("❌ No next page URL available")
        return state

    state["current_page_url"] = state["next_page_url"]
    state["pages_processed_for_target"] += 1

    current_url = state["current_page_url"]
    if any(domain in current_url for domain in ["google.com", "metacareers.com", "apple.com"]):
        delay = random.uniform(4, 6)
    elif any(domain in current_url for domain in ["wellfound.com", "startup.jobs"]):
        delay = random.uniform(3, 4)
    else:
        delay = random.uniform(2, 3)

    time.sleep(delay)

    print(f"✅ Ready for page {state['pages_processed_for_target']}")
    return state