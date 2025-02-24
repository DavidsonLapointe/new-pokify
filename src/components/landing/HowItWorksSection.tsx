
import { FileText, Upload, Video, Brain, Database, BarChart2, ArrowRight } from "lucide-react";

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
        
        <div className="relative max-w-5xl mx-auto">
          {/* Input Stage */}
          <div className="grid md:grid-cols-3 gap-8 mb-8 relative">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Texto</h3>
              <p className="text-gray-600 text-center text-sm">
                Transcrições e notas de vendas
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Áudio</h3>
              <p className="text-gray-600 text-center text-sm">
                Gravações de chamadas
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Vídeo</h3>
              <p className="text-gray-600 text-center text-sm">
                Reuniões e apresentações
              </p>
            </div>
          </div>

          {/* Arrow Down with AI Processing */}
          <div className="flex justify-center items-center my-8">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
              <Brain className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>

          {/* Output Stage */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Análise Inteligente</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Identificação de padrões de sucesso
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Pontos de melhoria nas conversas
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Score de qualificação de leads
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Integração com CRM</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Salesforce, HubSpot, Pipedrive
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Atualização automática de leads
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Sincronização em tempo real
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
