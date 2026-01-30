import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";

export default function Appearance() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Appearance
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize how Anarix looks on your device
          </p>
        </div>

        <Separator />

        {/* Theme Section */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">
              Theme
            </h2>
            <p className="text-sm text-muted-foreground">
              Select your preferred color scheme
            </p>
          </div>
          <ThemeSwitcher />
        </section>

        <Separator />

        {/* Additional Settings Placeholder */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">
              Display Density
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust how compact the interface appears
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 rounded-lg border-2 border-primary bg-primary/5 p-4 text-center">
              <p className="font-medium text-primary">Comfortable</p>
              <p className="text-xs text-muted-foreground">Default spacing</p>
            </button>
            <button className="flex-1 rounded-lg border-2 border-border bg-card p-4 text-center hover:border-primary/50">
              <p className="font-medium text-foreground">Compact</p>
              <p className="text-xs text-muted-foreground">More data visible</p>
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
