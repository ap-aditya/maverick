import { TimelineData } from "../types";
import { TrendsChart } from "../charts/TrendsChart";

interface TrendsTabProps {
  timelineData: TimelineData[];
}

export const TrendsTab = ({ timelineData }: TrendsTabProps) => {
  return (
    <div className="space-y-6">
      <TrendsChart data={timelineData} />
    </div>
  );
};
