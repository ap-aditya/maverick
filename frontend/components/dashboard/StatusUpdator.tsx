"use client";

import { useTransition } from "react";
import { updateJobStatus } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StatusUpdaterProps {
  jobId: number;
  currentStatus: string | null;
}

export function StatusUpdater({ jobId, currentStatus }: StatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateJobStatus(jobId, newStatus);
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Interested":
        return "text-blue-600";
      case "Applied":
        return "text-green-600";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">Status:</span>
      <Select
        defaultValue={currentStatus || "New"}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger
          className={cn(
            "w-[120px] h-7 text-xs focus:ring-0 border-none shadow-sm",
            getStatusColor(currentStatus),
            isPending && "opacity-50"
          )}
        >
          <SelectValue placeholder="Set status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Interested">Interested</SelectItem>
          <SelectItem value="Applied">Applied</SelectItem>
          <SelectItem value="Archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
