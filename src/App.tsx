
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./contexts/UserContext";
import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes />
        <Toaster />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
