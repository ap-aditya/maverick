import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TimelineData } from "../types";
import { THEME_COLORS } from "../constants";
import { CustomTooltip } from "../shared/CustomTooltip";

interface TimelineChartProps {
  data: TimelineData[];
}

export const TimelineChart = ({ data }: TimelineChartProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Application Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly application activity
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280} className="md:h-[320px]">
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey="count"
              stroke={THEME_COLORS.primary}
              strokeWidth={2}
              dot={{ fill: THEME_COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: THEME_COLORS.secondary }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
