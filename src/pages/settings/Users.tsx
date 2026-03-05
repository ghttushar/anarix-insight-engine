import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

const mockUsers = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "Admin", status: "active", lastLogin: "2025-12-02 09:15" },
  { id: "u2", name: "Sarah Johnson", email: "sarah@company.com", role: "Analyst", status: "active", lastLogin: "2025-12-01 16:42" },
  { id: "u3", name: "Mike Chen", email: "mike@company.com", role: "Viewer", status: "active", lastLogin: "2025-11-28 11:30" },
  { id: "u4", name: "Emily Davis", email: "emily@company.com", role: "Analyst", status: "inactive", lastLogin: "2025-10-15 08:00" },
];

const statusColors: Record<string, string> = { active: "bg-success/10 text-success", inactive: "bg-muted text-muted-foreground" };
const roleColors: Record<string, string> = { Admin: "bg-primary/10 text-primary", Analyst: "bg-accent/20 text-accent-foreground", Viewer: "bg-muted text-muted-foreground" };

export default function Users() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Viewer");

  const handleAddUser = () => {
    if (!newName || !newEmail) return;
    toast.success(`User ${newName} added successfully`);
    setShowAddUser(false);
    setNewName("");
    setNewEmail("");
    setNewRole("Viewer");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="Users"
          subtitle="Manage team members and their roles"
          hideTaskbar
          actions={<Button onClick={() => setShowAddUser(true)}><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>}
        />
        <Separator />
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge className={roleColors[u.role]}>{u.role}</Badge></TableCell>
                  <TableCell><Badge className={statusColors[u.status]}>{u.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{u.lastLogin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" /></div>
            <div><Label>Email</Label><Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email address" type="email" /></div>
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
