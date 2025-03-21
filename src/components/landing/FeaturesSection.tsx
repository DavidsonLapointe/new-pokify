
import { Clock, Target, Link, BrainCircuit, Shield, Zap } from "lucide-react";

export function FeaturesSection() {
  return (
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
              Automatize tarefas repetitivas em todos os departamentos e libere sua equipe para atividades estratégicas.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">IA Avançada</h3>
            <p className="text-gray-600">
              Modelos de IA de última geração que se adaptam às necessidades específicas de cada departamento.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Integração Total</h3>
            <p className="text-gray-600">
              Conecta-se facilmente com suas ferramentas existentes, como CRM, ERP e plataformas de colaboração.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Personalização</h3>
            <p className="text-gray-600">
              Ferramentas adaptáveis às necessidades específicas de cada área da sua empresa.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Segurança</h3>
            <p className="text-gray-600">
              Proteção de dados rigorosa e conformidade com regulamentações de privacidade.
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Escalabilidade</h3>
            <p className="text-gray-600">
              Cresce com seu negócio, atendendo desde startups até grandes corporações.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
