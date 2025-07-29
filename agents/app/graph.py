from typing import Optional, List, TypedDict
from langgraph.graph import StateGraph, END

from .agent_nodes import (
    initialize_agent,
    get_next_target,
    navigate_to_page,
    extract_job_urls,
    finalize_target_urls,
    aggregate_and_filter_urls,
    deep_job_analysis,
    save_jobs_to_db,
    prepare_for_next_page
)
from .models import JobListing, Job, UserProfile

class AgentState(TypedDict):
    targets: List[str]
    current_target: str
    current_page_url: str
    page_content: str
    all_collected_urls: set
    current_target_urls: set
    filtered_job_urls: List[str]
    processed_jobs: List[Job]
    next_page_url: Optional[str]
    user_profile: Optional[UserProfile]
    pages_processed_for_target: int
    visited_urls: set
    target_stats: dict

def create_workflow():
    workflow = StateGraph(AgentState)

    workflow.add_node("initialize_agent", initialize_agent)
    workflow.add_node("get_next_target", get_next_target)
    workflow.add_node("navigate_to_page", navigate_to_page)
    workflow.add_node("extract_job_urls", extract_job_urls)
    workflow.add_node("finalize_target_urls", finalize_target_urls)
    workflow.add_node("aggregate_and_filter_urls", aggregate_and_filter_urls)
    workflow.add_node("deep_job_analysis", deep_job_analysis)
    workflow.add_node("save_jobs_to_db", save_jobs_to_db)
    workflow.add_node("prepare_for_next_page", prepare_for_next_page)

    def should_continue_to_next_company(state):
        if state is None or state.get("user_profile") is None:
            return END
        if state["current_target"]:
            return "navigate_to_page"
        else:
            return "aggregate_and_filter_urls"

    def should_paginate(state):
        next_url = state.get("next_page_url")
        pages_done = state.get("pages_processed_for_target", 0)
        current_url = state.get("current_page_url", "")
        
        if any(term in current_url for term in ["university", "intern", "graduate", "campus", "fresher", "entry-level"]):
            max_pages = 3
        elif any(domain in current_url for domain in ["google.com", "metacareers.com", "apple.com", "amazon.jobs", "jobs.netflix.com"]):
            max_pages = 5
        elif any(domain in current_url for domain in ["naukri.com", "shine.com", "foundit.in", "linkedin.com"]):
            max_pages = 8
        elif any(domain in current_url for domain in ["wellfound.com", "startup.jobs", "builtin.com", "ycombinator.com"]):
            max_pages = 6
        elif any(domain in current_url for domain in ["tcs.com", "infosys.com", "wipro.com", "accenture.com", "ibm.com"]):
            max_pages = 4
        else:
            max_pages = 3
        
        if not next_url:
            print(f"📄 Pagination complete for target")
            return "finalize_target_urls"
        
        if pages_done >= max_pages:
            print(f"📄 Page limit reached ({max_pages}) for target")
            return "finalize_target_urls"
        
        print(f"📄 Continuing pagination ({pages_done}/{max_pages})")
        return "prepare_for_next_page"

    workflow.set_entry_point("initialize_agent")
    
    workflow.add_edge("navigate_to_page", "extract_job_urls")
    workflow.add_edge("prepare_for_next_page", "navigate_to_page")
    workflow.add_edge("finalize_target_urls", "get_next_target")
    
    workflow.add_edge("aggregate_and_filter_urls", "deep_job_analysis")
    
    workflow.add_edge("deep_job_analysis", "save_jobs_to_db")
    workflow.add_edge("save_jobs_to_db", END)
    
    workflow.add_conditional_edges(
        "initialize_agent",
        lambda state: "get_next_target" if state and state.get("user_profile") else END,
        {"get_next_target": "get_next_target", END: END}
    )

    workflow.add_conditional_edges(
        "extract_job_urls",
        should_paginate,
        {
            "prepare_for_next_page": "prepare_for_next_page", 
            "finalize_target_urls": "finalize_target_urls"
        }
    )
    
    workflow.add_conditional_edges(
        "get_next_target",
        should_continue_to_next_company,
        {
            "navigate_to_page": "navigate_to_page", 
            "aggregate_and_filter_urls": "aggregate_and_filter_urls"
        }
    )
    
    return workflow.compile()

app = create_workflow()
