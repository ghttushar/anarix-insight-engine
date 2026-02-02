import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAan } from "./AanContext";

interface AanBreadcrumbProps {
  className?: string;
}

const filterLabels: Record<string, string> = {
  all: "Chat",
  reports: "Reports",
  audit: "Audit",
  creative: "Creative",
  agent: "Agent",
};

export function AanBreadcrumb({ className }: AanBreadcrumbProps) {
  const { activeFilter, currentConversation, setActiveFilter } = useAan();

  return (
    <nav
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      {/* Aan root */}
      <button
        onClick={() => setActiveFilter("all")}
        className="hover:text-foreground transition-colors font-medium"
        style={{ fontFamily: "var(--font-aan)" }}
      >
        Aan
      </button>

      {/* Section */}
      {activeFilter !== "all" && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <button
            onClick={() => setActiveFilter(activeFilter)}
            className="hover:text-foreground transition-colors"
          >
            {filterLabels[activeFilter]}
          </button>
        </>
      )}

      {/* Current conversation */}
      {currentConversation && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {currentConversation.title}
          </span>
        </>
      )}
    </nav>
  );
}
