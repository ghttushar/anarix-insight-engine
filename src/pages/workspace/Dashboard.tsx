import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { WidgetCanvas } from "@/components/workspace/WidgetCanvas";
import { AddWidgetModal } from "@/components/workspace/AddWidgetModal";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Copy, Pencil } from "lucide-react";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export type WidgetType = "metric" | "chart" | "table" | "annotation" | "task";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  colSpan: number;
  rowSpan: number;
}

const defaultWidgets: Widget[] = [
  { id: "w1", type: "metric", title: "Total ROAS", config: { metric: "roas", value: 3.37, delta: 12.4 }, colSpan: 1, rowSpan: 1 },
  { id: "w2", type: "metric", title: "Ad Spend", config: { metric: "spend", value: 10973.6, delta: -3.2 }, colSpan: 1, rowSpan: 1 },
  { id: "w3", type: "metric", title: "Ad Sales", config: { metric: "sales", value: 36955.24, delta: 8.7 }, colSpan: 1, rowSpan: 1 },
  { id: "w4", type: "metric", title: "TACoS", config: { metric: "tacos", value: 14.2, delta: -1.8 }, colSpan: 1, rowSpan: 1 },
  { id: "w5", type: "chart", title: "Performance Trend", config: { chartType: "line", metric: "sales" }, colSpan: 2, rowSpan: 2 },
  { id: "w6", type: "table", title: "Top Campaigns", config: {}, colSpan: 2, rowSpan: 2 },
  { id: "w7", type: "annotation", title: "Notes", config: { text: "Review Q1 campaign strategy\nCheck competitor bids on brand keywords" }, colSpan: 1, rowSpan: 1 },
  { id: "w8", type: "task", title: "Action Items", config: { tasks: [{ text: "Pause underperforming campaigns", done: false }, { text: "Increase budget on top 3", done: true }, { text: "Add negative keywords", done: false }] }, colSpan: 1, rowSpan: 1 },
];

export default function WorkspaceDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const stored = localStorage.getItem("anarix-workspace-widgets");
    return stored ? JSON.parse(stored) : defaultWidgets;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardName, setDashboardName] = useState("My Workspace");
  const [isEditing, setIsEditing] = useState(false);

  const saveWidgets = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem("anarix-workspace-widgets", JSON.stringify(newWidgets));
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type,
      title: type === "metric" ? "New Metric" : type === "chart" ? "New Chart" : type === "table" ? "New Table" : type === "annotation" ? "New Note" : "New Tasks",
      config: type === "annotation" ? { text: "" } : type === "task" ? { tasks: [] } : {},
      colSpan: type === "chart" || type === "table" ? 2 : 1,
      rowSpan: type === "chart" || type === "table" ? 2 : 1,
    };
    saveWidgets([...widgets, newWidget]);
    setShowAddModal(false);
  };

  const removeWidget = (id: string) => {
    saveWidgets(widgets.filter((w) => w.id !== id));
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    saveWidgets(widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const resetDashboard = () => {
    saveWidgets(defaultWidgets);
  };

  const duplicateDashboard = () => {
    const name = `${dashboardName} (Copy)`;
    setDashboardName(name);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageBreadcrumb items={[{ label: "Workspace" }]} />

        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                autoFocus
                className="text-xl font-semibold bg-transparent border-b border-primary outline-none text-foreground"
              />
            ) : (
              <h1
                className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {dashboardName}
              </h1>
            )}
            <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={duplicateDashboard} className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm" onClick={resetDashboard} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Widget
            </Button>
          </div>
        </div>

        {/* Widget Canvas */}
        <WidgetCanvas
          widgets={widgets}
          onRemoveWidget={removeWidget}
          onUpdateWidget={updateWidget}
        />
      </div>

      <AddWidgetModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addWidget}
      />
    </AppLayout>
  );
}
