import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { cn } from "@/lib/utils";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

const OPTIONS: { id: Marketplace; label: string; logo?: string; color: string }[] = [
  { id: "amazon", label: "Amazon", logo: amazonLogo, color: "#FF9900" },
  { id: "walmart", label: "Walmart", logo: walmartLogo, color: "#0071CE" },
  { id: "shopify", label: "Shopify", color: "#96BF48" },
  { id: "tiktok", label: "TikTok", color: "#000000" },
];

/**
 * Marketplace switcher pill used in the mobile top bar.
 * Opens a bottom sheet listing the four supported marketplaces.
 */
export function MobileMarketplacePill() {
  const { marketplace, setMarketplace } = useMarketplace();
  const [open, setOpen] = useState(false);
  const current = OPTIONS.find((o) => o.id === marketplace) ?? OPTIONS[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-8 px-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted/60 active:bg-muted"
        aria-label="Switch marketplace"
      >
        {current.logo ? (
          <img src={current.logo} alt="" className="h-3.5 w-auto object-contain" />
        ) : (
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: current.color }}
            aria-hidden
          />
        )}
        <span className="text-[12px] font-medium text-foreground capitalize">
          {current.label}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl p-0 border-t border-border"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <SheetHeader className="px-4 pt-4 pb-2 text-left">
            <SheetTitle className="text-base">Marketplace</SheetTitle>
          </SheetHeader>
          <div className="px-2 pb-4">
            {OPTIONS.map((o) => {
              const selected = o.id === marketplace;
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setMarketplace(o.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full h-12 px-3 flex items-center gap-3 rounded-md text-left",
                    selected ? "bg-primary/8" : "hover:bg-muted/60 active:bg-muted"
                  )}
                >
                  {o.logo ? (
                    <img src={o.logo} alt="" className="h-4 w-auto object-contain" />
                  ) : (
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: o.color }}
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      selected ? "font-semibold text-primary" : "text-foreground"
                    )}
                  >
                    {o.label}
                  </span>
                  {selected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
