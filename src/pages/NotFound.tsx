
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
          <p className="text-gray-600 mb-6">
            O endereço que você tentou acessar não está disponível ou foi modificado.
          </p>
          
          {location.pathname.includes('confirm-registration') && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-left">
              <p className="text-sm text-blue-800">
                Se você está tentando completar seu cadastro, verifique se o link no email está correto
                ou tente acessar a página de configuração diretamente.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/")}
              variant="default"
              className="w-full"
            >
              Ir para página inicial
            </Button>
            
            <Button 
              onClick={() => navigate("/auth")}
              variant="outline"
              className="w-full"
            >
              Ir para página de login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
