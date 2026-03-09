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
import { 
  AlertCircle, Info, CheckCircle, XCircle, Home, 
  Plus, Edit, Trash2, Download, Bold, Italic, Underline,
  Calendar as CalendarIcon, User, Mail, X, Settings, Search
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
            { label: "Revenue", value: 125000, previousValue: 100000, format: "currency" },
            { label: "Orders", value: 4523, previousValue: 4200, format: "number" },
            { label: "Conversion Rate", value: 3.25, previousValue: 2.89, format: "percentage" },
            { label: "AOV", value: 27.64, previousValue: 28.10, format: "currency" },
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

    </div>
  );
}
