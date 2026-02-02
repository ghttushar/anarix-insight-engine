import { useState, useRef, useEffect, KeyboardEvent } from "react";
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
    lower.includes("weekly report") ||
    lower.includes("data visualization")
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
    lower.includes("analyze account") ||
    lower.includes("paragraph") ||
    lower.includes("summary")
  );
};

// Enhanced report summary with data visualization style
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

// Audit summary in paragraph format
const getAuditSummary = () => `I've completed a comprehensive audit of your Amazon account. Here's what I found:

**Overall Health Score: 78/100**

Your account shows strong fundamentals with a few areas requiring attention. The most critical issue is your advertising efficiency, where I've identified significant wasted spend on non-converting keywords.

Key findings include 15 high-spend, zero-conversion keywords that should be paused immediately, 23 products missing optimized backend search terms, and 8 products priced 5-10% higher than top competitors.

On the positive side, all products have sufficient inventory health for the next 45 days.

Running full audit analysis...`;

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
  const { addMessage, setGenerationState } = useAan();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

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

      // Start generation progress
      setGenerationState(true, "report", 0);
      
      // Progress animation over 30 seconds
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 30; // Increment every second
        if (progress >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progress = 100;
        }
        setGenerationState(true, "report", progress);
      }, 1000);

      // After 30 seconds, add the report artifact
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
            { field: "Impressions", before: "N/A", after: "1,234,567" },
            { field: "Top Campaign", before: "N/A", after: "SP | Bamboo | 8 inch | Queen (6.01x ROAS)" },
            { field: "Best Performer", before: "N/A", after: "SB | Bed in a Box Mattress (+42% CTR)" },
            { field: "Recommendation", before: "N/A", after: "Increase budget on top 3 campaigns" },
          ],
          status: "pending" as const,
        });
      }, 30000);

      return;
    }

    // Check if this is an audit request
    if (isAuditRequest(userMessage)) {
      // Show immediate summary
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getAuditSummary(), "assistant");
      setIsLoading(false);

      // Start generation progress
      setGenerationState(true, "audit", 0);
      
      // Progress animation over 30 seconds
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 30;
        if (progress >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progress = 100;
        }
        setGenerationState(true, "audit", progress);
      }, 1000);

      // After 30 seconds, add the audit artifact
      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        
        addMessage("**Audit Complete!** Click below to view the full health report with actionable recommendations.", "assistant", {
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
      }, 30000);

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
        Aan will explain reasoning and create drafts for your approval
      </p>
    </div>
  );
}
