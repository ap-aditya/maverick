import { pgTable, serial, text, integer, date } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  url: text("url").notNull().unique(),
  status: text("status").default("New"),
  raw_description: text("raw_description"),
  match_score: integer("match_score"),
  match_summary: text("match_summary"),
  matching_skills: text("matching_skills"),
  missing_skills: text("missing_skills"),
  salary_range: text("salary_range"),
  company_info: text("company_info"),
  tailored_suggestions: text("tailored_suggestions"),
});

export const userProfile = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  full_name: text("full_name"),
  summary: text("summary"),
  experience: text("experience"),
  education: text("education"),
  projects: text("projects"),
  skills: text("skills"),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  job_title: text("job_title").notNull(),
  application_link: text("application_link"),
  status: text("status").notNull().default("Interested"),
  application_date: date("application_date"),
  notes: text("notes"),
});
