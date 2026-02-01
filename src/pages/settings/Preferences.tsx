import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { useDensity } from "@/contexts/DensityContext";
import { cn } from "@/lib/utils";

const keyboardShortcuts = [
  { category: "Navigation", shortcuts: [
    { keys: ["⌘", "K"], description: "Open command palette" },
    { keys: ["?"], description: "Show all keyboard shortcuts" },
    { keys: ["G", "D"], description: "Go to Dashboard" },
    { keys: ["G", "A"], description: "Go to Advertising" },
    { keys: ["G", "S"], description: "Go to Settings" },
  ]},
  { category: "Tables", shortcuts: [
    { keys: ["J"], description: "Move down in table" },
    { keys: ["K"], description: "Move up in table" },
    { keys: ["Enter"], description: "Select/open row" },
    { keys: ["Esc"], description: "Deselect/close" },
    { keys: ["⌘", "A"], description: "Select all rows" },
  ]},
  { category: "Actions", shortcuts: [
    { keys: ["⌘", "S"], description: "Save changes" },
    { keys: ["⌘", "E"], description: "Export data" },
    { keys: ["⌘", "F"], description: "Search/filter" },
    { keys: ["⌘", "N"], description: "Create new item" },
    { keys: ["⌘", "\\"], description: "Toggle sidebar" },
  ]},
  { category: "AI (Aan)", shortcuts: [
    { keys: ["⌘", "J"], description: "Open Aan AI panel" },
    { keys: ["⌘", "Enter"], description: "Send message" },
    { keys: ["Esc"], description: "Close AI panel" },
  ]},
];

export default function Preferences() {
  const { density, setDensity } = useDensity();

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Preferences
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize how Anarix looks and behaves
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

        {/* Display Density */}
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
            <button
              onClick={() => setDensity("comfortable")}
              className={cn(
                "flex-1 rounded-lg border-2 p-4 text-center transition-colors",
                density === "comfortable"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <p className={cn("font-medium", density === "comfortable" ? "text-primary" : "text-foreground")}>
                Comfortable
              </p>
              <p className="text-xs text-muted-foreground">Default spacing</p>
            </button>
            <button
              onClick={() => setDensity("compact")}
              className={cn(
                "flex-1 rounded-lg border-2 p-4 text-center transition-colors",
                density === "compact"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <p className={cn("font-medium", density === "compact" ? "text-primary" : "text-foreground")}>
                Compact
              </p>
              <p className="text-xs text-muted-foreground">More data visible</p>
            </button>
          </div>
        </section>

        <Separator />

        {/* Keyboard Shortcuts */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">
              Keyboard Shortcuts
            </h2>
            <p className="text-sm text-muted-foreground">
              Quick actions to navigate and control Anarix. Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">?</kbd> anywhere to see all shortcuts.
            </p>
          </div>
          
          <div className="space-y-6">
            {keyboardShortcuts.map((section) => (
              <div key={section.category} className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{section.category}</h3>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  {section.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5",
                        index !== section.shortcuts.length - 1 && "border-b border-border"
                      )}
                    >
                      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i}>
                            <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono font-medium">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground mx-0.5">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Creative Features Toggle (placeholder for future) */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">
              Visual Effects
            </h2>
            <p className="text-sm text-muted-foreground">
              Control animations and visual enhancements
            </p>
          </div>
          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-foreground">Ambient Background</p>
                <p className="text-xs text-muted-foreground">Subtle animated dot pattern</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
            </label>
            <Separator />
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-foreground">Number Animations</p>
                <p className="text-xs text-muted-foreground">Smooth morphing transitions for metrics</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
            </label>
            <Separator />
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-foreground">Floating Action Island</p>
                <p className="text-xs text-muted-foreground">Quick actions bar at bottom</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
            </label>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
