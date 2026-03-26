import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useAan } from "./AanContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Square, Lightbulb, X } from "lucide-react";

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
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Show suggestion after assistant message
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && !isLoading) {
      setShowSuggestion(true);
      setSuggestionIndex(Math.floor(Math.random() * PROMPT_SUGGESTIONS.length));
    }
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
        if (progress >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progress = 100;
        }
        setGenerationState(true, "report", progress);
      }, 1000);

      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        addMessage("**Report Ready!** Click below to view the full report with data visualizations.", "assistant", {
          id: "report-" + Date.now(),
          type: "report" as const,
          title: "Last 7 Days Campaign Performance",
          description: "Amazon • Performance overview with data visualizations",
          changes: [
            { field: "Total Ad Spend", before: "N/A", after: "$10,973.60" },
            { field: "Total Ad Sales", before: "N/A", after: "$36,955.24" },
            { field: "Overall ROAS", before: "N/A", after: "3.37x" },
          ],
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
        if (progress >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progress = 100;
        }
        setGenerationState(true, "audit", progress);
      }, 1000);

      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        addMessage("**Audit Complete!** Click below to view the full health report.", "assistant", {
          id: "audit-" + Date.now(),
          type: "audit" as const,
          title: "Account Health Audit",
          description: "Health Score: 78/100 • Risk Level: Low",
          changes: [
            { field: "Health Score", before: "N/A", after: "78/100" },
            { field: "Wasted Spend", before: "N/A", after: "$2,341 (-15%)" },
          ],
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = () => {
    setInput(PROMPT_SUGGESTIONS[suggestionIndex]);
    setShowSuggestion(false);
  };

  return (
    <div className="border-t border-border bg-background shrink-0">
      {/* Prompt suggestion notch */}
      {showSuggestion && (
        <div className="mx-4 mt-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 px-3 py-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-primary shrink-0" />
          <button
            onClick={handleSuggestionClick}
            className="flex-1 text-left text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Try: "{PROMPT_SUGGESTIONS[suggestionIndex]}"
          </button>
          <button onClick={() => setShowSuggestion(false)} className="p-0.5 rounded hover:bg-muted cursor-pointer">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aan anything... (try: 'Generate report' or 'Run audit')"
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
            disabled={isLoading}
          />
          {isLoading ? (
            <Button
              size="icon"
              variant="destructive"
              onClick={handleStop}
              className="shrink-0"
              title="Stop generation"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Aan will explain reasoning and create drafts for your approval
        </p>
      </div>
    </div>
  );
}
