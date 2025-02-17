import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "@/pages/Admin";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AdminOrganizations from "@/pages/AdminOrganizations";
import AdminPlans from "@/pages/AdminPlans";
import AdminPrompt from "@/pages/AdminPrompt";
import AdminIntegrations from "@/pages/AdminIntegrations";
import AdminProfile from "@/pages/AdminProfile";
import OrganizationCalls from "@/pages/OrganizationCalls";
import OrganizationDashboard from "@/pages/OrganizationDashboard";
import OrganizationIntegrations from "@/pages/OrganizationIntegrations";
import OrganizationLeads from "@/pages/OrganizationLeads";
import OrganizationNewCall from "@/pages/OrganizationNewCall";
import OrganizationPlan from "@/pages/OrganizationPlan";
import OrganizationProfile from "@/pages/OrganizationProfile";
import OrganizationSettings from "@/pages/OrganizationSettings";
import OrganizationUsers from "@/pages/OrganizationUsers";
import AdminAnalysisPackages from "@/pages/AdminAnalysisPackages";
import AdminFinancial from "@/pages/AdminFinancial";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/organizations" element={<AdminOrganizations />} />
        <Route path="/admin/plans" element={<AdminPlans />} />
        <Route path="/admin/analysis-packages" element={<AdminAnalysisPackages />} />
        <Route path="/admin/integrations" element={<AdminIntegrations />} />
        <Route path="/admin/prompt" element={<AdminPrompt />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/financial" element={<AdminFinancial />} />

        {/* Organization Routes */}
        <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
        <Route path="/organization/calls" element={<OrganizationCalls />} />
        <Route path="/organization/calls/new" element={<OrganizationNewCall />} />
        <Route path="/organization/leads" element={<OrganizationLeads />} />
        <Route path="/organization/users" element={<OrganizationUsers />} />
        <Route path="/organization/integrations" element={<OrganizationIntegrations />} />
        <Route path="/organization/plan" element={<OrganizationPlan />} />
        <Route path="/organization/profile" element={<OrganizationProfile />} />
        <Route path="/organization/settings" element={<OrganizationSettings />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
