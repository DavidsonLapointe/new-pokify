
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Building2, Users, Phone, ChartBar, Video, MessageCircle, 
  ShieldCheck, Lock, HeadphonesIcon, UserCheck, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Definição das ferramentas de IA disponíveis
const AI_TOOLS = [
  {
    id: "video_prospecting",
    name: "Prospecção com Vídeo",
    icon: Video,
    description: "Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.",
    isSubscribed: true,
    content: (
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Crie vídeos personalizados para seus leads utilizando IA. O sistema pode gerar um roteiro baseado no perfil do lead e 
          automaticamente criar vídeos com seu avatar digital.
        </p>
        <div className="bg-gray-50 border rounded-md p-4">
          <h4 className="font-medium mb-2">Como funciona:</h4>
          <ol className="list-decimal ml-5 space-y-2 text-sm">
            <li>Selecione o lead ou insira informações manualmente</li>
            <li>A IA analisa o perfil e gera um roteiro personalizado</li>
            <li>Escolha um avatar ou use sua própria imagem</li>
            <li>O vídeo é gerado e pode ser enviado diretamente ao lead</li>
          </ol>
        </div>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] mt-4 py-6 text-lg w-full md:w-auto">
          <span>Criar novo vídeo</span>
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    )
  },
  {
    id: "inbound_agent",
    name: "Atendente Inbound",
    icon: HeadphonesIcon,
    description: "Automatize o atendimento inicial com um agente de IA para qualificação de leads inbound.",
    isSubscribed: false,
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64 bg-gray-50 border rounded-md">
          <div className="text-center p-6">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium">Módulo não contratado</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">Entre em contato com nosso time comercial para adicionar este módulo ao seu plano.</p>
            <Button className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB] py-6 text-lg px-8">
              <span>Saiba mais</span>
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "call_qualification",
    name: "Análise de Call",
    icon: UserCheck,
    description: "Analise automaticamente as calls com leads para identificar fit e próximos passos.",
    isSubscribed: true,
    content: (
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Nossa IA analisa as gravações de chamadas com leads e extrai informações valiosas como objeções, nível de interesse e pontos 
          a serem abordados em contatos futuros.
        </p>
        <div className="bg-gray-50 border rounded-md p-4 space-y-2">
          <h4 className="font-medium">Benefícios:</h4>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Análise automática de sentimentos durante a call</li>
            <li>Identificação de objeções e dúvidas frequentes</li>
            <li>Sugestões de abordagem para o próximo contato</li>
            <li>Resumo detalhado da conversa</li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] py-6 text-lg flex-1">
            <span>Analisar gravação</span>
            <ArrowRight className="ml-2" />
          </Button>
          <Button variant="outline" className="py-6 text-lg flex-1">
            Ver análises anteriores
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "email_automation",
    name: "Nutrição de leads (MKT)",
    icon: MessageCircle,
    description: "Crie sequências automatizadas de emails personalizados com IA.",
    isSubscribed: false,
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64 bg-gray-50 border rounded-md">
          <div className="text-center p-6">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium">Módulo não contratado</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">Entre em contato com nosso time comercial para adicionar este módulo ao seu plano.</p>
            <Button className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB] py-6 text-lg px-8">
              <span>Saiba mais</span>
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "objection_handler",
    name: "Assistente de Prospecção",
    icon: ShieldCheck,
    description: "IA para sugerir respostas a objeções comuns durante o processo de vendas.",
    isSubscribed: true,
    content: (
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Sistema inteligente que identifica objeções comuns durante o processo de vendas e sugere as melhores respostas 
          baseadas em casos de sucesso anteriores.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Objeções mais comuns</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span>Preço alto</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex justify-between">
                <span>Já tem fornecedor</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span>Não é prioridade</span>
                <span className="font-medium">17%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Taxa de conversão</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span>Com IA</span>
                <span className="font-medium text-green-600">68%</span>
              </div>
              <div className="flex justify-between">
                <span>Sem IA</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="flex justify-between">
                <span>Melhoria</span>
                <span className="font-medium text-green-600">+26%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] mt-4 py-6 text-lg w-full">
          <span>Consultar banco de objeções</span>
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    )
  }
];

const SalesProcess = () => {
  const [selectedTool, setSelectedTool] = useState("video_prospecting");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-[#9b87f5] fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white">
            <Building2 className="w-4 h-4 text-white" />
            <span className="font-medium">Empresa Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-white">Usuário Demo</p>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="w-64 bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30 border-r border-gray-200">
        <nav className="flex flex-col h-full py-6 px-3">
          <div className="space-y-0.5">
            <Link to="/dev/contracting" className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-[#9b87f5]">
              <ChartBar className="w-4 h-4 mr-3 text-[#9b87f5]" />
              Dashboard
            </Link>
            <Link to="/dev/sales-process" className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] bg-[#F1F0FB] text-[#9b87f5]">
              <Users className="w-4 h-4 mr-3 text-[#9b87f5]" />
              Ferramentas de IA
            </Link>
            <Link to="#" className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-gray-600" />
              Chamadas
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16">
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Ferramentas de IA</h1>
              <p className="text-muted-foreground">
                Ferramentas de IA para otimizar seu processo de vendas
              </p>
            </div>

            {/* AI Tools Module Carousel */}
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-6">
                Escolha uma das ferramentas abaixo para otimizar seu processo de vendas:
              </p>
              
              <div className="relative w-full mb-10">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {AI_TOOLS.map(tool => (
                      <CarouselItem key={tool.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/5">
                        <button
                          onClick={() => setSelectedTool(tool.id)}
                          className={cn(
                            "flex flex-col items-center text-center p-5 rounded-lg border-2 transition-all duration-200 h-full w-full",
                            selectedTool === tool.id
                              ? "border-[#9b87f5] bg-[#F1F0FB] shadow-md"
                              : "border-gray-200 hover:border-[#9b87f5] hover:bg-[#F1F0FB]/50"
                          )}
                        >
                          <div className="relative mb-4">
                            {React.createElement(tool.icon, { 
                              className: "w-12 h-12 text-[#9b87f5]" 
                            })}
                            {!tool.isSubscribed && (
                              <div className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1">
                                <Lock className="w-4 h-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium text-lg mb-2">{tool.name}</h3>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </Carousel>
              </div>
              
              {/* Selected Tool Content */}
              {AI_TOOLS.map(tool => (
                tool.id === selectedTool && (
                  <Card key={tool.id} className="border shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            {React.createElement(tool.icon, { className: "w-6 h-6 text-[#9b87f5]" })}
                            {tool.name}
                            {!tool.isSubscribed && (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                            {tool.description}
                          </CardDescription>
                        </div>
                        {tool.isSubscribed && (
                          <div className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            Ativo
                          </div>
                        )}
                        {!tool.isSubscribed && (
                          <div className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                            Não contratado
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 pb-8">
                      {tool.content}
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesProcess;
