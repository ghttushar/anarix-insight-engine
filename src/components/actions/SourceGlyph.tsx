import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getSourceMeta, type DecisionSource } from "@/lib/decisions/sourceRegistry";
import { cn } from "@/lib/utils";

interface Props {
  source: DecisionSource;
  /** Extra label appended to the tooltip: "Slack · #cs-urgent · 11:04" */
  refLabel?: string;
  size?: number;
  className?: string;
}

export function SourceGlyph({ source, refLabel, size = 14, className }: Props) {
  const meta = getSourceMeta(source);
  const Icon = meta.icon;
  const tip = refLabel ? `${meta.label} · ${refLabel}` : meta.description;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-md bg-muted/60 border border-border/60 shrink-0",
              className
            )}
            style={{ width: size + 10, height: size + 10 }}
          >
            <Icon className={cn(meta.colorClass)} style={{ width: size, height: size }} strokeWidth={2} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[11px]">
          {tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
