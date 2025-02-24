
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Pronto para automatizar seu processo de vendas?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Junte-se a centenas de empresas que já transformaram suas vendas com o Leadly
        </p>
        <Button size="lg" variant="secondary" className="text-lg">
          Começar Gratuitamente
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
