import { useMemo } from "react";
import { HelpCircle, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SourceGlyph } from "./SourceGlyph";
import { ShareMenu } from "./ShareMenu";
import { useActionsStore } from "@/state/actionsStore";
import type { AanQuestion } from "@/data/mockQuestions";

interface Props {
  question: AanQuestion;
}

export function QuestionCard({ question: q }: Props) {
  const { answerQuestion, skipQuestion } = useActionsStore();
  const isOpen = q.status === "open";
  const hoursLeft = useMemo(() => Math.max(0, Math.round((q.expiresAt - Date.now()) / (60 * 60 * 1000))), [q.expiresAt]);
  const chosen = q.choices.find((c) => c.id === q.chosenId);

  return (
    <div className={cn(
      "rounded-xl border bg-card transition-all",
      isOpen ? "border-border hover:border-primary/30 hover:shadow-sm" : "border-border/60 opacity-75",
    )}>
      <div className="px-4 pt-3.5 flex items-center gap-2">
        <span className="h-6 w-6 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center">
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
        </span>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Question from me</span>
        <span className="text-muted-foreground/60 text-[11px]">·</span>
        <span className="text-[11px] text-muted-foreground">{q.domain}</span>
        {isOpen && (
          <span className="ml-auto text-[10.5px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {hoursLeft}h left
          </span>
        )}
      </div>

      <div className="px-4 pt-2.5">
        <div className="text-[14.5px] text-foreground font-medium leading-snug">{q.prompt}</div>
        <div className="text-[12.5px] text-muted-foreground mt-1">{q.context}</div>
      </div>

      <div className="px-4 pt-3 pb-3.5">
        {isOpen ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {q.choices.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant="outline"
                onClick={() => answerQuestion(q.id, c.id)}
                className="h-auto py-1.5 px-2.5 text-[12px] flex flex-col items-start gap-0 hover:border-primary/50 hover:bg-primary/[0.04]"
                title={c.hint}
              >
                <span className="font-medium text-foreground">{c.label}</span>
                {c.hint && <span className="text-[10.5px] text-muted-foreground font-normal">{c.hint}</span>}
              </Button>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => skipQuestion(q.id)}
              className="h-7 text-[11.5px] text-muted-foreground hover:text-foreground ml-1"
            >
              Skip · I'll guess safely
            </Button>
            <div className="ml-auto">
              <ShareMenu itemLabel={q.prompt} />
            </div>
          </div>
        ) : (
          <div className="text-[12px] flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">
              You chose <span className="text-foreground font-medium">{chosen?.label ?? "—"}</span>.
              I'll remember this class ({q.policyClass}).
            </span>
          </div>
        )}
      </div>

      <div className="px-4 pt-2 pb-3 flex items-center gap-2 text-[10.5px] text-muted-foreground border-t border-border/50">
        <SourceGlyph source={q.source} size={10} />
        <span className="uppercase tracking-wider font-semibold">{q.source}</span>
      </div>
    </div>
  );
}
