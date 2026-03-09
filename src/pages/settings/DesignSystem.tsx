import { useState } from "react";
import { Check, Copy, Loader2, Search, ChevronDown, ArrowUp, ArrowDown, Info } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DesignSystem() {
  return (
    <AppLayout>
      <PageHeader
        title="Design System"
        subtitle="Complete documentation of all design elements, components, and patterns used in Anarix"
      />

      <div className="p-6 space-y-6">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="icons" disabled>Icons</TabsTrigger>
            <TabsTrigger value="states" disabled>States</TabsTrigger>
          </TabsList>

          {/* COLORS TAB */}
          <TabsContent value="colors" className="space-y-6 mt-6">
            <ColorSystemSection />
          </TabsContent>

          {/* TYPOGRAPHY TAB */}
          <TabsContent value="typography" className="space-y-6 mt-6">
            <TypographySection />
          </TabsContent>

          {/* SPACING TAB */}
          <TabsContent value="spacing" className="space-y-6 mt-6">
            <SpacingSection />
          </TabsContent>

          {/* COMPONENTS TAB */}
          <TabsContent value="components" className="space-y-6 mt-6">
            <ComponentsSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// ==================== COLOR SYSTEM SECTION ====================

function ColorSystemSection() {
  return (
    <>
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Periwinkle System 01 (Locked)</CardTitle>
          <CardDescription>
            The Anarix color system is deterministic and locked. 90-95% of the UI uses neutral colors,
            with 5-10% color maximum. Brand colors are reserved for primary actions and AI elements only.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Light Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Light Theme Colors</CardTitle>
          <CardDescription>Default color palette for light mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorSwatch
            name="Background"
            token="--background"
            hsl="230 33% 97%"
            hex="#F5F6FA"
            usage="App background, main canvas"
          />
          <ColorSwatch
            name="Foreground"
            token="--foreground"
            hsl="240 53% 9%"
            hex="#0F1020"
            usage="Primary text color"
          />
          <ColorSwatch
            name="Card"
            token="--card"
            hsl="0 0% 100%"
            hex="#FFFFFF"
            usage="Card backgrounds, panels, surfaces"
          />
          <ColorSwatch
            name="Muted Foreground"
            token="--muted-foreground"
            hsl="228 15% 46%"
            hex="#646A86"
            usage="Secondary text, labels, hints"
          />
          <ColorSwatch
            name="Secondary (Ink Blue)"
            token="--secondary"
            hsl="234 30% 24%"
            hex="#2A2D4F"
            usage="Dividers, outlines, borders"
          />
          <ColorSwatch
            name="Primary (Periwinkle)"
            token="--primary"
            hsl="229 65% 57%"
            hex="#4A62D9"
            usage="Primary actions, brand elements, CTAs"
          />
          <ColorSwatch
            name="Accent (Lilac)"
            token="--accent"
            hsl="231 74% 81%"
            hex="#A7AEF2"
            usage="Highlights, hover states (use sparingly)"
          />
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground font-medium">Data Visualization Colors (RESERVED)</div>
          <ColorSwatch
            name="Success (Green)"
            token="--success"
            hsl="142 71% 45%"
            hex="#22C55E"
            usage="Positive metrics, profit, success states"
            reserved
          />
          <ColorSwatch
            name="Destructive (Red)"
            token="--destructive"
            hsl="0 84% 60%"
            hex="#EF4444"
            usage="Negative metrics, loss, errors, delete actions"
            reserved
          />
          <ColorSwatch
            name="Warning (Amber)"
            token="--warning"
            hsl="38 92% 50%"
            hex="#F59E0B"
            usage="Warning states, out-of-budget indicators"
            reserved
          />
        </CardContent>
      </Card>

      {/* Dark Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Dark Theme Colors</CardTitle>
          <CardDescription>Color palette for dark mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorSwatch
            name="Background"
            token="--background"
            hsl="234 53% 9%"
            hex="#0E1020"
            usage="App background, main canvas"
            dark
          />
          <ColorSwatch
            name="Foreground"
            token="--foreground"
            hsl="240 100% 97%"
            hex="#ECEEFF"
            usage="Primary text color"
            dark
          />
          <ColorSwatch
            name="Card"
            token="--card"
            hsl="235 37% 14%"
            hex="#171A2E"
            usage="Card backgrounds, panels, surfaces"
            dark
          />
          <ColorSwatch
            name="Muted Foreground"
            token="--muted-foreground"
            hsl="230 29% 69%"
            hex="#9CA2C8"
            usage="Secondary text, labels, hints"
            dark
          />
          <ColorSwatch
            name="Secondary"
            token="--secondary"
            hsl="234 43% 32%"
            hex="#2F3470"
            usage="Dividers, outlines, borders"
            dark
          />
          <ColorSwatch
            name="Primary"
            token="--primary"
            hsl="231 88% 70%"
            hex="#6E82F5"
            usage="Primary actions, brand elements, CTAs"
            dark
          />
          <ColorSwatch
            name="Accent"
            token="--accent"
            hsl="231 100% 87%"
            hex="#B8BEFF"
            usage="Highlights, hover states (use sparingly)"
            dark
          />
        </CardContent>
      </Card>

      {/* Aan AI Gradient */}
      <Card>
        <CardHeader>
          <CardTitle>Aan AI Gradient (Restricted Use)</CardTitle>
          <CardDescription>
            This gradient is ONLY allowed in the Aan workspace and AI-related features.
            It must never appear in core analytics, reports, or data tables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-24 rounded-lg aan-gradient flex items-center justify-center">
            <span className="text-white font-heading text-2xl font-semibold">Aan Gradient</span>
          </div>
          <CodeBlock
            code={`/* CSS */
.aan-gradient {
  background: linear-gradient(
    90deg,
    hsl(var(--aan-gradient-start)) 0%,    /* #8B5CF6 Violet */
    hsl(var(--aan-gradient-mid)) 50%,     /* #6366F1 Indigo */
    hsl(var(--aan-gradient-end)) 100%     /* #3B82F6 Blue */
  );
}`}
          />
          <div className="text-sm text-muted-foreground">
            <strong>Allowed:</strong> AI headers, AI entry points, AI highlight outlines
            <br />
            <strong>Forbidden:</strong> Background fills, entire pages, core analytics, reports
          </div>
        </CardContent>
      </Card>

      {/* Usage Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Color Usage Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong className="text-foreground">✓ DO:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
              <li>Use semantic tokens (bg-primary, text-muted-foreground)</li>
              <li>Keep 90-95% of UI in neutral colors</li>
              <li>Reserve brand colors for primary actions only</li>
              <li>Use data viz colors exclusively for metrics</li>
            </ul>
          </div>
          <div>
            <strong className="text-destructive">✗ DON'T:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
              <li>Use hard-coded hex/RGB values in components</li>
              <li>Reuse data visualization colors for branding</li>
              <li>Apply gradients outside of Aan workspace</li>
              <li>Use accent color on text blocks or in tables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ==================== TYPOGRAPHY SECTION ====================

function TypographySection() {
  return (
    <>
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Typography System (Locked)</CardTitle>
          <CardDescription>
            Anarix uses three fonts: Satoshi Variable for headings, Noto Sans for body text,
            and Allura for Aan AI accents. All sizes and weights are locked.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Font Families */}
      <Card>
        <CardHeader>
          <CardTitle>Font Families</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-heading text-2xl">Satoshi Variable</span>
              <Badge variant="secondary">Headings</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Used for all headings (H1-H6), page titles, section headers, and card titles.
            </p>
            <CodeBlock code={`font-family: var(--font-heading); /* Satoshi Variable */`} />
          </div>

          <Separator />

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-body text-2xl">Noto Sans</span>
              <Badge variant="secondary">Body</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Primary body text, table content, labels, and all general UI text.
            </p>
            <CodeBlock code={`font-family: var(--font-body); /* Noto Sans */`} />
          </div>

          <Separator />

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-aan text-aan">Allura</span>
              <Badge variant="secondary">Aan Only</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Exclusively for Aan AI branding and accents. Never used in analytics or reports.
            </p>
            <CodeBlock code={`font-family: var(--font-aan); /* Allura */
font-size: 2rem; /* 32px - readable size */`} />
          </div>
        </CardContent>
      </Card>

      {/* Type Scale */}
      <Card>
        <CardHeader>
          <CardTitle>Type Scale</CardTitle>
          <CardDescription>Locked hierarchy for headings and body text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TypeScaleExample
            level="H1"
            size="32px"
            weight="600"
            usage="Page titles only"
            example="Campaign Manager"
          />
          <TypeScaleExample
            level="H2"
            size="24px"
            weight="600"
            usage="Section titles"
            example="Performance Overview"
          />
          <TypeScaleExample
            level="H3"
            size="18px"
            weight="500"
            usage="Subsection headers, card titles"
            example="Recent Activity"
          />
          <TypeScaleExample
            level="Body"
            size="14-16px"
            weight="400"
            usage="Primary text, table content, labels"
            example="This is body text used throughout the application."
          />
          <TypeScaleExample
            level="Meta"
            size="12px"
            weight="400"
            usage="Small labels, hints, timestamps"
            example="Last updated 2 hours ago"
          />
        </CardContent>
      </Card>

      {/* Typography Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong className="text-foreground">✓ DO:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
              <li>Use font-heading (Satoshi) for all H1-H6 elements</li>
              <li>Use font-body (Noto Sans) for body text and UI</li>
              <li>Maintain minimum 14px body text size</li>
              <li>Keep line-height between 1.2-1.5 for readability</li>
            </ul>
          </div>
          <div>
            <strong className="text-destructive">✗ DON'T:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
              <li>Center-align body text blocks</li>
              <li>Use decorative typography in analytics screens</li>
              <li>Use Allura outside of Aan workspace</li>
              <li>Mix font weights inconsistently</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ==================== SPACING SECTION ====================

function SpacingSection() {
  return (
    <>
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing & Layout System</CardTitle>
          <CardDescription>
            Spacing tokens, grid system, and density modes that control layout across the application.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Spacing Scale */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale (Tailwind)</CardTitle>
          <CardDescription>Base-4 spacing system used throughout the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SpacingExample value="0.5" pixels="2px" usage="Tight gaps between inline elements" />
          <SpacingExample value="1" pixels="4px" usage="Minimum spacing, compact layouts" />
          <SpacingExample value="2" pixels="8px" usage="Small gaps, icon padding" />
          <SpacingExample value="3" pixels="12px" usage="Form field gaps" />
          <SpacingExample value="4" pixels="16px" usage="Card padding (comfortable), section gaps" />
          <SpacingExample value="6" pixels="24px" usage="Large section spacing" />
          <SpacingExample value="8" pixels="32px" usage="Page-level vertical rhythm" />
        </CardContent>
      </Card>

      {/* Density Modes */}
      <Card>
        <CardHeader>
          <CardTitle>Density Modes</CardTitle>
          <CardDescription>Two density settings for different user preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-heading text-lg">Comfortable (Default)</span>
              <Badge>Default</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Row Height:</span>
                <span className="font-mono">44px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Padding:</span>
                <span className="font-mono">16px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Button Height:</span>
                <span className="font-mono">40px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Font Size:</span>
                <span className="font-mono">14px</span>
              </div>
            </div>
            <CodeBlock code={`/* CSS Custom Properties */
--spacing-base: 4px;
--row-height: 44px;
--card-padding: 16px;
--btn-height: 40px;`} className="mt-3" />
          </div>

          <Separator />

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-heading text-lg">Compact</span>
              <Badge variant="secondary">High Density</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Row Height:</span>
                <span className="font-mono">32px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Padding:</span>
                <span className="font-mono">12px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Button Height:</span>
                <span className="font-mono">36px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Font Size:</span>
                <span className="font-mono">13px</span>
              </div>
            </div>
            <CodeBlock code={`/* CSS Custom Properties */
--spacing-base: 2px;
--row-height: 32px;
--card-padding: 12px;
--btn-height: 36px;`} className="mt-3" />
          </div>
        </CardContent>
      </Card>

      {/* Layout Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Tokens</CardTitle>
          <CardDescription>Common layout patterns and their spacing values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">Page Gap</span>
              <span className="font-mono text-sm">1.5rem (24px)</span>
            </div>
            <p className="text-sm text-muted-foreground">Vertical spacing between major page sections</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">Section Gap</span>
              <span className="font-mono text-sm">1.5rem (24px)</span>
            </div>
            <p className="text-sm text-muted-foreground">Spacing between content sections within a page</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">Card Gap</span>
              <span className="font-mono text-sm">1rem (16px)</span>
            </div>
            <p className="text-sm text-muted-foreground">Spacing between cards in a grid or list</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">Border Radius</span>
              <span className="font-mono text-sm">8px (default)</span>
            </div>
            <p className="text-sm text-muted-foreground">Standard border radius for cards, buttons, inputs</p>
          </div>
        </CardContent>
      </Card>

      {/* Layout Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong className="text-foreground">✓ DO:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
              <li>Use density mode custom properties for spacing</li>
              <li>Maintain consistent spacing within density contexts</li>
              <li>Use semantic spacing tokens (space-y-6, gap-4)</li>
              <li>Respect density mode when building new components</li>
            </ul>
          </div>
          <div>
            <strong className="text-destructive">✗ DON'T:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
              <li>Hard-code pixel values that ignore density modes</li>
              <li>Mix spacing scales inconsistently</li>
              <li>Override density properties without justification</li>
              <li>Change layout structure based on theme (light/dark)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ==================== HELPER COMPONENTS ====================

interface ColorSwatchProps {
  name: string;
  token: string;
  hsl: string;
  hex: string;
  usage: string;
  reserved?: boolean;
  dark?: boolean;
}

function ColorSwatch({ name, token, hsl, hex, usage, reserved, dark }: ColorSwatchProps) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg border">
      <div
        className={cn("w-16 h-16 rounded-md border flex-shrink-0", dark && "ring-1 ring-white/20")}
        style={{ backgroundColor: `hsl(${hsl})` }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium">{name}</span>
          {reserved && (
            <Badge variant="destructive" className="text-xs">
              RESERVED
            </Badge>
          )}
        </div>
        <div className="text-sm space-y-0.5 text-muted-foreground">
          <div className="font-mono text-xs">{token}</div>
          <div className="flex gap-3">
            <span className="font-mono">HSL: {hsl}</span>
            <span className="font-mono">{hex}</span>
          </div>
          <div className="text-xs mt-1">{usage}</div>
        </div>
      </div>
    </div>
  );
}

interface TypeScaleExampleProps {
  level: string;
  size: string;
  weight: string;
  usage: string;
  example: string;
}

function TypeScaleExample({ level, size, weight, usage, example }: TypeScaleExampleProps) {
  const sizeMap: Record<string, string> = {
    "32px": "text-[32px]",
    "24px": "text-2xl",
    "18px": "text-lg",
    "14-16px": "text-base",
    "12px": "text-xs",
  };

  const weightMap: Record<string, string> = {
    "600": "font-semibold",
    "500": "font-medium",
    "400": "font-normal",
  };

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex items-baseline justify-between">
        <Badge variant="outline">{level}</Badge>
        <div className="text-xs text-muted-foreground font-mono">
          {size} / {weight}
        </div>
      </div>
      <div className={cn(sizeMap[size], weightMap[weight], level !== "Body" && level !== "Meta" && "font-heading")}>
        {example}
      </div>
      <p className="text-sm text-muted-foreground">{usage}</p>
    </div>
  );
}

interface SpacingExampleProps {
  value: string;
  pixels: string;
  usage: string;
}

function SpacingExample({ value, pixels, usage }: SpacingExampleProps) {
  const widthPx = parseInt(pixels);
  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
      <div className="flex items-center gap-2 w-32">
        <div className="w-12 h-12 border rounded flex items-center justify-center bg-muted/30">
          <div className="bg-primary rounded" style={{ width: `${widthPx}px`, height: "32px" }} />
        </div>
        <div className="text-sm">
          <div className="font-mono font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{pixels}</div>
        </div>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">{usage}</div>
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  className?: string;
}

function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto border">
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
