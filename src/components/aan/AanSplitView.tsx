import { useState } from "react";
import { X, Download, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAan } from "./AanContext";
import { AanLogo } from "./AanLogo";

export function AanSplitView() {
  const { mode, currentArtifact, closeAan, openCopilot } = useAan();
  const [currentVersion, setCurrentVersion] = useState(1);
  const [editInput, setEditInput] = useState("");
  const versions = [1, 2, 3]; // Mock versions

  const isOpen = mode === "split";

  if (!currentArtifact) return null;

  const handleEditSubmit = () => {
    if (!editInput.trim()) return;
    // Would create new version here
    setCurrentVersion((v) => v + 1);
    setEditInput("");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/4 backdrop-blur-[1px] transition-opacity"
          onClick={() => openCopilot()}
        />
      )}

      {/* Split Panel - 50% width */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[50vw] flex-col border-l border-border bg-background shadow-lg transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 aan-gradient opacity-10" />

          <div className="relative flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <AanLogo showByAnarix={false} />
              <div className="h-6 w-px bg-border" />
              <div>
                <h2 className="font-heading text-sm font-semibold text-foreground">
                  {currentArtifact.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentArtifact.type} • Generated just now
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Version Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    v{currentVersion}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {versions.map((v) => (
                    <DropdownMenuItem
                      key={v}
                      onClick={() => setCurrentVersion(v)}
                    >
                      Version {v}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => openCopilot()}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Artifact Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {currentArtifact.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {currentArtifact.description}
            </p>

            {/* Mock artifact content */}
            <div className="space-y-4">
              {currentArtifact.changes.map((change, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3"
                >
                  <span className="text-sm font-medium">{change.field}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground line-through">
                      {change.before}
                    </span>
                    <span className="text-primary font-medium">
                      → {change.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Edit Chat */}
        <div className="border-t border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground mb-2">
            Edit this artifact with natural language
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              placeholder="e.g., Remove ROAS column and group by campaign type..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
            />
            <Button size="icon" onClick={handleEditSubmit} disabled={!editInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
