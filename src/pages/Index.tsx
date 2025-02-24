
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-2xl text-gray-900">Leadly</div>
            <div className="hidden md:flex space-x-8">
              <a href="#como-funciona" className="text-gray-600 hover:text-gray-900">Como Funciona</a>
              <a href="#beneficios" className="text-gray-600 hover:text-gray-900">Benefícios</a>
              <a href="#depoimentos" className="text-gray-600 hover:text-gray-900">Depoimentos</a>
            </div>
            <Button>Começar Agora</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Transforme suas chamadas em oportunidades
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Automatize a análise de chamadas, identifique padrões e aumente suas conversões com inteligência artificial
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Agendar Demo
                </Button>
              </div>
            </div>
            <div className="relative animate-float">
              <img
                src="/photo-1581091226825-a6a2a5aee158"
                alt="Pessoa usando Leadly"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload de Chamadas</h3>
              <p className="text-gray-600">
                Faça upload das suas gravações de atendimento de forma simples e segura
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Análise Automática</h3>
              <p className="text-gray-600">
                Nossa IA analisa as conversas e extrai insights valiosos automaticamente
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Resultados Práticos</h3>
              <p className="text-gray-600">
                Receba relatórios detalhados e ações práticas para melhorar suas conversões
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Benefícios</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Economia de Tempo</h3>
                <p className="text-gray-600">Automatize a análise de chamadas e foque no que importa</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Insights Valiosos</h3>
                <p className="text-gray-600">Descubra padrões e oportunidades de melhoria nas conversas</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Aumento nas Conversões</h3>
                <p className="text-gray-600">Melhore suas taxas de conversão com dados precisos</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Treinamento Eficiente</h3>
                <p className="text-gray-600">Use casos reais para treinar sua equipe de vendas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "O Leadly transformou completamente nossa forma de avaliar chamadas. Aumentamos nossas conversões em 40%!"
              </p>
              <div className="flex items-center">
                <img
                  src="/photo-1519389950473-47ba0277781c"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Ana Silva</p>
                  <p className="text-sm text-gray-500">Gerente de Vendas</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "A análise automática nos ajudou a identificar pontos de melhoria que nem sabíamos que existiam."
              </p>
              <div className="flex items-center">
                <img
                  src="/photo-1649972904349-6e44c42644a7"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Carlos Santos</p>
                  <p className="text-sm text-gray-500">Diretor Comercial</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "Economizamos horas de trabalho manual e melhoramos a qualidade das nossas análises."
              </p>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Marina Costa</p>
                  <p className="text-sm text-gray-500">Supervisora de Equipe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comece a otimizar suas vendas hoje
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de empresas que já transformaram suas vendas com o Leadly
          </p>
          <Button size="lg" variant="secondary" className="text-lg">
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Leadly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
