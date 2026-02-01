import { Button } from "@/components/ui/button";
import { useAan } from "./AanContext";
import { cn } from "@/lib/utils";
export function AanTrigger() {
  const {
    isOpen,
    setIsOpen
  } = useAan();
  return <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className={cn("relative gap-2 transition-all duration-200", isOpen ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "text-muted-foreground hover:text-primary")}>
      
      <span className="hidden sm:inline">Aan</span>
      {/* Subtle gradient underline on hover */}
      {!isOpen && <span className="absolute -bottom-px left-2 right-2 h-0.5 scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform group-hover:scale-x-100" />}
    </Button>;
}