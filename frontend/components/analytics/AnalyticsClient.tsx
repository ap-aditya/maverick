"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Job,
  Application,
  Metrics,
  ScoreMetrics,
  StatusData,
  CompanyData,
  TimelineData,
  FunnelData,
  ScoreData,
  ScoreRangeData,
} from "./types";
import { toPercent, normalizeCompanyName, COMPANY_COLORS } from "./constants";

import { AnalyticsHeader } from "./AnalyticsHeader";
import { MetricsCards } from "./MetricsCards";
import { MobileTabSelector } from "./shared/MobileTabSelector";
import { OverviewTab } from "./tabs/OverviewTab";
import { ScoreAnalysisTab } from "./tabs/ScoreAnalysisTab";
import { CompaniesTab } from "./tabs/CompaniesTab";
import { TrendsTab } from "./tabs/TrendsTab";

interface AnalyticsClientProps {
  allJobs: Job[];
  allApplications: Application[];
}

export function AnalyticsClient({
  allJobs,
  allApplications,
}: AnalyticsClientProps) {
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabOptions = [
    { value: "overview", label: "Overview" },
    { value: "scores", label: "Score Analysis" },
    { value: "companies", label: "Companies" },
    { value: "trends", label: "Trends" },
  ];

  const filteredApplications = useMemo((): Application[] => {
    if (dateFilter === "All") return allApplications;
    const now = new Date();
    const daysToSubtract = parseInt(dateFilter, 10);
    const cutoffDate = new Date(
      new Date().setDate(now.getDate() - daysToSubtract)
    );

    return allApplications.filter((app): app is Application => {
      if (!app.application_date) return false;
      return new Date(app.application_date) >= cutoffDate;
    });
  }, [allApplications, dateFilter]);

  const filteredJobs = allJobs;

  const rawScores = filteredJobs
    .filter(
      (j): j is Job & { match_score: number } =>
        j.match_score !== null && j.match_score !== undefined
    )
    .map((j) => j.match_score);

  const scoreScale =
    rawScores.length && Math.max(...rawScores) <= 10 ? 10 : 100;
  const percentScores = rawScores.map((s) => toPercent(s, scoreScale));

  const scoreMetrics = useMemo((): ScoreMetrics => {
    if (percentScores.length === 0) {
      return {
        average: "0",
        highest: 0,
        lowest: 0,
        scoredCount: 0,
        scoredPct: "0",
        excellent: 0,
        good: 0,
        averageBand: 0,
        poor: 0,
      };
    }

    const sum = percentScores.reduce((a, b) => a + b, 0);
    const average = (sum / percentScores.length).toFixed(1);
    const highest = Math.max(...percentScores);
    const lowest = Math.min(...percentScores);

    const excellent = percentScores.filter((s) => s >= 80).length;
    const good = percentScores.filter((s) => s >= 60 && s < 80).length;
    const averageBand = percentScores.filter((s) => s >= 40 && s < 60).length;
    const poor = percentScores.filter((s) => s < 40).length;

    return {
      average,
      highest,
      lowest,
      scoredCount: percentScores.length,
      scoredPct: ((percentScores.length / filteredJobs.length) * 100).toFixed(
        1
      ),
      excellent,
      good,
      averageBand,
      poor,
    };
  }, [percentScores, filteredJobs.length]);

  const metrics = useMemo((): Metrics => {
    const appliedJobs = filteredApplications.filter(
      (app) => app.status !== "Interested"
    ).length;
    const offers = filteredApplications.filter(
      (app) => app.status === "Offer"
    ).length;
    const interviews = filteredApplications.filter(
      (app) => app.status === "Interviewing" || app.status === "HR Interview"
    ).length;

    const uniqueCompaniesJobs = new Set(
      filteredJobs.map((job) => normalizeCompanyName(job.company))
    ).size;
    const uniqueCompaniesApps = new Set(
      filteredApplications.map((app) => normalizeCompanyName(app.company))
    ).size;

    return {
      totalJobs: filteredJobs.length,
      totalApplications: filteredApplications.length,
      appliedJobs,
      offers,
      interviews,
      conversionRate:
        appliedJobs > 0 ? ((offers / appliedJobs) * 100).toFixed(1) : "0",
      uniqueCompaniesJobs,
      uniqueCompaniesApps,
    };
  }, [filteredJobs, filteredApplications]);

  const scoreRangeData = useMemo((): ScoreRangeData[] => {
    if (scoreMetrics.scoredCount === 0) return [];
    return [
      { range: "80-100 (Excellent)", count: scoreMetrics.excellent },
      { range: "60-79 (Good)", count: scoreMetrics.good },
      { range: "40-59 (Average)", count: scoreMetrics.averageBand },
      { range: "0-39 (Poor)", count: scoreMetrics.poor },
    ]
      .filter((d) => d.count > 0)
      .map((d) => ({
        ...d,
        percentage: (d.count / scoreMetrics.scoredCount) * 100,
      }));
  }, [scoreMetrics]);

  const jobCompanyData = useMemo((): CompanyData[] => {
    const companyMap = new Map<
      string,
      { displayName: string; count: number }
    >();

    filteredJobs.forEach((job) => {
      const normalizedName = normalizeCompanyName(job.company);
      const existing = companyMap.get(normalizedName);

      if (existing) {
        existing.count += 1;
      } else {
        companyMap.set(normalizedName, {
          displayName: job.company,
          count: 1,
        });
      }
    });

    return Array.from(companyMap.values())
      .map(
        ({ displayName, count }): CompanyData => ({
          name: displayName,
          value: count,
        })
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredJobs]);

  const applicationCompanyData = useMemo((): CompanyData[] => {
    const companyMap = new Map<
      string,
      { displayName: string; count: number }
    >();

    filteredApplications.forEach((app) => {
      const normalizedName = normalizeCompanyName(app.company);
      const existing = companyMap.get(normalizedName);

      if (existing) {
        existing.count += 1;
      } else {
        companyMap.set(normalizedName, {
          displayName: app.company,
          count: 1,
        });
      }
    });

    return Array.from(companyMap.values())
      .map(
        ({ displayName, count }): CompanyData => ({
          name: displayName,
          value: count,
        })
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredApplications]);

  const statusData = useMemo((): StatusData[] => {
    const statusCounts = filteredJobs.reduce<Record<string, number>>(
      (acc, job) => {
        const status = job.status || "New";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(statusCounts)
      .map(([name, value]): StatusData => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const scoreData = useMemo((): ScoreData[] => {
    const counts: Record<string, number> = {};
    filteredJobs.forEach((job) => {
      const raw = job.match_score;
      if (raw == null) {
        counts["N/A"] = (counts["N/A"] || 0) + 1;
        return;
      }
      const pct = toPercent(raw, scoreScale);
      const label = pct.toString();
      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]): ScoreData => ({ name, count }))
      .sort((a, b) =>
        a.name === "N/A"
          ? 1
          : b.name === "N/A"
          ? -1
          : Number(a.name) - Number(b.name)
      );
  }, [filteredJobs, scoreScale]);

  const applicationFunnelData = useMemo((): FunnelData[] => {
    const statusOrder = [
      "Interested",
      "Applied",
      "Resume Shortlisted",
      "OA Qualified",
      "Interviewing",
      "HR Interview",
      "Offer",
    ] as const;
    const pipelineCounts = filteredApplications.reduce<Record<string, number>>(
      (acc, app) => {
        const status = app.status || "Interested";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    return statusOrder
      .map(
        (status, index): FunnelData => ({
          name: status,
          value: pipelineCounts[status] || 0,
          fill: COMPANY_COLORS[index % COMPANY_COLORS.length],
        })
      )
      .filter((item): item is FunnelData => item.value > 0);
  }, [filteredApplications]);

  const timelineData = useMemo((): TimelineData[] => {
    const applicationsWithDates = filteredApplications.filter(
      (app): app is Application & { application_date: string } =>
        app.application_date !== null && app.application_date !== undefined
    );

    const monthCounts = applicationsWithDates.reduce<Record<string, number>>(
      (acc, app) => {
        const month = new Date(app.application_date).toLocaleDateString(
          "en-US",
          { month: "short", year: "2-digit" }
        );
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(monthCounts)
      .map(([month, count]): TimelineData => ({ month, count }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [filteredApplications]);

  const handleDateFilterChange = (value: string): void => {
    setDateFilter(value);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        <AnalyticsHeader
          uniqueCompanies={metrics.uniqueCompaniesJobs}
          dateFilter={dateFilter}
          onDateFilterChange={handleDateFilterChange}
        />

        <MetricsCards metrics={metrics} />

        <MobileTabSelector
          currentTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabOptions}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="hidden md:grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scores">Score Analysis</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              applicationFunnelData={applicationFunnelData}
              statusData={statusData}
              timelineData={timelineData}
              totalApplications={filteredApplications.length}
            />
          </TabsContent>

          <TabsContent value="scores">
            <ScoreAnalysisTab
              scoreMetrics={scoreMetrics}
              scoreData={scoreData}
              scoreRangeData={scoreRangeData}
              totalJobs={metrics.totalJobs}
            />
          </TabsContent>

          <TabsContent value="companies">
            <CompaniesTab
              jobCompanyData={jobCompanyData}
              applicationCompanyData={applicationCompanyData}
            />
          </TabsContent>

          <TabsContent value="trends">
            <TrendsTab timelineData={timelineData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
