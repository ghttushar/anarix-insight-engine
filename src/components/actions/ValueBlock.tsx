import { cn } from "@/lib/utils";
import { formatValue, type ValueKind, type Cadence } from "@/lib/decisions/valueFormat";

interface Props {
  cents: number;
  kind: ValueKind;
  cadence?: Cadence;
  caption?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  className?: string;
}

const KIND_COLOR: Record<ValueKind, string> = {
  gain: "text-success",
  cost: "text-foreground",
  at_risk: "text-destructive",
  info: "text-muted-foreground",
};

const SIZE: Record<NonNullable<Props["size"]>, { num: string; cap: string }> = {
  sm: { num: "text-[15px]", cap: "text-[11.5px]" },
  md: { num: "text-[18px]", cap: "text-[12px]" },
  lg: { num: "text-[22px]", cap: "text-[12.5px]" },
};

/**
 * Canonical value renderer. Same visual weight in Stack and Grid.
 * Number first, caption second — always readable at a glance.
 */
export function ValueBlock({
  cents, kind, cadence, caption, size = "md", align = "left", className,
}: Props) {
  const v = formatValue({ cents, kind, cadence });
  const sz = SIZE[size];
  return (
    <div
      className={cn("flex flex-col leading-tight", align === "right" && "items-end text-right", className)}
      aria-label={v.ariaLabel}
    >
      <span className={cn("font-mono font-semibold tabular-nums whitespace-nowrap", sz.num, KIND_COLOR[kind])}>
        {v.text}
      </span>
      {caption && (
        <span className={cn("mt-0.5 text-muted-foreground", sz.cap)}>
          {caption}
        </span>
      )}
    </div>
  );
}
