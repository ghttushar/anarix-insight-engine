import { PageBreadcrumb } from "./PageBreadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageFooterBarProps {
  breadcrumbItems: BreadcrumbItem[];
}

export function PageFooterBar({ breadcrumbItems }: PageFooterBarProps) {
  return (
    <div className="flex items-center justify-start py-3 mt-4 border-t border-border">
      <PageBreadcrumb items={breadcrumbItems} />
    </div>
  );
}
