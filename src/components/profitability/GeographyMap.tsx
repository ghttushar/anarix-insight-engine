import { useState } from "react";
import { ZoomIn, ZoomOut, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GeographyMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

// Simplified US state paths for visualization
const usStates: Record<string, { path: string; name: string; x: number; y: number }> = {
  CA: { path: "M50,150 L70,100 L90,120 L80,180 L60,200 Z", name: "California", x: 60, y: 150 },
  TX: { path: "M200,200 L280,180 L300,240 L250,280 L200,260 Z", name: "Texas", x: 240, y: 230 },
  NY: { path: "M450,80 L480,70 L490,110 L460,120 Z", name: "New York", x: 465, y: 95 },
  FL: { path: "M420,240 L450,220 L470,280 L440,310 L410,280 Z", name: "Florida", x: 440, y: 265 },
  WA: { path: "M60,30 L100,25 L110,60 L70,70 Z", name: "Washington", x: 80, y: 45 },
  IL: { path: "M340,120 L360,115 L370,170 L345,180 Z", name: "Illinois", x: 355, y: 145 },
  PA: { path: "M420,100 L460,95 L465,130 L425,135 Z", name: "Pennsylvania", x: 440, y: 115 },
  OH: { path: "M390,115 L420,110 L425,150 L395,155 Z", name: "Ohio", x: 405, y: 130 },
  GA: { path: "M400,200 L430,195 L440,250 L410,255 Z", name: "Georgia", x: 420, y: 225 },
  NC: { path: "M430,175 L490,165 L495,195 L435,205 Z", name: "North Carolina", x: 460, y: 185 },
};

const intensityColors = [
  { min: 0, max: 25000, color: "hsl(var(--primary) / 0.2)" },
  { min: 25000, max: 50000, color: "hsl(var(--primary) / 0.4)" },
  { min: 50000, max: 100000, color: "hsl(var(--primary) / 0.6)" },
  { min: 100000, max: Infinity, color: "hsl(var(--primary) / 0.9)" },
];

// Mock sales data per state
const stateSales: Record<string, number> = {
  CA: 156789,
  TX: 123456,
  NY: 98765,
  FL: 89012,
  WA: 56789,
  IL: 45678,
  PA: 43210,
  OH: 38765,
  GA: 35678,
  NC: 32456,
};

const getStateColor = (stateCode: string): string => {
  const sales = stateSales[stateCode] || 0;
  const intensity = intensityColors.find((i) => sales >= i.min && sales < i.max);
  return intensity?.color || intensityColors[0].color;
};

export function GeographyMap({ selectedRegion, onRegionSelect }: GeographyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search region..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[350px] overflow-hidden rounded-lg bg-muted/30">
        <svg
          viewBox="0 0 550 350"
          className="h-full w-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {/* Render states */}
          {Object.entries(usStates).map(([code, state]) => (
            <g key={code}>
              <path
                d={state.path}
                fill={getStateColor(code)}
                stroke="hsl(var(--border))"
                strokeWidth={selectedRegion === code ? 2 : 1}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  hoveredState === code && "opacity-80"
                )}
                onMouseEnter={() => setHoveredState(code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onRegionSelect?.(code)}
              />
              <text
                x={state.x}
                y={state.y}
                textAnchor="middle"
                className="fill-foreground text-[8px] font-medium pointer-events-none"
              >
                {code}
              </text>
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-popover p-3 shadow-lg">
            <p className="font-medium text-foreground">
              {usStates[hoveredState]?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Sales: ${stateSales[hoveredState]?.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="text-xs text-muted-foreground">Low</span>
        <div className="flex">
          {intensityColors.map((intensity, i) => (
            <div
              key={i}
              className="h-4 w-8"
              style={{ backgroundColor: intensity.color }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">High</span>
      </div>
    </div>
  );
}
