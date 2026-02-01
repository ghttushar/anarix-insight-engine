import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KeywordTrackerTable } from "@/components/bi/KeywordTrackerTable";
import { AddKeywordModal } from "@/components/bi/AddKeywordModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { trackedKeywords as initialKeywords } from "@/data/mockBrandSOV";
import { TrackedKeyword } from "@/types/bi";

export default function KeywordTracker() {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(initialKeywords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const activeKeywords = keywords.filter((k) => k.status === "active");
  const inactiveKeywords = keywords.filter((k) => k.status === "inactive");

  const filteredKeywords = (activeTab === "active" ? activeKeywords : inactiveKeywords).filter(
    (k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (id: string, status: "active" | "inactive") => {
    setKeywords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status, updatedAt: new Date().toISOString() } : k))
    );
  };

  const handleDelete = (id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  };

  const handleAddKeyword = (newKeyword: { keyword: string; region: string; channels: ("organic" | "sponsored")[] }) => {
    const now = new Date().toISOString();
    const regionFlags: Record<string, string> = {
      US: "🇺🇸",
      CA: "🇨🇦",
      UK: "🇬🇧",
      DE: "🇩🇪",
      FR: "🇫🇷",
    };

    setKeywords((prev) => [
      {
        id: `new-${Date.now()}`,
        keyword: newKeyword.keyword,
        addedAt: now,
        updatedAt: now,
        region: newKeyword.region,
        regionFlag: regionFlags[newKeyword.region] || "🌍",
        channels: newKeyword.channels,
        status: "active",
      },
      ...prev,
    ]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Keyword Tracker</h1>
            <p className="text-sm text-muted-foreground">Manage keywords for share of voice tracking</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Keyword
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeKeywords.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({inactiveKeywords.length})
              </TabsTrigger>
            </TabsList>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="active" className="mt-4">
            <KeywordTrackerTable
              keywords={filteredKeywords}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="inactive" className="mt-4">
            <KeywordTrackerTable
              keywords={filteredKeywords}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>

        {/* Empty state */}
        {filteredKeywords.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No keywords found</p>
            {searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search query</p>
            )}
          </div>
        )}
      </div>

      {/* Add Keyword Modal */}
      <AddKeywordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddKeyword}
      />
    </AppLayout>
  );
}
