import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProfitabilityProduct } from "@/types/profitability";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductTrendsModalProps {
  product: ProfitabilityProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const METRICS_OPTIONS = [
  { key: "orderSales", label: "Order Sales", color: "hsl(var(--primary))" },
  { key: "totalSales", label: "Total Sales", color: "hsl(var(--chart-2))" },
  { key: "commission", label: "Commission on Product", color: "hsl(var(--chart-3))" },
];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(v);

export function ProductTrendsModal({ product, isOpen, onClose }: ProductTrendsModalProps) {
  const [frequency, setFrequency] = useState("weekly");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["orderSales", "totalSales"]);

  if (!product) return null;

  const weeklyData = product.weeklyData || {};
  const chartData = Object.entries(weeklyData).map(([week, value]) => ({
    week,
    orderSales: value,
    totalSales: value * 1.08,
    commission: value * 0.15,
  }));

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-base">Product Trends</DialogTitle>
          <DialogDescription className="sr-only">View product trends over time</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Product info */}
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.itemId}</span>
                <span>•</span>
                <span>{product.sku}</span>
                <span>•</span>
                <span>{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"].map((f) => (
                  <SelectItem key={f.toLowerCase()} value={f.toLowerCase()} className="text-xs">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3">
              {METRICS_OPTIONS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => toggleMetric(m.key)}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Checkbox checked={selectedMetrics.includes(m.key)} className="pointer-events-none h-3.5 w-3.5" />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                {METRICS_OPTIONS.filter((m) => selectedMetrics.includes(m.key)).map((m) => (
                  <Line
                    key={m.key}
                    type="monotone"
                    dataKey={m.key}
                    stroke={m.color}
                    strokeWidth={2}
                    dot={{ fill: m.color, strokeWidth: 0, r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
