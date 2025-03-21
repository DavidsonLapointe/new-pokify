
import { useState, useEffect } from "react";
import { Testimonial } from "@/types/testimonial";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Sample testimonials data - this would typically come from a database
const initialTestimonials: Testimonial[] = [
  {
    id: uuidv4(),
    name: "Ana Silva",
    role: "Gerente de Vendas",
    company: "TechCorp",
    image: "/photo-1519389950473-47ba0277781c",
    text: "O Leadly transformou completamente nosso departamento de vendas. Além da análise de chamadas, as ferramentas de IA para prospecção nos ajudaram a aumentar conversões em 40%!"
  },
  {
    id: uuidv4(),
    name: "Carlos Santos",
    role: "Diretor de Operações",
    company: "InnovaSys",
    image: "/photo-1649972904349-6e44c42644a7",
    text: "Implementamos o Leadly em três departamentos diferentes e os resultados foram surpreendentes. A eficiência operacional aumentou significativamente com a automação de processos."
  },
  {
    id: uuidv4(),
    name: "Marina Costa",
    role: "Diretora de RH",
    company: "VendaMais",
    image: "/photo-1581091226825-a6a2a5aee158",
    text: "As ferramentas de IA do Leadly para recrutamento e desenvolvimento de talentos mudaram nossa maneira de trabalhar. Economizamos tempo e melhoramos a qualidade das contratações."
  }
];

const STORAGE_KEY = "leadly_testimonials";

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Load testimonials from localStorage on mount
  useEffect(() => {
    const savedTestimonials = localStorage.getItem(STORAGE_KEY);
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    } else {
      // Use initial data if nothing is saved yet
      setTestimonials(initialTestimonials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTestimonials));
    }
  }, []);

  // Save testimonials to localStorage whenever they change
  useEffect(() => {
    if (testimonials.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
    }
  }, [testimonials]);

  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newTestimonial = {
      ...testimonial,
      id: uuidv4(),
    };
    setTestimonials([...testimonials, newTestimonial]);
    toast.success("Depoimento adicionado com sucesso!");
    return newTestimonial;
  };

  const updateTestimonial = (testimonial: Testimonial) => {
    setTestimonials(
      testimonials.map((t) => (t.id === testimonial.id ? testimonial : t))
    );
    toast.success("Depoimento atualizado com sucesso!");
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
    toast.success("Depoimento excluído com sucesso!");
  };

  return {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
};
