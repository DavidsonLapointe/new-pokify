
import { FileText, Brain, BarChart2, FileAudio, FileVideo, Database, MessageSquare, BookOpen } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6">
          Como Funciona
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Nossa plataforma oferece ferramentas de IA para diversos departamentos, processando diferentes tipos de dados para gerar insights e automatizar tarefas
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Input */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Múltiplas Fontes de Dados</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileAudio className="h-5 w-5 text-primary/70" />
                <span>Arquivos de áudio e reuniões</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileVideo className="h-5 w-5 text-primary/70" />
                <span>Vídeos e apresentações</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Database className="h-5 w-5 text-primary/70" />
                <span>Dados estruturados e não-estruturados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="h-5 w-5 text-primary/70" />
                <span>Mensagens e interações com clientes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-5 w-5 text-primary/70" />
                <span>Documentos e materiais de conhecimento</span>
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
            <h3 className="text-lg font-semibold text-center mb-2">Inteligência Adaptativa</h3>
            <p className="text-gray-600 text-center text-sm">
              Nossa IA analisa, processa e otimiza informações específicas para cada departamento da sua empresa
            </p>
          </div>

          {/* Output */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Resultados para Toda Empresa</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Comercial: Análise de chamadas e leads</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Marketing: Otimização de conteúdo</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>RH: Triagem e avaliação de candidatos</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Financeiro: Análise preditiva</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>Operações: Otimização de processos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
