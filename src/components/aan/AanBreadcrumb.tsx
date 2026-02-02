import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AanBreadcrumbProps {
  className?: string;
}

export function AanBreadcrumb({ className }: AanBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2", className)}>
      <Sparkles className="h-5 w-5 aan-gradient-text" />
      <span className="font-aan text-aan aan-gradient-text">Aan</span>
      <span className="text-sm text-muted-foreground">by Anarix</span>
    </nav>
  );
}
