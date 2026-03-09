import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Chip, ChipGroup } from "@/components/ui/chip";
import { CircularProgress } from "@/components/ui/circular-progress";
import { KPICard } from "@/components/cards/KPICard";
import { KPICardsRow } from "@/components/cards/KPICardsRow";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { TableSkeleton, CardSkeleton, ChartSkeleton, MetricSkeleton } from "@/components/ui/loading-skeletons";
import { AanLogo } from "@/components/aan/AanLogo";
import { ArtifactCard } from "@/components/aan/ArtifactCard";
import { 
  AlertCircle, AlertTriangle, Info, CheckCircle, CheckCircle2, XCircle, Home, 
  Plus, Edit, Trash2, Download, Bold, Italic, Underline, Filter, Columns,
  Calendar as CalendarIcon, User, Mail, X, Settings, Search, Send, Loader2,
  Sparkles, RefreshCw, Camera, Lightbulb, Maximize2, SlidersHorizontal,
  ChevronDown, Eye, EyeOff, BarChart3, FileText, Zap, Store, ArrowRight,
  Check, ArrowUpDown
} from "lucide-react";

export default function ComponentLibrary() {
  return (
    <AppLayout>
      <PageHeader
        title="Component Library"
        subtitle="Static Figma-ready reference — all states visible, no interactions required"
      />

      <div className="p-6">
        {/* Force light theme for entire showcase */}
        <div className="light bg-background text-foreground rounded-lg border p-6">
          <ComponentShowcase />
        </div>
      </div>
    </AppLayout>
  );
}

function ComponentShowcase() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      
      {/* ==================== TYPOGRAPHY ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Heading 1 (32px, 600)</h1>
          <h2 className="text-2xl font-semibold text-foreground">Heading 2 (24px, 600)</h2>
          <h3 className="text-xl font-medium text-foreground">Heading 3 (18px, 500)</h3>
          <p className="text-base text-foreground">Body text paragraph (14-16px, 400)</p>
          <p className="text-sm text-muted-foreground">Meta/Secondary text (12px, muted)</p>
        </div>
      </section>

      {/* ==================== BUTTONS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Buttons</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Variants</Label>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sizes</Label>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Disabled State</Label>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Primary Disabled</Button>
            <Button variant="secondary" disabled>Secondary Disabled</Button>
            <Button variant="outline" disabled>Outline Disabled</Button>
            <Button variant="destructive" disabled>Destructive Disabled</Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">With Icons</Label>
          <div className="flex flex-wrap gap-3">
            <Button><Plus className="h-4 w-4 mr-2" />Create New</Button>
            <Button variant="secondary"><Edit className="h-4 w-4 mr-2" />Edit</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          </div>
        </div>
      </section>

      {/* ==================== TOGGLE & TOGGLE GROUP ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Toggle & Toggle Group</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Single Toggles (Default / Pressed)</Label>
          <div className="flex flex-wrap gap-3">
            <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Toggle italic" data-state="on" className="bg-accent"><Italic className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Toggle underline" disabled><Underline className="h-4 w-4" /></Toggle>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Toggle Group</Label>
          <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold"><Bold className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic"><Italic className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline"><Underline className="h-4 w-4" /></ToggleGroupItem>
          </ToggleGroup>
        </div>
      </section>

      {/* ==================== FORM CONTROLS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Form Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inputs */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Input — Default</Label>
            <Input placeholder="Placeholder text..." />
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Input — Filled</Label>
            <Input defaultValue="Filled value" />
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Input — Error</Label>
            <Input defaultValue="Invalid input" className="border-destructive focus-visible:ring-destructive" />
            <p className="text-xs text-destructive">This field is required</p>
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Input — Disabled</Label>
            <Input placeholder="Disabled" disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Textarea */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Textarea — Default</Label>
            <Textarea placeholder="Enter longer text..." rows={3} />
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Textarea — Disabled</Label>
            <Textarea placeholder="Disabled textarea" rows={3} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select — Default</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
                <SelectItem value="3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select — Disabled</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
            </Select>
          </div>
        </div>

        {/* Checkbox States */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Checkbox States</Label>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="cb-unchecked" />
              <Label htmlFor="cb-unchecked">Unchecked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cb-checked" defaultChecked />
              <Label htmlFor="cb-checked">Checked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cb-disabled" disabled />
              <Label htmlFor="cb-disabled" className="text-muted-foreground">Disabled Unchecked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cb-disabled-checked" disabled defaultChecked />
              <Label htmlFor="cb-disabled-checked" className="text-muted-foreground">Disabled Checked</Label>
            </div>
          </div>
        </div>

        {/* Switch States */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Switch States</Label>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch id="sw-off" />
              <Label htmlFor="sw-off">Off</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sw-on" defaultChecked />
              <Label htmlFor="sw-on">On</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sw-disabled" disabled />
              <Label htmlFor="sw-disabled" className="text-muted-foreground">Disabled</Label>
            </div>
          </div>
        </div>

        {/* Radio Group */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Radio Group</Label>
          <RadioGroup defaultValue="option-2">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-2" id="r2" />
                <Label htmlFor="r2">Option 2 (Selected)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-3" id="r3" />
                <Label htmlFor="r3">Option 3</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Slider */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Slider (Static at 50%)</Label>
          <Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" />
        </div>

        {/* Calendar */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Calendar</Label>
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border w-fit"
          />
        </div>
      </section>

      {/* ==================== BADGES & CHIPS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Badges & Chips</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Badge Variants</Label>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status Badges</Label>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="live" />
            <StatusBadge status="paused" />
            <StatusBadge status="scheduled" />
            <StatusBadge status="archived" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Delta Badges</Label>
          <div className="flex flex-wrap gap-2">
            <DeltaBadge value={12.5} />
            <DeltaBadge value={-8.3} />
            <DeltaBadge value={0} />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Chips</Label>
          <ChipGroup>
            <Chip variant="default">Default Chip</Chip>
            <Chip variant="primary">Primary Chip</Chip>
            <Chip variant="success">Success Chip</Chip>
            <Chip variant="warning">Warning Chip</Chip>
            <Chip variant="destructive">Error Chip</Chip>
            <Chip variant="primary" removable onRemove={() => {}}>Removable</Chip>
          </ChipGroup>
        </div>
      </section>

      {/* ==================== KPI CARDS (APP COMPONENT) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">KPI Cards</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Individual KPI Cards (Different States)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Revenue" value={125000} previousValue={100000} format="currency" />
            <KPICard label="Ad Spend" value={45000} previousValue={50000} format="currency" />
            <KPICard label="ROAS" value={2.78} previousValue={2.78} format="decimal" />
            <KPICard label="Impressions" value={1250000} previousValue={1100000} format="number" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">KPI Cards Row</Label>
          <KPICardsRow data={[
            { label: "Revenue", value: 125000, previousValue: 100000, format: "currency", trend: "up" },
            { label: "Orders", value: 4523, previousValue: 4200, format: "number", trend: "up" },
            { label: "Conversion Rate", value: 3.25, previousValue: 2.89, format: "percentage", trend: "up" },
            { label: "AOV", value: 27.64, previousValue: 28.10, format: "currency", trend: "down" },
          ]} />
        </div>
      </section>

      {/* ==================== INLINE KPI STRIP (APP COMPONENT) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Inline KPI Strip</h2>
        <InlineKPIStrip items={[
          { label: "Spend", value: 45200, previousValue: 42000, format: "currency", accentColor: "primary" },
          { label: "Sales", value: 125400, previousValue: 118000, format: "currency", accentColor: "success" },
          { label: "ROAS", value: 2.77, previousValue: 2.81, format: "decimal", accentColor: "warning" },
          { label: "TACoS", value: 8.5, previousValue: 9.2, format: "percentage", accentColor: "accent" },
        ]} />
      </section>

      {/* ==================== UNDERLINE TABS (APP COMPONENT) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Underline Tabs</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Active: "All Campaigns"</Label>
          <UnderlineTabs 
            tabs={[
              { value: "all", label: "All Campaigns", count: 124 },
              { value: "active", label: "Active", count: 89 },
              { value: "paused", label: "Paused", count: 35 },
            ]}
            value="all"
            onChange={() => {}}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Active: "Paused"</Label>
          <UnderlineTabs 
            tabs={[
              { value: "all", label: "All Campaigns", count: 124 },
              { value: "active", label: "Active", count: 89 },
              { value: "paused", label: "Paused", count: 35 },
            ]}
            value="paused"
            onChange={() => {}}
          />
        </div>
      </section>

      {/* ==================== DATA DISPLAY ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Data Display</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Separator</Label>
          <div className="space-y-2">
            <p className="text-sm text-foreground">Content above separator</p>
            <Separator />
            <p className="text-sm text-foreground">Content below separator</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Avatars</Label>
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Progress Bar (66%)</Label>
          <Progress value={66} className="w-[300px]" />
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Circular Progress</Label>
          <div className="flex gap-4">
            <CircularProgress progress={25} label="Started" />
            <CircularProgress progress={50} label="Halfway" />
            <CircularProgress progress={75} label="Almost" />
            <CircularProgress progress={100} label="Complete" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Skeleton Loading (No Animation)</Label>
          <div className="space-y-2 w-[300px]">
            <Skeleton className="h-4 w-full animate-none" />
            <Skeleton className="h-4 w-3/4 animate-none" />
            <Skeleton className="h-4 w-1/2 animate-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Table Skeleton</Label>
            <TableSkeleton rows={3} columns={3} className="[&_*]:animate-none" />
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Card Skeleton</Label>
            <CardSkeleton hasFooter className="[&_*]:animate-none" />
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Chart Skeleton</Label>
            <ChartSkeleton type="bar" className="[&_*]:animate-none" />
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Metric Skeleton</Label>
            <MetricSkeleton className="[&_*]:animate-none" />
          </div>
        </div>
      </section>

      {/* ==================== ALERTS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Alerts</h2>
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Informational alert message.</AlertDescription>
          </Alert>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Operation completed successfully.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>An error occurred during the operation.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* ==================== CARDS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Minimal Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Card with title only, no description or footer.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>With title and description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">Card content area with standard layout.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Full Card</CardTitle>
              <CardDescription>With all elements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">Card with header, content, and footer.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ==================== TABLE ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">Delta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Summer Sale Campaign</TableCell>
              <TableCell><StatusBadge status="live" /></TableCell>
              <TableCell className="text-right">$5,000</TableCell>
              <TableCell className="text-right">125,400</TableCell>
              <TableCell className="text-right">2,450</TableCell>
              <TableCell className="text-right">3.24</TableCell>
              <TableCell className="text-right"><DeltaBadge value={12.5} /></TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-medium">Brand Awareness (Selected)</TableCell>
              <TableCell><StatusBadge status="live" /></TableCell>
              <TableCell className="text-right">$3,200</TableCell>
              <TableCell className="text-right">89,200</TableCell>
              <TableCell className="text-right">1,890</TableCell>
              <TableCell className="text-right">2.87</TableCell>
              <TableCell className="text-right"><DeltaBadge value={-5.2} /></TableCell>
            </TableRow>
            <TableRow className="opacity-50">
              <TableCell className="font-medium">Winter Promo (Disabled)</TableCell>
              <TableCell><StatusBadge status="paused" /></TableCell>
              <TableCell className="text-right">$2,500</TableCell>
              <TableCell className="text-right">45,600</TableCell>
              <TableCell className="text-right">980</TableCell>
              <TableCell className="text-right">2.12</TableCell>
              <TableCell className="text-right"><DeltaBadge value={0} /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Product Launch</TableCell>
              <TableCell><StatusBadge status="scheduled" /></TableCell>
              <TableCell className="text-right">$8,000</TableCell>
              <TableCell className="text-right">—</TableCell>
              <TableCell className="text-right">—</TableCell>
              <TableCell className="text-right">—</TableCell>
              <TableCell className="text-right">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Q4 Clearance</TableCell>
              <TableCell><StatusBadge status="archived" /></TableCell>
              <TableCell className="text-right">$4,500</TableCell>
              <TableCell className="text-right">234,500</TableCell>
              <TableCell className="text-right">5,670</TableCell>
              <TableCell className="text-right">4.12</TableCell>
              <TableCell className="text-right"><DeltaBadge value={28.3} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* ==================== NAVIGATION ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Navigation</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Breadcrumb</Label>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Component Library</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tabs (All Panels Visible)</Label>
          <div className="space-y-4">
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1 (Active)</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-medium text-muted-foreground mb-1">Tab 1 Content</p>
                <p className="text-sm">Content for the first tab panel.</p>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-medium text-muted-foreground mb-1">Tab 2 Content</p>
                <p className="text-sm">Content for the second tab panel.</p>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-medium text-muted-foreground mb-1">Tab 3 Content</p>
                <p className="text-sm">Content for the third tab panel.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Accordion (All Expanded)</Label>
          <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion Item 1</AccordionTrigger>
              <AccordionContent>Content for the first accordion item is always visible.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Accordion Item 2</AccordionTrigger>
              <AccordionContent>Content for the second accordion item is always visible.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pagination</Label>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Menubar</Label>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Help</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>
      </section>

      {/* ==================== OVERLAYS (STATIC ANATOMY) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Overlays (Static Anatomy)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tooltip */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tooltip</Label>
            <div className="relative inline-block">
              <Button variant="outline">Hover target</Button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
                Tooltip content
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-popover" />
              </div>
            </div>
          </div>

          {/* Popover */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Popover</Label>
            <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-md w-72">
              <h4 className="font-medium">Popover Title</h4>
              <p className="text-sm text-muted-foreground mt-1">Popover content goes here with additional details.</p>
            </div>
          </div>

          {/* HoverCard */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hover Card</Label>
            <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-md w-80">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarFallback>HC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Hover Card Title</h4>
                  <p className="text-sm text-muted-foreground">Additional information appears on hover.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dialog */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Dialog</Label>
            <div className="rounded-lg border bg-background p-6 shadow-lg w-full max-w-md relative">
              <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold leading-none tracking-tight">Dialog Title</h3>
                <p className="text-sm text-muted-foreground">This is a dialog description explaining the purpose.</p>
              </div>
              <div className="py-4">
                <p className="text-sm">Dialog content goes here.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </div>
            </div>
          </div>

          {/* AlertDialog */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Alert Dialog</Label>
            <div className="rounded-lg border bg-background p-6 shadow-lg w-full max-w-md">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold leading-none tracking-tight">Are you sure?</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone. This will permanently delete the data.</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </div>

          {/* Sheet (Side Panel) */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sheet (Side Panel)</Label>
            <div className="border-l-4 border-l-border bg-background p-6 shadow-lg w-80">
              <div className="space-y-1.5 mb-4">
                <h3 className="text-lg font-semibold">Sheet Title</h3>
                <p className="text-sm text-muted-foreground">Sheet slides in from the side.</p>
              </div>
              <p className="text-sm">Sheet content goes here with forms or details.</p>
            </div>
          </div>

          {/* Drawer (Bottom Panel) */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Drawer (Bottom Panel)</Label>
            <div className="rounded-t-lg border bg-background">
              <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
              <div className="p-6">
                <div className="space-y-1.5 mb-4">
                  <h3 className="text-lg font-semibold">Drawer Title</h3>
                  <p className="text-sm text-muted-foreground">Drawer slides up from bottom.</p>
                </div>
                <p className="text-sm">Drawer content goes here.</p>
              </div>
            </div>
          </div>

          {/* Dropdown Menu (Open State) */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Dropdown Menu (Open)</Label>
            <div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-48">
              <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
              <Separator className="my-1" />
              <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer">Profile</div>
              <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer">Settings</div>
              <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer">Logout</div>
            </div>
          </div>

          {/* Context Menu (Open State) */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Context Menu (Open)</Label>
            <div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-48">
              <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </div>
              <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer flex items-center gap-2">
                <Download className="h-4 w-4" /> Duplicate
              </div>
              <Separator className="my-1" />
              <div className="px-2 py-1.5 text-sm text-destructive hover:bg-accent rounded cursor-pointer flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </div>
            </div>
          </div>

          {/* Command Palette (Open State) */}
          <div className="space-y-3 md:col-span-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Command Palette (Open)</Label>
            <Command className="rounded-lg border shadow-md w-full max-w-md">
              <CommandInput placeholder="Search commands..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </CommandItem>
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </CommandItem>
                  <CommandItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </section>

      {/* ==================== LAYOUT ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Layout</h2>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Collapsible (Content Always Visible)</Label>
          <div className="border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-medium">Collapsible Header</span>
              <Button variant="ghost" size="sm">Toggle</Button>
            </div>
            <div className="p-4">
              <p className="text-sm">This collapsible content is always visible for screenshot purposes.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scroll Area</Label>
          <ScrollArea className="h-[120px] w-full rounded-md border p-4">
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </ScrollArea>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Resizable Panels</Label>
          <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex h-[100px] items-center justify-center p-6">
                <span className="font-semibold">Panel 1</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex h-[100px] items-center justify-center p-6">
                <span className="font-semibold">Panel 2</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      {/* ==================== AAN BRAND ELEMENTS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Aan — Brand Elements</h2>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Aan Logo Variants</Label>
          <div className="flex flex-wrap items-center gap-6">
            <AanLogo />
            <AanLogo showByAnarix={false} />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Artifact Cards</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ArtifactCard
              artifact={{ id: "a1", type: "report", title: "Last 7 Days Performance", description: "Amazon • Campaign overview with data visualizations", changes: [{ field: "ROAS", before: "2.8x", after: "3.4x" }], status: "pending" }}
              onClick={() => {}}
            />
            <ArtifactCard
              artifact={{ id: "a2", type: "audit", title: "Account Health Audit", description: "Health Score: 78/100 • 23 issues found", changes: [{ field: "Wasted Spend", before: "N/A", after: "$2,341" }, { field: "Issues", before: "0", after: "23" }], status: "approved" }}
              onClick={() => {}}
            />
            <ArtifactCard
              artifact={{ id: "a3", type: "bid_change", title: "Keyword Bid Optimization", description: "Increase bids on 3 high-performing keywords", changes: [{ field: "wireless earbuds", before: "$1.35", after: "$1.65" }], status: "editing" }}
              onClick={() => {}}
            />
          </div>
        </div>
      </section>

      {/* ==================== AAN COPILOT PANEL (STATIC ANATOMY) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Aan Copilot Panel — Static Anatomy</h2>
        <div className="flex gap-6 flex-wrap">
          {/* Full panel mockup */}
          <div className="w-[420px] border border-border rounded-lg flex flex-col bg-background shadow-lg overflow-hidden" style={{ height: 560 }}>
            {/* Header */}
            <div className="border-b border-border shrink-0">
              <div className="flex items-center justify-between px-4 py-4">
                <AanLogo />
                <div className="flex items-center gap-1">
                  <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Context bar */}
              <div className="flex items-center gap-4 border-t border-border/50 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Context:</span>
                  <span>Campaign Manager</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Last 30 days</span>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-hidden p-4 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-sm">
                  Analyze my top campaigns by ROAS
                </div>
              </div>
              {/* Assistant message */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] text-sm space-y-1">
                  <p className="font-medium text-foreground">Top 3 by ROAS this period:</p>
                  <p className="text-muted-foreground">• SP | Bamboo 8" Queen — <span className="text-success font-medium">6.01x</span></p>
                  <p className="text-muted-foreground">• SB | Bed in a Box — <span className="text-success font-medium">5.89x</span></p>
                  <p className="text-muted-foreground">• SP | Memory Foam — <span className="text-warning font-medium">3.24x</span></p>
                </div>
              </div>
              {/* Artifact card inside chat */}
              <div className="ml-11">
                <ArtifactCard
                  artifact={{ id: "chat-a1", type: "report", title: "ROAS Analysis Report", description: "7-day breakdown across 12 campaigns", changes: [{ field: "Top ROAS", before: "N/A", after: "6.01x" }], status: "pending" }}
                  onClick={() => {}}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border bg-background p-4 shrink-0">
              <div className="flex gap-2">
                <div className="flex-1 min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground flex items-center">
                  Ask Aan anything...
                </div>
                <button className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">Aan explains reasoning and creates drafts for your approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INSIGHTS PANEL (STATIC ANATOMY) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Insights Panel — Static Anatomy</h2>
        <div className="w-[420px] border border-border rounded-lg flex flex-col bg-background shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-border shrink-0">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold text-foreground">Insights</h2>
                  <p className="text-xs text-muted-foreground">6 active insights</p>
                </div>
              </div>
              <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Summary pills */}
            <div className="flex items-center gap-2 border-t border-border/50 bg-muted/30 px-4 py-2">
              <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="font-medium text-destructive">2</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs">
                <AlertCircle className="h-3 w-3 text-warning" />
                <span className="font-medium text-warning">3</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span className="font-medium text-success">1</span>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Critical */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Critical Alerts</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="text-sm font-medium text-foreground">Budget cap reached on 3 campaigns</p>
                  <p className="text-xs text-muted-foreground mt-0.5">SP | Bamboo | Queen, SB | Mattress, SP | Pillow are paused due to daily budget limits.</p>
                  <button className="mt-2 text-xs text-destructive flex items-center gap-1">Increase Budget <ArrowRight className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
            {/* Attention */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold text-warning">Worth a Look</span>
              </div>
              <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                <p className="text-sm font-medium text-foreground">TACoS increased 2.1% vs last week</p>
                <p className="text-xs text-muted-foreground mt-0.5">Organic sales dipped while ad spend held steady.</p>
              </div>
            </div>
            {/* Positive */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">Wins & Highlights</span>
              </div>
              <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                <p className="text-sm font-medium text-foreground">ROAS up 18% this week</p>
                <p className="text-xs text-muted-foreground mt-0.5">Best week in the last 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FLOATING ACTION ISLAND ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Floating Action Island — Static Anatomy</h2>

        <div className="space-y-6">
          {/* Collapsed state */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Collapsed (Compact)</Label>
            <div className="inline-flex items-center gap-2 bg-card/95 border border-border rounded-full px-4 py-2 shadow-md">
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Sparkles className="h-4 w-4" />
                </button>
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-destructive hover:bg-accent">
                  <Lightbulb className="h-4 w-4" />
                </button>
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Download className="h-4 w-4" />
                </button>
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded state */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Expanded (Hover State)</Label>
            <div className="inline-flex items-center gap-2 bg-card/95 border border-border rounded-full px-2 py-2 shadow-md">
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                {[
                  { icon: Sparkles, label: "Ask Aan", highlight: false },
                  { icon: Lightbulb, label: "Insights (2)", highlight: true },
                  { icon: RefreshCw, label: "Refresh", highlight: false },
                  { icon: Download, label: "Export", highlight: false },
                  { icon: Camera, label: "Screenshot", highlight: false },
                ].map(({ icon: Icon, label, highlight }) => (
                  <button key={label} className={`h-8 px-3 rounded-full flex items-center gap-2 text-sm ${highlight ? "text-destructive" : "text-muted-foreground"} hover:bg-accent`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
              <div className="pl-2 border-l border-border">
                <span className="text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘K</kbd>
                </span>
              </div>
            </div>
          </div>

          {/* Hidden / Reopen state */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hidden / Reopen Button</Label>
            <button className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 border border-primary/30 bg-card shadow-md">
              <Sparkles className="h-4 w-4 aan-gradient-text" />
              <span className="text-sm font-medium text-foreground">Actions</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== INPUT FORM & FIELDS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Input Form — Field Anatomy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard field */}
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Standard Field</Label>
            <div className="space-y-1.5">
              <Label htmlFor="field-std">Campaign Name</Label>
              <Input id="field-std" placeholder="e.g. SP | Bamboo | Q4" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="field-email" className="pl-9" placeholder="you@company.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-pass">Password</Label>
              <div className="relative">
                <Input id="field-pass" type="password" defaultValue="password123" className="pr-9" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-err">Budget <span className="text-destructive">*</span></Label>
              <Input id="field-err" defaultValue="abc" className="border-destructive focus-visible:ring-destructive" />
              <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Must be a valid number</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-hint">Daily Budget</Label>
              <Input id="field-hint" defaultValue="500" />
              <p className="text-xs text-muted-foreground">Set the maximum daily spend in USD</p>
            </div>
          </div>

          {/* Full form block */}
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Form (Create Campaign)</Label>
            <div className="border border-border rounded-lg p-5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">New Campaign</h3>
                <p className="text-sm text-muted-foreground">Fill in the details to create a Sponsored Products campaign.</p>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label>Campaign Name</Label>
                <Input defaultValue="SP | Bamboo | Summer Sale" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Campaign Type</Label>
                  <Select defaultValue="sp">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sp">Sponsored Products</SelectItem>
                      <SelectItem value="sb">Sponsored Brands</SelectItem>
                      <SelectItem value="sd">Sponsored Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Targeting</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Daily Budget</Label>
                  <Input defaultValue="500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Default Bid</Label>
                  <Input defaultValue="1.25" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea rows={2} placeholder="Optional campaign notes..." />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Campaign</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ONBOARDING FORM ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Onboarding Form — Static Anatomy</h2>

        <div className="max-w-2xl">
          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 2 ? "bg-primary text-primary-foreground" : step < 2 ? "bg-success text-white" : "bg-muted text-muted-foreground"}`}>
                  {step < 2 ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 4 && <div className={`h-px w-12 ${step < 2 ? "bg-success" : "bg-border"}`} />}
              </div>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">Step 2 of 4 — Connect Account</span>
          </div>

          <div className="border border-border rounded-xl p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Connect Your Accounts</h2>
              <p className="text-muted-foreground mt-1">Link your Amazon or Walmart seller accounts to start optimizing.</p>
            </div>

            {/* Connected account card */}
            <div className="rounded-xl border border-border bg-card p-5 relative">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600">
                  <Store className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">My Amazon Store</h3>
                  <p className="text-xs text-muted-foreground">amazon • seller</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </div>
            </div>

            {/* Add account dashed card */}
            <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-5 flex flex-col items-center justify-center gap-3 min-h-[120px] text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Add Account</span>
            </div>

            {/* Marketplace selection modal (inline) */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Marketplace Selector (Modal)</Label>
              <div className="border border-border rounded-lg p-5 bg-background shadow-md max-w-sm">
                <h3 className="text-base font-semibold mb-4">Choose Marketplace</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center gap-3 p-5 rounded-xl border border-primary bg-primary/5">
                    <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                      <Store className="h-7 w-7 text-orange-600" />
                    </div>
                    <span className="font-medium text-sm text-foreground">Amazon</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border">
                    <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <Store className="h-7 w-7 text-blue-600" />
                    </div>
                    <span className="font-medium text-sm text-foreground">Walmart</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline">Skip for now</Button>
              <Button>Continue to Dashboard</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DROPDOWN MENUS (ALL VARIANTS) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Dropdown Menus — All Variants</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Standard dropdown */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Standard Dropdown Menu</Label>
            <div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-52">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">My Account</div>
              <Separator className="my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <User className="h-4 w-4" /> Profile
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded bg-accent cursor-pointer">
                <Mail className="h-4 w-4" /> Notifications <Badge className="ml-auto h-4 px-1 text-[10px]">3</Badge>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive rounded hover:bg-accent cursor-pointer">
                <X className="h-4 w-4" /> Log out
              </div>
            </div>
          </div>

          {/* Action menu with icons + shortcut */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Action Menu (with Shortcuts)</Label>
            <div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-52">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <Edit className="h-4 w-4" /> Edit
                <span className="ml-auto text-xs text-muted-foreground">⌘E</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <Download className="h-4 w-4" /> Duplicate
                <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <Eye className="h-4 w-4" /> View Details
              </div>
              <Separator className="my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground rounded hover:bg-accent cursor-pointer opacity-50">
                <EyeOff className="h-4 w-4" /> Archive <span className="ml-auto text-xs">Disabled</span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive rounded hover:bg-accent cursor-pointer">
                <Trash2 className="h-4 w-4" /> Delete
                <span className="ml-auto text-xs text-muted-foreground">⌫</span>
              </div>
            </div>
          </div>

          {/* Select menu with checkmarks */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select / Checkmark Menu</Label>
            <div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-52">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Marketplace</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded bg-accent cursor-pointer">
                <Check className="h-4 w-4 text-primary" /> Amazon
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <span className="h-4 w-4" /> Walmart
              </div>
              <Separator className="my-1" />
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Ad Type</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded bg-accent cursor-pointer">
                <Check className="h-4 w-4 text-primary" /> All Types
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <span className="h-4 w-4" /> Sponsored Products
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer">
                <span className="h-4 w-4" /> Sponsored Brands
              </div>
            </div>
          </div>

          {/* Filters menu */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Filters Menu</Label>
            <div className="rounded-lg border bg-popover p-4 text-popover-foreground shadow-md w-72 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</span>
                <button className="text-xs text-primary hover:underline">Clear all</button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="flex flex-wrap gap-1.5">
                  {["Live", "Paused", "Scheduled", "Archived"].map((s) => (
                    <button key={s} className={`text-xs px-2.5 py-1 rounded-full border ${s === "Live" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">ROAS Range</Label>
                <div className="flex items-center gap-2">
                  <Input className="h-8 text-sm" placeholder="Min" defaultValue="1.0" />
                  <span className="text-muted-foreground text-xs">to</span>
                  <Input className="h-8 text-sm" placeholder="Max" defaultValue="10.0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Campaign Type</Label>
                <div className="space-y-1.5">
                  {["Sponsored Products", "Sponsored Brands", "Sponsored Display"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <Checkbox id={`ft-${t}`} defaultChecked={t === "Sponsored Products"} />
                      <Label htmlFor={`ft-${t}`} className="text-sm font-normal">{t}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">Cancel</Button>
                <Button size="sm" className="flex-1">Apply Filters</Button>
              </div>
            </div>
          </div>

          {/* Column visibility menu */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Column Visibility Menu</Label>
            <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md w-56 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Columns className="h-4 w-4" /> Columns</span>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input className="h-7 pl-7 text-xs" placeholder="Search columns..." />
              </div>
              <div className="flex gap-1.5">
                <button className="text-xs text-primary hover:underline">Select all</button>
                <span className="text-muted-foreground">·</span>
                <button className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Campaign Name", visible: true, locked: true },
                  { label: "Status", visible: true, locked: false },
                  { label: "Budget", visible: true, locked: false },
                  { label: "Impressions", visible: true, locked: false },
                  { label: "Clicks", visible: false, locked: false },
                  { label: "CTR", visible: false, locked: false },
                  { label: "ROAS", visible: true, locked: false },
                  { label: "ACoS", visible: false, locked: false },
                ].map(({ label, visible, locked }) => (
                  <div key={label} className={`flex items-center justify-between rounded px-2 py-1 ${visible ? "bg-muted/50" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Checkbox defaultChecked={visible} disabled={locked} />
                      <span className="text-xs text-foreground">{label}</span>
                    </div>
                    {locked && <span className="text-[10px] text-muted-foreground">locked</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DataTable toolbar strip */}
          <div className="space-y-2 md:col-span-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">DataTable Toolbar</Label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8 h-8 text-sm" placeholder="Search campaigns..." />
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                {/* Active filter chips */}
                <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2.5 py-1 border border-primary/20">
                  Status: Live
                  <button className="ml-1 hover:text-primary"><X className="h-3 w-3" /></button>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filters <span className="bg-primary text-primary-foreground rounded-full h-4 w-4 text-[10px] flex items-center justify-center">1</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Columns className="h-3.5 w-3.5" /> Columns
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== RIGHT SIDE PANEL (GENERIC ANATOMY) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Right Side Panel — Static Anatomy</h2>

        <div className="flex gap-6 flex-wrap">
          {/* Product Detail Panel mockup */}
          <div className="w-[380px] border border-border rounded-lg flex flex-col bg-background shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Product Detail</h3>
                <p className="text-xs text-muted-foreground">B08XYZ12AB • ASIN Detail View</p>
              </div>
              <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Store className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Bamboo Shredded Memory Foam Pillow</p>
                  <p className="text-xs text-muted-foreground mt-0.5">B08XYZ12AB • Queen Size</p>
                  <StatusBadge status="live" />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Revenue", value: "$12,450", delta: 14.2 },
                  { label: "ROAS", value: "3.84x", delta: 8.1 },
                  { label: "Ad Spend", value: "$3,240", delta: -2.3 },
                  { label: "TACoS", value: "8.2%", delta: -1.1 },
                ].map(({ label, value, delta }) => (
                  <div key={label} className="rounded-md bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-base font-semibold text-foreground">{value}</p>
                    <DeltaBadge value={delta} />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Top Keywords</p>
                {["bamboo pillow queen", "shredded foam pillow", "cooling pillow"].map((kw) => (
                  <div key={kw} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{kw}</span>
                    <DeltaBadge value={Math.random() > 0.5 ? 5.2 : -3.1} />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border px-4 py-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">View Campaigns</Button>
              <Button size="sm" className="flex-1">Edit COGS</Button>
            </div>
          </div>

          {/* Generic sheet / side panel */}
          <div className="w-[360px] border border-border rounded-lg flex flex-col bg-background shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Schedule Editor</h3>
              <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Bid Adjustment (%)</Label>
                <Input defaultValue="25" />
              </div>
              <div className="space-y-1.5">
                <Label>Days Active</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <button key={d} className={`h-8 px-3 rounded-md text-xs font-medium border ${["Mon","Tue","Wed","Thu","Fri"].includes(d) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Time Window</Label>
                <div className="flex items-center gap-2">
                  <Select defaultValue="9">
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground text-sm">to</span>
                  <Select defaultValue="17">
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription className="text-xs">Bid adjustments apply only within the selected time window.</AlertDescription>
              </Alert>
            </div>
            <div className="border-t border-border px-4 py-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Cancel</Button>
              <Button size="sm" className="flex-1">Save Schedule</Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
