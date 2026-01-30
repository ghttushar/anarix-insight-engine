import { createContext, useContext, useState, ReactNode } from "react";

export type Marketplace = "walmart" | "amazon";

interface MarketplaceContextType {
  marketplace: Marketplace;
  setMarketplace: (marketplace: Marketplace) => void;
  isWalmart: boolean;
  isAmazon: boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceProviderProps {
  children: ReactNode;
  defaultMarketplace?: Marketplace;
}

export function MarketplaceProvider({ 
  children, 
  defaultMarketplace = "walmart" 
}: MarketplaceProviderProps) {
  const [marketplace, setMarketplace] = useState<Marketplace>(defaultMarketplace);

  const value: MarketplaceContextType = {
    marketplace,
    setMarketplace,
    isWalmart: marketplace === "walmart",
    isAmazon: marketplace === "amazon",
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
