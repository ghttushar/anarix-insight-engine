import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { POLICIES, Policy } from "@/data/mockAanPolicies";
import { Shield, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AanPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(POLICIES);

  const toggle = (id: string) =>
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Aan", href: "/aan" }, { label: "Automation Policies" }]} />
      <div className="p-6 max-w-[900px] mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-primary">
            <Shield className="h-3 w-3" /> Automation Policies
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground mt-1">What Aan can do without asking</h1>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-2xl">
            Every policy is a decision pattern you approved once. Aan applies it automatically within the guardrails you set.
            Turn any policy off at any time — Aan will fall back to asking for approval.
          </p>
        </header>

        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
          <div className="text-[12px] text-foreground/80">
            <span className="font-medium">Autonomy is opt-in.</span> Aan will only auto-execute scenarios covered by an
            enabled policy. Everything else still needs your explicit approval in the Aan Inbox.
          </div>
        </div>

        <ul className="space-y-3">
          {policies.map((p) => (
            <li key={p.id} className={cn("rounded-lg border bg-card p-4 transition-colors", p.enabled ? "border-primary/30" : "border-border")}>
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 h-8 w-8 rounded-md flex items-center justify-center shrink-0", p.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-semibold text-foreground">{p.name}</h3>
                    <span className={cn("text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded", p.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                      {p.enabled ? "Active" : "Off"}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                  <div className="mt-2">
                    <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Guardrails</div>
                    <ul className="flex flex-wrap gap-1.5">
                      {p.guardrails.map((g, i) => (
                        <li key={i} className="text-[10.5px] rounded bg-muted px-2 py-0.5 text-foreground/70">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 text-[10.5px] text-muted-foreground">
                    Triggered {p.timesTriggered} times{p.lastTriggered ? ` · last: ${p.lastTriggered}` : ""}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Switch checked={p.enabled} onCheckedChange={() => toggle(p.id)} />
                  <Button size="sm" variant="ghost" className="h-6 text-[10px] text-muted-foreground hover:text-foreground">
                    Edit
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
