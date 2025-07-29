import { db } from "@/lib/db";
import { applications } from "@/lib/schema";
import { ApplicationsTable } from "@/components/tracker/ApplicationsTable";
import { AddApplicationDialog } from "@/components/tracker/AddApplicationDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default async function TrackerPage() {
  const allApplications = await db.select().from(applications);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Application Tracker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor and manage your job application pipeline with detailed
              tracking and organization.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <AddApplicationDialog />
          </div>
        </header>
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Your Applications
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete overview of your job applications and their current
                status
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-sm flex items-center gap-1"
            >
              {allApplications.length} applications
            </Badge>
          </div>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm p-3">
            <CardContent className="p-0">
              <ApplicationsTable data={allApplications} />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
