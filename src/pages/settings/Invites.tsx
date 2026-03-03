import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { toast } from "sonner";

const mockInvites = [
  { id: "inv1", email: "alex@partner.com", role: "Analyst", status: "pending", sentAt: "2025-12-01 10:00" },
  { id: "inv2", email: "lisa@agency.com", role: "Viewer", status: "accepted", sentAt: "2025-11-28 14:30" },
  { id: "inv3", email: "tom@brand.com", role: "Analyst", status: "expired", sentAt: "2025-11-01 09:00" },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  expired: "bg-muted text-muted-foreground",
};

export default function Invites() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");

  const handleSendInvite = () => {
    if (!email) return;
    toast.success(`Invitation sent to ${email}`);
    setEmail("");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Invitations</h1>
          <p className="text-sm text-muted-foreground">Invite team members to join your workspace</p>
        </div>
        <Separator />

        {/* Send Invite Form */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">Send Invitation</h2>
          <div className="flex gap-3">
            <Input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSendInvite}><Send className="h-4 w-4 mr-2" />Send</Button>
          </div>
        </div>

        {/* Invites Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvites.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.role}</TableCell>
                  <TableCell><Badge className={statusColors[inv.status]}>{inv.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{inv.sentAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
