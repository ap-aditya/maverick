import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ScoreData } from "../types";
import { THEME_COLORS } from "../constants";
import { CustomTooltip } from "../shared/CustomTooltip";
import { BarChart3 } from "lucide-react";

interface ScoreDistributionChartProps {
  data: ScoreData[];
}

export const ScoreDistributionChart = ({
  data,
}: ScoreDistributionChartProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
          Score Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Individual score breakdown
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320} className="md:h-[400px]">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              className="md:text-xs"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              className="md:text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend className="text-xs md:text-sm" />
            <Bar
              dataKey="count"
              fill={THEME_COLORS.primary}
              name="Number of Jobs"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
