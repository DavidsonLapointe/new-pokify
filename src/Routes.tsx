
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import OrganizationLayout from "./components/OrganizationLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import Contract from "./pages/Contract";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./contexts/AuthContext";

// Admin Pages
import AdminProfile from "./pages/AdminProfile";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminUsers from "./pages/AdminUsers";
import AdminIntegrations from "./pages/AdminIntegrations";
import AdminModules from "./pages/AdminModules";
import AdminModuleSetups from "./pages/AdminModuleSetups";
import AdminPrompt from "./pages/AdminPrompt";
import AdminSettings from "./pages/AdminSettings";
import AdminFinancial from "./pages/AdminFinancial";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlans from "./pages/AdminPlans";
import AdminAnalysisPackages from "./pages/AdminAnalysisPackages";
import AdminCustomerSuccess from "./pages/AdminCustomerSuccess";
import AdminLeads from "./pages/AdminLeads"; 
import AdminCompany from "./pages/AdminCompany";
import AdminAICosts from "./pages/AdminAICosts";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminRegistrations from "./pages/AdminRegistrations"; // New import for Cadastro page

// Organization Pages
import OrganizationProfile from "./pages/OrganizationProfile";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationCalls from "./pages/OrganizationCalls";
import OrganizationLeads from "./pages/OrganizationLeads";
import OrganizationAITools from "./pages/OrganizationAITools";
import OrganizationUsers from "./pages/OrganizationUsers";
import OrganizationIntegrations from "./pages/OrganizationIntegrations";
import OrganizationSettings from "./pages/OrganizationSettings";
import OrganizationModules from "./pages/OrganizationModules";
import OrganizationCompany from "./pages/OrganizationCompany";
import OrganizationSetup from "./pages/OrganizationSetup";
import OrganizationKnowledgeBase from "./pages/OrganizationKnowledgeBase";
import OrganizationCredits from "./pages/OrganizationCredits";
import OrganizationAreas from "./pages/OrganizationAreas";
import OrganizationUnusedPermissions from "./pages/OrganizationUnusedPermissions";

function AppRoutes() {
  const { session, loading } = useAuth();

  // Mostra uma tela de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route 
          path="/auth" 
          element={
            <UserProvider>
              <Auth />
            </UserProvider>
          } 
        />
        <Route path="/confirm-registration" element={<ConfirmRegistration />} />
        <Route path="/confirm-registration/:id" element={<ConfirmRegistration />} />
        <Route path="/contract/:id" element={<Contract />} />
        <Route path="/payment/:id" element={<Contract paymentMode={true} />} />
        <Route path="/organization/setup" element={<OrganizationSetup />} />
        <Route path="/organization/setup/:setupToken" element={<OrganizationSetup />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <UserProvider>
                <AdminLayout />
              </UserProvider>
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="registrations" element={<AdminRegistrations />} /> {/* New route for Cadastro */}
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="prompt" element={<AdminPrompt />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="integrations" element={<AdminIntegrations />} />
          <Route path="modules" element={<AdminModules />} />
          <Route path="module-setups" element={<AdminModuleSetups />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="credit-packages" element={<AdminAnalysisPackages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="financial" element={<AdminFinancial />} />
          <Route path="customer-success" element={<AdminCustomerSuccess />} />
          <Route path="ai-costs" element={<AdminAICosts />} />
          <Route path="company" element={<AdminCompany />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Organization Routes */}
        <Route
          path="/organization"
          element={
            <ProtectedRoute>
              <UserProvider>
                <OrganizationLayout />
              </UserProvider>
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="profile" element={<OrganizationProfile />} />
          <Route path="dashboard" element={<OrganizationDashboard />} />
          <Route path="knowledge-base" element={<OrganizationKnowledgeBase />} />
          <Route path="calls" element={<OrganizationCalls />} />
          <Route path="leads" element={<OrganizationLeads />} />
          <Route path="ai-tools" element={<OrganizationAITools />} />
          <Route path="users" element={<OrganizationUsers />} />
          <Route path="unused-permissions" element={<OrganizationUnusedPermissions />} />
          <Route path="integrations" element={<OrganizationIntegrations />} />
          <Route path="settings" element={<OrganizationSettings />} />
          <Route path="areas" element={<OrganizationAreas />} />
          <Route path="modules" element={<OrganizationModules />} />
          <Route path="company" element={<OrganizationCompany />} />
          <Route path="credits" element={<OrganizationCredits />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
