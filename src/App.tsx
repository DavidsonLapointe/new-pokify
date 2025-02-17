import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import AdminOrganizations from "@/pages/AdminOrganizations";
import AdminPlans from "@/pages/AdminPlans";
import AdminIntegrations from "@/pages/AdminIntegrations";
import AdminProfile from "@/pages/AdminProfile";
import AdminPrompt from "@/pages/AdminPrompt";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/organizations" element={<AdminOrganizations />} />
        <Route path="/admin/plans" element={<AdminPlans />} />
        <Route path="/admin/integrations" element={<AdminIntegrations />} />
        <Route path="/admin/prompt" element={<AdminPrompt />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
