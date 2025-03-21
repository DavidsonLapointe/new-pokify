
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center">
          <div className="font-bold text-2xl text-gray-900 mr-auto">Leadly</div>
          
          <div className="hidden md:flex items-center space-x-6 mr-8">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Soluções</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Preços</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Recursos</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Sobre</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Contato</a>
          </div>
          
          <Button onClick={() => navigate("/auth")} className="mr-4">
            Acessar Plataforma
          </Button>
        </div>
      </div>
    </nav>
  );
}
