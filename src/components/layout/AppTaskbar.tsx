import { useState, useEffect, ReactNode } from "react";
import { CalendarIcon, Play, Sparkles, Bell, Lightbulb } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { cn } from "@/lib/utils";
import { useFilter } from "@/contexts/FilterContext";
import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DatePreset {
  label: string;
  getRange: () => { from: Date; to: Date };
}

const today = () => new Date();

const DATE_PRESET_GROUPS: { label: string; presets: DatePreset[] }[] = [
  {
    label: "Days",
    presets: [
      { label: "Today", getRange: () => ({ from: today(), to: today() }) },
      { label: "Yesterday", getRange: () => { const d = subDays(today(), 1); return { from: d, to: d }; } },
      { label: "Last 7 days", getRange: () => ({ from: subDays(today(), 6), to: today() }) },
      { label: "Last 14 days", getRange: () => ({ from: subDays(today(), 13), to: today() }) },
      { label: "Last 30 days", getRange: () => ({ from: subDays(today(), 29), to: today() }) },
    ],
  },
  {
    label: "Weeks",
    presets: [
      { label: "This week", getRange: () => ({ from: startOfWeek(today()), to: today() }) },
      { label: "Last week", getRange: () => { const s = startOfWeek(subWeeks(today(), 1)); return { from: s, to: endOfWeek(s) }; } },
      { label: "2 weeks ago", getRange: () => { const s = startOfWeek(subWeeks(today(), 2)); return { from: s, to: endOfWeek(s) }; } },
    ],
  },
  {
    label: "Months",
    presets: [
      { label: "This month", getRange: () => ({ from: startOfMonth(today()), to: today() }) },
      { label: "Last month", getRange: () => { const s = startOfMonth(subMonths(today(), 1)); return { from: s, to: endOfMonth(s) }; } },
      { label: "Last 3 months", getRange: () => ({ from: subMonths(today(), 3), to: today() }) },
    ],
  },
  {
    label: "Quarters",
    presets: [
      { label: "This quarter", getRange: () => ({ from: startOfQuarter(today()), to: today() }) },
      { label: "Last quarter", getRange: () => { const s = startOfQuarter(subQuarters(today(), 1)); return { from: s, to: endOfQuarter(s) }; } },
    ],
  },
];

interface AppTaskbarProps {
  showAdType?: boolean;
  showFrequency?: boolean;
  showDateRange?: boolean;
  showRunButton?: boolean;
  onRun?: () => void;
  children?: ReactNode;
}

export function AppTaskbar({ showAdType = false, showFrequency = false, showDateRange = false, showRunButton = false, onRun, children }: AppTaskbarProps) {
  const { adType, setAdType, frequency, setFrequency, dateRange, setDateRange } = useFilter();

  const [draftRange, setDraftRange] = useState<{ from: Date; to: Date }>(dateRange);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (datePopoverOpen) {
      setDraftRange(dateRange);
    }
  }, [datePopoverOpen]);

  const handleApplyDateRange = () => {
    setDateRange(draftRange);
    setDatePopoverOpen(false);
  };

  const handleCancelDateRange = () => {
    setDatePopoverOpen(false);
  };

  const handlePresetClick = (preset: DatePreset) => {
    const range = preset.getRange();
    setDraftRange(range);
  };

  return (
    <div className="flex h-14 items-center rounded-lg border border-border bg-card px-4 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        {showAdType && (
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ad Type</span>
            <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
              <SelectTrigger className="h-8 w-[110px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-xs cursor-pointer">All Types</SelectItem>
                <SelectItem value="SP" className="text-xs cursor-pointer">Sponsored Products</SelectItem>
                <SelectItem value="SB" className="text-xs cursor-pointer">Sponsored Brands</SelectItem>
                <SelectItem value="SD" className="text-xs cursor-pointer">Sponsored Display</SelectItem>
                <SelectItem value="SV" className="text-xs cursor-pointer">Sponsored Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showFrequency && (
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
              <SelectTrigger className="h-8 w-[90px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Daily", "Weekly", "Monthly"].map((f) => (
                  <SelectItem key={f} value={f} className="text-xs cursor-pointer">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showDateRange && (
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range</span>
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm font-normal px-1.5 cursor-pointer">
                  <CalendarIcon className="h-3 w-3" />
                  {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <div className="flex">
                  {/* Presets panel */}
                  <div className="w-[200px] border-r border-border py-3 space-y-4 max-h-[420px] overflow-auto bg-muted/30">
                    {DATE_PRESET_GROUPS.map((group) => (
                      <div key={group.label}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-1.5">{group.label}</p>
                        <div className="space-y-0.5 px-2">
                          {group.presets.map((preset) => {
                            const presetRange = preset.getRange();
                            const isSelected =
                              draftRange.from.toDateString() === presetRange.from.toDateString() &&
                              draftRange.to.toDateString() === presetRange.to.toDateString();
                            return (
                              <button
                                key={preset.label}
                                onClick={() => handlePresetClick(preset)}
                                className={cn(
                                  "w-full text-left text-xs px-3 py-2 rounded-md transition-colors cursor-pointer font-medium",
                                  isSelected
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                                )}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Calendar + actions */}
                  <div className="flex flex-col">
                    <Calendar
                      mode="range"
                      selected={{ from: draftRange.from, to: draftRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDraftRange({ from: range.from, to: range.to });
                        } else if (range?.from) {
                          setDraftRange({ from: range.from, to: range.from });
                        }
                      }}
                      numberOfMonths={2}
                      className="p-4 pointer-events-auto"
                    />
                    <div className="flex items-center justify-between px-4 pb-3 border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">
                        {format(draftRange.from, "MMM dd, yyyy")} – {format(draftRange.to, "MMM dd, yyyy")}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs px-4" onClick={handleCancelDateRange}>Cancel</Button>
                        <Button size="sm" className="h-8 text-xs px-4" onClick={handleApplyDateRange}>Apply</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {children}

        {showRunButton && (
          <Button size="sm" className="gap-1.5 h-8" onClick={onRun}>
            <Play className="h-3.5 w-3.5" />Run
          </Button>
        )}
      </div>
    </div>
  );
}
