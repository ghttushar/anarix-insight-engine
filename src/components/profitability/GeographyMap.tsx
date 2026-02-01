import { useState } from "react";
import { ZoomIn, ZoomOut, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GeographyMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

// Complete US state paths for proper visualization
const usStates: Record<string, { path: string; name: string }> = {
  WA: { path: "M125,50 L175,50 L180,95 L120,95 L115,65 Z", name: "Washington" },
  OR: { path: "M115,95 L180,95 L175,145 L105,145 L100,120 Z", name: "Oregon" },
  CA: { path: "M100,145 L130,145 L140,260 L85,260 L75,180 Z", name: "California" },
  NV: { path: "M130,145 L175,145 L170,230 L140,260 L130,200 Z", name: "Nevada" },
  ID: { path: "M175,60 L205,55 L215,145 L175,145 Z", name: "Idaho" },
  MT: { path: "M175,50 L280,45 L285,100 L205,100 L205,55 Z", name: "Montana" },
  WY: { path: "M205,100 L285,100 L285,155 L205,155 Z", name: "Wyoming" },
  UT: { path: "M175,145 L215,145 L215,215 L175,215 Z", name: "Utah" },
  AZ: { path: "M140,220 L175,215 L175,290 L130,290 Z", name: "Arizona" },
  CO: { path: "M215,155 L295,155 L295,215 L215,215 Z", name: "Colorado" },
  NM: { path: "M175,215 L225,215 L225,290 L175,290 Z", name: "New Mexico" },
  ND: { path: "M285,45 L365,45 L365,85 L285,85 Z", name: "North Dakota" },
  SD: { path: "M285,85 L365,85 L365,130 L285,130 Z", name: "South Dakota" },
  NE: { path: "M285,130 L375,125 L375,170 L285,175 Z", name: "Nebraska" },
  KS: { path: "M285,175 L375,170 L375,215 L295,215 Z", name: "Kansas" },
  OK: { path: "M295,215 L375,215 L375,260 L285,270 L285,235 Z", name: "Oklahoma" },
  TX: { path: "M225,265 L285,235 L285,350 L225,380 L190,340 L225,290 Z", name: "Texas" },
  MN: { path: "M365,55 L420,50 L420,115 L365,115 Z", name: "Minnesota" },
  IA: { path: "M365,115 L420,115 L430,160 L375,165 Z", name: "Iowa" },
  MO: { path: "M375,165 L430,160 L445,225 L385,230 Z", name: "Missouri" },
  AR: { path: "M385,230 L445,225 L445,275 L395,280 Z", name: "Arkansas" },
  LA: { path: "M395,280 L445,275 L450,335 L405,340 Z", name: "Louisiana" },
  WI: { path: "M420,65 L465,60 L470,115 L420,115 Z", name: "Wisconsin" },
  IL: { path: "M430,130 L470,125 L475,200 L435,205 Z", name: "Illinois" },
  MI: { path: "M465,55 L510,65 L520,120 L470,115 L470,80 Z", name: "Michigan" },
  IN: { path: "M475,135 L510,130 L515,195 L480,200 Z", name: "Indiana" },
  OH: { path: "M510,120 L555,115 L555,180 L515,185 Z", name: "Ohio" },
  KY: { path: "M480,200 L555,185 L550,225 L475,235 Z", name: "Kentucky" },
  TN: { path: "M475,235 L560,225 L555,260 L465,270 Z", name: "Tennessee" },
  MS: { path: "M445,275 L470,270 L475,335 L450,340 Z", name: "Mississippi" },
  AL: { path: "M475,270 L520,265 L525,335 L480,340 Z", name: "Alabama" },
  GA: { path: "M520,260 L575,255 L580,325 L530,330 Z", name: "Georgia" },
  FL: { path: "M530,325 L585,320 L610,400 L550,385 Z", name: "Florida" },
  SC: { path: "M560,250 L610,245 L600,285 L555,290 Z", name: "South Carolina" },
  NC: { path: "M555,220 L635,210 L625,250 L555,260 Z", name: "North Carolina" },
  VA: { path: "M555,185 L620,175 L635,210 L555,220 Z", name: "Virginia" },
  WV: { path: "M555,165 L590,160 L595,195 L560,200 Z", name: "West Virginia" },
  PA: { path: "M555,115 L620,105 L625,150 L560,160 Z", name: "Pennsylvania" },
  NY: { path: "M555,65 L620,55 L630,105 L560,115 Z", name: "New York" },
  VT: { path: "M620,45 L640,42 L642,70 L622,72 Z", name: "Vermont" },
  NH: { path: "M640,38 L655,35 L658,70 L643,72 Z", name: "New Hampshire" },
  ME: { path: "M655,25 L685,15 L680,65 L658,70 Z", name: "Maine" },
  MA: { path: "M630,72 L670,68 L668,88 L628,92 Z", name: "Massachusetts" },
  RI: { path: "M660,88 L672,86 L670,98 L658,100 Z", name: "Rhode Island" },
  CT: { path: "M635,92 L660,90 L658,108 L633,110 Z", name: "Connecticut" },
  NJ: { path: "M620,105 L642,100 L645,145 L625,150 Z", name: "New Jersey" },
  DE: { path: "M620,150 L638,148 L640,172 L622,175 Z", name: "Delaware" },
  MD: { path: "M595,165 L635,160 L640,185 L600,190 Z", name: "Maryland" },
};

const intensityColors = [
  { min: 0, max: 25000, color: "hsl(var(--primary) / 0.15)" },
  { min: 25000, max: 50000, color: "hsl(var(--primary) / 0.35)" },
  { min: 50000, max: 100000, color: "hsl(var(--primary) / 0.55)" },
  { min: 100000, max: Infinity, color: "hsl(var(--primary) / 0.85)" },
];

// Mock sales data per state
const stateSales: Record<string, number> = {
  CA: 156789, TX: 123456, NY: 98765, FL: 89012, WA: 56789,
  IL: 45678, PA: 43210, OH: 38765, GA: 35678, NC: 32456,
  MI: 28000, NJ: 31000, VA: 27000, AZ: 24000, MA: 22000,
  CO: 20000, TN: 19500, MO: 18000, IN: 17500, WI: 16000,
  MN: 15500, OR: 14000, NV: 12000, AL: 11000, SC: 10500,
  KY: 10000, LA: 9500, OK: 9000, UT: 8500, AR: 8000,
  KS: 7500, IA: 7000, MS: 6500, NE: 6000, NM: 5500,
  WV: 5000, ID: 4500, MT: 4000, ND: 3500, SD: 3000,
  WY: 2500, ME: 2200, NH: 2000, VT: 1800, RI: 1500,
  DE: 1200, CT: 2800, MD: 26000,
};

const getStateColor = (stateCode: string): string => {
  const sales = stateSales[stateCode] || 0;
  const intensity = intensityColors.find((i) => sales >= i.min && sales < i.max);
  return intensity?.color || intensityColors[0].color;
};

export function GeographyMap({ selectedRegion, onRegionSelect }: GeographyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  const filteredStates = searchQuery
    ? Object.entries(usStates).filter(([code, state]) =>
        state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search state..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[400px] overflow-hidden rounded-lg bg-muted/20 border border-border">
        <svg
          viewBox="50 0 680 420"
          className="h-full w-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect x="50" y="0" width="680" height="420" fill="transparent" />
          
          {/* Render states */}
          {Object.entries(usStates).map(([code, state]) => {
            const isHighlighted = filteredStates
              ? filteredStates.some(([c]) => c === code)
              : true;
            
            return (
              <path
                key={code}
                d={state.path}
                fill={isHighlighted ? getStateColor(code) : "hsl(var(--muted))"}
                stroke={selectedRegion === code ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={selectedRegion === code ? 2.5 : 1}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  hoveredState === code && "brightness-110",
                  !isHighlighted && "opacity-30"
                )}
                onMouseEnter={() => setHoveredState(code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onRegionSelect?.(code)}
              />
            );
          })}

          {/* State labels for larger states */}
          {Object.entries(usStates).map(([code]) => {
            // Calculate center of path (simplified)
            const path = usStates[code].path;
            const matches = path.match(/[ML]\s*(\d+),(\d+)/g);
            if (!matches || matches.length < 2) return null;
            
            const coords = matches.map(m => {
              const [, x, y] = m.match(/(\d+),(\d+)/) || [];
              return { x: parseInt(x), y: parseInt(y) };
            });
            
            const cx = coords.reduce((sum, c) => sum + c.x, 0) / coords.length;
            const cy = coords.reduce((sum, c) => sum + c.y, 0) / coords.length;
            
            // Only show labels for states with enough space
            const largeStates = ["CA", "TX", "NY", "FL", "MT", "CO", "AZ", "NM", "WA", "OR", "NV", "UT", "WY", "ID", "ND", "SD", "NE", "KS", "OK", "MN", "IA", "MO", "AR", "LA", "WI", "IL", "MI", "OH", "KY", "TN", "MS", "AL", "GA", "NC", "SC", "VA", "PA"];
            
            if (!largeStates.includes(code)) return null;
            
            return (
              <text
                key={`label-${code}`}
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-[10px] font-medium pointer-events-none select-none"
                style={{ fontSize: "10px" }}
              >
                {code}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && usStates[hoveredState] && (
          <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-popover p-3 shadow-lg z-10">
            <p className="font-medium text-foreground">
              {usStates[hoveredState].name}
            </p>
            <p className="text-sm text-muted-foreground">
              Sales: ${(stateSales[hoveredState] || 0).toLocaleString()}
            </p>
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-popover/80 text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="text-xs text-muted-foreground">Low Sales</span>
        <div className="flex rounded overflow-hidden">
          {intensityColors.map((intensity, i) => (
            <div
              key={i}
              className="h-4 w-10"
              style={{ backgroundColor: intensity.color }}
              title={`$${intensity.min.toLocaleString()} - ${intensity.max === Infinity ? "+" : "$" + intensity.max.toLocaleString()}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">High Sales</span>
      </div>
    </div>
  );
}
