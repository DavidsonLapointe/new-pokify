
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";

export function OrganizationNavbar() {
  const handleLogout = () => {
    // Implementar lógica de logout
    console.log("Logout clicked");
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-6">
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/organization/profile">
              <UserCircle className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Perfil</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
