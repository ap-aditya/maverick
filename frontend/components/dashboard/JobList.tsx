"use client";

import { useState, useMemo } from "react";
import { jobs } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { JobDetailView } from "@/components/dashboard/JobDetailView";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusUpdater } from "@/components/dashboard/StatusUpdator";
import {
  ExternalLink,
  MapPin,
  Search,
  Filter,
  Star,
  Building2,
  AlertCircle,
} from "lucide-react";

type Job = typeof jobs.$inferSelect;

interface JobListProps {
  initialJobs: Job[];
}
const getBadgeVariant = (score: number | null) => {
  if (score === null || score === undefined) {
    return {
      className: "bg-gray-100 text-gray-700 border border-gray-200",
      label: "N/A",
    };
  }
  if (score >= 8) {
    return {
      className:
        "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
      label: `${score}/10`,
    };
  }
  if (score >= 6) {
    return {
      className:
        "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
      label: `${score}/10`,
    };
  }
  return {
    className:
      "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
    label: `${score}/10`,
  };
};

export function JobList({ initialJobs }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minScore, setMinScore] = useState(0);

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const searchMatch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "All" || job.status === statusFilter;
      const scoreMatch = (job.match_score || 0) >= minScore;
      return searchMatch && statusMatch && scoreMatch;
    });
  }, [initialJobs, searchTerm, statusFilter, minScore]);

  const totalJobs = initialJobs.length;
  const matchingJobs = filteredJobs.length;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">
              Search & Filter Jobs
            </CardTitle>
            <Badge variant="outline" className="ml-auto">
              {matchingJobs} of {totalJobs} jobs
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="search"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search Jobs
              </label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Company or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter by Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  id="status"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="score"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                Minimum Score
              </label>
              <Select
                value={String(minScore)}
                onValueChange={(value) => setMinScore(Number(value))}
              >
                <SelectTrigger
                  id="score"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Select score" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 5, 6, 7, 8, 9].map((score) => (
                    <SelectItem key={score} value={String(score)}>
                      {score === 0 ? "All Scores" : `${score}+ Stars`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const badgeInfo = getBadgeVariant(job.match_score);

            return (
              <Drawer key={job.id}>
                <DrawerTrigger asChild>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={badgeInfo.className}>
                        <Star className="h-3 w-3 mr-1" />
                        {badgeInfo.label}
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 pr-16 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-600 dark:text-gray-400 pt-1">
                        <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">{job.company}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {job.location || "Remote / Location not specified"}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                job.status === "Applied"
                                  ? "bg-blue-500"
                                  : job.status === "Interested"
                                  ? "bg-green-500"
                                  : job.status === "Archived"
                                  ? "bg-gray-500"
                                  : "bg-purple-500"
                              }`}
                            ></div>
                            {job.status || "New"}
                          </span>
                          <span className="text-gray-400">ID: {job.id}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      <StatusUpdater
                        jobId={job.id}
                        currentStatus={job.status}
                      />
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Job
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>

                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </Card>
                </DrawerTrigger>
                <JobDetailView job={job} />
              </Drawer>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
              No jobs match your current search and filter criteria. Try
              adjusting your filters or search terms.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setMinScore(0);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
