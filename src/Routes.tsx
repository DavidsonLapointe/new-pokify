
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import AdminLayout from "./components/AdminLayout";
import OrganizationLayout from "./components/OrganizationLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import Contract from "./pages/Contract";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminProfile from "./pages/AdminProfile";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminUsers from "./pages/AdminUsers";
import AdminIntegrations from "./pages/AdminIntegrations";
import AdminPlans from "./pages/AdminPlans";
import AdminPrompt from "./pages/AdminPrompt";
import AdminSettings from "./pages/AdminSettings";
import AdminFinancial from "./pages/AdminFinancial";
import AdminAnalysisPackages from "./pages/AdminAnalysisPackages";

// Organization Pages
import OrganizationProfile from "./pages/OrganizationProfile";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationCalls from "./pages/OrganizationCalls";
import OrganizationLeads from "./pages/OrganizationLeads";
import OrganizationUsers from "./pages/OrganizationUsers";
import OrganizationIntegrations from "./pages/OrganizationIntegrations";
import OrganizationSettings from "./pages/OrganizationSettings";
import OrganizationPlan from "./pages/OrganizationPlan";
import OrganizationCompany from "./pages/OrganizationCompany";
import OrganizationSetup from "./pages/OrganizationSetup";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/confirm-registration" element={<ConfirmRegistration />} />
          <Route path="/contract" element={<Contract />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="" element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="organizations" element={<AdminOrganizations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="integrations" element={<AdminIntegrations />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="prompt" element={<AdminPrompt />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="financial" element={<AdminFinancial />} />
            <Route path="analysis-packages" element={<AdminAnalysisPackages />} />
          </Route>

          {/* Organization Routes */}
          <Route path="/organization" element={<OrganizationLayout />}>
            <Route path="" element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<OrganizationProfile />} />
            <Route path="dashboard" element={<OrganizationDashboard />} />
            <Route path="calls" element={<OrganizationCalls />} />
            <Route path="leads" element={<OrganizationLeads />} />
            <Route path="users" element={<OrganizationUsers />} />
            <Route path="integrations" element={<OrganizationIntegrations />} />
            <Route path="settings" element={<OrganizationSettings />} />
            <Route path="plan" element={<OrganizationPlan />} />
            <Route path="company" element={<OrganizationCompany />} />
            <Route path="setup" element={<OrganizationSetup />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
