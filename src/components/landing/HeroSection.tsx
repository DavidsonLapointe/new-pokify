
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LeadForm } from "./LeadForm";

export function HeroSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="pt-32 pb-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Multiplique seus resultados com o poder da Inteligência Artificial
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforme sua empresa com ferramentas de IA que geram resultados imediatos. 
            Aumente vendas, reduza custos e potencialize cada departamento da sua organização.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg"
              onClick={() => setIsFormOpen(true)}
            >
              Comece Agora - Grátis por 7 dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg"
            >
              Agende uma Demonstração
            </Button>
          </div>
          
          <div className="mt-10 text-gray-500 text-sm">
            <p>Mais de 500 empresas já aumentaram sua eficiência com o Leadly</p>
            <div className="flex justify-center gap-8 mt-4">
              <img src="https://via.placeholder.com/120x40" alt="Logo Cliente 1" className="h-8 opacity-70" />
              <img src="https://via.placeholder.com/120x40" alt="Logo Cliente 2" className="h-8 opacity-70" />
              <img src="https://via.placeholder.com/120x40" alt="Logo Cliente 3" className="h-8 opacity-70" />
              <img src="https://via.placeholder.com/120x40" alt="Logo Cliente 4" className="h-8 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      <LeadForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  );
}
