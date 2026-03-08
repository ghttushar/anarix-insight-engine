import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, Globe } from "lucide-react";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";

export default function Configuration() {
  const [defaultMarketplace, setDefaultMarketplace] = useState("amazon");
  const [defaultDateRange, setDefaultDateRange] = useState("last30");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = "ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const { displayCurrency, setDisplayCurrency, exchangeRate, lastUpdated, currencyConfig } = useCurrency();

  const handleSave = () => toast.success("Configuration saved");

  const currencyList = Object.values(CURRENCIES);

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Configuration</h1>
          <p className="text-sm text-muted-foreground">System-wide defaults and integration settings</p>
        </div>
        <Separator />

        {/* Defaults */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">Defaults</h2>
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Default Marketplace</p><p className="text-xs text-muted-foreground">Applied when opening the app</p></div>
              <Select value={defaultMarketplace} onValueChange={setDefaultMarketplace}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="walmart">Walmart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Default Date Range</p><p className="text-xs text-muted-foreground">Initial date range for dashboards</p></div>
              <Select value={defaultDateRange} onValueChange={setDefaultDateRange}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        {/* Currency Display */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium text-foreground">Currency Display</h2>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Display Currency</p>
                <p className="text-xs text-muted-foreground">All monetary values across the app will be converted to this currency</p>
              </div>
              <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyList.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {displayCurrency !== "USD" && (
              <>
                <Separator />
                <div className="rounded-md bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground font-medium">Current Rate</span>
                    <span className="text-sm font-mono text-foreground">
                      1 USD = {exchangeRate.toFixed(2)} {displayCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last Updated</span>
                    <span className="text-xs text-muted-foreground">
                      {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Exchange rates are calculated according to international market rates in realtime.
                All underlying data is stored in the marketplace's base currency (USD).
                The conversion is for display purposes only and does not affect actual billing or reporting values.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">Notifications</h2>
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Email Notifications</p><p className="text-xs text-muted-foreground">Receive alerts via email</p></div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Slack Notifications</p><p className="text-xs text-muted-foreground">Send alerts to Slack channel</p></div>
              <Switch checked={slackNotifs} onCheckedChange={setSlackNotifs} />
            </div>
          </div>
        </section>

        <Separator />

        {/* API Keys */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">API Keys</h2>
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <p className="text-sm text-muted-foreground">Use this key to access the Anarix API programmatically.</p>
            <div className="flex gap-2">
              <Input readOnly value={showApiKey ? apiKey : "ak_live_••••••••••••••••••••••••••••"} className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(apiKey); toast.success("API key copied"); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <div className="flex justify-end"><Button onClick={handleSave}>Save Configuration</Button></div>
      </div>
    </AppLayout>
  );
}
