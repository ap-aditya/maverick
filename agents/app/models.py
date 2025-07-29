from typing import Optional, List, Dict
from sqlmodel import Field, SQLModel
from pydantic.v1 import BaseModel
import datetime
def get_utc_now():
    return datetime.datetime.now(datetime.UTC)


class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profile"
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: Optional[str] = None
    summary: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    projects: Optional[str] = None
    skills: Optional[str] = None


class Job(SQLModel, table=True):
    __tablename__ = "jobs"
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    date_found: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    title: str
    company: str
    location: Optional[str] = None
    url: str = Field(unique=True, index=True)
    status: str = Field(default="New")
    raw_description: Optional[str] = None
    match_score: Optional[int] = None
    match_summary: Optional[str] = None
    matching_skills: Optional[str] = None
    missing_skills: Optional[str] = None
    salary_range: Optional[str] = None
    company_info: Optional[str] = None
    tailored_suggestions: Optional[str] = None


class Application(SQLModel, table=True):
    __tablename__ = "applications"
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str
    job_title: str
    application_link: Optional[str] = None
    status: str = Field(default="Applied")
    application_date: Optional[datetime.date] = None
    notes: Optional[str] = None


class JobListing(BaseModel):
    title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    location: str = Field(default="Not specified", description="Job location")
    url: str = Field(..., description="Job detail page URL")


class JobListings(BaseModel):
    jobs: List[JobListing] = Field(
        default_factory=list, description="List of job listings"
    )
    next_page_url: Optional[str] = Field(
        default=None, description="Next page URL or null"
    )


class JobFitAnalysis(BaseModel):
    match_score: int = Field(..., ge=1, le=10, description="Match score 1-10")
    match_summary: str = Field(..., description="Brief match summary")
    matching_skills: List[str] = Field(
        default_factory=list, description="Matching skills"
    )
    missing_skills: List[str] = Field(
        default_factory=list, description="Missing skills"
    )
    salary_range: Optional[str] = Field(
        default=None, description="Salary range if found"
    )
    company_info: Optional[Dict[str, str]] = Field(
        default=None, description="Company info"
    )
