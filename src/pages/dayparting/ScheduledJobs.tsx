import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ScheduledJobsTable } from "@/components/dayparting/ScheduledJobsTable";
import { CreateSchedulePanel } from "@/components/panels/CreateSchedulePanel";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { schedules as initialSchedules } from "@/data/mockDayParting";
import { DayPartingSchedule } from "@/types/dayparting";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";

export default function ScheduledJobs() {
  const { setDataPanel } = useActivePanel();
  const [schedules, setSchedules] = useState<DayPartingSchedule[]>(initialSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [showDeltas, setShowDeltas] = useState(false);

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
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 space-y-6 overflow-auto">
          <PageHeader title="Scheduled Jobs" subtitle="Manage your day parting schedules" />

          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search schedules..."
            onDownload={() => toast.success("Exporting schedules...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            leftContent={
              <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setDataPanel("createSchedule")}>
                <Plus className="h-3.5 w-3.5" />Create Schedule
              </Button>
            }
          />

          {filteredSchedules.length > 0 ? (
            <ScheduledJobsTable
              schedules={filteredSchedules}
              onPauseResume={handlePauseResume}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="text-center py-12 border border-border rounded-lg bg-card">
              <p className="text-muted-foreground">No scheduled jobs found</p>
              {searchQuery ? (
                <p className="text-sm mt-1 text-muted-foreground">Try adjusting your search query</p>
              ) : (
                <Button variant="link" onClick={() => setDataPanel("createSchedule")} className="mt-2">Create your first schedule</Button>
              )}
            </div>
          )}
        </div>

        {/* Right panel for creating schedule */}
        <CreateSchedulePanel />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone and all scheduled jobs will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}