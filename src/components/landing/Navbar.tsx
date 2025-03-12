
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <div className="font-bold text-2xl text-gray-900">Leadly</div>
          <div className="flex items-center gap-4 ml-auto">
            <Button 
              variant="outline"
              onClick={() => navigate("/dev/contracting")}
              className="mr-2"
            >
              Dev Contracting
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Acessar Plataforma
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
