import { useState, KeyboardEvent } from "react";
import { useAan } from "./AanContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

// Mock responses with drafts for demo
const mockResponses = [
  {
    content: "I've analyzed your campaign performance. Based on the data, I recommend adjusting the bid for your top-performing keywords. Here's a draft of the changes:",
    draft: {
      id: "draft-1",
      type: "bid_change" as const,
      title: "Keyword Bid Optimization",
      description: "Increase bids on high-performing keywords to capture more impressions during peak hours.",
      changes: [
        { field: "wireless earbuds", before: "$1.35", after: "$1.65" },
        { field: "bluetooth headphones", before: "$1.15", after: "$1.45" },
        { field: "smart home devices", before: "$1.25", after: "$1.50" },
      ],
      status: "pending" as const,
    },
  },
  {
    content: "I found some underperforming campaigns that could be paused to improve overall ROAS. Would you like me to prepare a draft?",
    draft: undefined,
  },
  {
    content: "Your TACoS has improved by 3.2% this week. The main contributors are your Electronics and Kitchen Appliances ad groups. Keep up the good work!",
    draft: undefined,
  },
];

export function AanInput() {
  const { addMessage } = useAan();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage(userMessage, "user");

    // Simulate AI response
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    addMessage(randomResponse.content, "assistant", randomResponse.draft);
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Aan anything..."
          className="min-h-[44px] max-h-[120px] resize-none"
          rows={1}
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="shrink-0 bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground text-center">
        Aan will explain reasoning and create drafts for your approval
      </p>
    </div>
  );
}
