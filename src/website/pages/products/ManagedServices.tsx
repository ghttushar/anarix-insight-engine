import { motion } from "framer-motion";
import { Users, Handshake, Eye, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import StatBlock from "@/website/components/marketing/StatBlock";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import EmbedInsightCard from "@/website/components/embeds/EmbedInsightCard";

const features = [
  { icon: Users, title: "Dedicated Team", desc: "Senior account managers and strategists assigned to your brand. Not a call centre, not a junior shuffle. The same humans week after week." },
  { icon: Handshake, title: "Hybrid Model", desc: "Our experts use the Anarix platform alongside your team. Same dashboards, same insights, same audit trail. Full transparency on every action taken." },
  { icon: Eye, title: "Complete Visibility", desc: "Every action logged, every decision documented, every rule traceable. You see exactly what we did, when, and why — without asking." },
  { icon: LineChart, title: "Performance Guarantees", desc: "We tie our compensation to your outcomes. Aligned incentives, not hourly billing. Skin in the game from day one." },
];

const ProductManagedServices = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <Users className="w-3.5 h-3.5" /> Managed Services
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">Your team, <span className="text-gradient-primary">amplified</span>.</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Expert strategy and execution, fully transparent and aligned to your growth.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <SectionHeader eyebrow="The agency problem" title="Most agencies sell hours. We sell outcomes." lead="The traditional agency model rewards activity, not results. Anarix Managed Services flips that: our compensation is tied to the metrics that matter to your business, and every action we take is visible to you in real time." />
        <StatBlock value="$50M+" label="Managed annually" delta="for 60+ brands" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-24">
        {features.map((f, i) => (
          <motion.div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
            <f.icon className="w-7 h-7 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-24 mb-24">
        <SplitFeature
          eyebrow="What it looks like"
          title="A weekly cadence built around decisions, not status."
          body={<><p>Monday: Aan-generated audit with our strategist's commentary. Wednesday: working session on the week's top three opportunities. Friday: results review with projected vs actual impact. No 90-minute "alignment" calls.</p><p>You always know what's being worked on, why, and what changed.</p></>}
          visual={
            <div className="space-y-3">
              <EmbedInsightCard severity="high" title="Sponsored Brands ROAS dropped 22% in 7 days" body="Strategist note: tied to a Q4 competitor launch. Drafted a defensive bid + creative refresh. Reviewing with you Wed." />
              <EmbedInsightCard severity="medium" title="Two SKUs ready to graduate from manual to auto" body="Aan flagged consistent ROAS > 5x for 21 days. We'll move them under the standard auto-bid envelope this Friday." />
              <EmbedInsightCard severity="low" title="Q1 budget pacing on track" body="92% of plan, 8% headroom for a Black Friday push. No action needed." />
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-20 border-y border-border mb-16">
        <StatBlock value="60+" label="Brands managed" delta="across 4 marketplaces" />
        <StatBlock value="48 hrs" label="Avg onboarding" delta="from contract to live" />
        <StatBlock value="92%" label="Client retention" delta="trailing 12 months" />
      </div>

      <div className="text-center pb-8"><Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">Talk to Our Team</Button></Link></div>
    </div>
  </PageLayout>
);

export default ProductManagedServices;
