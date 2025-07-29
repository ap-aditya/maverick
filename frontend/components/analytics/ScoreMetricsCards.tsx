import { Card, CardContent } from "@/components/ui/card";
import { Star, BarChart3, TrendingUp } from "lucide-react";
import { ScoreMetrics } from "./types";

interface ScoreMetricsCardsProps {
  scoreMetrics: ScoreMetrics;
  totalJobs: number;
}

export const ScoreMetricsCards = ({
  scoreMetrics,
  totalJobs,
}: ScoreMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Score
              </p>
              <p className="text-xl md:text-2xl font-bold">
                {scoreMetrics.average}%
              </p>
            </div>
            <Star className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Jobs Scored
              </p>
              <p className="text-xl md:text-2xl font-bold">
                {scoreMetrics.scoredPct}%
              </p>
              <p className="text-xs text-muted-foreground">
                {scoreMetrics.scoredCount} of {totalJobs}
              </p>
            </div>
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Score Range
              </p>
              <p className="text-xl md:text-2xl font-bold">
                {scoreMetrics.lowest}% - {scoreMetrics.highest}%
              </p>
            </div>
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
