import { cn } from "@/lib/utils";

interface Props {
  count: number;
  value: number;
  onChange: (i: number) => void;
  labels?: string[];
  className?: string;
}

export function PageIndicator({ count, value, onChange, labels, className }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => {
        const active = i === value;
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={labels?.[i] ?? `Page ${i + 1}`}
            className={cn(
              "transition-all rounded-full",
              active
                ? "h-2 w-6 bg-foreground shadow-[0_0_10px_hsl(var(--foreground)/0.35)]"
                : "h-2 w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70",
            )}
          />
        );
      })}
      {labels && (
        <span className="ml-2 text-[11.5px] text-muted-foreground">{labels[value]}</span>
      )}
    </div>
  );
}
