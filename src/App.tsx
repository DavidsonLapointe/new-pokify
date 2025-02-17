
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import AdminOrganizations from "@/pages/AdminOrganizations";
import AdminPlans from "@/pages/AdminPlans";
import AdminIntegrations from "@/pages/AdminIntegrations";
import AdminProfile from "@/pages/AdminProfile";
import AdminPrompt from "@/pages/AdminPrompt";
import NotFound from "@/pages/NotFound";
import OrganizationDashboard from "@/pages/OrganizationDashboard";
import OrganizationLeads from "@/pages/OrganizationLeads";
import OrganizationUsers from "@/pages/OrganizationUsers";
import OrganizationIntegrations from "@/pages/OrganizationIntegrations";
import OrganizationProfile from "@/pages/OrganizationProfile";
import OrganizationNewCall from "@/pages/OrganizationNewCall";
import OrganizationPlan from "@/pages/OrganizationPlan";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/organizations" element={<AdminOrganizations />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
          <Route path="/admin/prompt" element={<AdminPrompt />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          
          {/* Rotas da Organização */}
          <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
          <Route path="/organization/leads" element={<OrganizationLeads />} />
          <Route path="/organization/new-call" element={<OrganizationNewCall />} />
          <Route path="/organization/users" element={<OrganizationUsers />} />
          <Route path="/organization/integrations" element={<OrganizationIntegrations />} />
          <Route path="/organization/profile" element={<OrganizationProfile />} />
          <Route path="/organization/plan" element={<OrganizationPlan />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
