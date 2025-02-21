import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Database, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  FileAudio2,
  FileVideo,
  FileText,
  Brain,
  ArrowRight as ArrowRightIcon,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LoginModal from "@/components/auth/LoginModal";

const Index = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Clock,
      title: "Economia de Tempo",
      description: "Elimine o trabalho manual de cadastro de leads após cada ligação",
    },
    {
      icon: CheckCircle2,
      title: "Maior Precisão",
      description: "Dados extraídos automaticamente, sem erros de digitação",
    },
    {
      icon: Database,
      title: "Integração Total",
      description: "Funciona com seu CRM atual e ferramentas de chamada",
    },
  ];

  const testimonials = [
    {
      content: "A automatização das chamadas revolucionou nosso processo de vendas. Reduzimos o tempo de processamento em 75%.",
      author: "Maria Silva",
      role: "Gerente de Vendas",
      company: "TechCorp Brasil",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
    },
    {
      content: "Desde que implementamos o Leadly, nossa equipe consegue focar mais em fechar negócios e menos em tarefas administrativas.",
      author: "João Santos",
      role: "Diretor Comercial",
      company: "Inova Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
    },
    {
      content: "A precisão na extração de dados é impressionante. Não temos mais problemas com informações incorretas no CRM.",
      author: "Ana Costa",
      role: "SDR Leader",
      company: "Global Sales",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
    },
    {
      content: "O suporte da equipe é excepcional. Sempre prontos para ajudar e resolver qualquer questão rapidamente.",
      author: "Ricardo Oliveira",
      role: "Head de Vendas",
      company: "Digital One",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
    },
    {
      content: "A implementação foi muito mais rápida do que esperávamos. Em poucos dias já estávamos utilizando todas as funcionalidades.",
      author: "Patrícia Lima",
      role: "COO",
      company: "StartUp BR",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b fixed w-full bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Leadly</h1>
          <Button 
            variant="outline" 
            onClick={() => setShowLoginModal(true)}
          >
            Acessar Plataforma
          </Button>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
      />

      {/* Hero Section */}
      <section className="relative min-h-[700px] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 pt-32 pb-20 items-center">
            {/* Left Content */}
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  Tecnologia de ponta em Vendas
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                Automatize suas{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Vendas com IA
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                Nossa plataforma integra IA avançada para converter arquivos de áudio, vídeo e textos em leads qualificados automaticamente. 
                Aumente sua produtividade e foque no que realmente importa: fechar negócios.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6" 
                  onClick={() => navigate("/register")}
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="h-12 px-6" 
                  onClick={() => navigate("/demo")}
                >
                  Ver Demonstração
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                <div>
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                  <div className="text-sm text-slate-600">Precisão na extração</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">2.5x</div>
                  <div className="text-sm text-slate-600">Mais produtividade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Suporte dedicado</div>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-3xl animate-pulse"></div>
                <img
                  src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=1200"
                  alt="Equipe de vendas trabalhando no escritório"
                  className="rounded-3xl shadow-2xl object-cover h-[600px] w-full"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-[280px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Lead Qualificado</div>
                    <div className="text-sm text-slate-600">Extração automática</div>
                  </div>
                </div>
                <div className="h-2 bg-blue-100 rounded-full">
                  <div className="h-2 w-4/5 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nossa plataforma processa seus dados de vendas usando IA avançada e gera insights acionáveis, 
              integrando-se perfeitamente com seu CRM.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative grid lg:grid-cols-3 gap-8 items-stretch">
              {/* Input Section */}
              <div className="group relative">
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FileAudio2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Inputs</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FileAudio2 className="text-blue-500 h-5 w-5" />
                      <span className="text-slate-700">Áudios de Vendas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileVideo className="text-blue-500 h-5 w-5" />
                      <span className="text-slate-700">Vídeos de Reuniões</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-500 h-5 w-5" />
                      <span className="text-slate-700">Textos e Mensagens</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Section */}
              <div className="group relative">
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Processamento IA
                    </div>
                  </div>
                  <div className="mt-8 flex justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-full">
                        <Brain className="h-12 w-12 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30">
                      <p className="text-slate-700 text-center">Análise Avançada</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30">
                      <p className="text-slate-700 text-center">Extração de Dados</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30">
                      <p className="text-slate-700 text-center">Identificação de Padrões</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="group relative">
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Benefícios</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="text-green-500 h-5 w-5" />
                      <span className="text-slate-700">Leads Qualificados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-green-500 h-5 w-5" />
                      <span className="text-slate-700">Insights de Vendas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="text-green-500 h-5 w-5" />
                      <span className="text-slate-700">Métricas Detalhadas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="text-green-500 h-5 w-5" />
                      <span className="text-slate-700">Sugestões de Ação</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none hidden lg:block">
                <div className="relative h-2">
                  {/* Left to Center Line */}
                  <div className="absolute left-[33%] w-[calc(16.7%-2rem)] h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                  </div>
                  {/* Center to Right Line */}
                  <div className="absolute left-[66.7%] w-[calc(16.7%-2rem)] h-0.5 bg-gradient-to-r from-indigo-500 to-green-500">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* CRM Integration Banner */}
            <div className="mt-16 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold text-white mb-2">Integração com CRMs</h4>
                      <p className="text-blue-100">Compatível com as principais plataformas do mercado</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                      Salesforce
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                      HubSpot
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                      Pipedrive
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                      RD Station
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher nossa solução?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">O que nossos clientes dizem</h2>
            <p className="text-muted-foreground mt-2">
              Empresas que transformaram seu processo de vendas com nossa solução
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg bg-white hover:bg-gray-50"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg bg-white hover:bg-gray-50"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div 
              ref={scrollContainerRef}
              className="overflow-hidden flex gap-6 px-8 -mx-4 snap-x snap-mandatory"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="min-w-[300px] max-w-[300px] flex-shrink-0 snap-center"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{testimonial.author}</div>
                        <div className="text-xs text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                    
                    <Quote className="h-6 w-6 text-blue-600/20 mb-3 absolute top-5 right-5" />
                    
                    <p className="text-gray-700 mb-4 relative text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-xs text-blue-600 font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Pronto para automatizar seu processo de vendas?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de empresas que já otimizaram seu processo de
            captação de leads.
          </p>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={() => navigate("/register")}
          >
            Começar Gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Leadly. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

<style>
  {`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}
</style>
