import { ReactNode } from "react";
import { PageBreadcrumb } from "./PageBreadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  appLevelSelector?: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

export function PageHeader({ title, subtitle, actions, appLevelSelector, breadcrumbItems }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <PageBreadcrumb items={breadcrumbItems} />
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {appLevelSelector}
        </div>
      </div>
    </div>
  );
}
