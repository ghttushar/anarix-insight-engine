import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  ZAxis,
} from "recharts";
import { ScatterDataPoint } from "@/types/profitability";
import { cn } from "@/lib/utils";

interface ScatterPlotChartProps {
  data: ScatterDataPoint[];
}

const quadrantColors = {
  winners: "hsl(142, 76%, 36%)", // Green
  grow: "hsl(142, 76%, 70%)", // Light green
  optimize: "hsl(48, 96%, 53%)", // Yellow
  review: "hsl(0, 84%, 60%)", // Red
};

const quadrantLabels = {
  winners: { title: "Winners", description: "High margin, high sales" },
  grow: { title: "Grow", description: "High margin, low sales" },
  optimize: { title: "Optimize", description: "Low margin, high sales" },
  review: { title: "Review", description: "Low margin, low sales" },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Profit Margin: <span className="text-foreground">{data.profitMargin.toFixed(1)}%</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Total Sales: <span className="text-foreground">${data.totalSales.toLocaleString()}</span>
        </p>
        <p className="mt-1 text-xs capitalize" style={{ color: quadrantColors[data.quadrant as keyof typeof quadrantColors] }}>
          {quadrantLabels[data.quadrant as keyof typeof quadrantLabels].title}
        </p>
      </div>
    );
  }
  return null;
};

export function ScatterPlotChart({ data }: ScatterPlotChartProps) {
  const maxSales = Math.max(...data.map((d) => d.totalSales)) * 1.1;
  const maxMargin = Math.max(...data.map((d) => d.profitMargin)) * 1.1;
  const midMargin = 25; // 25% profit margin as midpoint
  const midSales = maxSales / 2;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Product Performance Quadrants</h3>
        <div className="flex items-center gap-4">
          {Object.entries(quadrantLabels).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: quadrantColors[key as keyof typeof quadrantColors] }}
              />
              <span className="text-xs text-muted-foreground">{value.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            
            {/* Quadrant backgrounds */}
            <ReferenceArea x1={0} x2={midMargin} y1={midSales} y2={maxSales} fill={quadrantColors.optimize} fillOpacity={0.1} />
            <ReferenceArea x1={midMargin} x2={maxMargin} y1={midSales} y2={maxSales} fill={quadrantColors.winners} fillOpacity={0.1} />
            <ReferenceArea x1={0} x2={midMargin} y1={0} y2={midSales} fill={quadrantColors.review} fillOpacity={0.1} />
            <ReferenceArea x1={midMargin} x2={maxMargin} y1={0} y2={midSales} fill={quadrantColors.grow} fillOpacity={0.1} />
            
            {/* Reference lines for quadrants */}
            <ReferenceLine x={midMargin} stroke="hsl(var(--border))" strokeDasharray="5 5" />
            <ReferenceLine y={midSales} stroke="hsl(var(--border))" strokeDasharray="5 5" />

            <XAxis
              type="number"
              dataKey="profitMargin"
              name="Profit Margin"
              unit="%"
              domain={[0, maxMargin]}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              label={{ value: "Profit Margin (%)", position: "bottom", offset: 0 }}
            />
            <YAxis
              type="number"
              dataKey="totalSales"
              name="Total Sales"
              domain={[0, maxSales]}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              label={{ value: "Total Sales ($)", angle: -90, position: "insideLeft" }}
            />
            <ZAxis range={[80, 200]} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Scatter points by quadrant */}
            {Object.keys(quadrantColors).map((quadrant) => (
              <Scatter
                key={quadrant}
                name={quadrantLabels[quadrant as keyof typeof quadrantLabels].title}
                data={data.filter((d) => d.quadrant === quadrant)}
                fill={quadrantColors[quadrant as keyof typeof quadrantColors]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
