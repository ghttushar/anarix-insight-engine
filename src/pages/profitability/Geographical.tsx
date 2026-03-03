import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GeographyMap } from "@/components/profitability/GeographyMap";
import { RegionStatsPanel } from "@/components/profitability/RegionStatsPanel";
import { RegionalTable } from "@/components/tables/RegionalTable";
import { geographicalData } from "@/data/mockProfitability";
import { Lock } from "lucide-react";

const regionLookup: Record<string, typeof geographicalData[0]> = {
  US: geographicalData[0],
  CA: geographicalData[0].children?.[0] || geographicalData[0],
  TX: geographicalData[0].children?.[1] || geographicalData[0],
  NY: geographicalData[0].children?.[2] || geographicalData[0],
  FL: geographicalData[0].children?.[3] || geographicalData[0],
};

export default function Geographical() {
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("US");
  const selectedRegion = regionLookup[selectedRegionCode] || geographicalData[0];

  return (
    <AppLayout>
      <div className="space-y-6 relative">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Geographical Data</h1>
          <p className="text-sm text-muted-foreground">Regional performance breakdown across markets</p>
        </div>

        {/* Coming Soon Overlay */}
        <div className="relative">
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3 text-center max-w-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Coming Soon</h2>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon. The UI is ready but data is not yet active. 
                Geographic performance insights will be available in a future update.
              </p>
            </div>
          </div>

          <div className="pointer-events-none opacity-40">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GeographyMap
                  selectedRegion={selectedRegionCode}
                  onRegionSelect={() => {}}
                />
              </div>
              <div>
                <RegionStatsPanel
                  region={selectedRegion}
                  dateRange="Jan 1 - Jan 30, 2026"
                />
              </div>
            </div>
            <div className="mt-6">
              <RegionalTable data={geographicalData} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
