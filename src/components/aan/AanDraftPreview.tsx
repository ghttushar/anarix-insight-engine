import { useAan } from "./AanContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Pencil, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AanDraftPreview() {
  const { currentDraft, approveDraft, rejectDraft, setCurrentDraft } = useAan();

  if (!currentDraft) return null;

  const isApproved = currentDraft.status === "approved";
  const isRejected = currentDraft.status === "rejected";
  const isPending = currentDraft.status === "pending";

  return (
    <div className="border-t border-border bg-gradient-to-b from-primary/5 to-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium",
              isPending && "border-warning/50 bg-warning/10 text-warning",
              isApproved && "border-success/50 bg-success/10 text-success",
              isRejected && "border-destructive/50 bg-destructive/10 text-destructive"
            )}
          >
            {isPending ? "Draft" : isApproved ? "Approved" : "Rejected"}
          </Badge>
          <span className="text-sm font-medium text-foreground">
            {currentDraft.title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground capitalize">
          {currentDraft.type.replace("_", " ")}
        </span>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-sm text-muted-foreground">{currentDraft.description}</p>
      </div>

      {/* Changes Preview */}
      <div className="px-4 pb-3">
        <div className="rounded-lg border border-border bg-background/50">
          <div className="px-3 py-2 border-b border-border/50">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Changes Preview
            </span>
          </div>
          <div className="divide-y divide-border/50">
            {currentDraft.changes.map((change, index) => (
              <div key={index} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span className="text-muted-foreground min-w-[100px]">{change.field}</span>
                <span className="text-destructive/70 line-through">{change.before}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-success font-medium">{change.after}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="flex items-center gap-2 px-4 pb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => {
              // Preview/Review action
            }}
          >
            <Eye className="h-4 w-4" />
            Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setCurrentDraft({ ...currentDraft, status: "editing" })}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 gap-2 bg-success hover:bg-success/90"
            onClick={() => approveDraft(currentDraft.id)}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => rejectDraft(currentDraft.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Status Message */}
      {!isPending && (
        <div className={cn(
          "flex items-center justify-center gap-2 px-4 pb-4 text-sm",
          isApproved ? "text-success" : "text-destructive"
        )}>
          {isApproved ? (
            <>
              <Check className="h-4 w-4" />
              Changes applied successfully
            </>
          ) : (
            <>
              <X className="h-4 w-4" />
              No changes were made
            </>
          )}
        </div>
      )}
    </div>
  );
}
