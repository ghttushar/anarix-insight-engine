import { ArrowRight, PenLine, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AanMark } from "@/components/branding/AanMark";
import { cn } from "@/lib/utils";
import type { Decision } from "@/data/mockDecisions";

export interface ActionOption {
  id: string;
  label: string;
  hint?: string;
  kind: "primary" | "safe" | "aan" | "destructive";
  onClick: () => void;
}

/**
 * Derives 3 typed options + one "Write your own" from a Decision.
 * No mock-data changes required — everything is synthesized from
 * the existing actionVerb + status.
 */
export function deriveActionOptions(
  d: Decision,
  handlers: {
    approve: () => void;
    delegate: () => void;
    reject: () => void;
    custom: () => void;
  },
): ActionOption[] {
  const primaryVerb = d.actionVerb || "Approve";
  return [
    { id: "approve", label: primaryVerb, hint: "I execute the steps and report back.", kind: "primary", onClick: handlers.approve },
    { id: "delegate", label: "Aan handles it", hint: "I draft, execute, and post the outcome.", kind: "aan", onClick: handlers.delegate },
    { id: "reject", label: "Reject", hint: "Stand down for 24h.", kind: "destructive", onClick: handlers.reject },
    { id: "custom", label: "Write your own", hint: "Tell me exactly how to handle it.", kind: "safe", onClick: handlers.custom },
  ];
}

interface Props {
  options: ActionOption[];
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function ActionChoiceRow({ options, layout = "horizontal", className }: Props) {
  return (
    <div
      className={cn(
        layout === "horizontal" ? "flex flex-wrap items-center gap-2" : "flex flex-col gap-2",
        className,
      )}
    >
      {options.map((opt) => {
        const isPrimary = opt.kind === "primary";
        const isAan = opt.kind === "aan";
        const isDestructive = opt.kind === "destructive";
        const isCustom = opt.id === "custom";
        return (
          <Button
            key={opt.id}
            size="sm"
            variant={isPrimary ? "default" : "outline"}
            onClick={(e) => { e.stopPropagation(); opt.onClick(); }}
            title={opt.hint}
            className={cn(
              "h-9 px-3.5 text-[13px] gap-1.5 font-medium justify-start",
              layout === "vertical" && "w-full",
              isAan && !isPrimary && "border-primary/40 text-primary hover:bg-primary/10",
              isDestructive && "text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30",
              isCustom && "border-dashed text-muted-foreground hover:text-foreground",
            )}
          >
            {isPrimary && <ArrowRight className="h-3.5 w-3.5" />}
            {isAan && <AanMark size={13} className={isPrimary ? "text-primary-foreground" : "text-primary"} />}
            {isDestructive && <XCircle className="h-3.5 w-3.5" />}
            {isCustom && <PenLine className="h-3.5 w-3.5" />}
            <span>{opt.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
