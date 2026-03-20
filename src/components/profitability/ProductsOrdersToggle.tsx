import { cn } from "@/lib/utils";

interface ProductsOrdersToggleProps {
  activeTab: "products" | "orders";
  onTabChange: (tab: "products" | "orders") => void;
}

export function ProductsOrdersToggle({ activeTab, onTabChange }: ProductsOrdersToggleProps) {
  return (
    <div className="flex rounded-lg border border-border bg-background p-0.5 w-fit px-0 py-0">
      <button
        onClick={() => onTabChange("products")}
        className={cn(
          "rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
          activeTab === "products" ?
          "bg-primary text-primary-foreground" :
          "text-muted-foreground hover:text-foreground"
        )}>
        
        Products
      </button>
      <button
        onClick={() => onTabChange("orders")}
        className={cn(
          "rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
          activeTab === "orders" ?
          "bg-primary text-primary-foreground" :
          "text-muted-foreground hover:text-foreground"
        )}>
        
        Orders
      </button>
    </div>);

}