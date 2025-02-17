
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b fixed w-full bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Leadly</h1>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Acessar Plataforma
          </Button>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 mix-blend-multiply" />
        <div 
          className="w-full h-[600px] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop')",
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center relative">
            <div className="max-w-3xl text-white space-y-6 animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Automatize o Cadastro de{" "}
                <span className="text-blue-200">Leads no CRM</span>
              </h1>
              <p className="text-xl opacity-90">
                Chega de perder tempo preenchendo manualmente informações após cada
                ligação. Nossa IA extrai e cadastra os dados automaticamente enquanto
                você foca no que importa: vender mais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50" 
                  onClick={() => navigate("/register")}
                >
                  Começar Agora
                  <ArrowRight className="ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white hover:bg-white/10" 
                  onClick={() => navigate("/demo")}
                >
                  Agendar Demo
                </Button>
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
