import { ScoreMetrics, ScoreData, ScoreRangeData } from "../types";
import { ScoreMetricsCards } from "../ScoreMetricsCards";
import { ScoreDistributionChart } from "../charts/ScoreDistributionChart";
import { ScoreQualityChart } from "../charts/ScoreQualityChart";

interface ScoreAnalysisTabProps {
  scoreMetrics: ScoreMetrics;
  scoreData: ScoreData[];
  scoreRangeData: ScoreRangeData[];
  totalJobs: number;
}

export const ScoreAnalysisTab = ({
  scoreMetrics,
  scoreData,
  scoreRangeData,
  totalJobs,
}: ScoreAnalysisTabProps) => {
  return (
    <div className="space-y-6">
      <ScoreMetricsCards scoreMetrics={scoreMetrics} totalJobs={totalJobs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreDistributionChart data={scoreData} />
        {scoreRangeData.length > 0 && (
          <ScoreQualityChart
            data={scoreRangeData}
            scoreMetrics={scoreMetrics}
          />
        )}
      </div>
    </div>
  );
};
