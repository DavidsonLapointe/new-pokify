
import { Routes as RouterRoutes, Route } from "react-router-dom";
import OrganizationLayout from "./components/OrganizationLayout";
import AdminLayout from "./components/AdminLayout";
import OrganizationCalls from "./pages/OrganizationCalls";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationIntegrations from "./pages/OrganizationIntegrations";
import OrganizationLeads from "./pages/OrganizationLeads";
import OrganizationPlan from "./pages/OrganizationPlan";
import OrganizationProfile from "./pages/OrganizationProfile";
import OrganizationSettings from "./pages/OrganizationSettings";
import OrganizationUsers from "./pages/OrganizationUsers";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminPlans from "./pages/AdminPlans";
import AdminPrompt from "./pages/AdminPrompt";
import AdminSettings from "./pages/AdminSettings";
import AdminProfile from "./pages/AdminProfile";
import AdminIntegrations from "./pages/AdminIntegrations";
import AdminAnalysisPackages from "./pages/AdminAnalysisPackages";
import AdminFinancial from "./pages/AdminFinancial";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      
      {/* Rotas da Organização */}
      <Route element={<OrganizationLayout />}>
        <Route path="/organization">
          <Route index element={<OrganizationDashboard />} />
          <Route path="dashboard" element={<OrganizationDashboard />} />
          <Route path="leads" element={<OrganizationLeads />} />
          <Route path="calls" element={<OrganizationCalls />} />
          <Route path="users" element={<OrganizationUsers />} />
          <Route path="integrations" element={<OrganizationIntegrations />} />
          <Route path="settings" element={<OrganizationSettings />} />
          <Route path="plan" element={<OrganizationPlan />} />
          <Route path="profile" element={<OrganizationProfile />} />
        </Route>
      </Route>

      {/* Rotas Administrativas */}
      <Route element={<AdminLayout />}>
        <Route path="/admin">
          <Route index element={<Admin />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="prompt" element={<AdminPrompt />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="integrations" element={<AdminIntegrations />} />
          <Route path="analysis-packages" element={<AdminAnalysisPackages />} />
          <Route path="financial" element={<AdminFinancial />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
