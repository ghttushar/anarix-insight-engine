import { Navigate } from "react-router-dom";
import { PageFooterBar } from "@/components/layout/PageFooterBar";


const breadcrumbItems = [
  { label: "Day Parting", href: "/dayparting/campaigns" },
  { label: "Campaigns" },
];
export default function DayPartingCampaigns() {
  return <Navigate to="/dayparting/hourly" replace />;
}
