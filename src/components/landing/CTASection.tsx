
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LeadForm } from "./LeadForm";

export function CTASection() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="py-20 pb-32 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Pronto para transformar sua empresa com IA?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Junte-se a centenas de empresas que já aumentaram sua eficiência e produtividade com o Leadly
        </p>
        <Button 
          size="lg" 
          className="text-lg bg-white text-primary hover:bg-gray-100 transition-colors"
          onClick={() => setIsFormOpen(true)}
        >
          Começar Gratuitamente
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <LeadForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </section>
  );
}
