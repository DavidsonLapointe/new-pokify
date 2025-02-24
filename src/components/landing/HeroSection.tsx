
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary/10 rounded-full px-4 py-2 text-primary font-medium mb-6">
              Tecnologia de ponta em Vendas
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Transforme suas chamadas
              </span>{" "}
              em oportunidades reais
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Automatize a análise de chamadas, identifique padrões e aumente suas conversões com inteligência artificial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-lg">
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
            <div className="relative animate-float">
              <img
                src="/photo-1581091226825-a6a2a5aee158"
                alt="Pessoa usando Leadly"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 h-5 w-5" />
                  <span className="font-medium">Lead Qualificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
