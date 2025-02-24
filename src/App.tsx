
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./Routes";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
