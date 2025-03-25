import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './Routes';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
