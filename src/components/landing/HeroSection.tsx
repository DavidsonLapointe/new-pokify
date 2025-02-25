
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { LeadForm } from "./LeadForm";

export function HeroSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-medium">
                Tecnologia de ponta em Vendas
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Potencialize seu time
              </span>{" "}
              com Inteligência Artificial
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Use inteligência artificial para analisar 100% das suas chamadas, identificar padrões de sucesso e multiplicar suas vendas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-lg" onClick={() => setIsFormOpen(true)}>
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Ver Demonstração
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="font-bold text-2xl text-primary">98%</div>
                <div className="text-sm text-gray-600">Precisão</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-primary">2.5x</div>
                <div className="text-sm text-gray-600">Produtividade</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-primary">24/7</div>
                <div className="text-sm text-gray-600">Suporte</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg z-10" />
              <img
                src="/lovable-uploads/817f098f-b9a1-4bd0-87f9-c523e1b33f53.png"
                alt="Equipe de vendas trabalhando"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100 z-20">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30"></div>
                    <Star className="text-yellow-400 h-5 w-5 relative" />
                  </div>
                  <span className="font-medium">Lead Qualificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LeadForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </section>
  );
}
