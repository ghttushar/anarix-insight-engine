import { useState, useRef, KeyboardEvent } from "react";
import { useAan } from "./AanContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

// Check if user is requesting a report
const isReportRequest = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes("report") ||
    lower.includes("generate report") ||
    lower.includes("create report") ||
    lower.includes("performance report") ||
    lower.includes("last 7 days") ||
    lower.includes("weekly report")
  );
};

// Check if user is requesting an audit
const isAuditRequest = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes("audit") ||
    lower.includes("health") ||
    lower.includes("account health") ||
    lower.includes("review") ||
    lower.includes("analyze account")
  );
};

// Mock report summary shown immediately
const getReportSummary = () => `**Report Draft Started**

Summary (Last 7 Days):
• **Total Spend:** $12,450.32
• **Total Sales:** $48,920.15
• **ROAS:** 3.93x
• **TACoS:** 25.4%
• **Impressions:** 1.2M
• **Clicks:** 45,200 (CTR: 3.8%)

Generating full report. ETA ~30 seconds...`;

// Mock audit summary shown immediately
const getAuditSummary = () => `**Audit Started**

Preliminary Findings:
• **Health Score:** 78/100
• **Campaigns Analyzed:** 47
• **Issues Found:** 23
• **Critical Issues:** 3 requiring immediate action
• **Wasted Spend:** $2,341 (down 15% from last month)

Running full audit. ETA ~30 seconds...`;

// Mock non-report responses
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<"report" | "audit" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage(userMessage, "user");

    // Check if this is a report request
    if (isReportRequest(userMessage)) {
      // Show immediate summary
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getReportSummary(), "assistant");
      setIsLoading(false);
      setIsGenerating(true);
      setGenerationType("report");

      // After 30 seconds, add the report artifact
      timerRef.current = setTimeout(() => {
        addMessage("**Report Ready!** Click below to view the full report.", "assistant", {
          id: "report-" + Date.now(),
          type: "report" as const,
          title: "Last 7 Days Campaign Performance",
          description: "Amazon • Performance overview for the past week",
          changes: [
            { field: "Total Spend", before: "N/A", after: "$12,450.32" },
            { field: "Total Sales", before: "N/A", after: "$48,920.15" },
            { field: "ROAS", before: "N/A", after: "3.93x" },
            { field: "Impressions", before: "N/A", after: "1,200,000" },
            { field: "Top Campaign", before: "N/A", after: "SP | Electronics ($18,420 sales)" },
            { field: "Best Performer", before: "N/A", after: "Wireless Earbuds (+42% CTR)" },
            { field: "Recommendation", before: "N/A", after: "Increase budget on top 3 campaigns" },
          ],
          status: "pending" as const,
        });
        setIsGenerating(false);
        setGenerationType(null);
      }, 30000); // 30 second delay

      return;
    }

    // Check if this is an audit request
    if (isAuditRequest(userMessage)) {
      // Show immediate summary
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getAuditSummary(), "assistant");
      setIsLoading(false);
      setIsGenerating(true);
      setGenerationType("audit");

      // After 30 seconds, add the audit artifact
      timerRef.current = setTimeout(() => {
        addMessage("**Audit Complete!** Click below to view the full health report.", "assistant", {
          id: "audit-" + Date.now(),
          type: "audit" as const,
          title: "Account Health Audit",
          description: "Health Score: 78/100 • Risk Level: Low",
          changes: [
            { field: "Health Score", before: "N/A", after: "78/100" },
            { field: "Wasted Spend", before: "N/A", after: "$2,341 (-15%)" },
            { field: "Optimization Score", before: "N/A", after: "B+" },
            { field: "Campaigns Reviewed", before: "N/A", after: "47 campaigns" },
            { field: "Issues Found", before: "N/A", after: "23 issues" },
            { field: "Critical Issues", before: "N/A", after: "3 requiring immediate action" },
            { field: "Quick Wins", before: "N/A", after: "12 easy optimizations available" },
          ],
          status: "pending" as const,
        });
        setIsGenerating(false);
        setGenerationType(null);
      }, 30000); // 30 second delay

      return;
    }

    // Non-report/audit request - random response
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

  const getStatusMessage = () => {
    if (isGenerating && generationType === "report") {
      return "Generating full report... This will take about 30 seconds.";
    }
    if (isGenerating && generationType === "audit") {
      return "Running full audit... This will take about 30 seconds.";
    }
    return "Aan will explain reasoning and create drafts for your approval";
  };

  return (
    <div className="border-t border-border bg-background p-4">
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
        {getStatusMessage()}
      </p>
    </div>
  );
}
