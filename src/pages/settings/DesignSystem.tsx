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

// ==================== COMPONENTS SECTION ====================

function ComponentsSection() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  
  return (
    <>
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Component Library</CardTitle>
          <CardDescription>
            Complete documentation of all UI components with live interactive examples,
            code snippets, and usage guidelines. Every component follows the locked design system.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ========== BUTTONS ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>All button variants with states and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Primary Button */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h4 className="font-heading text-lg font-semibold">Primary Button</h4>
              <Badge>Default Variant</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Used for main irreversible actions, confirmations, and primary CTAs.
              Background uses <code className="text-xs bg-muted px-1 py-0.5 rounded">bg-primary</code>.
            </p>
            
            {/* Live Examples */}
            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">Default</Button>
                  <Button variant="default" disabled>Disabled</Button>
                  <Button 
                    variant="default" 
                    onClick={() => {
                      setButtonLoading(true);
                      setTimeout(() => setButtonLoading(false), 2000);
                    }}
                    disabled={buttonLoading}
                  >
                    {buttonLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {buttonLoading ? "Loading..." : "Click to Load"}
                  </Button>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default" size="sm">Small</Button>
                  <Button variant="default" size="default">Default</Button>
                  <Button variant="default" size="lg">Large</Button>
                  <Button variant="default" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CodeBlock code={`import { Button } from "@/components/ui/button";

// Basic usage
<Button variant="default">Primary Action</Button>

// With loading state
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
  {isLoading ? "Saving..." : "Save Changes"}
</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><SearchIcon /></Button>`} />

            <PropsTable rows={[
              { prop: "variant", type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', default: '"default"' },
              { prop: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"' },
              { prop: "disabled", type: "boolean", default: "false" },
              { prop: "asChild", type: "boolean", default: "false" },
            ]} />
          </div>

          <Separator className="my-8" />

          {/* Secondary Button */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h4 className="font-heading text-lg font-semibold">Secondary Button (Outline)</h4>
              <Badge variant="outline">Outline Variant</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Safe actions, navigation, cancel operations. Uses transparent background with border.
            </p>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="outline">Cancel</Button>
                <Button variant="outline" disabled>Disabled</Button>
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="lg">Large</Button>
              </div>
            </div>

            <CodeBlock code={`<Button variant="outline">Cancel</Button>
<Button variant="outline" size="sm">Back</Button>`} />
          </div>

          <Separator className="my-8" />

          {/* Destructive Button */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h4 className="font-heading text-lg font-semibold">Destructive Button</h4>
              <Badge variant="destructive">RESERVED Color</Badge>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Uses data visualization red. Requires confirmation modal for all destructive actions.
              </AlertDescription>
            </Alert>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="destructive">Delete Campaign</Button>
                <Button variant="destructive" disabled>Disabled</Button>
                <Button variant="destructive" size="sm">Remove</Button>
              </div>
            </div>

            <CodeBlock code={`// Destructive actions MUST have confirmation
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    {/* Confirmation dialog */}
  </AlertDialogContent>
</AlertDialog>`} />
          </div>

          <Separator className="my-8" />

          {/* Ghost & Link Buttons */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Ghost & Link Buttons</h4>
            
            <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="ghost" disabled>Disabled</Button>
                <Button variant="ghost" size="sm">Small</Button>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="link">Link Button</Button>
                <Button variant="link" disabled>Disabled</Button>
                <Button variant="link" size="sm">Small</Button>
              </div>
            </div>

            <CodeBlock code={`<Button variant="ghost">Ghost (subtle hover)</Button>
<Button variant="link">Link (underline on hover)</Button>`} />
          </div>

        </CardContent>
      </Card>

      {/* ========== FORM ELEMENTS ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Inputs, selects, checkboxes, switches, and labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Input */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Input</h4>
            <p className="text-sm text-muted-foreground">
              Text input with focus ring, error states, and disabled styling.
              Height: <code className="text-xs bg-muted px-1 py-0.5 rounded">40px</code> (comfortable mode).
            </p>

            <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Default Input</Label>
                  <Input type="text" placeholder="Enter campaign name..." />
                </div>
                
                <div className="space-y-2">
                  <Label>With Error</Label>
                  <Input 
                    type="text" 
                    placeholder="Required field" 
                    className="border-destructive focus-visible:ring-destructive"
                  />
                  <p className="text-xs text-destructive">This field is required</p>
                </div>

                <div className="space-y-2">
                  <Label>Disabled</Label>
                  <Input type="text" placeholder="Disabled input" disabled />
                </div>

                <div className="space-y-2">
                  <Label>With Icon</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search..." className="pl-9" />
                  </div>
                </div>
              </div>
            </div>

            <CodeBlock code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Basic input
<div className="space-y-2">
  <Label>Campaign Name</Label>
  <Input type="text" placeholder="Enter name..." />
</div>

// Error state
<Input 
  className="border-destructive focus-visible:ring-destructive"
/>
<p className="text-xs text-destructive">Error message</p>

// With icon
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input placeholder="Search..." className="pl-9" />
</div>`} />
          </div>

          <Separator className="my-8" />

          {/* Textarea */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Textarea</h4>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter detailed description..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Disabled</Label>
                  <Textarea placeholder="Disabled textarea" disabled rows={3} />
                </div>
              </div>
            </div>

            <CodeBlock code={`import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Enter description..." rows={4} />`} />
          </div>

          <Separator className="my-8" />

          {/* Select */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Select / Dropdown</h4>
            <p className="text-sm text-muted-foreground">
              Searchable if &gt;5 options. Max height: 240px (scrollable).
            </p>

            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Marketplace</Label>
                  <Select value={selectValue} onValueChange={setSelectValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marketplace..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="walmart">Walmart</SelectItem>
                      <SelectItem value="target">Target</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Disabled</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Disabled select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Option 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <CodeBlock code={`import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`} />
          </div>

          <Separator className="my-8" />

          {/* Checkbox */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Checkbox</h4>

            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={checkboxChecked}
                    onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    Accept terms and conditions
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled" disabled />
                  <Label htmlFor="disabled" className="opacity-50">
                    Disabled checkbox
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="checked-disabled" checked disabled />
                  <Label htmlFor="checked-disabled" className="opacity-50">
                    Checked and disabled
                  </Label>
                </div>
              </div>
            </div>

            <CodeBlock code={`import { Checkbox } from "@/components/ui/checkbox";

<div className="flex items-center space-x-2">
  <Checkbox 
    id="terms" 
    checked={checked}
    onCheckedChange={setChecked}
  />
  <Label htmlFor="terms">Accept terms</Label>
</div>`} />
          </div>

          <Separator className="my-8" />

          {/* Switch */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Switch / Toggle</h4>
            <p className="text-sm text-muted-foreground">
              Enable/disable binary options. Instant UI feedback. Backend execution after Save.
            </p>

            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <Label>Enable notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive email alerts</p>
                  </div>
                  <Switch 
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between max-w-md opacity-50">
                  <div>
                    <Label>Disabled switch</Label>
                    <p className="text-xs text-muted-foreground">Cannot be toggled</p>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </div>

            <CodeBlock code={`import { Switch } from "@/components/ui/switch";

<div className="flex items-center justify-between">
  <Label>Enable notifications</Label>
  <Switch 
    checked={enabled}
    onCheckedChange={setEnabled}
  />
</div>`} />
          </div>

        </CardContent>
      </Card>

      {/* ========== DATA DISPLAY ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Data Display Components</CardTitle>
          <CardDescription>Cards, badges, tables, and delta indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Card */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Card</h4>
            <p className="text-sm text-muted-foreground">
              Primary container for grouped content. Background: <code className="text-xs bg-muted px-1 py-0.5 rounded">bg-card</code>.
              Padding: 16px (comfortable) / 12px (compact).
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>Card with header only</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the card content area. Use for displaying grouped information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>Includes action buttons</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Content goes here.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">Cancel</Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
            </div>

            <CodeBlock code={`import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>`} />
          </div>

          <Separator className="my-8" />

          {/* Badge */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Badge</h4>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <CodeBlock code={`import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>`} />
          </div>

          <Separator className="my-8" />

          {/* Status Badge */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Status Badge</h4>
            <p className="text-sm text-muted-foreground">
              Campaign and entity status indicators with tooltips. Colors are locked per status type.
            </p>

            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="flex flex-wrap gap-3 items-center">
                <StatusBadge status="live" />
                <StatusBadge status="paused" />
                <StatusBadge status="archived" />
                <StatusBadge status="scheduled" />
                <StatusBadge status="out_of_budget" />
                <StatusBadge status="completed" />
              </div>
            </div>

            <CodeBlock code={`import { StatusBadge } from "@/components/status/StatusBadge";

<StatusBadge status="live" />
<StatusBadge status="paused" />
<StatusBadge status="out_of_budget" />

// Available statuses:
// "live" | "paused" | "archived" | "scheduled" | "out_of_budget" | "completed"`} />
          </div>

          <Separator className="my-8" />

          {/* Delta Badge */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Delta Badge</h4>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Uses RESERVED data viz colors (green=positive, red=negative). Never use for non-metric purposes.
              </AlertDescription>
            </Alert>

            <div className="p-6 border rounded-lg bg-muted/30">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="text-center">
                  <div className="text-2xl font-semibold font-heading mb-1">$12,450</div>
                  <DeltaBadge value={15.3} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold font-heading mb-1">$8,230</div>
                  <DeltaBadge value={-8.7} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold font-heading mb-1">$10,000</div>
                  <DeltaBadge value={0} />
                </div>
              </div>
            </div>

            <CodeBlock code={`import { DeltaBadge } from "@/components/ui/delta-badge";

// Shows percentage change with up/down arrow
<DeltaBadge value={15.3} />  // Green, +15.3%
<DeltaBadge value={-8.7} />  // Red, -8.7%
<DeltaBadge value={0} />     // Hidden (returns null)`} />
          </div>

          <Separator className="my-8" />

          {/* Table */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Table</h4>
            <p className="text-sm text-muted-foreground">
              Primary data surface. Row height: 44px (comfortable) / 32px (compact).
              Fixed header, scrollable body, sticky first column.
            </p>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Campaign</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Brand Campaign A</TableCell>
                    <TableCell className="text-right">124,532</TableCell>
                    <TableCell className="text-right">$2,450.00</TableCell>
                    <TableCell className="text-right">4.2x</TableCell>
                    <TableCell><StatusBadge status="live" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Product Launch B</TableCell>
                    <TableCell className="text-right">89,230</TableCell>
                    <TableCell className="text-right">$1,850.00</TableCell>
                    <TableCell className="text-right">3.8x</TableCell>
                    <TableCell><StatusBadge status="paused" /></TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="font-medium">Retargeting C (Hover)</TableCell>
                    <TableCell className="text-right">45,120</TableCell>
                    <TableCell className="text-right">$980.00</TableCell>
                    <TableCell className="text-right">5.1x</TableCell>
                    <TableCell><StatusBadge status="out_of_budget" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <CodeBlock code={`import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Campaign</TableHead>
      <TableHead className="text-right">Spend</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">Campaign A</TableCell>
      <TableCell className="text-right">$2,450</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Rules:
// - Numeric values: text-right alignment
// - Black text for all numbers (never colored)
// - Performance changes via DeltaBadge only`} />
          </div>

        </CardContent>
      </Card>

      {/* ========== LAYOUT COMPONENTS ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Components</CardTitle>
          <CardDescription>Structural components for page layout and navigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Layout components are structural and not meant to be directly copied.
              Refer to existing pages for implementation patterns.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-1">AppLayout</div>
              <p className="text-muted-foreground">
                Main layout wrapper with sidebar. All pages must wrap content in <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;AppLayout&gt;</code>.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-1">PageHeader</div>
              <p className="text-muted-foreground">
                Standard page header with title, subtitle, and optional breadcrumbs.
                Positioned at top of page content.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-1">Sidebar</div>
              <p className="text-muted-foreground">
                Collapsible navigation sidebar. Expanded/collapsed states. Auto-collapses when right panels open.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-1">AppTaskbar</div>
              <p className="text-muted-foreground">
                Universal controls (Ad Type, Frequency, Date Range, Marketplace) below page heading.
                Consistent positioning across all data pages.
              </p>
            </div>
          </div>

          <CodeBlock code={`// Typical page structure
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";

export default function MyPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Page Title"
        subtitle="Page description"
      />
      
      <div className="p-6 space-y-6">
        {/* Page content */}
      </div>
    </AppLayout>
  );
}`} />

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
