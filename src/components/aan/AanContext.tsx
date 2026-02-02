import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type AanMode = "closed" | "copilot" | "split" | "workspace";
export type ConversationType = "general" | "report" | "audit" | "creative" | "rule" | "agent";
export type FilterType = "all" | "reports" | "audit" | "creative" | "agent";

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

export interface Conversation {
  id: string;
  title: string;
  type: ConversationType;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  artifacts: AanDraft[];
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

  // Messages and drafts (current conversation)
  messages: Message[];
  addMessage: (content: string, role: "user" | "assistant", draft?: AanDraft) => void;
  currentDraft: AanDraft | null;
  currentArtifact: AanDraft | null;
  setCurrentDraft: (draft: AanDraft | null) => void;
  approveDraft: (draftId: string) => void;
  rejectDraft: (draftId: string) => void;

  // Conversations management
  conversations: Conversation[];
  currentConversation: Conversation | null;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;

  // Context
  context: AanContextInfo;
  setContext: (context: AanContextInfo) => void;
}

const AanContext = createContext<AanContextType | undefined>(undefined);

// Mock initial conversations for demo
const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Campaign Performance Analysis",
    type: "report",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    messages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm Aan, your AI assistant for Anarix. I can help you analyze campaign performance, create rules, and optimize your advertising strategy. What would you like to explore?",
        timestamp: new Date(Date.now() - 60000),
      },
    ],
    artifacts: [],
  },
  {
    id: "conv-2",
    title: "Q4 2025 Audit Review",
    type: "audit",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    messages: [],
    artifacts: [],
  },
  {
    id: "conv-3",
    title: "New Bid Strategy Discussion",
    type: "general",
    createdAt: new Date(Date.now() - 604800000),
    updatedAt: new Date(Date.now() - 604800000),
    messages: [],
    artifacts: [],
  },
];

export function AanProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AanMode>("closed");
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>("conv-1");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentDraft, setCurrentDraft] = useState<AanDraft | null>(null);
  const [currentArtifact, setCurrentArtifact] = useState<AanDraft | null>(null);
  const [context, setContext] = useState<AanContextInfo>({ page: "Campaign Manager" });

  // Current conversation
  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  // Messages from current conversation
  const messages = currentConversation?.messages || [];

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
    if (!currentConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      draft,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

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

  // Conversation management
  const startNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New Conversation",
      type: "general",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! How can I help you today?",
          timestamp: new Date(),
        },
      ],
      artifacts: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
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
        conversations,
        currentConversation,
        activeFilter,
        setActiveFilter,
        startNewConversation,
        selectConversation,
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
