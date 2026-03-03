import { useState, useEffect, useRef, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useDensity } from "@/contexts/DensityContext";
import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import { cn } from "@/lib/utils";
import { Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const CUSTOM_SHORTCUTS_KEY = "anarix-custom-shortcuts";

interface ShortcutDef {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  category: string;
  shortcuts: ShortcutDef[];
}

const defaultShortcuts: ShortcutCategory[] = [
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

function loadCustomShortcuts(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(CUSTOM_SHORTCUTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveCustomShortcuts(custom: Record<string, string[]>) {
  localStorage.setItem(CUSTOM_SHORTCUTS_KEY, JSON.stringify(custom));
}

function ShortcutRow({ shortcut, customKeys, onEdit, isEditing, onCaptured }: {
  shortcut: ShortcutDef;
  customKeys?: string[];
  onEdit: () => void;
  isEditing: boolean;
  onCaptured: (keys: string[]) => void;
}) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [captured, setCaptured] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) return;
    setCaptured([]);

    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const parts: string[] = [];
      if (e.metaKey || e.ctrlKey) parts.push("⌘");
      if (e.shiftKey) parts.push("Shift");
      if (e.altKey) parts.push("Alt");
      const key = e.key;
      if (!["Meta", "Control", "Shift", "Alt"].includes(key)) {
        parts.push(key.length === 1 ? key.toUpperCase() : key);
      }
      if (parts.length > 0 && !["Meta", "Control", "Shift", "Alt"].includes(e.key)) {
        setCaptured(parts);
        onCaptured(parts);
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [isEditing, onCaptured]);

  const displayKeys = customKeys || shortcut.keys;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 group">
      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div ref={captureRef} className="flex items-center gap-1 px-2 py-1 rounded border-2 border-primary bg-primary/5 animate-pulse">
            {captured.length > 0 ? captured.map((k, i) => (
              <kbd key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-medium">{k}</kbd>
            )) : (
              <span className="text-xs text-primary">Press keys...</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {displayKeys.map((key, i) => (
              <span key={i}>
                <kbd className={cn(
                  "px-2 py-1 rounded bg-muted text-xs font-mono font-medium",
                  customKeys && "bg-primary/10 text-primary"
                )}>{key}</kbd>
                {i < displayKeys.length - 1 && <span className="text-muted-foreground mx-0.5">+</span>}
              </span>
            ))}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function Preferences() {
  const { density, setDensity } = useDensity();
  const { effects, toggle } = useVisualEffects();
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, string[]>>(loadCustomShortcuts);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleCaptured = useCallback((desc: string, keys: string[]) => {
    const next = { ...customShortcuts, [desc]: keys };
    setCustomShortcuts(next);
    saveCustomShortcuts(next);
    setEditingKey(null);
    toast.success(`Shortcut updated for "${desc}"`);
  }, [customShortcuts]);

  const resetCategory = (category: string) => {
    const section = defaultShortcuts.find(s => s.category === category);
    if (!section) return;
    const next = { ...customShortcuts };
    section.shortcuts.forEach(s => delete next[s.description]);
    setCustomShortcuts(next);
    saveCustomShortcuts(next);
    toast.success(`${category} shortcuts reset to defaults`);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Preferences</h1>
          <p className="text-sm text-muted-foreground">Customize how Anarix looks and behaves</p>
        </div>

        <Separator />

        {/* Theme */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Theme</h2>
            <p className="text-sm text-muted-foreground">Select your preferred color scheme</p>
          </div>
          <ThemeSwitcher />
        </section>

        <Separator />

        {/* Display Density */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Display Density</h2>
            <p className="text-sm text-muted-foreground">Adjust how compact the interface appears</p>
          </div>
          <div className="flex gap-4">
            {(["comfortable", "compact"] as const).map(d => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={cn(
                  "flex-1 rounded-lg border-2 p-4 text-center transition-colors",
                  density === d ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                )}
              >
                <p className={cn("font-medium capitalize", density === d ? "text-primary" : "text-foreground")}>{d}</p>
                <p className="text-xs text-muted-foreground">{d === "comfortable" ? "Default spacing" : "More data visible"}</p>
              </button>
            ))}
          </div>
        </section>

        <Separator />

        {/* Keyboard Shortcuts */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground">
              Click <Pencil className="inline h-3 w-3" /> to rebind. Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">?</kbd> anywhere to see all shortcuts.
            </p>
          </div>
          <div className="space-y-6">
            {defaultShortcuts.map(section => (
              <div key={section.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">{section.category}</h3>
                  {section.shortcuts.some(s => customShortcuts[s.description]) && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => resetCategory(section.category)}>
                      <RotateCcw className="h-3 w-3 mr-1" />Reset
                    </Button>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
                  {section.shortcuts.map(shortcut => (
                    <ShortcutRow
                      key={shortcut.description}
                      shortcut={shortcut}
                      customKeys={customShortcuts[shortcut.description]}
                      isEditing={editingKey === shortcut.description}
                      onEdit={() => setEditingKey(editingKey === shortcut.description ? null : shortcut.description)}
                      onCaptured={(keys) => handleCaptured(shortcut.description, keys)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Visual Effects */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Visual Effects</h2>
            <p className="text-sm text-muted-foreground">Control animations and visual enhancements</p>
          </div>
          <div className="space-y-0 rounded-lg border border-border bg-card divide-y divide-border">
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Ambient Background</p>
                <p className="text-xs text-muted-foreground">Subtle animated dot pattern</p>
              </div>
              <Switch checked={effects.ambientBackground} onCheckedChange={() => toggle("ambientBackground")} />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Number Animations</p>
                <p className="text-xs text-muted-foreground">Smooth morphing transitions for metrics</p>
              </div>
              <Switch checked={effects.numberAnimations} onCheckedChange={() => toggle("numberAnimations")} />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Floating Action Island</p>
                <p className="text-xs text-muted-foreground">Quick actions bar at bottom</p>
              </div>
              <Switch checked={effects.floatingIsland} onCheckedChange={() => toggle("floatingIsland")} />
            </label>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
