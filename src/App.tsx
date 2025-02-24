
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import Routes from './Routes';
import { UserProvider } from './contexts/UserContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes />
        <Toaster position="top-right" richColors />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
