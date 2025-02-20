
import { Routes as RouterRoutes, Route } from "react-router-dom";
import OrganizationLayout from "./components/OrganizationLayout";
import { OrganizationCalls } from "./pages/OrganizationCalls";
import { OrganizationDashboard } from "./pages/OrganizationDashboard";
import { OrganizationIntegrations } from "./pages/OrganizationIntegrations";
import { OrganizationLeads } from "./pages/OrganizationLeads";
import { OrganizationPlan } from "./pages/OrganizationPlan";
import { OrganizationProfile } from "./pages/OrganizationProfile";
import { OrganizationSettings } from "./pages/OrganizationSettings";
import { OrganizationUsers } from "./pages/OrganizationUsers";
import { Index } from "./pages/Index";
import { NotFound } from "./pages/NotFound";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      
      {/* Organization Routes */}
      <Route path="/organization" element={<OrganizationLayout />}>
        <Route path="dashboard" element={<OrganizationDashboard />} />
        <Route path="leads" element={<OrganizationLeads />} />
        <Route path="calls" element={<OrganizationCalls />} />
        <Route path="users" element={<OrganizationUsers />} />
        <Route path="integrations" element={<OrganizationIntegrations />} />
        <Route path="settings" element={<OrganizationSettings />} />
        <Route path="plan" element={<OrganizationPlan />} />
        <Route path="profile" element={<OrganizationProfile />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
