import { AlertTriangle, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { JobListItem } from "@/features/job/components/JobListItem/JobListItem";
import type { JobListItem as JobListItemType, JobStatusUi, JobViewState } from "@/features/job/components/types";
import type { JobStatus } from "@/generated/api";
import { cn } from "@/lib/utils";

type JobListProps = {
  jobs: JobListItemType[];
  state: JobViewState;
  selectedJobId: string | null;
  selectedJobIds: Set<string>;
  emptyLabel: string;
  errorLabel: string;
  deleteLabel: string;
  deleteSelectedLabel: string;
  canManage: boolean;
  hostLabel: string;
  startedAtLabel: string;
  durationLabel: string;
  statusLabels: Record<JobStatusUi, string>;
  statusFilterLabels: Record<JobStatus | "all", string>;
  filters: {
    status: JobStatus | "all";
    hostId: string;
    tag: string;
    query: string;
  };
  hostOptions: { id: string; name: string }[];
  filterLabels: {
    status: string;
    host: string;
    keyword: string;
    keywordPlaceholder: string;
    tag: string;
    tagPlaceholder: string;
    selectPage: string;
    selected: string;
    clearSelection: string;
  };
  pagination: {
    pageRangeLabel: string;
    previousLabel: string;
    nextLabel: string;
    canPrevious: boolean;
    canNext: boolean;
  };
  onSelectJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onToggleJobSelection: (jobId: string) => void;
  onToggleCurrentPageSelection: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onFiltersChange: (filters: Partial<JobListProps["filters"]>) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function JobList({
  jobs,
  state,
  selectedJobId,
  selectedJobIds,
  emptyLabel,
  errorLabel,
  deleteLabel,
  deleteSelectedLabel,
  canManage,
  hostLabel,
  startedAtLabel,
  durationLabel,
  statusLabels,
  statusFilterLabels,
  filters,
  hostOptions,
  filterLabels,
  pagination,
  onSelectJob,
  onDeleteJob,
  onToggleJobSelection,
  onToggleCurrentPageSelection,
  onClearSelection,
  onBulkDelete,
  onFiltersChange,
  onPreviousPage,
  onNextPage,
}: JobListProps) {
  const pageJobIds = jobs.map((job) => job.id);
  const selectedCount = selectedJobIds.size;
  const isPageSelected = pageJobIds.length > 0 && pageJobIds.every((jobId) => selectedJobIds.has(jobId));
  const isPagePartiallySelected = !isPageSelected && pageJobIds.some((jobId) => selectedJobIds.has(jobId));
  const controls = (
    <div className={cn("mb-3 space-y-3")}>
      <div className={cn("grid gap-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]")}>
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value as JobStatus | "all" })}
        >
          <SelectTrigger className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200")}>
            <SelectValue placeholder={filterLabels.status} />
          </SelectTrigger>
          <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
            {(["all", "running", "finished", "failed", "canceled"] as const).map((status) => (
              <SelectItem key={status} value={status} className={cn("cursor-pointer")}>
                {statusFilterLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.hostId} onValueChange={(value) => onFiltersChange({ hostId: value })}>
          <SelectTrigger className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200")}>
            <SelectValue placeholder={filterLabels.host} />
          </SelectTrigger>
          <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
            <SelectItem value="all" className={cn("cursor-pointer")}>
              {statusFilterLabels.all}
            </SelectItem>
            {hostOptions.map((host) => (
              <SelectItem key={host.id} value={host.id} className={cn("cursor-pointer")}>
                {host.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={filters.tag}
          onChange={(event) => onFiltersChange({ tag: event.target.value })}
          placeholder={filterLabels.tagPlaceholder}
          aria-label={filterLabels.tag}
          className={cn("border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500")}
        />
        <Input
          value={filters.query}
          onChange={(event) => onFiltersChange({ query: event.target.value })}
          placeholder={filterLabels.keywordPlaceholder}
          aria-label={filterLabels.keyword}
          className={cn("border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500")}
        />
      </div>
      <div className={cn("flex flex-wrap items-center justify-between gap-2")}>
        <div className={cn("flex min-w-0 flex-wrap items-center gap-2")}>
          {canManage ? (
            <label className={cn("inline-flex cursor-pointer items-center gap-2 text-sm text-slate-300")}>
              <input
                type="checkbox"
                checked={isPageSelected}
                ref={(element) => {
                  if (element) element.indeterminate = isPagePartiallySelected;
                }}
                onChange={onToggleCurrentPageSelection}
                className={cn("size-4 cursor-pointer accent-cyan-400")}
              />
              {filterLabels.selectPage}
            </label>
          ) : null}
          {selectedCount > 0 ? (
            <>
              <span className={cn("text-sm text-slate-300")}>{filterLabels.selected}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
              >
                <X className={cn("size-4")} />
                {filterLabels.clearSelection}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onBulkDelete}
                className={cn("cursor-pointer bg-rose-700 text-white hover:bg-rose-600")}
              >
                <Trash2 className={cn("size-4")} />
                {deleteSelectedLabel}
              </Button>
            </>
          ) : null}
        </div>
        <div className={cn("flex items-center gap-2 text-sm text-slate-400")}>
          <span>{pagination.pageRangeLabel}</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!pagination.canPrevious}
            onClick={onPreviousPage}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
            aria-label={pagination.previousLabel}
          >
            <ChevronLeft className={cn("size-4")} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!pagination.canNext}
            onClick={onNextPage}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
            aria-label={pagination.nextLabel}
          >
            <ChevronRight className={cn("size-4")} />
          </Button>
        </div>
      </div>
    </div>
  );

  if (state === "loading") {
    return (
      <>
        {controls}
        <div className={cn("space-y-2")}>
          <Skeleton className={cn("h-20 bg-slate-800")} />
          <Skeleton className={cn("h-20 bg-slate-800")} />
          <Skeleton className={cn("h-20 bg-slate-800")} />
        </div>
      </>
    );
  }

  if (state === "error") {
    return (
      <>
        {controls}
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border border-rose-400/35 bg-rose-950/35 p-4 text-sm text-rose-100",
          )}
        >
          <AlertTriangle className={cn("size-4")} />
          {errorLabel}
        </div>
      </>
    );
  }

  if (state === "empty") {
    return (
      <>
        {controls}
        <div
          className={cn("rounded-xl border border-dashed border-slate-600 bg-slate-900/45 p-5 text-sm text-slate-400")}
        >
          {emptyLabel}
        </div>
      </>
    );
  }

  return (
    <>
      {controls}
      <div className={cn("space-y-2")}>
        {jobs.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            isSelected={job.id === selectedJobId}
            isBulkSelected={selectedJobIds.has(job.id)}
            canManage={canManage}
            deleteLabel={deleteLabel}
            hostLabel={hostLabel}
            statusLabel={statusLabels[job.status]}
            startedAtLabel={startedAtLabel}
            durationLabel={durationLabel}
            onSelect={onSelectJob}
            onDelete={onDeleteJob}
            onToggleBulkSelection={onToggleJobSelection}
          />
        ))}
      </div>
    </>
  );
}
