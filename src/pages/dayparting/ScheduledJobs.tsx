import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScheduledJobsTable } from "@/components/dayparting/ScheduledJobsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pause, Trash2 } from "lucide-react";
import { schedules as initialSchedules } from "@/data/mockDayParting";
import { DayPartingSchedule } from "@/types/dayparting";
import { useNavigate } from "react-router-dom";

export default function ScheduledJobs() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<DayPartingSchedule[]>(initialSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredSchedules = schedules.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.campaignNames.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePauseResume = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkPause = () => {
    setSchedules((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) && s.status === "active"
          ? { ...s, status: "paused", updatedAt: new Date().toISOString() }
          : s
      )
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} schedule(s)?`)) {
      setSchedules((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Scheduled Jobs</h1>
            <p className="text-sm text-muted-foreground">Manage your day parting schedules</p>
          </div>
          <Button onClick={() => navigate("/dayparting/scheduled/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <Button variant="outline" size="sm" onClick={handleBulkPause}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        {filteredSchedules.length > 0 ? (
          <ScheduledJobsTable
            schedules={filteredSchedules}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onPauseResume={handlePauseResume}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <p className="text-muted-foreground">No scheduled jobs found</p>
            {searchQuery ? (
              <p className="text-sm mt-1 text-muted-foreground">Try adjusting your search query</p>
            ) : (
              <Button variant="link" onClick={() => navigate("/dayparting/scheduled/new")} className="mt-2">
                Create your first schedule
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
