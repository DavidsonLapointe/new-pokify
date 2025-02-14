
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationCalls from "./pages/OrganizationCalls";
import OrganizationNewCall from "./pages/OrganizationNewCall";
import OrganizationProfile from "./pages/OrganizationProfile";
import OrganizationUsers from "./pages/OrganizationUsers";
import OrganizationIntegrations from "./pages/OrganizationIntegrations";
import Admin from "./pages/Admin";
import Organizations from "./pages/Organizations";
import AdminProfile from "./pages/AdminProfile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
        <Route path="/organization/calls" element={<OrganizationCalls />} />
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
