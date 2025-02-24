
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
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          O que nossos clientes dizem
        </h2>
        
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="bg-white p-6 rounded-xl shadow-lg mx-2 h-full">
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>
                  <p className="text-gray-700 mb-6 min-h-[100px]">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
