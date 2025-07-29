import { db } from "@/lib/db";
import { jobs, applications } from "@/lib/schema";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";
export default async function AnalyticsPage() {
  const allJobs = await db.select().from(jobs);
  const allApplications = await db.select().from(applications);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-10" />
        <AnalyticsClient allJobs={allJobs} allApplications={allApplications} />
      </div>
    </main>
  );
}
