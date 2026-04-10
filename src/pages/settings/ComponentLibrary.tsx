import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
import { SortableTableHead, usePinning } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageFooterBar } from "@/components/layout/PageFooterBar";
import { 
  AlertCircle, AlertTriangle, Info, CheckCircle, CheckCircle2, XCircle, Home, 
  Plus, Edit, Trash2, Download, Bold, Italic, Underline, Filter, Columns,
  Calendar as CalendarIcon, User, Mail, X, Settings, Search, Send, Loader2,
  Sparkles, RefreshCw, Lightbulb, Maximize2, SlidersHorizontal,
  ChevronDown, ChevronRight, Eye, EyeOff, BarChart3, FileText, Zap, Store, ArrowRight,
  Check, ArrowUpDown, ArrowUp, ArrowDown, Pin, Sun, Moon, Upload, Bell, Clock,
  Play, PanelLeft, LayoutDashboard, ShoppingCart, Target, Package, DollarSign,
  TrendingUp, Megaphone, BarChart2, Layers, BookOpen, Wrench
} from "lucide-react";


const breadcrumbItems = [
  { label: "Settings", href: "/settings/component-library" },
  { label: "Component Library" },
];
export default function ComponentLibrary() {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme') || 'light';

  return (
    <AppLayout>
      <PageHeader
        title="Component Library"
        subtitle="Static Figma-ready reference — all states visible, no interactions required"
      />

      <div className="p-6">
        {/* Theme URL Switcher */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium text-muted-foreground">Screenshot Mode:</span>
          <Link to="/settings/component-library?theme=light">
            <Button 
              variant={theme === 'light' ? 'default' : 'outline'} 
              size="sm"
              className="gap-2"
            >
              <Sun className="h-4 w-4" />
              Light Mode
            </Button>
          </Link>
          <Link to="/settings/component-library?theme=dark">
            <Button 
              variant={theme === 'dark' ? 'default' : 'outline'} 
              size="sm"
              className="gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark Mode
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground ml-auto">
            Current: <code className="bg-muted px-1.5 py-0.5 rounded">?theme={theme}</code>
          </span>
        </div>

        {/* Theme wrapper based on URL param */}
        <div className={`${theme === 'dark' ? 'dark' : 'light'} bg-background text-foreground rounded-lg border p-6`}>
          <ComponentShowcase />
        </div>
      </div>
    
      <PageFooterBar breadcrumbItems={breadcrumbItems} />
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
        <p className="text-xs text-muted-foreground">Persistent hub with border-primary/60 blue border. Contains Ask Aan, Insights, Refresh + separated bell icon. Export and Screenshot have been removed.</p>

        <div className="space-y-6">
          {/* Collapsed state */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Collapsed (Compact)</Label>
            <div className="inline-flex items-center gap-2 bg-card/95 border border-primary/60 rounded-full px-4 py-2 shadow-md">
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                <button className="h-8 px-2 rounded-full flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs">Ask Aan</span>
                </button>
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Lightbulb className="h-4 w-4" />
                </button>
                <button className="h-8 px-2 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="pl-2 border-l border-border">
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Bell className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded state */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Expanded (Hover State)</Label>
            <div className="inline-flex items-center gap-2 bg-card/95 border border-primary/60 rounded-full px-2 py-2 shadow-md">
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                {[
                  { icon: Sparkles, label: "Ask Aan", highlight: false },
                  { icon: Lightbulb, label: "Insights (2)", highlight: true },
                  { icon: RefreshCw, label: "Refresh", highlight: false },
                ].map(({ icon: Icon, label, highlight }) => (
                  <button key={label} className={`h-8 px-3 rounded-full flex items-center gap-2 text-sm ${highlight ? "text-destructive" : "text-muted-foreground"} hover:bg-accent`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
              <div className="pl-2 border-l border-border">
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Bell className="h-4 w-4" />
                </button>
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

      {/* ==================== CHART COMPONENTS (STATIC ANATOMY) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Chart Components — Static Anatomy</h2>
        
        {/* Performance Chart mockup */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Performance Chart (Line/Area/Bar)</Label>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Chart header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Performance Overview</h3>
                <p className="text-xs text-muted-foreground">Last 30 days • Updated 2 min ago</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Chart type buttons */}
                <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5">
                  <button className="h-7 px-2.5 rounded text-xs font-medium bg-background text-foreground shadow-sm">Line</button>
                  <button className="h-7 px-2.5 rounded text-xs font-medium text-muted-foreground">Area</button>
                  <button className="h-7 px-2.5 rounded text-xs font-medium text-muted-foreground">Bar</button>
                </div>
                <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* Metric toggles */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
              {[
                { label: "Spend", color: "bg-primary", active: true },
                { label: "Revenue", color: "bg-success", active: true },
                { label: "ROAS", color: "bg-warning", active: false },
                { label: "Impressions", color: "bg-accent", active: false },
              ].map(({ label, color, active }) => (
                <button key={label} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${active ? "border-border bg-background" : "border-transparent text-muted-foreground"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${color} ${!active ? "opacity-40" : ""}`} />
                  {label}
                </button>
              ))}
            </div>
            {/* Chart area (static SVG representation) */}
            <div className="p-4 h-[280px] relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-4 bottom-8 w-12 flex flex-col justify-between text-[10px] text-muted-foreground">
                <span>$50k</span>
                <span>$40k</span>
                <span>$30k</span>
                <span>$20k</span>
                <span>$10k</span>
                <span>$0</span>
              </div>
              {/* Chart grid and lines */}
              <div className="ml-12 mr-8 h-full flex flex-col">
                <div className="flex-1 relative border-l border-b border-border">
                  {/* Grid lines */}
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="absolute left-0 right-0 border-t border-border/50" style={{ top: `${i * 16.67}%` }} />
                  ))}
                  {/* Spend line (primary) */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      points="0,180 50,160 100,170 150,140 200,120 250,130 300,100 350,80 400,90 450,70 500,50 550,60 600,40"
                    />
                    {/* Dots */}
                    {[180,160,170,140,120,130,100,80,90,70,50,60,40].map((y, i) => (
                      <circle key={i} cx={i * 50} cy={y} r="3" fill="hsl(var(--primary))" />
                    ))}
                  </svg>
                  {/* Revenue line (success) */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="hsl(var(--success))"
                      strokeWidth="2"
                      points="0,160 50,140 100,150 150,120 200,100 250,110 300,80 350,60 400,70 450,50 500,30 550,40 600,20"
                    />
                    {[160,140,150,120,100,110,80,60,70,50,30,40,20].map((y, i) => (
                      <circle key={i} cx={i * 50} cy={y} r="3" fill="hsl(var(--success))" />
                    ))}
                  </svg>
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  {["Jan 1", "Jan 5", "Jan 9", "Jan 13", "Jan 17", "Jan 21", "Jan 25", "Jan 30"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
              {/* Right Y-axis for ROAS */}
              <div className="absolute right-0 top-4 bottom-8 w-8 flex flex-col justify-between text-[10px] text-muted-foreground text-right">
                <span>5x</span>
                <span>4x</span>
                <span>3x</span>
                <span>2x</span>
                <span>1x</span>
                <span>0</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-border bg-muted/10 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-foreground">Spend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-success" />
                <span className="text-foreground">Revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOV Stacked Area Chart mockup */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Share of Voice Chart (Stacked Area)</Label>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Chart header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Share of Voice Trend</h3>
                <p className="text-xs text-muted-foreground">Keyword: "bamboo pillow" • Last 7 days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5">
                  <button className="h-7 px-2.5 rounded text-xs font-medium text-muted-foreground">Line</button>
                  <button className="h-7 px-2.5 rounded text-xs font-medium bg-background text-foreground shadow-sm">Area</button>
                  <button className="h-7 px-2.5 rounded text-xs font-medium text-muted-foreground">Bar</button>
                </div>
              </div>
            </div>
            {/* Brand toggles */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
              {[
                { label: "Your Brand", color: "bg-primary", active: true },
                { label: "Competitor A", color: "bg-success", active: true },
                { label: "Competitor B", color: "bg-warning", active: true },
                { label: "Others", color: "bg-muted-foreground", active: true },
              ].map(({ label, color, active }) => (
                <button key={label} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${active ? "border-border bg-background" : "border-transparent text-muted-foreground"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  {label}
                </button>
              ))}
            </div>
            {/* Stacked area chart (static SVG) */}
            <div className="p-4 h-[280px] relative">
              <div className="absolute left-0 top-4 bottom-8 w-10 flex flex-col justify-between text-[10px] text-muted-foreground">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className="ml-10 h-full flex flex-col">
                <div className="flex-1 relative border-l border-b border-border overflow-hidden">
                  {/* Static stacked area representation */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Others (bottom layer) */}
                    <polygon fill="hsl(var(--muted-foreground))" fillOpacity="0.3" points="0,100 10,100 20,100 30,100 40,100 50,100 60,100 70,100 80,100 90,100 100,100 100,85 90,82 80,80 70,83 60,85 50,82 40,80 30,83 20,85 10,82 0,80" />
                    {/* Competitor B */}
                    <polygon fill="hsl(38, 92%, 50%)" fillOpacity="0.6" points="0,80 10,82 20,85 30,83 40,80 50,82 60,85 70,83 80,80 90,82 100,85 100,60 90,58 80,55 70,58 60,62 50,58 40,55 30,60 20,62 10,58 0,55" />
                    {/* Competitor A */}
                    <polygon fill="hsl(142, 71%, 45%)" fillOpacity="0.6" points="0,55 10,58 20,62 30,60 40,55 50,58 60,62 70,58 80,55 90,58 100,60 100,35 90,32 80,30 70,33 60,38 50,32 40,30 30,35 20,38 10,32 0,30" />
                    {/* Your Brand (top layer) */}
                    <polygon fill="hsl(var(--primary))" fillOpacity="0.7" points="0,30 10,32 20,38 30,35 40,30 50,32 60,38 70,33 80,30 90,32 100,35 100,10 90,12 80,8 70,15 60,18 50,12 40,8 30,15 20,18 10,12 0,10" />
                  </svg>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-border bg-muted/10 text-xs">
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-primary" /><span>Your Brand</span></div>
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-success" /><span>Competitor A</span></div>
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-warning" /><span>Competitor B</span></div>
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-muted-foreground" /><span>Others</span></div>
            </div>
          </div>
        </div>

        {/* Hourly Heatmap mockup */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hourly Heatmap (Day Parting)</Label>
          <div className="rounded-lg border border-border bg-card p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Hourly Performance</h3>
                <p className="text-xs text-muted-foreground">Metric: ROAS • Last 14 days</p>
              </div>
              <Select defaultValue="roas">
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roas">ROAS</SelectItem>
                  <SelectItem value="spend">Spend</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="acos">ACoS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Heatmap grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Hour header */}
                <div className="grid grid-cols-[50px_repeat(24,1fr)] gap-0.5 mb-0.5">
                  <div></div>
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-[9px] text-muted-foreground text-center">{String(i).padStart(2, "0")}</div>
                  ))}
                </div>
                {/* Day rows */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, dayIdx) => (
                  <div key={day} className="grid grid-cols-[50px_repeat(24,1fr)] gap-0.5 mb-0.5">
                    <div className="text-xs text-muted-foreground flex items-center">{day}</div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      // Generate pseudo-random intensity based on day/hour
                      const seed = (dayIdx * 24 + hour) % 5;
                      const intensityClasses = ["bg-primary/5", "bg-primary/15", "bg-primary/30", "bg-primary/50", "bg-primary/70"];
                      // Business hours (9-17) on weekdays get higher intensity
                      const isBusinessHour = hour >= 9 && hour <= 17 && dayIdx >= 1 && dayIdx <= 5;
                      const intensity = isBusinessHour ? Math.min(seed + 2, 4) : seed;
                      return (
                        <div key={hour} className={`h-6 rounded ${intensityClasses[intensity]}`} />
                      );
                    })}
                  </div>
                ))}
                {/* Legend */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground">Low</span>
                  <div className="flex rounded overflow-hidden">
                    <div className="h-4 w-6 bg-primary/5" />
                    <div className="h-4 w-6 bg-primary/15" />
                    <div className="h-4 w-6 bg-primary/30" />
                    <div className="h-4 w-6 bg-primary/50" />
                    <div className="h-4 w-6 bg-primary/70" />
                  </div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar chart variant */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bar Chart (Category Comparison)</Label>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Campaign Performance Comparison</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "SP | Bamboo | Queen", value: 85, color: "bg-primary" },
                { name: "SB | Mattress Bundle", value: 72, color: "bg-primary/80" },
                { name: "SP | Memory Foam", value: 58, color: "bg-primary/60" },
                { name: "SD | Retargeting", value: 45, color: "bg-primary/40" },
                { name: "SP | Pillow | King", value: 32, color: "bg-primary/30" },
              ].map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs text-foreground w-40 truncate">{name}</span>
                  <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                    <div className={`h-full ${color} rounded`} style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-12 text-right">{(value / 20).toFixed(2)}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scatter plot placeholder */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scatter Plot (Profitability)</Label>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Revenue vs Profit Margin</h3>
                <p className="text-xs text-muted-foreground">Product-level analysis</p>
              </div>
            </div>
            <div className="h-[200px] relative border-l border-b border-border ml-8 mb-6">
              {/* Y-axis */}
              <div className="absolute -left-8 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-muted-foreground text-right pr-1">
                <span>40%</span>
                <span>30%</span>
                <span>20%</span>
                <span>10%</span>
                <span>0%</span>
              </div>
              {/* X-axis */}
              <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[10px] text-muted-foreground">
                <span>$0</span>
                <span>$25k</span>
                <span>$50k</span>
                <span>$75k</span>
                <span>$100k</span>
              </div>
              {/* Scatter points */}
              <div className="absolute inset-0">
                {[
                  { x: 15, y: 70, size: 12, color: "bg-success" },
                  { x: 30, y: 55, size: 18, color: "bg-success" },
                  { x: 45, y: 40, size: 10, color: "bg-warning" },
                  { x: 55, y: 65, size: 14, color: "bg-success" },
                  { x: 25, y: 30, size: 8, color: "bg-destructive" },
                  { x: 70, y: 50, size: 20, color: "bg-success" },
                  { x: 80, y: 35, size: 16, color: "bg-warning" },
                  { x: 40, y: 80, size: 11, color: "bg-success" },
                  { x: 60, y: 25, size: 9, color: "bg-destructive" },
                  { x: 85, y: 60, size: 22, color: "bg-success" },
                ].map(({ x, y, size, color }, i) => (
                  <div
                    key={i}
                    className={`absolute rounded-full ${color} opacity-60`}
                    style={{
                      left: `${x}%`,
                      bottom: `${y}%`,
                      width: size,
                      height: size,
                      transform: "translate(-50%, 50%)",
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">Bubble size = Units Sold • Color = Profit Status</p>
          </div>
        </div>
      </section>

      {/* ========== NEW COMPONENTS (Phase 3+) ========== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">New Components</h2>
          <p className="text-sm text-muted-foreground">Recently added components for advertising detail pages, BI modals, and day parting.</p>
        </div>

        {/* Item Breadcrumb */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Item Breadcrumb (Drill-Down Navigation)</h3>
          <p className="text-xs text-muted-foreground">Used on Campaign Detail, Ad Group Detail pages. Shows hierarchical path from module → ad type → campaign → ad group.</p>
          <div className="p-4 rounded-lg border border-border bg-card space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink className="text-primary hover:underline cursor-pointer">Advertising</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink className="text-primary hover:underline cursor-pointer">SP</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink className="text-primary hover:underline cursor-pointer">Rainbow Mattress | New | Manual | SP</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage className="text-foreground font-medium">Rainbow Mattress | New | Manual | Adgroup | SP</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink className="text-primary hover:underline cursor-pointer">Advertising</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink className="text-primary hover:underline cursor-pointer">SP</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage className="text-foreground font-medium">Rainbow Mattress | New | Manual | SP</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Campaign Info Card */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Campaign Info Card</h3>
          <p className="text-xs text-muted-foreground">Horizontal metadata strip on Campaign Detail page. Shows campaign name, status, type, budgets. Editable values in primary color with underline on hover.</p>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-6 rounded-lg border border-border bg-card px-5 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Campaign Name</span>
                <span className="text-sm font-medium text-foreground">Rainbow Mattress | New | Manual | SP</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</span>
                <StatusBadge status="live" />
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Type</span>
                <span className="text-sm text-foreground">Manual</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Daily Budget</span>
                <span className="text-sm font-medium text-primary cursor-pointer hover:underline">$150.00</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Budget</span>
                <span className="text-sm font-medium text-primary cursor-pointer hover:underline">$4,500.00</span>
              </div>
              <div className="flex-1" />
              <Button variant="outline" size="sm" className="gap-1.5"><Edit className="h-3.5 w-3.5" />Edit</Button>
            </div>
          </div>
        </div>

        {/* Ad Group Info Card */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Ad Group Info Card</h3>
          <p className="text-xs text-muted-foreground">Horizontal metadata strip on Ad Group Detail page. Shows ad group name, status, targeting type, bids, TRoAS. Editable values in primary color.</p>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-6 rounded-lg border border-border bg-card px-5 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Ad Group Name</span>
                <span className="text-sm font-medium text-foreground">Rainbow Mattress | New | Manual | Adgroup | SP</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</span>
                <StatusBadge status="live" />
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Keyword Targeting</span>
                <span className="text-sm text-foreground">Bidded Value</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Min. Bid</span>
                <span className="text-sm font-medium text-primary cursor-pointer hover:underline">$0.45</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Max. Bid</span>
                <span className="text-sm font-medium text-primary cursor-pointer hover:underline">$2.30</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">TRoAS</span>
                <span className="text-sm font-medium text-primary cursor-pointer hover:underline">$8.00</span>
              </div>
              <div className="flex-1" />
              <Button variant="outline" size="sm" className="gap-1.5"><Edit className="h-3.5 w-3.5" />Edit</Button>
            </div>
          </div>
        </div>

        {/* Add Product Ads Modal Anatomy */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Add Product Ads Modal</h3>
          <p className="text-xs text-muted-foreground">Dual-pane modal for adding products to an ad group. Left: searchable catalog. Right: staging area with bid inputs.</p>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Add Product</h4>
                  <p className="text-xs text-muted-foreground">15 / 2,000</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
              </div>
              {/* Modal Body */}
              <div className="flex divide-x divide-border" style={{ minHeight: 200 }}>
                {/* Left: Catalog */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-8 h-8 text-xs" readOnly />
                  </div>
                  <div className="space-y-2">
                    {["Rainbow Memory Foam Mattress", "Ultra Comfort Pillow Set", "Bamboo Sheet Set"].map((name, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded border border-border">
                        <Checkbox checked={i === 0} />
                        <div className="h-8 w-8 rounded bg-muted border border-border" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{name}</p>
                          <p className="text-[10px] text-muted-foreground">ITEM-{1000 + i}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right: Staging */}
                <div className="flex-1 p-4 space-y-3">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase">Added Products</h5>
                  <Table>
                    <TableHeader>
                      <TableRow className="text-[10px]">
                        <TableHead className="text-[10px]">Product</TableHead>
                        <TableHead className="text-[10px] text-right">Suggested Bid</TableHead>
                        <TableHead className="text-[10px] text-right">Bid</TableHead>
                        <TableHead className="text-[10px] w-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs">Rainbow Memory Foam</TableCell>
                        <TableCell className="text-xs text-right text-muted-foreground">$1.25</TableCell>
                        <TableCell className="text-right"><Input className="h-6 w-16 text-xs text-right" defaultValue="1.25" readOnly /></TableCell>
                        <TableCell><Button variant="ghost" size="sm" className="h-6 w-6 p-0"><X className="h-3 w-3" /></Button></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Add</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Keyword Modal Anatomy */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Add Keyword Modal</h3>
          <p className="text-xs text-muted-foreground">Modal for adding a tracked keyword with region and channel selection. Used in Keyword Tracker (BI).</p>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="border border-border rounded-lg overflow-hidden max-w-md">
              <div className="px-5 py-3 border-b border-border bg-muted/30">
                <h4 className="text-sm font-semibold text-foreground">Add Keyword</h4>
                <p className="text-xs text-muted-foreground">Add a new keyword to track share of voice</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Keyword</Label>
                  <Input placeholder="Enter keyword..." className="h-9 text-sm" defaultValue="memory foam mattress" readOnly />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Region</Label>
                  <Select defaultValue="US">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">🇺🇸 United States</SelectItem>
                      <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                      <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Channels</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><Checkbox checked /><span className="text-sm">Organic</span></div>
                    <div className="flex items-center gap-2"><Checkbox checked /><span className="text-sm">Sponsored</span></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Add Keyword</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Schedule (Day Parting) Anatomy */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Create Schedule (Day Parting)</h3>
          <p className="text-xs text-muted-foreground">Schedule creation panel for day parting. Includes campaign selection, action type, day/time selectors, and frequency.</p>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="border border-border rounded-lg overflow-hidden max-w-lg">
              <div className="px-5 py-3 border-b border-border bg-muted/30">
                <h4 className="text-sm font-semibold text-foreground">Create Schedule</h4>
                <p className="text-xs text-muted-foreground">Set up automated bid adjustments for specific time windows</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Campaign</Label>
                  <Select defaultValue="camp1">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="camp1">Rainbow Mattress | New | Manual | SP</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Action Type</Label>
                  <Select defaultValue="pause">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pause">Pause Campaign</SelectItem>
                      <SelectItem value="boost">Increase Bids</SelectItem>
                      <SelectItem value="reduce">Decrease Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Days</Label>
                  <div className="flex gap-1.5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <Button key={day} variant={i < 5 ? "default" : "outline"} size="sm" className="h-8 w-10 text-xs px-0">{day}</Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Start Time</Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="09:00">09:00 AM</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">End Time</Label>
                    <Select defaultValue="17:00">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="17:00">05:00 PM</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Create Schedule</Button>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ==================== APP TASKBAR (2-ROW LAYOUT) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">AppTaskbar (2-Row Layout)</h2>
        <p className="text-xs text-muted-foreground">Sticky two-row taskbar with border-primary accent. Row 1: breadcrumb + account/sync info. Row 2: page-specific filters + island-off fallback actions. Actions collapse to icon-only when side panels are open.</p>
        
        {/* Default state */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Default State — Full Actions</Label>
          <div className="rounded-lg border border-primary bg-card overflow-hidden">
            {/* Row 1 */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
              <nav className="flex items-center gap-0.5 text-xs">
                <span className="text-muted-foreground">Profitability</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="font-medium text-foreground">Dashboard</span>
              </nav>
              <div className="flex items-center gap-3">
                <div className="h-4 w-6 rounded bg-[#FF9900]/20 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#FF9900]">a</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-foreground">My Store</span>
                <div className="h-3.5 w-px bg-border" />
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">Last synced: Apr 10, 2:30 PM</span>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex items-center px-4 py-2 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                  <span className="text-sm font-medium text-muted-foreground">Ad Type</span>
                  <span className="text-sm">All Types</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                  <span className="text-sm font-medium text-muted-foreground">Date Range</span>
                  <CalendarIcon className="h-3 w-3" />
                  <span className="text-sm">Apr 01 – Apr 10, 2026</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 ml-auto shrink-0">
                <button className="h-7 px-2 gap-1 inline-flex items-center rounded-md text-[11px] text-muted-foreground hover:bg-accent">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>Ask Aan</span>
                </button>
                <button className="h-7 px-2 gap-1 inline-flex items-center rounded-md text-[11px] text-muted-foreground hover:bg-accent">
                  <Lightbulb className="h-3 w-3" />
                  <span>Insights</span>
                </button>
                <button className="h-7 px-2 gap-1 inline-flex items-center rounded-md text-[11px] text-muted-foreground hover:bg-accent">
                  <RefreshCw className="h-3 w-3" />
                  <span>Refresh</span>
                </button>
                <div className="pl-2 border-l border-border ml-1">
                  <button className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                    <Bell className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel-collapsed variant */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Panel Open — Icon-Only Actions</Label>
          <div className="rounded-lg border border-primary bg-card overflow-hidden">
            {/* Row 1 */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
              <nav className="flex items-center gap-0.5 text-xs">
                <span className="text-muted-foreground">Advertising</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="font-medium text-foreground">Campaign Manager</span>
              </nav>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-foreground">My Store</span>
                <div className="h-3.5 w-px bg-border" />
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">Last synced: Apr 10, 2:30 PM</span>
              </div>
            </div>
            {/* Row 2 — icon-only actions */}
            <div className="flex items-center px-4 py-2 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                  <span className="text-sm font-medium text-muted-foreground">Ad Type</span>
                  <span className="text-sm">SP</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 ml-auto shrink-0">
                <button className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                  <Sparkles className="h-3 w-3 text-primary" />
                </button>
                <button className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                  <Lightbulb className="h-3 w-3" />
                </button>
                <button className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                  <RefreshCw className="h-3 w-3" />
                </button>
                <div className="pl-2 border-l border-border ml-1">
                  <button className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                    <Bell className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DATA TABLE TOOLBAR (UPDATED) ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">DataTable Toolbar (Updated)</h2>
        <p className="text-xs text-muted-foreground">Standardized table toolbar with left-side actions (Create, Toggle, Search) and right-side controls (Upload, Delta, Sort, Filter, Columns, Export, Edit). Sort is a 3-state inline toggle — no popover.</p>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Toolbar — All Controls Visible</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
              {/* Left side */}
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Create</Button>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search..." className="h-8 w-[200px] pl-8 text-xs" readOnly />
                </div>
              </div>
              {/* Right side */}
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Upload className="h-3.5 w-3.5" />Upload
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <BarChart3 className="h-3.5 w-3.5" />Delta
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5" />Sort
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Filter className="h-3.5 w-3.5" />Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Columns className="h-3.5 w-3.5" />Columns
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Download className="h-3.5 w-3.5" />Export
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Edit className="h-3.5 w-3.5" />Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sort Button — 3 States</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="space-y-1 text-center">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5" />Sort
                </Button>
                <p className="text-[10px] text-muted-foreground">Inactive</p>
              </div>
              <div className="space-y-1 text-center">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs bg-primary/10 text-primary border-primary/30">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  Sort
                </Button>
                <p className="text-[10px] text-muted-foreground">Ascending</p>
              </div>
              <div className="space-y-1 text-center">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs bg-primary/10 text-primary border-primary/30">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  Sort
                </Button>
                <p className="text-[10px] text-muted-foreground">Descending</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Active Filter Chips</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-center gap-1.5 py-1.5">
              <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-foreground">Live</span>
                <button className="ml-0.5 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs">
                <span className="text-muted-foreground">ROAS:</span>
                <span className="font-medium text-foreground">&gt; 2.0</span>
                <button className="ml-0.5 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
              </div>
              <button className="text-xs text-primary hover:underline ml-1">Clear all</button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TABLE WITH COLUMN PINNING ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Table with Column Pinning</h2>
        <p className="text-xs text-muted-foreground">Each non-fixed column header has a small radio dot (h-2.5). Unpinned dots appear at 50% opacity on hover. Pinned dots show solid primary color. Pinned columns get sticky positioning with opaque backgrounds to prevent bleed-through during horizontal scroll.</p>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pin Radio States</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/40 opacity-60" />
                <span className="text-xs text-muted-foreground">Unpinned (hover state)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full border border-primary bg-primary" />
                <span className="text-xs text-foreground font-medium">Pinned (active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/40 opacity-0" />
                <span className="text-xs text-muted-foreground">Unpinned (hidden — visible on row hover only)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Table with Pinned Column ("Impressions" pinned)</Label>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right bg-muted">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Impressions</span>
                      <div className="h-2.5 w-2.5 rounded-full border border-primary bg-primary" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Clicks</span>
                      <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/40 opacity-60" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Spend</span>
                      <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/40 opacity-60" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>ROAS</span>
                      <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/40 opacity-60" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Summer Sale Campaign</TableCell>
                  <TableCell><StatusBadge status="live" /></TableCell>
                  <TableCell className="text-right bg-background font-medium">125,400</TableCell>
                  <TableCell className="text-right">2,450</TableCell>
                  <TableCell className="text-right">$5,000</TableCell>
                  <TableCell className="text-right">3.24</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Brand Awareness</TableCell>
                  <TableCell><StatusBadge status="live" /></TableCell>
                  <TableCell className="text-right bg-background font-medium">89,200</TableCell>
                  <TableCell className="text-right">1,890</TableCell>
                  <TableCell className="text-right">$3,200</TableCell>
                  <TableCell className="text-right">2.87</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">↑ "Impressions" column has solid primary dot and opaque bg-muted header / bg-background cells. Other columns show dots at 60% opacity (hover state shown for demo).</p>
        </div>
      </section>

      {/* ==================== PROFITABILITY HERO CARD ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Profitability Hero Card (5-Card Grid)</h2>
        <p className="text-xs text-muted-foreground">Fixed 5-card grid: Today, Yesterday, This Month, Last Month, Forecast. Clicking selects a card (ring-2 ring-primary). Each card shows 6 metrics in bordered boxes + a highlighted Net Profit section. Comparison chart at 220px height below.</p>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Card Grid — "Today" Selected</Label>
          <div className="grid grid-cols-5 gap-3">
            {[
              { title: "Today", selected: true, profit: "$1,245", metrics: [
                { label: "GMV", value: "$4,520" }, { label: "Orders", value: "89" }, { label: "Auth Sales", value: "$3,210" },
                { label: "Ad Cost", value: "$680", }, { label: "Units", value: "124" }, { label: "Est. Payout", value: "$2,890" },
              ]},
              { title: "Yesterday", selected: false, profit: "$1,180", metrics: [
                { label: "GMV", value: "$4,200" }, { label: "Orders", value: "82" }, { label: "Auth Sales", value: "$2,980" },
                { label: "Ad Cost", value: "$620" }, { label: "Units", value: "115" }, { label: "Est. Payout", value: "$2,710" },
              ]},
              { title: "This Month", selected: false, profit: "$12,450", metrics: [
                { label: "GMV", value: "$45,200" }, { label: "Orders", value: "890" }, { label: "Auth Sales", value: "$32,100" },
                { label: "Ad Cost", value: "$6,800" }, { label: "Units", value: "1,240" }, { label: "Est. Payout", value: "$28,900" },
              ]},
              { title: "Last Month", selected: false, profit: "$10,800", metrics: [
                { label: "GMV", value: "$42,100" }, { label: "Orders", value: "820" }, { label: "Auth Sales", value: "$29,800" },
                { label: "Ad Cost", value: "$6,200" }, { label: "Units", value: "1,150" }, { label: "Est. Payout", value: "$27,100" },
              ]},
              { title: "Forecast", selected: false, profit: "$1,380", metrics: [
                { label: "GMV", value: "$4,800" }, { label: "Est. Orders", value: "95" }, { label: "Est. Sales", value: "$3,400" },
                { label: "Est. Ad Cost", value: "$700" }, { label: "Est. Units", value: "132" }, { label: "Est. Payout", value: "$3,060" },
              ]},
            ].map((card) => (
              <div key={card.title} className={`rounded-lg border bg-card overflow-hidden ${card.selected ? "ring-2 ring-primary border-primary shadow-md" : "border-border"} ${card.title === "Forecast" ? "border-dashed" : ""}`}>
                <div className="px-3 py-2 border-b border-border/50">
                  <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                </div>
                <div className="px-3 py-2">
                  <div className="rounded-md bg-muted/30 px-2.5 py-2 mb-2">
                    <p className="text-[10px] text-muted-foreground">Net Profit</p>
                    <p className="text-sm font-bold text-foreground">{card.profit}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {card.metrics.map((m) => (
                      <div key={m.label} className="rounded-md border border-border/50 px-2 py-1.5">
                        <p className="text-[9px] text-muted-foreground leading-tight">{m.label}</p>
                        <p className="text-[10px] font-semibold text-foreground mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Comparison Chart Below Cards (220px height)</Label>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="h-[220px] bg-muted/20 rounded-lg flex items-center justify-center border border-dashed border-border">
              <span className="text-sm text-muted-foreground">5-Series Area Chart — 220px height — All periods overlaid</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== UPLOAD DIALOG ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Upload Dialog</h2>
        <p className="text-xs text-muted-foreground">Drag-and-drop file upload modal triggered by toolbar Upload button. Supports CSV/XLSX. Shows staged file list with size and remove action.</p>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Dialog Anatomy — With Files Staged</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="border border-border rounded-lg overflow-hidden max-w-md bg-background shadow-lg">
              {/* Header */}
              <div className="px-6 pt-6 pb-2">
                <h4 className="text-lg font-semibold text-foreground">Upload Files</h4>
                <p className="text-sm text-muted-foreground">Drag and drop files or click to browse</p>
              </div>
              {/* Drop zone */}
              <div className="px-6 py-3">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-foreground font-medium">Drop files here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                </div>
              </div>
              {/* File list */}
              <div className="px-6 py-2 space-y-1.5">
                {[
                  { name: "campaign_data_2024.csv", size: "245.3 KB" },
                  { name: "keyword_bids_update.xlsx", size: "128.7 KB" },
                ].map((file) => (
                  <div key={file.name} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground truncate">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{file.size}</span>
                    </div>
                    <button className="p-0.5 hover:bg-muted rounded">
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className="px-6 py-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Upload (2)</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Drop Zone — Drag Active State</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5 p-8 max-w-md">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-foreground font-medium">Drop files here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PIN ICON TABLE HEADER ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Table Header — Pin Icon + Sort</h2>
        <p className="text-sm text-muted-foreground">Column headers now use a Pin icon (4 states: hidden, hover, active, hover-highlight) instead of radio buttons. Sort arrows are also larger and more visible.</p>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pin Icon States</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-6">
              {/* State 1: Hidden (default) */}
              <div className="text-center space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                  <span>Column A</span>
                  <Pin className="h-3.5 w-3.5 opacity-0" />
                </div>
                <p className="text-[10px] text-muted-foreground">Default (hidden)</p>
              </div>
              {/* State 2: Hover visible */}
              <div className="text-center space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                  <span>Column B</span>
                  <Pin className="h-3.5 w-3.5 opacity-40 text-muted-foreground" />
                </div>
                <p className="text-[10px] text-muted-foreground">Hover (40% opacity)</p>
              </div>
              {/* State 3: Active pinned */}
              <div className="text-center space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-foreground">
                  <ArrowUp className="h-3.5 w-3.5 text-primary" />
                  <span>Column C</span>
                  <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground">Pinned + Sorted Asc</p>
              </div>
              {/* State 4: Sort desc */}
              <div className="text-center space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-foreground">
                  <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  <span>Column D</span>
                  <Pin className="h-3.5 w-3.5 opacity-0" />
                </div>
                <p className="text-[10px] text-muted-foreground">Sorted Desc (no pin)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GROUP BY TOOLBAR ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">DataTableToolbar — Group By</h2>
        <p className="text-sm text-muted-foreground">The "Sort" button is now renamed to "Group By". Same 3-state toggle logic (inactive → asc → desc → inactive) per field.</p>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Group By Button</Label>
          <div className="p-4 rounded-lg border border-border bg-card flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Group By
            </Button>
            <span className="text-xs text-muted-foreground">→</span>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs bg-primary/10 text-primary">
              <ArrowUp className="h-3.5 w-3.5" />
              Group By
            </Button>
            <span className="text-xs text-muted-foreground">(active with asc field)</span>
          </div>
        </div>
      </section>

      {/* ==================== BREADCRUMB SIZES ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Breadcrumb — Updated Size + Footer</h2>
        <p className="text-sm text-muted-foreground">Breadcrumbs are now text-xs with h-3 w-3 chevrons. A bottom breadcrumb (PageFooterBar) is placed at the end of every page.</p>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Top Breadcrumb (text-xs)</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <PageBreadcrumb items={[
              { label: "Profitability", href: "/profitability/dashboard" },
              { label: "Dashboard" },
            ]} />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bottom Footer Bar</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <PageFooterBar breadcrumbItems={[
              { label: "Advertising", href: "/advertising/campaigns" },
              { label: "Campaign Manager" },
            ]} />
          </div>
        </div>
      </section>

      {/* ==================== PAGINATION LAYOUT ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">TablePagination — Updated Layout</h2>
        <p className="text-sm text-muted-foreground">Rows per page now sits on the right side adjacent to pagination arrows. Count label on the left.</p>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">New Layout: [count left] ... [rows-per-page | arrows right]</Label>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <TablePagination
              page={2}
              pageSize={25}
              totalItems={142}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
            />
          </div>
        </div>
      </section>

      {/* ==================== METRIC DROPDOWN BOX ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Day Parting — Metric Dropdown Box</h2>
        <p className="text-sm text-muted-foreground">Each hero metric box has a dropdown selector to swap the displayed metric independently.</p>
        
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Metric Box with Dropdown</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { label: "Spend", value: "$12,450.00" },
                { label: "ROAS", value: "3.42x" },
                { label: "Orders", value: "1,245" },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-border bg-card px-3 py-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-0.5">
                      {item.label}
                      <ChevronDown className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== RIGHT-SIDE PANELS ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Right-Side Panels — Anatomy</h2>
        <p className="text-xs text-muted-foreground">All right-side panels use fixed viewport positioning, independent scroll containers (ScrollArea), and automatically close on outside click. Panels replace modal dialogs to maintain analytical context.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CreateCampaignPanel */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Create Campaign Panel</Label>
            <div className="w-[380px] rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Create Campaign</h4>
                <button className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Campaign Name</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">SP | Bamboo | Q4</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Campaign Type</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Sponsored Products</span><ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bidding Strategy</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Dynamic Bids - Down Only</span><ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Daily Budget</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">$50.00</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Date</Label>
                    <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">2026-04-10</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Date</Label>
                    <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">Optional</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Create Campaign</Button>
              </div>
            </div>
          </div>

          {/* CreateReportPanel */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Create Report Panel</Label>
            <div className="w-[380px] rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Create Report</h4>
                <button className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Template</Label>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground">Performance</button>
                    <button className="px-3 py-1.5 rounded-md text-xs border border-border text-muted-foreground">Custom</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Report Name</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">Weekly Performance Report</div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Sections</Label>
                  <div className="space-y-1.5">
                    {["Executive Summary", "Campaign Performance", "Keyword Analysis", "Budget Allocation"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded border ${i < 3 ? "bg-primary border-primary" : "border-border"} flex items-center justify-center`}>
                          {i < 3 && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span className="text-xs text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Create Report</Button>
              </div>
            </div>
          </div>

          {/* CreateSchedulePanel */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Create Schedule Panel</Label>
            <div className="w-[380px] rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Create Schedule</h4>
                <button className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Campaigns</Label>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-[10px]">SP | Bamboo <X className="h-2.5 w-2.5 ml-1" /></Badge>
                    <Badge variant="secondary" className="text-[10px]">SB | Mattress <X className="h-2.5 w-2.5 ml-1" /></Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Action</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Increase Bids</span><ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Days</Label>
                  <div className="flex gap-1.5">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                      <button key={i} className={`h-8 w-8 rounded-md text-xs font-medium ${i < 5 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{day}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Time</Label>
                    <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">09:00 AM</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Time</Label>
                    <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">05:00 PM</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Apply</Button>
              </div>
            </div>
          </div>

          {/* ProductDetailPanel */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Product Detail Panel</Label>
            <div className="w-[380px] rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Product Details</h4>
                <button className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Bamboo Pillow — Queen Size</p>
                    <p className="text-[10px] text-muted-foreground">SKU: BPQ-2024 • ASIN: B09XYZ1234</p>
                  </div>
                </div>
                <div className="rounded-md bg-muted/30 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Net Profit</p>
                  <p className="text-lg font-bold text-success">$4,520</p>
                </div>
                <div className="h-16 bg-muted/20 rounded-lg border border-dashed border-border flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">Sparkline Chart</span>
                </div>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted text-xs">
                    <span className="font-medium">Revenue</span>
                    <span className="text-muted-foreground">$12,400</span>
                  </button>
                  <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted text-xs">
                    <span className="font-medium">COGS</span>
                    <span className="text-muted-foreground">$5,200</span>
                  </button>
                  <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted text-xs">
                    <span className="font-medium">Expenses</span>
                    <span className="text-muted-foreground">$2,680</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PeriodBreakdownPanel */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Period Breakdown Panel</Label>
            <div className="w-[380px] rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Period Breakdown</h4>
                <button className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <p className="text-xs text-muted-foreground">Apr 1 – Apr 10, 2026</p>
                {[
                  { section: "Sales", items: [{ label: "Authorized Sales", value: "$32,100" }, { label: "Ad Sales", value: "$8,400" }] },
                  { section: "Costs", items: [{ label: "COGS", value: "$14,200" }, { label: "Ad Spend", value: "$6,800" }, { label: "FBA Fees", value: "$4,100" }] },
                  { section: "Units", items: [{ label: "Ordered Units", value: "890" }, { label: "Shipped Units", value: "872" }] },
                ].map((group) => (
                  <div key={group.section}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{group.section}</p>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-muted/50">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="rounded-md bg-muted/30 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Net Profit</span>
                  <span className="text-sm font-bold text-success">$12,450</span>
                </div>
              </div>
            </div>
          </div>

          {/* CampaignSettingsPanel */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Campaign Settings Panel</Label>
            <div className="w-[380px] rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Campaign Settings</h4>
                <button className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Campaign</span>
                  <span className="font-medium text-foreground">SP | Bamboo | Queen</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Type</span>
                  <span className="text-foreground">Sponsored Products</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-[10px]">Live</Badge>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs">Daily Budget</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm">$50.00</div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Bidding Strategy</Label>
                  <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Dynamic Bids - Down Only</span><ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SIDEBAR NAVIGATION ==================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-foreground">Sidebar Navigation — Anatomy</h2>
        <p className="text-xs text-muted-foreground">Collapsible left sidebar (w-56). Auto-collapses when right panels open. Features grouped nav items, "Ask Aan" pill, marketplace selector, and footer with theme toggle + avatar.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Expanded sidebar */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Expanded (w-56)</Label>
            <div className="w-56 rounded-lg border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-heading font-semibold">Anarix</span>
                </div>
                <button className="text-muted-foreground"><PanelLeft className="h-4 w-4" /></button>
              </div>
              {/* Ask Aan pill */}
              <div className="px-3 py-2">
                <button className="w-full h-9 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center gap-2 text-sm text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="font-medium">Ask Aan</span>
                </button>
              </div>
              {/* Nav groups */}
              <div className="px-2 py-1 space-y-0.5">
                {[
                  { icon: LayoutDashboard, label: "Workspace", active: false },
                  { icon: DollarSign, label: "Profitability", active: true },
                  { icon: Megaphone, label: "Advertising", active: false },
                  { icon: BarChart2, label: "Business Intel", active: false },
                  { icon: Layers, label: "AMC", active: false },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${item.active ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "text-muted-foreground hover:bg-muted"}`}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className="mt-auto px-3 py-3 border-t border-border flex items-center justify-between">
                <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted">
                  <Sun className="h-4 w-4" />
                </button>
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">JD</div>
              </div>
            </div>
          </div>

          {/* Collapsed sidebar */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Collapsed (Icon-Only)</Label>
            <div className="w-14 rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex flex-col items-center py-3 gap-1">
                <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                {[LayoutDashboard, DollarSign, Megaphone, BarChart2, Layers].map((Icon, i) => (
                  <button key={i} className={`h-9 w-9 rounded-md flex items-center justify-center ${i === 1 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <div className="border-t border-border py-2 flex flex-col items-center gap-1">
                <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground"><Sun className="h-4 w-4" /></button>
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">JD</div>
              </div>
            </div>
          </div>

          {/* Hover popup */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hover Popup (Submenu)</Label>
            <div className="w-[200px] rounded-lg border border-border bg-card shadow-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Profitability</span>
              </div>
              <div className="p-1.5 space-y-0.5">
                {["Dashboard", "Profit & Loss", "Trends", "Geographical", "Unified P&L"].map((item, i) => (
                  <button key={item} className={`w-full text-left px-3 py-1.5 rounded-md text-xs ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}`}>{item}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Selector */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Marketplace Selector (Sidebar-Integrated)</Label>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-6">
              {/* Expanded */}
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Expanded</span>
                <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                  <div className="h-5 w-5 rounded bg-[#FF9900]/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-[#FF9900]">a</span>
                  </div>
                  <span className="text-sm font-medium">Amazon</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
              {/* Collapsed */}
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Collapsed</span>
                <div className="h-9 w-9 rounded-md border border-border flex items-center justify-center">
                  <div className="h-5 w-5 rounded bg-[#FF9900]/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-[#FF9900]">a</span>
                  </div>
                </div>
              </div>
              {/* Account popup */}
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Account Popup</span>
                <div className="w-[200px] rounded-lg border border-border bg-card shadow-lg p-2 space-y-1">
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="font-medium text-foreground">My Store</span>
                    <Check className="h-3 w-3 ml-auto text-primary" />
                  </button>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-foreground">Second Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
