import type { Widget } from "@/pages/workspace/Dashboard";
import { MetricWidget } from "./MetricWidget";
import { ChartWidget } from "./ChartWidget";
import { TableWidget } from "./TableWidget";
import { AnnotationWidget } from "./AnnotationWidget";
import { TaskWidget } from "./TaskWidget";
import { WidgetHeader } from "./WidgetHeader";

interface WidgetCanvasProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
  onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
}

export function WidgetCanvas({ widgets, onRemoveWidget, onUpdateWidget }: WidgetCanvasProps) {
  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[180px]">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="rounded-lg border border-border bg-card overflow-hidden flex flex-col"
          style={{
            gridColumn: `span ${widget.colSpan}`,
            gridRow: `span ${widget.rowSpan}`,
          }}
        >
          <WidgetHeader
            title={widget.title}
            type={widget.type}
            onRemove={() => onRemoveWidget(widget.id)}
            onTitleChange={(title) => onUpdateWidget(widget.id, { title })}
          />
          <div className="flex-1 overflow-auto p-4">
            {widget.type === "metric" && <MetricWidget config={widget.config} />}
            {widget.type === "chart" && <ChartWidget config={widget.config} onConfigChange={(config) => onUpdateWidget(widget.id, { config })} />}
            {widget.type === "table" && <TableWidget />}
            {widget.type === "annotation" && <AnnotationWidget config={widget.config} onConfigChange={(config) => onUpdateWidget(widget.id, { config })} />}
            {widget.type === "task" && <TaskWidget config={widget.config} onConfigChange={(config) => onUpdateWidget(widget.id, { config })} />}
          </div>
        </div>
      ))}
    </div>
  );
}
