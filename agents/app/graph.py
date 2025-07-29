from typing import Optional, List, TypedDict
from langgraph.graph import StateGraph, END

from .agent_nodes import (
    initialize_agent,
    get_next_target,
    navigate_to_page,
    analyze_page,
    filter_new_jobs,
    analyze_job_fit,
    save_jobs_to_db,
    prepare_for_next_page
)
from .models import JobListing, Job, UserProfile

class AgentState(TypedDict):
    targets: List[str]
    current_target: str
    current_page_url: str
    page_content: str
    job_listings: List[JobListing]
    unique_job_listings: List[JobListing]
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
    workflow.add_node("analyze_page", analyze_page)
    workflow.add_node("filter_new_jobs", filter_new_jobs)
    workflow.add_node("analyze_job_fit", analyze_job_fit)
    workflow.add_node("save_jobs_to_db", save_jobs_to_db)
    workflow.add_node("prepare_for_next_page", prepare_for_next_page)

    def should_continue_to_next_company(state):
        if state is None or state.get("user_profile") is None:
            return END
        if state["current_target"]:
            return "navigate_to_page"
        else:
            return END

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
            return "get_next_target"
        
        if pages_done >= max_pages:
            print(f"📄 Page limit reached ({max_pages}) for target")
            return "get_next_target"
        
        stats = state.get("target_stats", {})
        recent_job_counts = stats.get("recent_job_counts", [])
        if len(recent_job_counts) >= 2 and sum(recent_job_counts[-2:]) == 0:
            print(f"📄 Early termination: No new jobs in recent pages")
            return "get_next_target"
        
        print(f"📄 Continuing pagination ({pages_done}/{max_pages})")
        return "prepare_for_next_page"

    workflow.set_entry_point("initialize_agent")
    
    workflow.add_edge("navigate_to_page", "analyze_page")
    workflow.add_edge("analyze_page", "filter_new_jobs") 
    workflow.add_edge("filter_new_jobs", "analyze_job_fit")
    workflow.add_edge("analyze_job_fit", "save_jobs_to_db")
    workflow.add_edge("prepare_for_next_page", "navigate_to_page")
    
    workflow.add_conditional_edges(
        "initialize_agent",
        lambda state: "get_next_target" if state and state.get("user_profile") else END,
        {"get_next_target": "get_next_target", END: END}
    )

    workflow.add_conditional_edges(
        "save_jobs_to_db",
        should_paginate,
        {
            "prepare_for_next_page": "prepare_for_next_page", 
            "get_next_target": "get_next_target"
        }
    )
    
    workflow.add_conditional_edges(
        "get_next_target",
        should_continue_to_next_company,
        {"navigate_to_page": "navigate_to_page", END: END}
    )
    
    return workflow.compile()

app = create_workflow()
