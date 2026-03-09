import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Chip, ChipGroup } from "@/components/ui/chip";
import { CircularProgress } from "@/components/ui/circular-progress";
import { 
  AlertCircle, Info, CheckCircle, XCircle, Home, Settings, 
  Plus, Edit, Trash2, Download, ChevronDown, Bold, Italic, Underline,
  Calendar as CalendarIcon, User, Mail, ChevronRight, ChevronsUpDown
} from "lucide-react";

export default function ComponentLibrary() {
  return (
    <AppLayout>
      <PageHeader
        title="Component Library"
        subtitle="Complete UI component reference — always displayed in light theme"
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

// Shared component showcase
function ComponentShowcase() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progress, setProgress] = useState(66);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Typography */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Typography</h3>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Heading 1 (32px, 600)</h1>
            <h2 className="text-2xl font-semibold">Heading 2 (24px, 600)</h2>
            <h3 className="text-xl font-semibold">Heading 3 (18px, 500)</h3>
            <p className="text-base">Body text paragraph with normal weight (14-16px, 400)</p>
            <p className="text-sm text-muted-foreground">Secondary text in muted color (12px, 400)</p>
          </div>
        </section>

        {/* Buttons & Toggles */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Buttons & Toggles</h3>
          <div className="space-y-4">
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
            <div className="flex flex-wrap gap-2">
              <Toggle aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
        </section>

        {/* Form Controls */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Form Controls</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Input</Label>
                <Input id="text-input" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textarea">Textarea</Label>
                <Textarea id="textarea" placeholder="Enter longer text..." rows={3} />
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Radio Group</Label>
                <RadioGroup defaultValue="option-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-1" id="option-1" />
                    <Label htmlFor="option-1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-2" id="option-2" />
                    <Label htmlFor="option-2">Option 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-3" id="option-3" />
                    <Label htmlFor="option-3">Option 3</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Slider (Value: {sliderValue[0]})</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Calendar</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Badges & Chips */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Badges & Chips</h3>
          <div className="space-y-4">
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

        {/* Data Display */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Data Display</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Separator</Label>
              <div className="space-y-2">
                <p className="text-sm">Content above</p>
                <Separator />
                <p className="text-sm">Content below</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Skeleton (Loading State)</Label>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Progress (Value: {progress}%)</Label>
              <Progress value={progress} />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
                <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Circular Progress</Label>
              <CircularProgress progress={75} label="Complete" />
            </div>

            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex gap-2">
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
          </div>
        </section>

        {/* Alerts & Feedback */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Alerts & Feedback</h3>
          <div className="space-y-3">
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
          </div>
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

        {/* Navigation */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Navigation</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Breadcrumb</Label>
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

            <div className="space-y-2">
              <Label>Tabs</Label>
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
            </div>

            <div className="space-y-2">
              <Label>Accordion</Label>
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
            </div>

            <div className="space-y-2">
              <Label>Pagination</Label>
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

            <div className="space-y-2">
              <Label>Menubar</Label>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>New File</MenubarItem>
                    <MenubarItem>Open</MenubarItem>
                    <MenubarItem>Save</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Cut</MenubarItem>
                    <MenubarItem>Copy</MenubarItem>
                    <MenubarItem>Paste</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
        </section>

        {/* Overlays */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Overlays</h3>
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tooltip content</p>
              </TooltipContent>
            </Tooltip>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">Hover Card</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarFallback>HC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Hover Card</h4>
                    <p className="text-sm">Additional information appears on hover.</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Popover Title</h4>
                  <p className="text-sm text-muted-foreground">Popover content goes here.</p>
                </div>
              </PopoverContent>
            </Popover>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog description explaining the purpose.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm">Dialog content goes here.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                  <SheetDescription>
                    Sheet slides in from the side.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <p className="text-sm">Sheet content goes here.</p>
                </div>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Title</DrawerTitle>
                  <DrawerDescription>Drawer slides up from bottom.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <p className="text-sm">Drawer content goes here.</p>
                </div>
              </DrawerContent>
            </Drawer>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Dropdown <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="flex h-[100px] w-[200px] items-center justify-center rounded-md border border-dashed text-sm">
                  Right click here
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Edit</ContextMenuItem>
                <ContextMenuItem>Duplicate</ContextMenuItem>
                <ContextMenuItem>Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Command</Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
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
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Layout */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Layout</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Collapsible</Label>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Toggle Content <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <p className="text-sm">This content can be collapsed and expanded.</p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="space-y-2">
              <Label>Scroll Area</Label>
              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label>Resizable Panels</Label>
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

            <div className="space-y-2">
              <Label>Carousel</Label>
              <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <CarouselItem key={num}>
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">{num}</span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
