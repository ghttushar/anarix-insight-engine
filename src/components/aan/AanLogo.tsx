import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import logoFull from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-white.png";
interface AanLogoProps {
  className?: string;
  showByAnarix?: boolean;
}
export function AanLogo({
  className,
  showByAnarix = true
}: AanLogoProps) {
  const {
    resolvedTheme
  } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;
  return;
}