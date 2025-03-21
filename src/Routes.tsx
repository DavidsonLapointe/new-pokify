import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizationLayout from "./components/organization/layout/OrganizationLayout";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ModuleDetails from "./pages/ModuleDetails";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ComingSoon from "./pages/ComingSoon";

// Organization Routes
import OrganizationAITools from "./pages/OrganizationAITools";
import OrganizationAreas from "./pages/OrganizationAreas";
import OrganizationCalls from "./pages/OrganizationCalls";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationLeads from "./pages/OrganizationLeads";
import OrganizationProfile from "./pages/OrganizationProfile";
import OrganizationCompany from "./pages/OrganizationCompany";
import OrganizationModules from "./pages/OrganizationModules";
import OrganizationUsers from "./pages/OrganizationUsers";
import OrganizationSettings from "./pages/OrganizationSettings";
import OrganizationCredits from "./pages/OrganizationCredits";
import OrganizationSetup from "./pages/OrganizationSetup";
import OrganizationIntegrations from "./pages/OrganizationIntegrations";
import OrganizationKnowledgeBase from "./pages/OrganizationKnowledgeBase";
import OrganizationUnusedPermissions from "./pages/OrganizationUnusedPermissions";

// Admin Routes
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminUsers from "./pages/AdminUsers";
import AdminModules from "./pages/AdminModules";
import AdminModuleSetups from "./pages/AdminModuleSetups";
import AdminPlans from "./pages/AdminPlans";
import AdminAnalysisPackages from "./pages/AdminAnalysisPackages";
import AdminFinancial from "./pages/AdminFinancial";
import AdminCustomerSuccess from "./pages/AdminCustomerSuccess";
import AdminIntegrations from "./pages/AdminIntegrations";
import AdminPrompt from "./pages/AdminPrompt";
import AdminSettings from "./pages/AdminSettings";
import AdminCompany from "./pages/AdminCompany";
import AdminProfile from "./pages/AdminProfile";
import AdminLeads from "./pages/AdminLeads";
import AdminAICosts from "./pages/AdminAICosts";
import AdminTestimonials from "./pages/AdminTestimonials";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/modules/:moduleId" element={<ModuleDetails />} />
		    <Route path="/coming-soon" element={<ComingSoon />} />
        
        <Route path="/organization">
          <Route 
            element={
              <ProtectedRoute>
                <OrganizationLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OrganizationDashboard />} />
            <Route path="ai-tools" element={<OrganizationAITools />} />
            <Route path="areas" element={<OrganizationAreas />} />
            <Route path="calls" element={<OrganizationCalls />} />
            <Route path="leads" element={<OrganizationLeads />} />
            <Route path="profile" element={<OrganizationProfile />} />
            <Route path="company" element={<OrganizationCompany />} />
            <Route path="modules" element={<OrganizationModules />} />
            <Route path="users" element={<OrganizationUsers />} />
            <Route path="settings" element={<OrganizationSettings />} />
            <Route path="credits" element={<OrganizationCredits />} />
            <Route path="setup" element={<OrganizationSetup />} />
            <Route path="integrations" element={<OrganizationIntegrations />} />
            <Route path="knowledge-base" element={<OrganizationKnowledgeBase />} />
            <Route path="unused-permissions" element={<OrganizationUnusedPermissions />} />
          </Route>
        </Route>

        <Route path="/admin">
          <Route 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="organizations" element={<AdminOrganizations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="modules" element={<AdminModules />} />
            <Route path="module-setups" element={<AdminModuleSetups />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="credit-packages" element={<AdminAnalysisPackages />} />
            <Route path="financial" element={<AdminFinancial />} />
            <Route path="customer-success" element={<AdminCustomerSuccess />} />
            <Route path="integrations" element={<AdminIntegrations />} />
            <Route path="prompt" element={<AdminPrompt />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="company" element={<AdminCompany />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="ai-costs" element={<AdminAICosts />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Switch>
    </Router>
  );
}
