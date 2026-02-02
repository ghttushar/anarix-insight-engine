import { cn } from "@/lib/utils";

interface AanBreadcrumbProps {
  className?: string;
}

export function AanBreadcrumb({ className }: AanBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center", className)}>
      <span className="font-aan text-aan aan-gradient-text font-bold">
        Aan
      </span>
    </nav>
  );
}
