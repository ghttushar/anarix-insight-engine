import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeographyMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

// Simplified but recognizable country/region paths for a world map
// Active regions: USA, Canada, Mexico
const activeCountries: Record<string, { path: string; name: string; sales: number; labelX: number; labelY: number }> = {
  USA: {
    path: "M50,95 L55,90 L65,88 L80,87 L95,88 L105,90 L120,92 L130,95 L128,100 L132,108 L125,115 L118,118 L108,120 L100,125 L108,130 L106,138 L98,135 L88,140 L80,138 L72,142 L65,140 L60,148 L52,145 L48,135 L42,128 L35,120 L28,112 L25,100 L30,92 L40,90 Z",
    name: "United States",
    sales: 156789,
    labelX: 78,
    labelY: 115,
  },
  CAN: {
    path: "M25,30 L40,25 L60,22 L80,20 L100,22 L120,25 L135,30 L142,40 L140,52 L135,62 L130,72 L128,80 L120,85 L105,87 L95,86 L80,85 L65,86 L55,88 L45,88 L35,85 L25,80 L20,70 L18,55 L20,40 Z",
    name: "Canada",
    sales: 45678,
    labelX: 80,
    labelY: 55,
  },
  MEX: {
    path: "M28,118 L35,125 L42,132 L48,140 L52,148 L60,155 L68,162 L75,168 L80,172 L78,178 L70,182 L60,180 L50,175 L42,168 L35,158 L28,148 L24,138 L22,128 Z",
    name: "Mexico",
    sales: 23456,
    labelX: 50,
    labelY: 158,
  },
};

// Decorative continent outlines (not interactive)
const decorativePaths: { path: string; name: string }[] = [
  // South America
  { path: "M80,190 L95,185 L108,195 L115,215 L112,240 L105,260 L92,270 L78,262 L72,245 L70,225 L72,205 Z", name: "South America" },
  // Europe
  { path: "M230,55 L240,50 L255,48 L268,52 L275,60 L272,72 L265,80 L255,82 L245,78 L235,72 L228,62 Z", name: "Europe" },
  // Africa
  { path: "M235,95 L250,90 L268,92 L278,100 L280,118 L275,140 L265,155 L250,162 L238,158 L228,145 L225,125 L228,108 Z", name: "Africa" },
  // Asia
  { path: "M280,35 L300,30 L325,28 L350,32 L365,42 L370,58 L365,75 L355,88 L340,92 L320,90 L300,85 L285,75 L278,60 L275,45 Z", name: "Asia" },
  // Middle East
  { path: "M272,72 L285,68 L295,72 L298,82 L292,90 L282,92 L275,85 Z", name: "Middle East" },
  // Oceania / Australia
  { path: "M340,165 L360,158 L378,162 L385,175 L380,190 L365,198 L348,195 L338,182 Z", name: "Australia" },
  // Southeast Asia islands
  { path: "M345,100 L358,95 L368,100 L372,110 L365,118 L352,120 L342,112 Z", name: "SE Asia" },
];

const getIntensityColor = (sales: number): string => {
  if (sales >= 100000) return "hsl(var(--primary) / 0.8)";
  if (sales >= 50000) return "hsl(var(--primary) / 0.5)";
  if (sales >= 25000) return "hsl(var(--primary) / 0.35)";
  return "hsl(var(--primary) / 0.2)";
};

export function GeographyMap({ selectedRegion, onRegionSelect }: GeographyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  const hoveredData = hoveredCountry ? activeCountries[hoveredCountry] : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Sales by Region</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-7 w-7">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-7 w-7">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} className="h-7 w-7">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div
        className="relative h-[400px] overflow-hidden rounded-lg bg-muted/10 border border-border select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <svg
          viewBox="0 0 420 280"
          className="h-full w-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.2s ease",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Decorative continents */}
          {decorativePaths.map((region) => (
            <path
              key={region.name}
              d={region.path}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              className="opacity-50"
              style={{ cursor: "default" }}
            />
          ))}

          {/* Active countries */}
          {Object.entries(activeCountries).map(([code, country]) => (
            <g key={code}>
              <path
                d={country.path}
                fill={getIntensityColor(country.sales)}
                stroke={selectedRegion === code ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={selectedRegion === code ? 2 : 0.8}
                style={{ cursor: "pointer" }}
                className="transition-all duration-150 hover:brightness-110"
                onMouseEnter={() => setHoveredCountry(code)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegionSelect?.(code);
                }}
              />
              <text
                x={country.labelX}
                y={country.labelY}
                className="fill-foreground pointer-events-none"
                textAnchor="middle"
                fontSize={6}
                fontWeight={500}
              >
                {code}
              </text>
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredData && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-popover px-3 py-2 shadow-lg z-10">
            <p className="font-medium text-foreground text-sm">{hoveredData.name}</p>
            <p className="text-xs text-muted-foreground">
              Sales: ${hoveredData.sales.toLocaleString()}
            </p>
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-popover/80 text-[10px] text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <div className="flex rounded overflow-hidden">
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.2)" }} />
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.35)" }} />
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.5)" }} />
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.8)" }} />
          </div>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-muted opacity-50" />
          <span className="text-[10px] text-muted-foreground">No data</span>
        </div>
      </div>
    </div>
  );
}
