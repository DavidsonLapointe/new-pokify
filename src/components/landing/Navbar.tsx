
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginModal from "@/components/auth/LoginModal";
import { UserProvider } from "@/contexts/UserContext";

export function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={`border-b backdrop-blur-sm fixed w-full top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-primary shadow-md" : "bg-white/80"
      }`}>
        <div className="max-w-[1152px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className={`font-bold text-2xl ${
              isScrolled ? "text-white" : "text-gray-900"
            }`}>
              Leadly
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className={`hover:text-primary transition-colors ${
                isScrolled ? "text-white/80 hover:text-white" : "text-gray-600"
              }`}>Soluções</a>
              <a href="#" className={`hover:text-primary transition-colors ${
                isScrolled ? "text-white/80 hover:text-white" : "text-gray-600"
              }`}>Preços</a>
              <a href="#" className={`hover:text-primary transition-colors ${
                isScrolled ? "text-white/80 hover:text-white" : "text-gray-600"
              }`}>Recursos</a>
              <a href="#" className={`hover:text-primary transition-colors ${
                isScrolled ? "text-white/80 hover:text-white" : "text-gray-600"
              }`}>Sobre</a>
              <a href="#" className={`hover:text-primary transition-colors ${
                isScrolled ? "text-white/80 hover:text-white" : "text-gray-600"
              }`}>Contato</a>
              
              <Button 
                onClick={() => setLoginModalOpen(true)} 
                className={`${isScrolled 
                  ? "bg-white text-primary hover:bg-white/90" 
                  : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Acessar Plataforma
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <UserProvider>
        <LoginModal 
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
        />
      </UserProvider>
    </>
  );
}
