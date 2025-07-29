import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ScoreRangeData, ScoreMetrics } from "../types";
import { THEME_COLORS } from "../constants";
import { Star } from "lucide-react";

interface ScoreQualityChartProps {
  data: ScoreRangeData[];
  scoreMetrics: ScoreMetrics;
}

export const ScoreQualityChart = ({
  data,
  scoreMetrics,
}: ScoreQualityChartProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Star className="h-4 w-4 md:h-5 md:w-5" />
          Quality Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Jobs grouped by match quality
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320} className="md:h-[400px]">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="range"
              cx="50%"
              cy="50%"
              outerRadius={100}
              className="md:outerRadius-[120]"
              label={({ range, percentage }) =>
                `${range.split(" ")[0]} (${percentage.toFixed(0)}%)`
              }
              labelLine={false}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    [
                      THEME_COLORS.success,
                      THEME_COLORS.primary,
                      THEME_COLORS.warning,
                      THEME_COLORS.danger,
                    ][index]
                  }
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value} jobs (${(
                  (value / scoreMetrics.scoredCount) *
                  100
                ).toFixed(1)}%)`,
                "Count",
              ]}
            />
            <Legend className="text-xs md:text-sm" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
