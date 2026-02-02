import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GeographyMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

// North America country paths - accurate SVG paths
const northAmericaCountries = {
  USA: {
    path: "M 158,120 L 162,115 L 180,118 L 220,115 L 260,118 L 280,130 L 285,145 L 270,155 L 275,175 L 265,185 L 250,190 L 240,210 L 255,225 L 252,240 L 240,235 L 220,245 L 200,240 L 185,250 L 170,245 L 155,255 L 145,250 L 140,235 L 130,220 L 115,210 L 100,190 L 95,170 L 100,150 L 115,135 L 135,125 Z",
    name: "United States",
    sales: 156789,
  },
  CAN: {
    path: "M 100,20 L 130,15 L 170,18 L 210,12 L 250,15 L 290,20 L 310,35 L 305,55 L 290,70 L 280,90 L 285,105 L 260,110 L 220,108 L 180,112 L 160,108 L 130,115 L 100,110 L 80,95 L 75,70 L 80,45 L 90,30 Z",
    name: "Canada",
    sales: 45678,
  },
  MEX: {
    path: "M 100,195 L 120,210 L 130,235 L 145,255 L 160,270 L 175,280 L 190,275 L 200,285 L 195,300 L 175,310 L 155,305 L 135,295 L 120,280 L 105,265 L 95,245 L 90,225 L 95,210 Z",
    name: "Mexico",
    sales: 23456,
  },
};

// Other world regions (greyed out)
const worldRegions = {
  SA: { path: "M 180,320 L 220,310 L 250,340 L 260,400 L 240,450 L 200,470 L 170,440 L 160,380 L 165,340 Z", name: "South America" },
  EU: { path: "M 420,80 L 480,70 L 510,90 L 520,120 L 500,145 L 460,150 L 430,135 L 410,110 Z", name: "Europe" },
  AF: { path: "M 440,170 L 510,160 L 540,200 L 530,280 L 480,320 L 420,300 L 400,240 L 420,190 Z", name: "Africa" },
  AS: { path: "M 540,60 L 650,50 L 720,80 L 750,140 L 720,200 L 640,220 L 560,200 L 520,150 L 530,100 Z", name: "Asia" },
  OC: { path: "M 660,280 L 750,270 L 780,310 L 760,360 L 700,380 L 640,350 L 640,310 Z", name: "Oceania" },
};

const getIntensityColor = (sales: number): string => {
  if (sales >= 100000) return "hsl(var(--primary) / 0.85)";
  if (sales >= 50000) return "hsl(var(--primary) / 0.55)";
  if (sales >= 25000) return "hsl(var(--primary) / 0.35)";
  return "hsl(var(--primary) / 0.2)";
};

export function GeographyMap({ selectedRegion, onRegionSelect }: GeographyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  const hoveredData = hoveredCountry
    ? northAmericaCountries[hoveredCountry as keyof typeof northAmericaCountries]
    : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Sales by Region</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out" className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} title="Reset" className="h-8 w-8">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[400px] overflow-hidden rounded-lg bg-muted/10 border border-border">
        <svg
          viewBox="0 0 800 500"
          className="h-full w-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* World regions (greyed out) */}
          {Object.entries(worldRegions).map(([code, region]) => (
            <path
              key={code}
              d={region.path}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              className="opacity-40 cursor-default"
            />
          ))}

          {/* North America countries (active with data) */}
          {Object.entries(northAmericaCountries).map(([code, country]) => (
            <path
              key={code}
              d={country.path}
              fill={getIntensityColor(country.sales)}
              stroke={selectedRegion === code ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={selectedRegion === code ? 2.5 : 1}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:brightness-110",
                hoveredCountry === code && "brightness-110"
              )}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredCountry(code)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => onRegionSelect?.(code)}
            />
          ))}

          {/* Country labels */}
          <text x="190" y="180" className="fill-foreground text-xs font-medium pointer-events-none" textAnchor="middle">USA</text>
          <text x="180" y="65" className="fill-foreground text-xs font-medium pointer-events-none" textAnchor="middle">CAN</text>
          <text x="145" y="275" className="fill-foreground text-xs font-medium pointer-events-none" textAnchor="middle">MEX</text>
        </svg>

        {/* Tooltip */}
        {hoveredData && (
          <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-popover p-3 shadow-lg z-10">
            <p className="font-medium text-foreground">{hoveredData.name}</p>
            <p className="text-sm text-muted-foreground">
              Sales: ${hoveredData.sales.toLocaleString()}
            </p>
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-popover/80 text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">Low Sales</span>
          <div className="flex rounded overflow-hidden">
            <div className="h-4 w-8" style={{ backgroundColor: "hsl(var(--primary) / 0.2)" }} />
            <div className="h-4 w-8" style={{ backgroundColor: "hsl(var(--primary) / 0.35)" }} />
            <div className="h-4 w-8" style={{ backgroundColor: "hsl(var(--primary) / 0.55)" }} />
            <div className="h-4 w-8" style={{ backgroundColor: "hsl(var(--primary) / 0.85)" }} />
          </div>
          <span className="text-xs text-muted-foreground">High Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted opacity-40" />
          <span className="text-xs text-muted-foreground">No data available</span>
        </div>
      </div>
    </div>
  );
}
