import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TimeSelector } from "@/components/dayparting/TimeSelector";
import { DaySelector } from "@/components/dayparting/DaySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Play, Clock } from "lucide-react";
import { dayPartingCampaigns, schedules } from "@/data/mockDayParting";
import { DayPartingSchedule } from "@/types/dayparting";
import { toast } from "sonner";
import { PageFooterBar } from "@/components/layout/PageFooterBar";


const breadcrumbItems = [
  { label: "Day Parting", href: "/dayparting/scheduled" },
  { label: "Schedule Editor" },
];
export default function ScheduleEditor() {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const isEdit = Boolean(scheduleId);

  const [name, setName] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [actionType, setActionType] = useState<"pause" | "reduce_budget" | "increase_budget">("pause");
  const [budgetModifier, setBudgetModifier] = useState<number>(20);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [repeatType, setRepeatType] = useState<"daily" | "weekly" | "once">("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (isEdit && scheduleId) {
      const existing = schedules.find((s) => s.id === scheduleId);
      if (existing) {
        setName(existing.name);
        setSelectedCampaigns(existing.campaignIds);
        setActionType(existing.actionType);
        setBudgetModifier(Math.abs(existing.budgetModifier || 20));
        setSelectedHours(existing.hours);
        setSelectedDays(existing.daysOfWeek);
        setRepeatType(existing.repeatType as "daily" | "weekly" | "once");
        setStartDate(existing.startDate);
      }
    }
  }, [isEdit, scheduleId]);

  const toggleCampaign = (campaignId: string) => {
    if (selectedCampaigns.includes(campaignId)) {
      setSelectedCampaigns(selectedCampaigns.filter((c) => c !== campaignId));
    } else {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    }
  };

  const handleSave = (activate: boolean) => {
    const schedule: Partial<DayPartingSchedule> = {
      name,
      campaignIds: selectedCampaigns,
      actionType,
      budgetModifier: actionType === "reduce_budget" ? -budgetModifier : budgetModifier,
      hours: selectedHours,
      daysOfWeek: selectedDays,
      repeatType,
      startDate,
      status: activate ? "active" : "draft",
    };
    console.log("Saving schedule:", schedule);
    toast.success(activate ? "Schedule activated" : "Draft saved");
    navigate("/dayparting/scheduled");
  };

  const isValid = name.trim() && selectedCampaigns.length > 0 && selectedHours.length > 0 && selectedDays.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={isEdit ? "Edit Schedule" : "Create Schedule"}
          subtitle="Configure day parting rules for your campaigns"
          actions={
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="outline" onClick={() => handleSave(false)} disabled={!isValid}>
                <Save className="mr-2 h-4 w-4" />Save as Draft
              </Button>
              <Button onClick={() => handleSave(true)} disabled={!isValid}>
                <Play className="mr-2 h-4 w-4" />Activate Schedule
              </Button>
            </div>
          }
        />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column — Configuration */}
          <div className="space-y-6">
            {/* Schedule Name */}
            <section className="space-y-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">Schedule Details</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Night Hours Pause"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Repeat</Label>
                  <Select value={repeatType} onValueChange={(v) => setRepeatType(v as typeof repeatType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
            </section>

            {/* Action Type */}
            <section className="space-y-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">Action</h3>
              <div className="space-y-2">
                <Label>Action Type</Label>
                <Select value={actionType} onValueChange={(v) => setActionType(v as typeof actionType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pause">Pause Campaign</SelectItem>
                    <SelectItem value="reduce_budget">Reduce Budget</SelectItem>
                    <SelectItem value="increase_budget">Increase Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {actionType !== "pause" && (
                <div className="space-y-2">
                  <Label>Budget Modifier (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number" min={1} max={100}
                      value={budgetModifier}
                      onChange={(e) => setBudgetModifier(parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      {actionType === "reduce_budget" ? "reduction" : "increase"}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Campaign Selection */}
            <section className="space-y-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Campaigns ({selectedCampaigns.length} selected)
              </h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {dayPartingCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <Checkbox
                      id={campaign.id}
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={() => toggleCampaign(campaign.id)}
                    />
                    <Label htmlFor={campaign.id} className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">{campaign.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ${campaign.budget} • {campaign.roas.toFixed(2)}x ROAS
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column — Timing & Preview */}
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">Hours</h3>
              <TimeSelector selectedHours={selectedHours} onHoursChange={setSelectedHours} />
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">Days</h3>
              <DaySelector selectedDays={selectedDays} onDaysChange={setSelectedDays} />
            </section>

            {/* Preview */}
            <section className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
              <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Schedule Preview
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedCampaigns.length > 0 ? (
                  <>
                    Will{" "}
                    <strong className="text-foreground">
                      {actionType === "pause"
                        ? "pause"
                        : actionType === "reduce_budget"
                        ? `reduce budget by ${budgetModifier}%`
                        : `increase budget by ${budgetModifier}%`}
                    </strong>{" "}
                    for {selectedCampaigns.length} campaign(s) during{" "}
                    {selectedHours.length > 0 ? `${selectedHours.length} hour(s)` : "no hours selected"} on{" "}
                    {selectedDays.length > 0 ? `${selectedDays.length} day(s)` : "no days selected"} — repeats{" "}
                    <strong className="text-foreground">{repeatType}</strong>, starting{" "}
                    <strong className="text-foreground">{startDate}</strong>.
                  </>
                ) : (
                  "Select campaigns and configure timing to see preview."
                )}
              </p>
            </section>
          </div>
        </div>
      </div>
    
      <PageFooterBar breadcrumbItems={breadcrumbItems} />
</AppLayout>
  );
}
