import { createContext, useContext, useState, ReactNode } from "react";

export type AanMode = "closed" | "copilot" | "split" | "workspace";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  draft?: AanDraft;
}

export interface AanDraft {
  id: string;
  type: "rule" | "audit" | "bid_change" | "campaign_edit" | "report";
  title: string;
  description: string;
  changes: DraftChange[];
  status: "pending" | "approved" | "rejected" | "editing";
}

interface DraftChange {
  field: string;
  before: string | number;
  after: string | number;
}

interface AanContextInfo {
  page: string;
  dateRange?: string;
  selectedItems?: string[];
}

interface AanContextType {
  // Mode management
  mode: AanMode;
  setMode: (mode: AanMode) => void;
  openCopilot: () => void;
  openSplit: (artifact: AanDraft) => void;
  openWorkspace: () => void;
  closeAan: () => void;

  // Legacy compatibility
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openPanel: () => void;
  closePanel: () => void;

  // Messages and drafts
  messages: Message[];
  addMessage: (content: string, role: "user" | "assistant", draft?: AanDraft) => void;
  currentDraft: AanDraft | null;
  currentArtifact: AanDraft | null;
  setCurrentDraft: (draft: AanDraft | null) => void;
  approveDraft: (draftId: string) => void;
  rejectDraft: (draftId: string) => void;

  // Context
  context: AanContextInfo;
  setContext: (context: AanContextInfo) => void;
}

const AanContext = createContext<AanContextType | undefined>(undefined);

// Mock initial messages for demo
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm Aan, your AI assistant for Anarix. I can help you analyze campaign performance, create rules, and optimize your advertising strategy. What would you like to explore?",
    timestamp: new Date(Date.now() - 60000),
  },
];

export function AanProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AanMode>("closed");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentDraft, setCurrentDraft] = useState<AanDraft | null>(null);
  const [currentArtifact, setCurrentArtifact] = useState<AanDraft | null>(null);
  const [context, setContext] = useState<AanContextInfo>({ page: "Campaign Manager" });

  // Mode helpers
  const openCopilot = () => setMode("copilot");
  const openSplit = (artifact: AanDraft) => {
    setCurrentArtifact(artifact);
    setMode("split");
  };
  const openWorkspace = () => setMode("workspace");
  const closeAan = () => {
    setMode("closed");
    setCurrentArtifact(null);
  };

  // Legacy compatibility
  const isOpen = mode !== "closed";
  const setIsOpen = (open: boolean) => setMode(open ? "copilot" : "closed");
  const openPanel = () => openCopilot();
  const closePanel = () => closeAan();

  const addMessage = (content: string, role: "user" | "assistant", draft?: AanDraft) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      draft,
    };
    setMessages((prev) => [...prev, newMessage]);

    if (draft) {
      setCurrentDraft(draft);
    }
  };

  const approveDraft = (draftId: string) => {
    if (currentDraft?.id === draftId) {
      setCurrentDraft({ ...currentDraft, status: "approved" });
      addMessage(
        `✓ Draft "${currentDraft.title}" has been approved and applied.`,
        "assistant"
      );
      setTimeout(() => setCurrentDraft(null), 2000);
    }
  };

  const rejectDraft = (draftId: string) => {
    if (currentDraft?.id === draftId) {
      setCurrentDraft({ ...currentDraft, status: "rejected" });
      addMessage(
        `Draft "${currentDraft.title}" has been rejected. No changes were made.`,
        "assistant"
      );
      setTimeout(() => setCurrentDraft(null), 1500);
    }
  };

  return (
    <AanContext.Provider
      value={{
        mode,
        setMode,
        openCopilot,
        openSplit,
        openWorkspace,
        closeAan,
        isOpen,
        setIsOpen,
        openPanel,
        closePanel,
        messages,
        addMessage,
        currentDraft,
        currentArtifact,
        setCurrentDraft,
        approveDraft,
        rejectDraft,
        context,
        setContext,
      }}
    >
      {children}
    </AanContext.Provider>
  );
}

export function useAan() {
  const context = useContext(AanContext);
  if (context === undefined) {
    throw new Error("useAan must be used within an AanProvider");
  }
  return context;
}
