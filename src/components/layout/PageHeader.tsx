import { ReactNode } from "react";
import { AppTaskbar } from "./AppTaskbar";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  hideTaskbar?: boolean;
}

export function PageHeader({ title, subtitle, actions, hideTaskbar = true }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {!hideTaskbar && <AppTaskbar />}
    </div>
  );
}
