import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { StatusData, PieLabelProps } from '../types';
import { PIE_COLORS } from '../constants';
import { CustomTooltip } from '../shared/CustomTooltip';

interface JobStatusChartProps {
  data: StatusData[];
}

const renderPieLabel = ({ name, percent }: PieLabelProps): string => {
  return `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`;
};

export const JobStatusChart = ({ data }: JobStatusChartProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Job Discovery Status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of job discovery stages
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280} className="md:h-[320px]">
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80}
              className="md:outerRadius-[100]"
              label={renderPieLabel}
              labelLine={false}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend className="text-xs md:text-sm" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
