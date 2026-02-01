import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingBag, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logoFull from "@/assets/logo-full.png";
import { useAccounts } from "@/contexts/AccountContext";

// Amazon logo
const AmazonLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.128.076.122.063.249-.04.378-.104.13-.257.267-.46.413-.94.68-1.97 1.298-3.09 1.853-.904.448-1.868.82-2.893 1.118-1.025.297-2.052.5-3.08.606-.335.034-.67.054-1.004.063-.334.01-.668.008-1.001-.003-1.024-.032-2.044-.15-3.062-.352-1.018-.203-2.02-.488-3.004-.855a16.735 16.735 0 01-2.81-1.345 14.72 14.72 0 01-1.105-.72c-.085-.063-.137-.124-.155-.186-.018-.062.015-.12.099-.174l.041-.028zm8.06-2.098c-.075-.096-.16-.17-.257-.22a1.353 1.353 0 00-.333-.126c-.12-.028-.244-.037-.373-.028-.128.01-.254.042-.378.096-.124.054-.247.125-.37.215-.122.09-.237.196-.345.32-.1.115-.192.252-.273.41-.082.158-.147.327-.196.506-.05.18-.073.366-.073.558 0 .192.023.378.068.558.046.18.115.348.207.503.092.156.202.294.33.415.128.121.27.22.426.296.156.076.32.131.492.165.172.034.348.042.528.024.18-.017.356-.058.528-.123.172-.065.337-.153.493-.264.157-.111.3-.243.43-.396.129-.153.239-.324.33-.513.08-.173.145-.361.195-.564.05-.202.075-.413.075-.632 0-.22-.025-.433-.075-.638-.05-.206-.115-.398-.195-.577-.082-.186-.186-.355-.313-.507-.126-.152-.27-.282-.43-.39-.16-.107-.334-.19-.521-.247-.187-.057-.38-.086-.58-.086h-.127l-.01.001c-.252.013-.492.07-.72.17-.227.1-.43.24-.61.42l-.068.068-.044-.1-.03-.073c-.082-.204-.09-.424-.024-.66l.017-.052c.087-.224.232-.404.435-.54.134-.09.281-.157.443-.202.162-.045.333-.07.513-.073a2.01 2.01 0 01.54.05c.177.041.347.104.51.19.163.086.312.193.447.32.136.128.248.273.337.435.09.162.152.335.186.519.035.184.04.373.016.567-.023.194-.076.382-.158.564-.08.177-.19.343-.327.498-.137.155-.294.29-.472.405-.178.115-.372.207-.582.276-.21.07-.427.112-.653.127v.007c-.215.017-.428 0-.637-.05-.21-.05-.404-.128-.582-.232-.178-.104-.334-.233-.468-.387-.134-.154-.24-.326-.318-.517-.078-.19-.12-.39-.126-.6-.006-.21.026-.415.095-.615.07-.2.174-.38.314-.542.14-.16.31-.293.51-.398.2-.105.42-.175.66-.21l.07-.01z"/>
  </svg>
);

// Walmart logo
const WalmartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

export default function ConnectAccounts() {
  const navigate = useNavigate();
  const { accounts, addAccount, completeOnboarding, hasAccounts } = useAccounts();
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);

  const handleSelectMarketplace = (marketplace: "amazon" | "walmart") => {
    setShowMarketplaceModal(false);
    navigate(`/settings/accounts/connect/${marketplace}`);
  };

  const handleContinue = () => {
    completeOnboarding();
    navigate("/profitability/dashboard");
  };

  const handleSkip = () => {
    // Add a demo account for demo purposes
    addAccount({
      marketplace: "walmart",
      accountType: "seller",
      merchantName: "Nadia's Organics",
      merchantId: "DEMO123",
      region: "US",
      status: "connected",
      lastSync: new Date().toISOString(),
      bidAutomation: "ai",
    });
    completeOnboarding();
    navigate("/profitability/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <img src={logoFull} alt="Anarix" className="h-8 w-auto" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-heading font-semibold text-foreground mb-3">
              Connect Your Accounts
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Link your Amazon or Walmart seller accounts to start optimizing your advertising performance.
            </p>
          </div>

          {/* Account cards grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Connected accounts */}
            {accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-xl border border-border bg-card p-5 relative"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    account.marketplace === "amazon" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {account.marketplace === "amazon" ? (
                      <Store className="h-5 w-5" />
                    ) : (
                      <WalmartLogo className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{account.merchantName}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{account.marketplace} • {account.accountType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </div>
            ))}

            {/* Add Account card */}
            <button
              onClick={() => setShowMarketplaceModal(true)}
              className={cn(
                "rounded-xl border-2 border-dashed border-border bg-card/50 p-5",
                "flex flex-col items-center justify-center gap-3 min-h-[140px]",
                "text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card",
                "transition-all duration-200"
              )}
            >
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Add Account</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button onClick={handleContinue} disabled={!hasAccounts}>
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </main>

      {/* Marketplace Selection Modal */}
      <Dialog open={showMarketplaceModal} onOpenChange={setShowMarketplaceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Marketplace</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => handleSelectMarketplace("amazon")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border border-border",
                "hover:border-primary hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Store className="h-8 w-8 text-orange-600" />
              </div>
              <span className="font-medium text-foreground">Amazon</span>
            </button>
            
            <button
              onClick={() => handleSelectMarketplace("walmart")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border border-border",
                "hover:border-primary hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <WalmartLogo className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-medium text-foreground">Walmart</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
