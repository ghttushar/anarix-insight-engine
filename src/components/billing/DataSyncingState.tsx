import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import tacoIllustration from "@/assets/illustrations/taco.svg";

/**
 * Full-card overlay shown on the Profitability Dashboard while the
 * new user's data is initially syncing (trial === "syncing").
 *
 * Tone exception: this is part of the marketing/trial onboarding moment,
 * sanctioned per content rules §10.5.
 */
export function DataSyncingState() {
  const { trial } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();

  if (!billingFlowEnabled || trial !== "syncing") return null;

  return (
    <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center text-center min-h-[420px] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70 animate-[dataSyncShimmer_1800ms_linear_infinite]"
        style={{ backgroundSize: "200% 100%" }}
      />
      <img src={tacoIllustration} alt="" className="h-28 w-auto mb-6" />
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
        Grab a coffee while we grab your data.
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Don't wait for the biscuit — we're faster than that. Your dashboard will populate
        as soon as the first sync completes.
      </p>
      <style>{`
        @keyframes dataSyncShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
