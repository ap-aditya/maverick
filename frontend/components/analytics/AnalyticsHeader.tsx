import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Calendar } from "lucide-react";

interface AnalyticsHeaderProps {
  uniqueCompanies: number;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
}

export const AnalyticsHeader = ({
  uniqueCompanies,
  dateFilter,
  onDateFilterChange,
}: AnalyticsHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Job Analytics Dashboard
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Track your job search progress and insights across {uniqueCompanies}{" "}
          companies
        </p>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter Applications:</span>
        </div>
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[140px] md:w-[160px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Time</SelectItem>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
