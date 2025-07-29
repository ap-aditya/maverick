import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { CompanyData, PieLabelProps } from "../types";
import { COMPANY_COLORS } from "../constants";

interface CompanyDonutChartProps {
  data: CompanyData[];
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tooltipFormatter: (value: number, name: string) => [string, string];
}

const renderCompanyDonutLabel = ({ name, percent }: PieLabelProps): string => {
  if (!percent || percent < 0.05) return "";
  return `${name} (${(percent * 100).toFixed(0)}%)`;
};

export const CompanyDonutChart = ({
  data,
  title,
  subtitle,
  icon,
  tooltipFormatter,
}: CompanyDonutChartProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            {icon}
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Badge variant="outline" className="self-start sm:self-center">
          {data.length} companies shown
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350} className="md:h-[400px]">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={renderCompanyDonutLabel}
              labelLine={false}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COMPANY_COLORS[index % COMPANY_COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip formatter={tooltipFormatter} />
            <Legend
              verticalAlign="bottom"
              height={36}
              className="text-xs md:text-sm"
              formatter={(value) => (
                <span className="text-sm font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
