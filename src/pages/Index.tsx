
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Target, Link, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Gerente de Vendas",
      company: "TechCorp",
      image: "/photo-1519389950473-47ba0277781c",
      text: "O Leadly transformou completamente nossa forma de avaliar chamadas. Aumentamos nossas conversões em 40%!"
    },
    {
      name: "Carlos Santos",
      role: "Diretor Comercial",
      company: "InnovaSales",
      image: "/photo-1649972904349-6e44c42644a7",
      text: "A análise automática nos ajudou a identificar pontos de melhoria que nem sabíamos que existiam."
    },
    {
      name: "Marina Costa",
      role: "Supervisora de Equipe",
      company: "VendaMais",
      image: "/placeholder.svg",
      text: "Economizamos horas de trabalho manual e melhoramos a qualidade das nossas análises."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-2xl text-gray-900">Leadly</div>
            <Button onClick={() => window.location.href = "/auth"}>
              Acessar Plataforma
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-primary/10 rounded-full px-4 py-2 text-primary font-medium mb-6">
                Tecnologia de ponta em Vendas
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Transforme suas chamadas
                </span>{" "}
                em oportunidades reais
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Automatize a análise de chamadas, identifique padrões e aumente suas conversões com inteligência artificial
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="text-lg">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Ver Demonstração
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">98%</div>
                  <div className="text-sm text-gray-600">Precisão</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">2.5x</div>
                  <div className="text-sm text-gray-600">Produtividade</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">24/7</div>
                  <div className="text-sm text-gray-600">Suporte</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative animate-float">
                <img
                  src="/photo-1581091226825-a6a2a5aee158"
                  alt="Pessoa usando Leadly"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 h-5 w-5" />
                    <span className="font-medium">Lead Qualificado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Por que escolher nossa solução?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Economia de Tempo</h3>
              <p className="text-gray-600">
                Automatize suas análises e foque no que realmente importa: fechar negócios.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Maior Precisão</h3>
              <p className="text-gray-600">
                Nossa IA garante análises precisas e consistentes em todas as chamadas.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Link className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Integração Total</h3>
              <p className="text-gray-600">
                Conecte-se facilmente com suas ferramentas existentes de CRM e vendas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  <p className="text-gray-500">{testimonials[currentTestimonial].company}</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="icon" onClick={prevTestimonial}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextTestimonial}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para automatizar seu processo de vendas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de empresas que já transformaram suas vendas com o Leadly
          </p>
          <Button size="lg" variant="secondary" className="text-lg">
            Começar Gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Leadly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
