
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationLeads from "./pages/OrganizationLeads";
import OrganizationNewCall from "./pages/OrganizationNewCall";
import OrganizationProfile from "./pages/OrganizationProfile";
import OrganizationUsers from "./pages/OrganizationUsers";
import OrganizationIntegrations from "./pages/OrganizationIntegrations";
import Admin from "./pages/Admin";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminProfile from "./pages/AdminProfile";
import AdminIntegrations from "./pages/AdminIntegrations";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/organizations" element={<AdminOrganizations />} />
        <Route path="/admin/integrations" element={<AdminIntegrations />} />
        <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
        <Route path="/organization/leads" element={<OrganizationLeads />} />
        <Route path="/organization/new-call" element={<OrganizationNewCall />} />
        <Route path="/organization/profile" element={<OrganizationProfile />} />
        <Route path="/organization/users" element={<OrganizationUsers />} />
        <Route path="/organization/integrations" element={<OrganizationIntegrations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
