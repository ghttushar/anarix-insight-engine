import { createContext, useContext, useEffect, useState } from "react";

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

const schemes: ColorScheme[] = [
  {
    id: "periwinkle-classic",
    name: "Periwinkle Classic",
    description: "Original analytical calm — cool blue-indigo tones",
    light: {
      "--background": "230 33% 97%",
      "--foreground": "240 53% 9%",
      "--card": "0 0% 100%",
      "--card-foreground": "240 53% 9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "240 53% 9%",
      "--primary": "229 65% 57%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "234 30% 24%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "230 33% 97%",
      "--muted-foreground": "228 15% 46%",
      "--accent": "231 74% 81%",
      "--accent-foreground": "240 53% 9%",
      "--border": "230 25% 90%",
      "--input": "230 25% 90%",
      "--ring": "229 65% 57%",
      "--sidebar-background": "0 0% 100%",
      "--sidebar-foreground": "228 15% 46%",
      "--sidebar-primary": "229 65% 57%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "230 33% 97%",
      "--sidebar-accent-foreground": "240 53% 9%",
      "--sidebar-border": "230 25% 90%",
      "--sidebar-ring": "229 65% 57%",
    },
    dark: {
      "--background": "234 53% 9%",
      "--foreground": "240 100% 97%",
      "--card": "235 37% 14%",
      "--card-foreground": "240 100% 97%",
      "--popover": "235 37% 14%",
      "--popover-foreground": "240 100% 97%",
      "--primary": "231 88% 70%",
      "--primary-foreground": "240 53% 9%",
      "--secondary": "234 43% 32%",
      "--secondary-foreground": "240 100% 97%",
      "--muted": "235 37% 14%",
      "--muted-foreground": "230 29% 69%",
      "--accent": "231 100% 87%",
      "--accent-foreground": "240 53% 9%",
      "--border": "235 30% 20%",
      "--input": "235 30% 20%",
      "--ring": "231 88% 70%",
      "--sidebar-background": "235 37% 14%",
      "--sidebar-foreground": "230 29% 69%",
      "--sidebar-primary": "231 88% 70%",
      "--sidebar-primary-foreground": "240 53% 9%",
      "--sidebar-accent": "234 53% 9%",
      "--sidebar-accent-foreground": "240 100% 97%",
      "--sidebar-border": "235 30% 20%",
      "--sidebar-ring": "231 88% 70%",
    },
  },
  {
    id: "periwinkle-refined",
    name: "Periwinkle Refined",
    description: "Stripe/Linear inspired — flatter neutrals, warmer primary, softer borders",
    light: {
      "--background": "220 14% 98%",
      "--foreground": "240 10% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "240 10% 10%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "240 10% 10%",
      "--primary": "234 68% 55%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "234 25% 22%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "220 14% 96%",
      "--muted-foreground": "220 9% 46%",
      "--accent": "231 74% 81%",
      "--accent-foreground": "240 10% 10%",
      "--border": "220 13% 91%",
      "--input": "220 13% 91%",
      "--ring": "234 68% 55%",
      "--sidebar-background": "0 0% 100%",
      "--sidebar-foreground": "220 9% 46%",
      "--sidebar-primary": "234 68% 55%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "220 14% 96%",
      "--sidebar-accent-foreground": "240 10% 10%",
      "--sidebar-border": "220 13% 91%",
      "--sidebar-ring": "234 68% 55%",
    },
    dark: {
      "--background": "240 12% 8%",
      "--foreground": "240 100% 97%",
      "--card": "240 12% 12%",
      "--card-foreground": "240 100% 97%",
      "--popover": "240 12% 12%",
      "--popover-foreground": "240 100% 97%",
      "--primary": "231 88% 70%",
      "--primary-foreground": "240 12% 8%",
      "--secondary": "234 30% 28%",
      "--secondary-foreground": "240 100% 97%",
      "--muted": "240 12% 12%",
      "--muted-foreground": "230 20% 64%",
      "--accent": "231 100% 87%",
      "--accent-foreground": "240 12% 8%",
      "--border": "240 12% 18%",
      "--input": "240 12% 18%",
      "--ring": "231 88% 70%",
      "--sidebar-background": "240 12% 12%",
      "--sidebar-foreground": "230 20% 64%",
      "--sidebar-primary": "231 88% 70%",
      "--sidebar-primary-foreground": "240 12% 8%",
      "--sidebar-accent": "240 12% 8%",
      "--sidebar-accent-foreground": "240 100% 97%",
      "--sidebar-border": "240 12% 18%",
      "--sidebar-ring": "231 88% 70%",
    },
  },
  {
    id: "periwinkle-warm",
    name: "Periwinkle Warm",
    description: "Warmer undertones — ivory backgrounds with a softer indigo",
    light: {
      "--background": "40 20% 97%",
      "--foreground": "240 10% 10%",
      "--card": "40 20% 100%",
      "--card-foreground": "240 10% 10%",
      "--popover": "40 20% 100%",
      "--popover-foreground": "240 10% 10%",
      "--primary": "235 55% 52%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "234 25% 22%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "40 15% 95%",
      "--muted-foreground": "220 9% 46%",
      "--accent": "231 60% 78%",
      "--accent-foreground": "240 10% 10%",
      "--border": "30 12% 89%",
      "--input": "30 12% 89%",
      "--ring": "235 55% 52%",
      "--sidebar-background": "40 20% 100%",
      "--sidebar-foreground": "220 9% 46%",
      "--sidebar-primary": "235 55% 52%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "40 15% 95%",
      "--sidebar-accent-foreground": "240 10% 10%",
      "--sidebar-border": "30 12% 89%",
      "--sidebar-ring": "235 55% 52%",
    },
    dark: {
      "--background": "240 10% 9%",
      "--foreground": "40 20% 96%",
      "--card": "240 10% 13%",
      "--card-foreground": "40 20% 96%",
      "--popover": "240 10% 13%",
      "--popover-foreground": "40 20% 96%",
      "--primary": "231 80% 68%",
      "--primary-foreground": "240 10% 9%",
      "--secondary": "234 30% 28%",
      "--secondary-foreground": "40 20% 96%",
      "--muted": "240 10% 13%",
      "--muted-foreground": "230 15% 62%",
      "--accent": "231 80% 85%",
      "--accent-foreground": "240 10% 9%",
      "--border": "240 10% 18%",
      "--input": "240 10% 18%",
      "--ring": "231 80% 68%",
      "--sidebar-background": "240 10% 13%",
      "--sidebar-foreground": "230 15% 62%",
      "--sidebar-primary": "231 80% 68%",
      "--sidebar-primary-foreground": "240 10% 9%",
      "--sidebar-accent": "240 10% 9%",
      "--sidebar-accent-foreground": "40 20% 96%",
      "--sidebar-border": "240 10% 18%",
      "--sidebar-ring": "231 80% 68%",
    },
  },
];

interface ColorSchemeContextType {
  schemeId: string;
  setSchemeId: (id: string) => void;
  schemes: ColorScheme[];
  currentScheme: ColorScheme;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [schemeId, setSchemeIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("anarix-color-scheme") || "periwinkle-classic";
    }
    return "periwinkle-classic";
  });

  const currentScheme = schemes.find((s) => s.id === schemeId) || schemes[0];

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const vars = isDark ? currentScheme.dark : currentScheme.light;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [schemeId, currentScheme]);

  // Re-apply when theme (light/dark) changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      const vars = isDark ? currentScheme.dark : currentScheme.light;
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [currentScheme]);

  const setSchemeId = (id: string) => {
    localStorage.setItem("anarix-color-scheme", id);
    setSchemeIdState(id);
  };

  return (
    <ColorSchemeContext.Provider value={{ schemeId, setSchemeId, schemes, currentScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) throw new Error("useColorScheme must be used within ColorSchemeProvider");
  return context;
}
