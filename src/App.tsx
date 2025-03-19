
import AppRoutes from "./Routes"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  )
}

export default App
