import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type PanelType = "none" | "insights" | "copilot" | "split" | "productDetail" | "periodBreakdown";

interface ActivePanelContextType {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  closePanel: () => void;
}

const ActivePanelContext = createContext<ActivePanelContextType>({
  activePanel: "none",
  setActivePanel: () => {},
  closePanel: () => {},
});

export function ActivePanelProvider({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanelState] = useState<PanelType>("none");

  const setActivePanel = useCallback((panel: PanelType) => {
    setActivePanelState(panel);
  }, []);

  const closePanel = useCallback(() => {
    setActivePanelState("none");
  }, []);

  return (
    <ActivePanelContext.Provider value={{ activePanel, setActivePanel, closePanel }}>
      {children}
    </ActivePanelContext.Provider>
  );
}

export function useActivePanel() {
  return useContext(ActivePanelContext);
}
