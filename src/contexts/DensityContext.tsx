import { createContext, useContext, useEffect, useState } from "react";

type Density = "comfortable" | "compact";

interface DensityContextType {
  density: Density;
  setDensity: (density: Density) => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensityState] = useState<Density>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("anarix-density") as Density) || "comfortable";
    }
    return "comfortable";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply density-specific CSS custom properties
    if (density === "compact") {
      root.style.setProperty("--spacing-base", "2px");
      root.style.setProperty("--row-height", "32px");
      root.style.setProperty("--card-padding", "12px");
      root.classList.add("density-compact");
      root.classList.remove("density-comfortable");
    } else {
      root.style.setProperty("--spacing-base", "4px");
      root.style.setProperty("--row-height", "44px");
      root.style.setProperty("--card-padding", "16px");
      root.classList.add("density-comfortable");
      root.classList.remove("density-compact");
    }
  }, [density]);

  const setDensity = (newDensity: Density) => {
    localStorage.setItem("anarix-density", newDensity);
    setDensityState(newDensity);
  };

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  const context = useContext(DensityContext);
  if (context === undefined) {
    throw new Error("useDensity must be used within a DensityProvider");
  }
  return context;
}
