"use server";

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { db } from "./db";
import { jobs, userProfile, applications } from "./schema";
import { eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { zodToJsonSchema } from "zod-to-json-schema";

export async function login(password: string) {
  if (password === process.env.APP_PASSWORD) {
    const session = await getSession();
    session.isLoggedIn = true;
    await session.save();
    redirect("/dashboard");
  }
  return { error: "Invalid password" };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

const ResumeSuggestionsSchema = z.object({
  tailored_summary: z
    .string()
    .describe(
      "A professional summary, rewritten to align with the job description."
    ),
  suggested_bullet_points: z
    .array(z.string())
    .describe(
      "A list of 3-5 specific, action-oriented bullet points to add to the resume for this job."
    ),
});

export async function generateResumeSuggestions(jobId: number) {
  const job = await db.query.jobs.findFirst({ where: eq(jobs.id, jobId) });
  const profile = await db.query.userProfile.findFirst();

  if (!job || !profile || !job.raw_description) {
    return { error: "Job or profile data not found." };
  }

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-8b-8192",
  });
  const structuredLlm = llm.withStructuredOutput({
    schema: zodToJsonSchema(ResumeSuggestionsSchema),
  });

  const prompt = `
    You are an expert resume writer. Your task is to tailor a candidate's resume for a specific job.
    Use the provided candidate profile and job description to generate a new professional summary and 3-5 impactful bullet points.
    CANDIDATE PROFILE:
    - Summary: ${profile.summary}
    - Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Education: ${profile.education}
    JOB DESCRIPTION:
    ---
    ${job.raw_description.substring(0, 5000)}
    ---
    YOUR TASK: Provide a structured JSON response with a 'tailored_summary' and a list of 'suggested_bullet_points'.
  `;

  try {
    const suggestions = await structuredLlm.invoke(prompt);
    await db
      .update(jobs)
      .set({ tailored_suggestions: JSON.stringify(suggestions) })
      .where(eq(jobs.id, jobId));
    revalidatePath("/dashboard");
    return { success: "Successfully generated suggestions!", suggestions };
  } catch (error) {
    console.error("LLM generation failed:", error);
    return { error: "Failed to generate suggestions from AI." };
  }
}

export async function updateJobStatus(jobId: number, newStatus: string) {
  try {
    const updatedJobs = await db
      .update(jobs)
      .set({ status: newStatus })
      .where(eq(jobs.id, jobId))
      .returning();

    if (newStatus === "Applied" && updatedJobs.length > 0) {
      const job = updatedJobs[0];
      await db.insert(applications).values({
        job_title: job.title,
        company: job.company,
        application_link: job.url,
        status: "Applied",
        application_date: new Date().toISOString().split("T")[0],
      });
      revalidatePath("/tracker");
    }

    revalidatePath("/dashboard");
    return { success: `Status updated to ${newStatus}` };
  } catch (error) {
    console.error("Failed to update job status:", error);
    return { error: "Database operation failed." };
  }
}

export async function updateApplicationStatus(
  applicationId: number,
  newStatus: string
) {
  try {
    await db
      .update(applications)
      .set({ status: newStatus })
      .where(eq(applications.id, applicationId));
    revalidatePath("/tracker");
    return { success: `Application moved to ${newStatus}` };
  } catch (error) {
    console.error("Failed to update application status:", error);
    return { error: "Database operation failed." };
  }
}

export async function createApplication(
  jobTitle: string,
  company: string,
  applicationLink?: string | null,
  applicationDate?: Date | null,
  notes?: string | null
) {
  try {
    await db.insert(applications).values({
      job_title: jobTitle,
      company: company,
      application_link: applicationLink,
      application_date: applicationDate
        ? applicationDate.toISOString().split("T")[0]
        : null,
      notes: notes,
      status: "Interested",
    });
    revalidatePath("/tracker");
    return { success: "Application added to tracker!" };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { error: "Database operation failed." };
  }
}

const applicationSchema = z.object({
  job_title: z.string().min(2),
  company: z.string().min(2),
  application_link: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function updateApplication(
  applicationId: number,
  values: z.infer<typeof applicationSchema>
) {
  try {
    await db
      .update(applications)
      .set({
        job_title: values.job_title,
        company: values.company,
        application_link: values.application_link,
        notes: values.notes,
      })
      .where(eq(applications.id, applicationId));

    revalidatePath("/tracker");
    return { success: "Application updated successfully!" };
  } catch (error) {
    console.error("Failed to update application:", error);
    return { error: "Database operation failed." };
  }
}

const profileSchema = z.object({
  full_name: z.string().optional(),
  summary: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  projects: z.string().optional(),
  skills: z.string().optional(),
});

export async function updateUserProfile(values: z.infer<typeof profileSchema>) {
  try {
    await db
      .update(userProfile)
      .set({
        full_name: values.full_name,
        summary: values.summary,
        experience: values.experience,
        education: values.education,
        projects: values.projects,
        skills: values.skills,
      })
      .where(eq(userProfile.id, 1));
    revalidatePath("/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { error: "Database operation failed." };
  }
}

const JobFitAnalysisSchema = z.object({
  match_score: z
    .number()
    .describe(
      "A score from 1 to 10 indicating how well the profile matches the job."
    ),
  match_summary: z
    .string()
    .describe("A 2-3 sentence summary explaining the match score."),
  matching_skills: z
    .array(z.string())
    .describe(
      "A list of skills present in both the user's profile and the job description."
    ),
  missing_skills: z
    .array(z.string())
    .describe(
      "A list of skills required by the job but missing from the user's profile."
    ),
  salary_range: z
    .string()
    .nullable()
    .describe(
      "The salary range mentioned in the job description (e.g., '$100k - $120k'). Return null if not found."
    ),
  company_info: z
    .record(z.string())
    .nullable()
    .describe(
      "A dictionary with company 'industry' and 'size' if mentioned. Return null if not found."
    ),
});

export async function reanalyzeAllJobs() {
  console.log("Starting re-analysis of all jobs...");
  const profile = await db.query.userProfile.findFirst();
  if (!profile) {
    return { error: "User profile not found." };
  }

  const jobsToAnalyze = await db
    .select()
    .from(jobs)
    .where(ne(jobs.status, "Archived"));
  if (jobsToAnalyze.length === 0) {
    return { success: "No active jobs to re-analyze." };
  }

  console.log(`Found ${jobsToAnalyze.length} jobs to re-analyze.`);

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-8b-8192",
  });
  const structuredLlm = llm.withStructuredOutput({
    schema: zodToJsonSchema(JobFitAnalysisSchema),
  });

  let updatedCount = 0;
  for (const job of jobsToAnalyze) {
    if (!job.raw_description) continue;

    console.log(`- Re-analyzing job #${job.id}: ${job.title}`);
    const prompt = `
      You are a world-class career coach. Analyze the candidate's updated profile against the provided job description and provide a detailed fit analysis.
      CANDIDATE PROFILE:
      - Summary: ${profile.summary}
      - Experience: ${profile.experience}
      - Education: ${profile.education}
      - Projects: ${profile.projects}
      - Skills: ${profile.skills}
      JOB DESCRIPTION:
      ---
      ${job.raw_description.substring(0, 5000)}
      ---
      YOUR TASK: Provide a structured JSON analysis including: 'match_score', 'match_summary', 'matching_skills', 'missing_skills', 'salary_range', and 'company_info'.
    `;

    try {
      const analysis = await structuredLlm.invoke(prompt);
      await db
        .update(jobs)
        .set({
          match_score: analysis.match_score,
          match_summary: analysis.match_summary,
          matching_skills: JSON.stringify(analysis.matching_skills),
          missing_skills: JSON.stringify(analysis.missing_skills),
          salary_range: analysis.salary_range,
          company_info: analysis.company_info
            ? JSON.stringify(analysis.company_info)
            : null,
        })
        .where(eq(jobs.id, job.id));
      updatedCount++;
    } catch (error) {
      console.error(`Failed to re-analyze job #${job.id}:`, error);
    }
  }

  revalidatePath("/dashboard");
  return { success: `Successfully re-analyzed ${updatedCount} jobs!` };
}
