
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
            <div className="bg-[#E5DEFF] w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="h-8 w-8 text-[#9b87f5]" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Múltiplas Fontes de Dados</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileAudio className="h-5 w-5 text-[#9b87f5]" />
                <span>Arquivos de áudio e reuniões</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileVideo className="h-5 w-5 text-[#7E69AB]" />
                <span>Vídeos e apresentações</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Database className="h-5 w-5 text-[#D946EF]" />
                <span>Dados estruturados e não-estruturados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="h-5 w-5 text-[#F97316]" />
                <span>Mensagens e interações com clientes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-5 w-5 text-[#0EA5E9]" />
                <span>Documentos e materiais de conhecimento</span>
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="inline-flex px-3 py-1 rounded-full bg-[#9b87f5]/10 text-[#9b87f5] text-sm font-medium mb-4">
              Processamento de IA
            </div>
            <div className="bg-[#D3E4FD] w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Brain className="h-8 w-8 text-[#0EA5E9] animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Inteligência Adaptativa</h3>
            <p className="text-gray-600 text-center text-sm mb-4">
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
            <div className="bg-[#F2FCE2] w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart2 className="h-8 w-8 text-[#84cc16]" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Resultados para Toda Empresa</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-5 w-5 text-[#84cc16]" />
                <span>Leads Qualificados</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Lightbulb className="h-5 w-5 text-[#F97316]" />
                <span>Insights de Vendas</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <PieChart className="h-5 w-5 text-[#D946EF]" />
                <span>Métricas Detalhadas</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Sugestões de Ação</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart2 className="h-5 w-5 text-[#0EA5E9]" />
                <span>Otimização de Processos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
