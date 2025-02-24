
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
}

const testimonials: Testimonial[] = [
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

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
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
  );
}
