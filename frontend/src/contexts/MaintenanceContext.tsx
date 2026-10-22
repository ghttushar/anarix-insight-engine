import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const STORAGE_KEY = "anarix-maintenance-mode";

interface MaintenanceContextType {
  maintenanceMode: boolean;
  setMaintenanceMode: (v: boolean) => void;
  toggleMaintenanceMode: () => void;
}

const MaintenanceContext = createContext<MaintenanceContextType>({
  maintenanceMode: false,
  setMaintenanceMode: () => {},
  toggleMaintenanceMode: () => {},
});

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [maintenanceMode, setState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const setMaintenanceMode = useCallback((v: boolean) => {
    setState(v);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
  }, []);

  const toggleMaintenanceMode = useCallback(() => {
    setState((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <MaintenanceContext.Provider value={{ maintenanceMode, setMaintenanceMode, toggleMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  return useContext(MaintenanceContext);
}
