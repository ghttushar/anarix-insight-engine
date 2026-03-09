import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AlertCircle, Info, CheckCircle, XCircle, Home, Settings, 
  Plus, Edit, Trash2, Download, ChevronDown 
} from "lucide-react";

export default function ComponentLibrary() {
  return (
    <AppLayout>
      <PageHeader
        title="Component Library"
        subtitle="All UI components displayed in both light and dark themes simultaneously"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT COLUMN - LIGHT MODE */}
          <div className="light bg-background text-foreground rounded-lg border p-6 space-y-6">
            <div className="text-center pb-4 border-b">
              <h2 className="text-xl font-semibold">Light Mode</h2>
              <p className="text-sm text-muted-foreground">All components in light theme</p>
            </div>
            <ComponentShowcase />
          </div>

          {/* RIGHT COLUMN - DARK MODE */}
          <div className="dark bg-background text-foreground rounded-lg border p-6 space-y-6">
            <div className="text-center pb-4 border-b">
              <h2 className="text-xl font-semibold">Dark Mode</h2>
              <p className="text-sm text-muted-foreground">All components in dark theme</p>
            </div>
            <ComponentShowcase />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Shared component showcase rendered in both columns
function ComponentShowcase() {
  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Typography */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Typography</h3>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Heading 1</h1>
            <h2 className="text-2xl font-semibold">Heading 2</h2>
            <h3 className="text-xl font-semibold">Heading 3</h3>
            <p className="text-base">Body text paragraph with normal weight</p>
            <p className="text-sm text-muted-foreground">Secondary text in muted color</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
          </div>
        </section>

        {/* Form Controls */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Form Controls</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Text Input</Label>
              <Input id="text-input" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="select">Select Dropdown</Label>
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Option 1</SelectItem>
                  <SelectItem value="2">Option 2</SelectItem>
                  <SelectItem value="3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox" />
              <Label htmlFor="checkbox">Checkbox option</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="switch" />
              <Label htmlFor="switch">Switch toggle</Label>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="live" />
            <StatusBadge status="paused" />
            <StatusBadge status="scheduled" />
            <StatusBadge status="archived" />
          </div>
          <div className="flex flex-wrap gap-2">
            <DeltaBadge value={12.5} />
            <DeltaBadge value={-8.3} />
            <DeltaBadge value={0} />
          </div>
        </section>

        {/* Alerts */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Alerts</h3>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert message.
            </AlertDescription>
          </Alert>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Operation completed successfully.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred during the operation.
            </AlertDescription>
          </Alert>
        </section>

        {/* Cards */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Cards</h3>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is the card content area.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Tables */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Tables</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Item 1</TableCell>
                <TableCell><StatusBadge status="live" /></TableCell>
                <TableCell className="text-right">$250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Item 2</TableCell>
                <TableCell><StatusBadge status="paused" /></TableCell>
                <TableCell className="text-right">$150</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Item 3</TableCell>
                <TableCell><StatusBadge status="scheduled" /></TableCell>
                <TableCell className="text-right">$350</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        {/* Tabs */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Tabs</h3>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="pt-4">
              Content for tab 1
            </TabsContent>
            <TabsContent value="tab2" className="pt-4">
              Content for tab 2
            </TabsContent>
            <TabsContent value="tab3" className="pt-4">
              Content for tab 3
            </TabsContent>
          </Tabs>
        </section>

        {/* Accordion */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Accordion</h3>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion Item 1</AccordionTrigger>
              <AccordionContent>
                Content for the first accordion item.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Accordion Item 2</AccordionTrigger>
              <AccordionContent>
                Content for the second accordion item.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Tooltips */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Tooltips</h3>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tooltip content</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Additional information</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
