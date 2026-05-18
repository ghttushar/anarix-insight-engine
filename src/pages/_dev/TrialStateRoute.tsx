import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTrial, TrialState } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import ProfitabilityDashboard from "@/pages/profitability/Dashboard";

const VALID: TrialState[] = ["none", "syncing", "active", "expired", "paid"];

/**
 * Hidden utility route: /_state/:state
 * Pins a specific trial state and renders the dashboard inline (no redirect),
 * so each trial screen has a stable, copy-paste URL for Figma capture.
 *
 * Re-pins state on every change to defeat the auto-progress timer in TrialContext.
 */
export default function TrialStateRoute() {
  const { state } = useParams<{ state: string }>();
  const { trial, setTrial } = useTrial();
  const { billingFlowEnabled, setBillingFlow } = useBillingFlow();

  const target = (VALID.includes(state as TrialState) ? state : "none") as TrialState;

  useEffect(() => {
    if (!billingFlowEnabled) setBillingFlow(true);
  }, [billingFlowEnabled, setBillingFlow]);

  useEffect(() => {
    if (trial !== target) setTrial(target);
  }, [trial, target, setTrial]);

  return <ProfitabilityDashboard />;
}
