
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { session, loading } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Bem-vindo à Leadly
          </h1>
          
          {/* Status de Autenticação */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-2">Status de Autenticação:</h2>
            {loading ? (
              <p>Verificando autenticação...</p>
            ) : session ? (
              <div className="space-y-2">
                <p className="text-green-600">
                  Logado como: {session.user.email}
                </p>
                <p className="text-sm text-gray-600">
                  ID do usuário: {session.user.id}
                </p>
              </div>
            ) : (
              <p className="text-red-600">Não está logado</p>
            )}
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!session ? (
              <Button asChild>
                <Link to="/auth">
                  Fazer Login
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to={session ? "/admin/dashboard" : "/auth"}>
                  Ir para Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
