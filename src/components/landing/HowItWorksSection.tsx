
import { FileText, Brain, BarChart2, FileAudio, FileVideo } from "lucide-react";

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
            <h3 className="text-lg font-semibold text-center mb-4">Entrada de Dados</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileAudio className="h-5 w-5 text-primary/70" />
                <span>Arquivos de áudio de chamadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileVideo className="h-5 w-5 text-primary/70" />
                <span>Gravações de videochamadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-5 w-5 text-primary/70" />
                <span>Transcrições e anotações</span>
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Processamento de IA
            </div>
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Análise Inteligente</h3>
            <p className="text-gray-600 text-center text-sm">
              Nossa IA analisa e identifica padrões de sucesso em suas vendas
            </p>
          </div>

          {/* Output */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Resultados</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Aumento de taxa de conversão</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Identificação de objeções comuns</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Insights para treinamento</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Melhoria contínua do script</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
