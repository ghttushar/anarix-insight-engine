import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTrial, TrialState } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";

const VALID: TrialState[] = ["none", "syncing", "active", "expired", "paid"];

/**
 * Hidden utility route: /_state/:state
 * Forces a specific trial state then redirects to the dashboard so each
 * trial screen has a stable, copy-paste URL for Figma capture.
 */
export default function TrialStateRoute() {
  const { state } = useParams<{ state: string }>();
  const { setTrial } = useTrial();
  const { billingFlowEnabled, setBillingFlow } = useBillingFlow();

  const target = (VALID.includes(state as TrialState) ? state : "none") as TrialState;

  useEffect(() => {
    if (!billingFlowEnabled) setBillingFlow(true);
    setTrial(target);
  }, [target, billingFlowEnabled, setBillingFlow, setTrial]);

  return <Navigate to="/profitability/dashboard" replace />;
}
