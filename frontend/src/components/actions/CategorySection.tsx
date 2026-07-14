// Category section — collapsible section per bucket inside a tab.
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
  aggregate?: string;
}

export function CategorySection({ label, count, defaultOpen, children, aggregate }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  if (count === 0) return null;
  return (
    <section className="mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2 px-1 py-1.5 text-left transition-colors group",
        )}
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-[11.5px] uppercase tracking-wider font-semibold text-foreground/70">
          {label}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
          {count}
        </span>
        {aggregate && (
          <span className="ml-1 text-[11px] text-muted-foreground">{aggregate}</span>
        )}
        <span className="ml-2 flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
      </button>
      {open && (
        <div className="mt-1 rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </section>
  );
}
