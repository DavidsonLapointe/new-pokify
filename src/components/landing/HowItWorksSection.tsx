
import { 
  FileText, 
  Brain, 
  BarChart2, 
  FileAudio, 
  FileVideo, 
  Database, 
  MessageSquare, 
  BookOpen,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  PieChart
} from "lucide-react";

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
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Múltiplas Fontes de Dados</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <FileAudio className="h-5 w-5 text-primary" />
                <span>Arquivos de áudio e reuniões</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <FileVideo className="h-5 w-5 text-primary" />
                <span>Vídeos e apresentações</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <Database className="h-5 w-5 text-primary" />
                <span>Dados estruturados e não-estruturados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Mensagens e interações com clientes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Documentos e materiais de conhecimento</span>
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Processamento de IA
            </div>
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Inteligência Adaptativa</h3>
            <p className="text-gray-600 text-left text-sm mb-4">
              Nossa IA analisa, processa e otimiza informações específicas para cada departamento da sua empresa
            </p>
            <div className="space-y-2 text-center text-xs text-gray-500">
              <p>Análise Avançada</p>
              <p>Extração de Dados</p>
              <p>Identificação de Padrões</p>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Resultados para Toda Empresa</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Leads Qualificados</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span>Insights de Vendas</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Métricas Detalhadas</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Sugestões de Ação</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 text-left">
                <BarChart2 className="h-5 w-5 text-primary" />
                <span>Otimização de Processos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
