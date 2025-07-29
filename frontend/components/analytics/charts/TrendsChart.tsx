import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TimelineData } from "../types";
import { THEME_COLORS } from "../constants";
import { CustomTooltip } from "../shared/CustomTooltip";
import { Calendar } from "lucide-react";

interface TrendsChartProps {
  data: TimelineData[];
}

export const TrendsChart = ({ data }: TrendsChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2">
            No Timeline Data Available
          </h3>
          <p className="text-muted-foreground text-center text-sm md:text-base">
            Start adding application dates to see trends over time
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Application Activity Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your job application activity over time
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350} className="md:h-[400px]">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
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
            <Line
              type="monotone"
              dataKey="count"
              stroke={THEME_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: THEME_COLORS.primary, strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 10,
                stroke: THEME_COLORS.secondary,
                strokeWidth: 3,
              }}
              name="Applications Submitted"
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
