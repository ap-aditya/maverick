import { jobs, applications } from "@/lib/schema";

export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;

export interface StatusData {
  name: string;
  value: number;
}

export interface CompanyData {
  name: string;
  value: number;
}

export interface TimelineData {
  month: string;
  count: number;
}

export interface FunnelData {
  name: string;
  value: number;
  fill: string;
}

export interface ScoreData {
  name: string;
  count: number;
}

export interface ScoreRangeData {
  range: string;
  count: number;
  percentage: number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

export interface FunnelLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  name?: string;
  viewBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PieLabelProps {
  name?: string;
  percent?: number;
  value?: number;
}

export interface Metrics {
  totalJobs: number;
  totalApplications: number;
  appliedJobs: number;
  offers: number;
  interviews: number;
  conversionRate: string;
  uniqueCompaniesJobs: number;
  uniqueCompaniesApps: number;
}

export interface ScoreMetrics {
  average: string;
  highest: number;
  lowest: number;
  scoredCount: number;
  scoredPct: string;
  excellent: number;
  good: number;
  averageBand: number;
  poor: number;
}
