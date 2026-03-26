import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { KeywordTrackerTable } from "@/components/bi/KeywordTrackerTable";
import { AddKeywordModal } from "@/components/bi/AddKeywordModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { trackedKeywords as initialKeywords } from "@/data/mockBrandSOV";
import { TrackedKeyword } from "@/types/bi";
import { toast } from "sonner";

export default function KeywordTracker() {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(initialKeywords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [showDeltas, setShowDeltas] = useState(false);

  const activeKeywords = keywords.filter((k) => k.status === "active");
  const inactiveKeywords = keywords.filter((k) => k.status === "inactive");
  const filteredKeywords = (activeTab === "active" ? activeKeywords : inactiveKeywords).filter(
    (k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (id: string, status: "active" | "inactive") => {
    setKeywords((prev) => prev.map((k) => (k.id === id ? { ...k, status, updatedAt: new Date().toISOString() } : k)));
  };
  const handleDelete = (id: string) => { setKeywords((prev) => prev.filter((k) => k.id !== id)); };
  const handleAddKeyword = (newKeyword: { keyword: string; region: string; channels: ("organic" | "sponsored")[] }) => {
    const now = new Date().toISOString();
    const regionFlags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", UK: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷" };
    setKeywords((prev) => [{ id: `new-${Date.now()}`, keyword: newKeyword.keyword, addedAt: now, updatedAt: now, region: newKeyword.region, regionFlag: regionFlags[newKeyword.region] || "🌍", channels: newKeyword.channels, status: "active" }, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Keyword Tracker"
          subtitle="Manage keywords for share of voice tracking"
        />

        <AppTaskbar />

        <div className="flex items-center justify-end">
          <Button onClick={() => setIsAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Keyword</Button>
        </div>

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by keyword..."
          onDownload={() => toast.success("Exporting keywords...")}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeKeywords.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveKeywords.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4"><KeywordTrackerTable keywords={filteredKeywords} onStatusChange={handleStatusChange} onDelete={handleDelete} /></TabsContent>
          <TabsContent value="inactive" className="mt-4"><KeywordTrackerTable keywords={filteredKeywords} onStatusChange={handleStatusChange} onDelete={handleDelete} /></TabsContent>
        </Tabs>

        {filteredKeywords.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No keywords found</p>
            {searchQuery && <p className="text-sm mt-1">Try adjusting your search query</p>}
          </div>
        )}
      </div>
      <AddKeywordModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddKeyword} />
    </AppLayout>
  );
}
