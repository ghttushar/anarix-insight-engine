import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface UnderlineTabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}

export function UnderlineTabs({ tabs, value, onChange }: UnderlineTabsProps) {
  return (
    <div className="flex gap-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors",
            value === tab.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs",
                value === tab.value
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {tab.count}
            </span>
          )}
          {value === tab.value && (
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
