import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import logoFull from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-white.png";

interface AanLogoProps {
  className?: string;
  showByAnarix?: boolean;
}

export function AanLogo({ className, showByAnarix = true }: AanLogoProps) {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="font-aan text-aan-lg aan-gradient-text font-bold">
        Aan
      </span>
      {showByAnarix && (
        <>
          <span className="text-xs text-muted-foreground">by</span>
          <img src={logoSrc} alt="Anarix" className="h-5 w-auto" />
        </>
      )}
    </div>
  );
}
