import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";

const mockUsers = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "Admin", status: "active", lastLogin: "2025-12-02 09:15" },
  { id: "u2", name: "Sarah Johnson", email: "sarah@company.com", role: "Analyst", status: "active", lastLogin: "2025-12-01 16:42" },
  { id: "u3", name: "Mike Chen", email: "mike@company.com", role: "Viewer", status: "active", lastLogin: "2025-11-28 11:30" },
  { id: "u4", name: "Emily Davis", email: "emily@company.com", role: "Analyst", status: "inactive", lastLogin: "2025-10-15 08:00" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
};

const roleColors: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Analyst: "bg-accent/20 text-accent-foreground",
  Viewer: "bg-muted text-muted-foreground",
};

export default function Users() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">Manage team members and their roles</p>
          </div>
          <Button><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>
        </div>
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
    </AppLayout>
  );
}
