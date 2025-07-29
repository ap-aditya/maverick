import { db } from "@/lib/db";
import { jobs, applications } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { JobList } from "@/components/dashboard/JobList";
import { ScoreLegend } from "@/components/dashboard/ScoreLegend";
import { Target, CheckCircle, Briefcase, TrendingUp, Star } from "lucide-react";

type Job = typeof jobs.$inferSelect;

interface CompanyData {
  name: string;
  value: number;
}

interface ScoreMetrics {
  average: string;
  excellent: number;
  good: number;
  scoredPct: string;
}

const toPercent = (score: number, scale: number): number =>
  (score / scale) * 100;
const normalizeCompanyName = (name: string): string =>
  name.toLowerCase().trim();

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "purple" | "red";
}

const DashboardStatsCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = "blue",
}: StatsCardProps) => {
  const colorClasses = {
    blue: "border-l-blue-500 from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-600 dark:text-blue-400",
    green:
      "border-l-green-500 from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-600 dark:text-green-400",
    yellow:
      "border-l-yellow-500 from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-yellow-600 dark:text-yellow-400",
    purple:
      "border-l-purple-500 from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-purple-600 dark:text-purple-400",
    red: "border-l-red-500 from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-600 dark:text-red-400",
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 ${
        colorClasses[color].split(" ")[0]
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div
                className={`flex items-center text-xs ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 mr-1 ${
                    trend.isPositive ? "" : "rotate-180"
                  }`}
                />
                {Math.abs(trend.value)}% vs last period
              </div>
            )}
          </div>
          <div className="relative">
            <div
              className={`p-3 bg-gradient-to-br ${
                colorClasses[color].split("border-l-")[1]
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  colorClasses[color].split("dark:to-")[1]
                }`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QualityMatchesCardProps {
  scoreMetrics: ScoreMetrics;
}

const QualityMatchesCard = ({ scoreMetrics }: QualityMatchesCardProps) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 border-l-green-500`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Quality Matches
              <ScoreLegend />
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {scoreMetrics.excellent}
            </p>
            <p className="text-xs text-muted-foreground">
              Excellent jobs (80%+ score)
            </p>
          </div>
          <div className="relative">
            <div
              className={`p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20`}
            >
              <Star className={`h-6 w-6 text-green-600 dark:text-green-400`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default async function DashboardPage() {
  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.id));
  const allApplications = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.id));
  const rawScores = allJobs
    .filter(
      (j): j is Job & { match_score: number } =>
        j.match_score !== null && j.match_score !== undefined
    )
    .map((j) => j.match_score);

  const scoreScale =
    rawScores.length && Math.max(...rawScores) <= 10 ? 10 : 100;
  const percentScores = rawScores.map((s) => toPercent(s, scoreScale));
  const totalJobs = allJobs.length;
  const totalApplications = allApplications.length;
  const appliedJobs = allJobs.filter((job) => job.status === "Applied").length;
  const offers = allApplications.filter((app) => app.status === "Offer").length;
  const interviews = allApplications.filter(
    (app) => app.status === "Interviewing" || app.status === "HR Interview"
  ).length;

  const scoredJobs = allJobs.filter((job) => job.match_score !== null);
  const averageScore =
    percentScores.length > 0
      ? (
          percentScores.reduce((a, b) => a + b, 0) / percentScores.length
        ).toFixed(1)
      : "0";
  const excellentJobs = percentScores.filter((s) => s >= 80).length;
  const goodJobs = percentScores.filter((s) => s >= 60 && s < 80).length;
  const scoredPct =
    totalJobs > 0 ? ((scoredJobs.length / totalJobs) * 100).toFixed(1) : "0";

  const companyMap = new Map<string, { displayName: string; count: number }>();
  allJobs.forEach((job) => {
    const normalizedName = normalizeCompanyName(job.company);
    const existing = companyMap.get(normalizedName);

    if (existing) {
      existing.count += 1;
    } else {
      companyMap.set(normalizedName, {
        displayName: job.company,
        count: 1,
      });
    }
  });

  const topCompanies: CompanyData[] = Array.from(companyMap.values())
    .map(({ displayName, count }) => ({ name: displayName, value: count }))
    .sort((a, b) => b.value - a.value);

  const scoreMetrics: ScoreMetrics = {
    average: averageScore,
    excellent: excellentJobs,
    good: goodJobs,
    scoredPct,
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome back! Here&apos;s your personal career agent&apos;s latest
              insights and opportunities.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardStatsCard
            title="Total Jobs Found"
            value={totalJobs}
            icon={Briefcase}
            subtitle={`From ${topCompanies.length} companies`}
            color="blue"
          />
          <QualityMatchesCard scoreMetrics={scoreMetrics} />
          <DashboardStatsCard
            title="Applications Sent"
            value={totalApplications}
            icon={CheckCircle}
            subtitle={`${appliedJobs} jobs applied`}
            color="purple"
          />
          <DashboardStatsCard
            title="Active Opportunities"
            value={interviews + offers}
            icon={Target}
            subtitle={`${offers} offers received`}
            color="yellow"
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Recent Jobs
              </h2>
              <p className="text-sm text-muted-foreground">
                Latest jobs and updates from your search
              </p>
            </div>
          </div>
          <Card className="shadow-xl bg-gradient-to-br from-slate-75 via-blue-75 to-indigo-100 p-3">
            <CardContent className="p-0">
              <JobList initialJobs={allJobs} />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
