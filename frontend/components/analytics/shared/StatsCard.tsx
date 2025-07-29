import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  color = "blue",
}: StatsCardProps) => {
  const colorClasses = {
    blue: "border-l-blue-500 from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-600 dark:text-blue-400",
    green:
      "border-l-green-500 from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-600 dark:text-green-400",
    yellow:
      "border-l-yellow-500 from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-yellow-600 dark:text-yellow-400",
    red: "border-l-red-500 from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-600 dark:text-red-400",
    purple:
      "border-l-purple-500 from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 ${
        colorClasses[color].split(" ")[0]
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div
                className={`flex items-center text-xs ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 mr-1 ${
                    trend.isPositive ? "" : "rotate-180"
                  }`}
                />
                {Math.abs(trend.value)}% vs last period
              </div>
            )}
          </div>
          <div className="relative">
            <div
              className={`p-3 bg-gradient-to-br ${
                colorClasses[color].split("border-l-")[1]
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  colorClasses[color].split("dark:to-")[1]
                }`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
