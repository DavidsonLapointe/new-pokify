
import { FileText, Brain, BarChart2 } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6">
          Como Funciona
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Nossa plataforma processa seus dados de vendas usando IA avançada para gerar insights valiosos e se integra perfeitamente com seu CRM
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Input */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Entrada de Dados</h3>
            <p className="text-gray-600 text-center text-sm">
              Conecte suas chamadas, reuniões e apresentações de vendas
            </p>
          </div>

          {/* Processing */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Processamento IA</h3>
            <p className="text-gray-600 text-center text-sm">
              Nossa IA analisa e identifica padrões de sucesso em suas vendas
            </p>
          </div>

          {/* Output */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Resultados</h3>
            <p className="text-gray-600 text-center text-sm">
              Receba insights acionáveis e aumente suas conversões
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
