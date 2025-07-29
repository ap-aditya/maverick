import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
} from "recharts";
import { FunnelData, FunnelLabelProps } from "../types";
import { CustomTooltip } from "../shared/CustomTooltip";

interface ApplicationPipelineChartProps {
  data: FunnelData[];
  totalApplications: number;
}

const CustomFunnelLabel = (props: FunnelLabelProps) => {
  const { x = 0, y = 0, width = 0, height = 0, value = 0, name = "" } = props;
  return (
    <text
      x={x + width + 10}
      y={y + height / 2}
      textAnchor="start"
      dominantBaseline="middle"
      className="fill-gray-700 dark:fill-gray-300 text-sm font-medium"
    >
      {`${name}: ${value}`}
    </text>
  );
};

export const ApplicationPipelineChart = ({
  data,
  totalApplications,
}: ApplicationPipelineChartProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <CardTitle className="text-lg md:text-xl">
            Application Pipeline
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress through each application stage
          </p>
        </div>
        <Badge
          variant="secondary"
          className="text-sm md:text-lg px-2 md:px-3 py-1 self-start sm:self-center"
        >
          {totalApplications} applications
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
          <FunnelChart
            margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
            className="md:mr-[120px]"
          >
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
              animationDuration={1000}
            >
              <LabelList content={<CustomFunnelLabel />} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
