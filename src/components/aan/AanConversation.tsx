import { useRef, useEffect } from "react";
import { useAan } from "./AanContext";
import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import { format } from "date-fns";
import { ArtifactCard } from "./ArtifactCard";

export function AanConversation() {
  const { messages, openSplit } = useAan();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              message.role === "assistant"
                ? "aan-gradient text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {message.role === "assistant" ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={cn(
              "flex max-w-[80%] flex-col gap-2",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-2.5 text-sm",
                message.role === "assistant"
                  ? "bg-card text-foreground border border-border"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>

            {/* Artifact Card (if present) */}
            {message.draft && (
              <ArtifactCard
                artifact={message.draft}
                onClick={() => openSplit(message.draft!)}
                className="max-w-sm"
              />
            )}

            <span className="text-xs text-muted-foreground px-2">
              {format(message.timestamp, "h:mm a")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
