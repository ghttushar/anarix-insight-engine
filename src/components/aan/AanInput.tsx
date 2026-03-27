import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useAan } from "./AanContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const isReportRequest = (message: string): boolean => {
  const lower = message.toLowerCase();
  return lower.includes("report") || lower.includes("generate report") || lower.includes("create report") || lower.includes("performance report") || lower.includes("last 7 days") || lower.includes("weekly report") || lower.includes("data visualization");
};

const isAuditRequest = (message: string): boolean => {
  const lower = message.toLowerCase();
  return lower.includes("audit") || lower.includes("health") || lower.includes("account health") || lower.includes("review") || lower.includes("analyze account") || lower.includes("paragraph") || lower.includes("summary");
};

const getReportSummary = () => `I've analyzed your Amazon advertising data for the last 7 days. Here's what I found:

**Performance Summary:**
• Total Ad Spend: $10,973.60
• Total Ad Sales: $36,955.24
• Overall ROAS: 3.37x

**Top Performers:**
Your best performing campaign is "SP | Bamboo | 8 inch | Queen" with a 6.01x ROAS, followed by "SB | Bed in a Box Mattress" at 6.19x ROAS. These campaigns are efficiently converting ad spend into sales.

**Opportunities:**
Consider optimizing "SP | Bamboo | Queen" (1.88x ROAS) and "SP | Bamboo | 8 inch | Twin" (2.04x ROAS) which are underperforming relative to your account average.

Generating full report with data visualizations...`;

const getAuditSummary = () => `I've completed a comprehensive audit of your Amazon account. Here's what I found:

**Overall Health Score: 78/100**

Your account shows strong fundamentals with a few areas requiring attention. The most critical issue is your advertising efficiency, where I've identified significant wasted spend on non-converting keywords.

Key findings include 15 high-spend, zero-conversion keywords that should be paused immediately, 23 products missing optimized backend search terms, and 8 products priced 5-10% higher than top competitors.

On the positive side, all products have sufficient inventory health for the next 45 days.

Running full audit analysis...`;

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

const PROMPT_SUGGESTIONS = [
  "Optimize my top spending campaigns",
  "Show me wasted spend analysis",
  "Compare this week vs last week",
  "Which keywords should I pause?",
  "Find budget reallocation opportunities",
];

export function AanInput() {
  const { addMessage, setGenerationState, messages } = useAan();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    };
  }, []);

  // Show suggestion after assistant message with delay
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && !isLoading) {
      setSuggestionIndex(Math.floor(Math.random() * PROMPT_SUGGESTIONS.length));
      // Show after 500ms delay for smooth appearance
      suggestionTimerRef.current = setTimeout(() => {
        setShowSuggestion(true);
        // Trigger animation after mount
        requestAnimationFrame(() => setSuggestionVisible(true));
      }, 500);
    }
    return () => {
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    };
  }, [messages, isLoading]);

  const handleStop = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
    setGenerationState(false, null, 0);
    setIsLoading(false);
    addMessage("Generation stopped.", "assistant");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setShowSuggestion(false);
    setSuggestionVisible(false);
    addMessage(userMessage, "user");

    if (isReportRequest(userMessage)) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getReportSummary(), "assistant");
      setIsLoading(false);
      setGenerationState(true, "report", 0);
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 30;
        if (progress >= 100) { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); progress = 100; }
        setGenerationState(true, "report", progress);
      }, 1000);
      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        addMessage("**Report Ready!** Click below to view the full report with data visualizations.", "assistant", {
          id: "report-" + Date.now(), type: "report" as const, title: "Last 7 Days Campaign Performance",
          description: "Amazon • Performance overview with data visualizations",
          changes: [{ field: "Total Ad Spend", before: "N/A", after: "$10,973.60" }, { field: "Total Ad Sales", before: "N/A", after: "$36,955.24" }, { field: "Overall ROAS", before: "N/A", after: "3.37x" }],
          status: "pending" as const,
        });
      }, 30000);
      return;
    }

    if (isAuditRequest(userMessage)) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getAuditSummary(), "assistant");
      setIsLoading(false);
      setGenerationState(true, "audit", 0);
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 30;
        if (progress >= 100) { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); progress = 100; }
        setGenerationState(true, "audit", progress);
      }, 1000);
      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        addMessage("**Audit Complete!** Click below to view the full health report.", "assistant", {
          id: "audit-" + Date.now(), type: "audit" as const, title: "Account Health Audit",
          description: "Health Score: 78/100 • Risk Level: Low",
          changes: [{ field: "Health Score", before: "N/A", after: "78/100" }, { field: "Wasted Spend", before: "N/A", after: "$2,341 (-15%)" }],
          status: "pending" as const,
        });
      }, 30000);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    addMessage(randomResponse.content, "assistant", randomResponse.draft);
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSuggestionClick = () => {
    setInput(PROMPT_SUGGESTIONS[suggestionIndex]);
    setShowSuggestion(false);
    setSuggestionVisible(false);
  };

  const handleDismissSuggestion = () => {
    setSuggestionVisible(false);
    setTimeout(() => setShowSuggestion(false), 200);
  };

  return (
    <div className="shrink-0 bg-background">
      <div className="px-4 pb-4 pt-2">
        {/* Input container with suggestion notch */}
        <div className="relative">
          {/* Prompt suggestion — emerges from textbox top edge */}
          {showSuggestion && (
            <div
              className={cn(
                "absolute bottom-full left-0 right-0 mb-0 origin-bottom transition-all duration-200 ease-out",
                suggestionVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-2 scale-95"
              )}
            >
              <div className="mx-0 mb-1 flex items-center gap-2 rounded-t-lg rounded-b-none border border-b-0 border-primary/20 bg-gradient-to-r from-primary/[0.06] via-accent/[0.04] to-primary/[0.06] px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <button
                  onClick={handleSuggestionClick}
                  className="flex-1 text-left text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-primary/70 font-medium">Try: </span>
                  <span className="italic">"{PROMPT_SUGGESTIONS[suggestionIndex]}"</span>
                </button>
                <button
                  onClick={handleDismissSuggestion}
                  className="p-0.5 rounded-full hover:bg-muted/80 cursor-pointer transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Textarea + Send button in same container */}
          <div className="relative flex items-end gap-0 rounded-lg border border-border bg-card focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Aan anything..."
              className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={handleStop}
                  className="h-8 w-8 rounded-lg"
                  title="Stop generation"
                >
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-30"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
          Aan will explain reasoning and create drafts for your approval
        </p>
      </div>
    </div>
  );
}
