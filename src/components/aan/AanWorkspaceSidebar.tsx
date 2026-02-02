import { useState } from "react";
import { MessageSquare, FileText, Search, Palette, Zap, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: WorkspaceSection[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "audit", label: "Audit", icon: Search },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "rules", label: "Rules", icon: Zap },
  { id: "agents", label: "Agents", icon: Bot },
];

interface AanWorkspaceSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AanWorkspaceSidebar({
  activeSection,
  onSectionChange,
}: AanWorkspaceSidebarProps) {
  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col">
      <nav className="flex-1 p-3 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "aan-gradient text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
