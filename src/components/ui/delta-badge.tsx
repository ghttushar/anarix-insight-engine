import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  value: number; // percentage change
  className?: string;
}

export function DeltaBadge({ value, className }: DeltaBadgeProps) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-medium leading-none mt-0.5",
        isPositive ? "text-success" : "text-destructive",
        className
      )}
    >
      {isPositive ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}
