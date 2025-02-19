import { Link, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { mockUsers } from "@/types/organization"; // Temporário, depois virá do contexto

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporariamente usando o primeiro usuário mock como exemplo
  // Depois isso virá do contexto de autenticação
  const currentUser = mockUsers[0];

  return (
    <ProtectedRoute user={currentUser}>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-100 p-4">
          <nav>
            <ul>
              <li>
                <Link to="/organization/profile">Meu Perfil</Link>
              </li>
              <li>
                <Link to="/organization/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/organization/leads">Análise de Leads</Link>
              </li>
              <li>
                <Link to="/organization/users">Usuários</Link>
              </li>
              <li>
                <Link to="/organization/integrations">Integrações</Link>
              </li>
              <li>
                <Link to="/organization/settings">Configurações</Link>
              </li>
              <li>
                <Link to="/organization/plan">Meu Plano</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
