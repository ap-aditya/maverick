"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { applications } from "@/lib/schema";
import { updateApplicationStatus } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditApplicationForm } from "@/components/tracker/EditApplicationForm";
import {
  ExternalLink,
  Edit,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type Application = typeof applications.$inferSelect;

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case "Offer":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Offer",
      };
    case "Interviewing":
    case "HR Interview":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        label: status,
      };
    case "Applied":
    case "Resume Shortlisted":
    case "OA Qualified":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: status,
      };
    case "Rejected":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Rejected",
      };
    case "Interested":
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
        label: status || "Interested",
      };
  }
};

function StatusCell({ row }: { row: Row<Application> }) {
  const [isPending, startTransition] = useTransition();
  const application = row.original;
  const statusInfo = getStatusInfo(application.status);

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const result = await updateApplicationStatus(application.id, newStatus);
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${statusInfo.color} border`}>
        <statusInfo.icon className="h-3 w-3 mr-1" />
        {statusInfo.label}
      </Badge>
      <Select
        defaultValue={application.status || ""}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-8 h-8 p-0 border-0 bg-transparent hover:bg-gray-100 transition-colors">
          <Edit className="h-3 w-3" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Interested">Interested</SelectItem>
          <SelectItem value="Applied">Applied</SelectItem>
          <SelectItem value="Resume Shortlisted">Resume Shortlisted</SelectItem>
          <SelectItem value="OA Qualified">OA Qualified</SelectItem>
          <SelectItem value="Interviewing">Interviewing</SelectItem>
          <SelectItem value="HR Interview">HR Interview</SelectItem>
          <SelectItem value="Offer">Offer</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ActionsCell({ row }: { row: Row<Application> }) {
  const application = row.original;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-1">
      {application.application_link && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          asChild
        >
          <a
            href={application.application_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <EditApplicationForm
            application={application}
            onFormSubmit={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CompanyCell({ row }: { row: Row<Application> }) {
  const company = row.original.company;
  return <span className="font-medium">{company}</span>;
}

function JobTitleCell({ row }: { row: Row<Application> }) {
  const jobTitle = row.original.job_title;
  return <span>{jobTitle}</span>;
}
function DateCell({ row }: { row: Row<Application> }) {
  const date = row.original.application_date;

  if (!date) {
    return <span className="text-gray-400 text-sm">N/A</span>;
  }

  const applicationDate = new Date(date);
  return (
    <span className="text-sm">{applicationDate.toLocaleDateString()}</span>
  );
}
export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <CompanyCell row={row} />,
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
    cell: ({ row }) => <JobTitleCell row={row} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "application_date",
    header: "Date Applied",
    cell: ({ row }) => <DateCell row={row} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export function ApplicationsTable({ data }: { data: Application[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [dateFilter, setDateFilter] = React.useState("All");

  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (statusFilter !== "All") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    if (dateFilter !== "All") {
      const now = new Date();
      const daysToSubtract = parseInt(dateFilter, 10);
      const cutoffDate = new Date(now.setDate(now.getDate() - daysToSubtract));

      filtered = filtered.filter((app) => {
        if (!app.application_date) return false;
        return new Date(app.application_date) >= cutoffDate;
      });
    }

    return filtered;
  }, [data, statusFilter, dateFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Filter Applications</h3>
          <Badge variant="outline" className="ml-auto">
            {filteredData.length} of {data.length} applications
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Applications
            </label>
            <div className="relative">
              <Input
                placeholder="Company or job title..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter by Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Resume Shortlisted">
                  Resume Shortlisted
                </SelectItem>
                <SelectItem value="OA Qualified">OA Qualified</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
                <SelectItem value="HR Interview">HR Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Filter by Date
            </label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
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
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-gray-900 h-12"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <AlertCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No Applications Found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      No applications match your current filters. Try adjusting
                      your search criteria.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGlobalFilter("");
                        setStatusFilter("All");
                        setDateFilter("All");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
