
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="font-bold text-2xl text-gray-900">Leadly</div>
          <div>
            <Button onClick={() => window.location.href = "/auth"}>
              Acessar Plataforma
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
