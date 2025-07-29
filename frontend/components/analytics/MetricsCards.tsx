import { Users, Briefcase, Target, CheckCircle } from "lucide-react";
import { StatsCard } from "./shared/StatsCard";
import { Metrics } from "./types";

interface MetricsCardsProps {
  metrics: Metrics;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatsCard
        title="Total Jobs Discovered"
        value={metrics.totalJobs}
        icon={Briefcase}
        subtitle={`From ${metrics.uniqueCompaniesJobs} companies`}
        color="blue"
      />
      <StatsCard
        title="Applications Submitted"
        value={metrics.totalApplications}
        icon={Users}
        subtitle={`To ${metrics.uniqueCompaniesApps} companies`}
        color="green"
      />
      <StatsCard
        title="Interview Stage"
        value={metrics.interviews}
        icon={Target}
        subtitle="Active interviews"
        color="yellow"
      />
      <StatsCard
        title="Offers Received"
        value={metrics.offers}
        icon={CheckCircle}
        subtitle={`${metrics.conversionRate}% conversion rate`}
        color="purple"
      />
    </div>
  );
};
