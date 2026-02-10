import { useState, useMemo } from "react";
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeographyMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

// Hexagonal dot-grid world map
// Each point represents a geographic area using an offset hex grid
// Coordinates are col, row in a hex grid mapped to approximate lat/lng

interface HexPoint {
  col: number;
  row: number;
  country: string;
}

// Generate hex grid points that form continent shapes
// Grid: cols 0-60, rows 0-30
const hexPoints: HexPoint[] = [
  // North America - Canada
  ...[
    [12,3],[13,3],[14,3],[15,3],[16,3],[17,3],[18,3],
    [11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4],[18,4],[19,4],
    [10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],[19,5],
    [10,6],[11,6],[12,6],[13,6],[14,6],[15,6],[16,6],[17,6],[18,6],
  ].map(([c,r]) => ({ col: c, row: r, country: "CAN" })),
  
  // North America - USA
  ...[
    [10,7],[11,7],[12,7],[13,7],[14,7],[15,7],[16,7],[17,7],
    [10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[16,8],[17,8],
    [11,9],[12,9],[13,9],[14,9],[15,9],[16,9],[17,9],
    [12,10],[13,10],[14,10],[15,10],[16,10],
  ].map(([c,r]) => ({ col: c, row: r, country: "USA" })),
  
  // North America - Mexico
  ...[
    [10,10],[11,10],[12,11],[13,11],
    [10,11],[11,11],
    [10,12],[11,12],[12,12],
  ].map(([c,r]) => ({ col: c, row: r, country: "MEX" })),
  
  // Central America & Caribbean
  ...[
    [13,12],[14,12],[15,12],
    [14,13],[15,13],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // South America
  ...[
    [16,14],[17,14],[18,14],[19,14],
    [16,15],[17,15],[18,15],[19,15],[20,15],
    [16,16],[17,16],[18,16],[19,16],[20,16],[21,16],
    [17,17],[18,17],[19,17],[20,17],[21,17],
    [17,18],[18,18],[19,18],[20,18],[21,18],
    [18,19],[19,19],[20,19],[21,19],
    [18,20],[19,20],[20,20],
    [19,21],[20,21],
    [19,22],[20,22],
    [19,23],[20,23],
    [19,24],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // Europe
  ...[
    [28,3],[29,3],[30,3],[31,3],[32,3],
    [27,4],[28,4],[29,4],[30,4],[31,4],[32,4],[33,4],
    [27,5],[28,5],[29,5],[30,5],[31,5],[32,5],[33,5],[34,5],
    [28,6],[29,6],[30,6],[31,6],[32,6],[33,6],[34,6],
    [29,7],[30,7],[31,7],[32,7],[33,7],
    [29,8],[30,8],[31,8],[32,8],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // Africa
  ...[
    [29,9],[30,9],[31,9],[32,9],
    [28,10],[29,10],[30,10],[31,10],[32,10],[33,10],
    [28,11],[29,11],[30,11],[31,11],[32,11],[33,11],
    [29,12],[30,12],[31,12],[32,12],[33,12],
    [29,13],[30,13],[31,13],[32,13],[33,13],
    [30,14],[31,14],[32,14],[33,14],
    [30,15],[31,15],[32,15],
    [31,16],[32,16],
    [31,17],[32,17],
    [32,18],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // Middle East
  ...[
    [34,7],[35,7],[36,7],
    [34,8],[35,8],[36,8],[37,8],
    [35,9],[36,9],[37,9],
    [35,10],[36,10],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // Asia (Russia + Central + East)
  ...[
    [34,2],[35,2],[36,2],[37,2],[38,2],[39,2],[40,2],[41,2],[42,2],[43,2],[44,2],[45,2],[46,2],
    [34,3],[35,3],[36,3],[37,3],[38,3],[39,3],[40,3],[41,3],[42,3],[43,3],[44,3],[45,3],[46,3],[47,3],
    [35,4],[36,4],[37,4],[38,4],[39,4],[40,4],[41,4],[42,4],[43,4],[44,4],[45,4],[46,4],[47,4],
    [36,5],[37,5],[38,5],[39,5],[40,5],[41,5],[42,5],[43,5],[44,5],[45,5],[46,5],
    [37,6],[38,6],[39,6],[40,6],[41,6],[42,6],[43,6],[44,6],[45,6],
    [38,7],[39,7],[40,7],[41,7],[42,7],[43,7],[44,7],
    [38,8],[39,8],[40,8],[41,8],[42,8],[43,8],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // India / SE Asia
  ...[
    [39,9],[40,9],[41,9],[42,9],
    [39,10],[40,10],[41,10],[42,10],[43,10],
    [40,11],[41,11],[42,11],[43,11],
    [41,12],[42,12],[43,12],[44,12],
    [42,13],[43,13],[44,13],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // Australia
  ...[
    [44,16],[45,16],[46,16],[47,16],
    [43,17],[44,17],[45,17],[46,17],[47,17],[48,17],
    [43,18],[44,18],[45,18],[46,18],[47,18],[48,18],
    [44,19],[45,19],[46,19],[47,19],[48,19],
    [45,20],[46,20],[47,20],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
  
  // Japan / Korea
  ...[
    [46,7],[47,7],
    [46,8],[47,8],
    [47,9],
  ].map(([c,r]) => ({ col: c, row: r, country: "OTHER" })),
];

const activeCountryData: Record<string, { name: string; sales: number; orders: number; color: string }> = {
  USA: { name: "United States", sales: 156789, orders: 12450, color: "0.7" },
  CAN: { name: "Canada", sales: 45678, orders: 3210, color: "0.45" },
  MEX: { name: "Mexico", sales: 23456, orders: 1890, color: "0.3" },
};

const HEX_SIZE = 7;
const HEX_GAP = 1.5;

function hexToPixel(col: number, row: number): { x: number; y: number } {
  const w = (HEX_SIZE * 2 + HEX_GAP);
  const h = (HEX_SIZE * Math.sqrt(3) + HEX_GAP);
  const x = col * w + (row % 2 === 1 ? w / 2 : 0);
  const y = row * h * 0.85;
  return { x: x + 20, y: y + 20 };
}

function hexPath(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return `M${points.join("L")}Z`;
}

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

  const hoveredData = hoveredCountry ? activeCountryData[hoveredCountry] : null;

  // Compute SVG viewBox based on hex positions
  const viewBox = useMemo(() => {
    let maxX = 0, maxY = 0;
    hexPoints.forEach(({ col, row }) => {
      const { x, y } = hexToPixel(col, row);
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });
    return `0 0 ${maxX + 40} ${maxY + 40}`;
  }, []);

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
        className="relative h-[400px] overflow-hidden rounded-lg bg-muted/5 border border-border select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <svg
          viewBox={viewBox}
          className="h-full w-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.2s ease",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {hexPoints.map(({ col, row, country }, i) => {
            const { x, y } = hexToPixel(col, row);
            const isActive = country in activeCountryData;
            const isSelected = selectedRegion === country;
            const isHovered = hoveredCountry === country;
            
            let fill: string;
            if (isActive) {
              const opacity = activeCountryData[country].color;
              fill = `hsl(var(--primary) / ${isHovered ? parseFloat(opacity) + 0.15 : opacity})`;
            } else {
              fill = "hsl(var(--muted-foreground) / 0.08)";
            }
            
            return (
              <path
                key={`${col}-${row}-${i}`}
                d={hexPath(x, y, HEX_SIZE)}
                fill={fill}
                stroke={isSelected ? "hsl(var(--primary))" : isActive ? "hsl(var(--primary) / 0.2)" : "transparent"}
                strokeWidth={isSelected ? 1.5 : 0.5}
                style={{ cursor: isActive ? "pointer" : "default" }}
                className="transition-all duration-150"
                onMouseEnter={() => isActive && setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={(e) => {
                  if (!isActive) return;
                  e.stopPropagation();
                  onRegionSelect?.(country);
                }}
              />
            );
          })}
        </svg>

        {/* Floating metric cards for active regions */}
        {Object.entries(activeCountryData).map(([code, data]) => {
          // Position cards near each country
          const positions: Record<string, { left: string; top: string }> = {
            USA: { left: "22%", top: "42%" },
            CAN: { left: "25%", top: "15%" },
            MEX: { left: "12%", top: "58%" },
          };
          const pos = positions[code];
          if (!pos) return null;
          
          return (
            <div
              key={code}
              className={`absolute rounded-md border bg-popover/95 backdrop-blur-sm px-2.5 py-1.5 shadow-sm transition-all duration-150 ${
                selectedRegion === code ? "border-primary ring-1 ring-primary/20" : "border-border"
              } ${hoveredCountry === code ? "scale-105" : ""}`}
              style={{ left: pos.left, top: pos.top, pointerEvents: "none" }}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-foreground">{data.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ${data.sales.toLocaleString()}
              </p>
            </div>
          );
        })}

        {/* Tooltip on hover */}
        {hoveredData && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-popover px-3 py-2 shadow-lg z-10">
            <p className="font-medium text-foreground text-sm">{hoveredData.name}</p>
            <p className="text-xs text-muted-foreground">Sales: ${hoveredData.sales.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Orders: {hoveredData.orders.toLocaleString()}</p>
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
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.08)" }} />
          <span className="text-[10px] text-muted-foreground">No data</span>
        </div>
      </div>
    </div>
  );
}
