import { FunnelData, StatusData, TimelineData } from "../types";
import { ApplicationPipelineChart } from "../charts/ApplicationPipelineChart";
import { JobStatusChart } from "../charts/JobStatusChart";
import { TimelineChart } from "../charts/TimelineChart";

interface OverviewTabProps {
  applicationFunnelData: FunnelData[];
  statusData: StatusData[];
  timelineData: TimelineData[];
  totalApplications: number;
}

export const OverviewTab = ({
  applicationFunnelData,
  statusData,
  timelineData,
  totalApplications,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <ApplicationPipelineChart
        data={applicationFunnelData}
        totalApplications={totalApplications}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <JobStatusChart data={statusData} />
        {timelineData.length > 0 && <TimelineChart data={timelineData} />}
      </div>
    </div>
  );
};
