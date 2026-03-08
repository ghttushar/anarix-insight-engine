import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ScheduledJobsTable } from "@/components/dayparting/ScheduledJobsTable";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { schedules as initialSchedules } from "@/data/mockDayParting";
import { DayPartingSchedule } from "@/types/dayparting";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ScheduledJobs() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<DayPartingSchedule[]>(initialSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const filteredSchedules = schedules.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.campaignNames.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePauseResume = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() } : s)
    );
  };

  const handleDeleteClick = (id: string) => {
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (scheduleToDelete) {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete));
      toast.success("Schedule deleted successfully");
      setScheduleToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Scheduled Jobs"
          subtitle="Manage your day parting schedules"
          actions={
            <Button onClick={() => navigate("/dayparting/scheduled/new")}>
              <Plus className="mr-2 h-4 w-4" />Create Schedule
            </Button>
          }
        />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search schedules..."
          onDownload={() => toast.success("Exporting schedules...")}
        />

        {filteredSchedules.length > 0 ? (
          <ScheduledJobsTable
            schedules={filteredSchedules}
            onPauseResume={handlePauseResume}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <p className="text-muted-foreground">No scheduled jobs found</p>
            {searchQuery ? (
              <p className="text-sm mt-1 text-muted-foreground">Try adjusting your search query</p>
            ) : (
              <Button variant="link" onClick={() => navigate("/dayparting/scheduled/new")} className="mt-2">Create your first schedule</Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}