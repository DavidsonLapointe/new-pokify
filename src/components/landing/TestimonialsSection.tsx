
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    text: "O Leadly transformou completamente nossa forma de avaliar chamadas. Aumentamos nossas conversões em 40% em apenas 3 meses de uso!"
  },
  {
    name: "Carlos Santos",
    role: "Diretor Comercial",
    company: "InnovaSales",
    image: "/photo-1649972904349-6e44c42644a7",
    text: "A análise automática nos ajudou a identificar pontos de melhoria que nem sabíamos que existiam. Nosso time está muito mais produtivo."
  },
  {
    name: "Marina Costa",
    role: "Supervisora de Equipe",
    company: "VendaMais",
    image: "/photo-1581091226825-a6a2a5aee158",
    text: "Economizamos horas de trabalho manual e melhoramos a qualidade das nossas análises. O retorno sobre o investimento foi impressionante!"
  },
  {
    name: "Pedro Almeida",
    role: "CEO",
    company: "SalesForce",
    image: "/placeholder.svg",
    text: "A plataforma é incrivelmente intuitiva e os insights gerados pela IA são muito precisos. Recomendo fortemente para qualquer equipe de vendas."
  },
  {
    name: "Juliana Torres",
    role: "Head de Vendas",
    company: "TechSales",
    image: "/placeholder.svg",
    text: "Desde que implementamos o Leadly, nossa equipe melhorou significativamente a taxa de conversão. Os relatórios automáticos são fantásticos!"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          O que nossos clientes dizem
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Descubra como empresas estão transformando suas vendas com nossa plataforma
        </p>
        
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-gray-700 italic leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/10"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 h-9 w-9 bg-white" />
          <CarouselNext className="hidden md:flex -right-12 h-9 w-9 bg-white" />
        </Carousel>
      </div>
    </section>
  );
}
