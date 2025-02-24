
import { Clock, Target, Link } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Por que escolher nossa solução?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Economia de Tempo</h3>
            <p className="text-gray-600">
              Automatize suas análises e foque no que realmente importa: fechar negócios.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Maior Precisão</h3>
            <p className="text-gray-600">
              Nossa IA garante análises precisas e consistentes em todas as chamadas.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Integração Total</h3>
            <p className="text-gray-600">
              Conecte-se facilmente com suas ferramentas existentes de CRM e vendas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
