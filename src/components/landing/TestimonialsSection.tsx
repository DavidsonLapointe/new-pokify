
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch testimonials from localStorage, fallback to default if not found
    const fetchTestimonials = () => {
      try {
        const storedTestimonials = localStorage.getItem('testimonials');
        if (storedTestimonials) {
          setTestimonials(JSON.parse(storedTestimonials));
        } else {
          // Fallback to default testimonials if none found in localStorage
          const defaultTestimonials = [
            {
              id: "1",
              name: "Ana Silva",
              role: "Gerente de Vendas",
              company: "TechCorp",
              image: "/photo-1519389950473-47ba0277781c",
              text: "O Leadly transformou completamente nosso departamento de vendas. Além da análise de chamadas, as ferramentas de IA para prospecção nos ajudaram a aumentar conversões em 40%!"
            },
            {
              id: "2",
              name: "Carlos Santos",
              role: "Diretor de Operações",
              company: "InnovaSys",
              image: "/photo-1649972904349-6e44c42644a7",
              text: "Implementamos o Leadly em três departamentos diferentes e os resultados foram surpreendentes. A eficiência operacional aumentou significativamente com a automação de processos."
            },
            {
              id: "3",
              name: "Marina Costa",
              role: "Diretora de RH",
              company: "VendaMais",
              image: "/photo-1581091226825-a6a2a5aee158",
              text: "As ferramentas de IA do Leadly para recrutamento e desenvolvimento de talentos mudaram nossa maneira de trabalhar. Economizamos tempo e melhoramos a qualidade das contratações."
            },
            {
              id: "4",
              name: "Pedro Almeida",
              role: "CEO",
              company: "SalesForce",
              image: "/photo-1486312338219-ce68d2c6f44d",
              text: "A integração da IA em diversos setores da empresa aumentou nossa produtividade em 30%. A plataforma é incrivelmente intuitiva e adaptável às necessidades específicas de cada equipe."
            },
            {
              id: "5",
              name: "Juliana Torres",
              role: "Diretora de Marketing",
              company: "TechSales",
              image: "/photo-1519389950473-47ba0277781c",
              text: "As ferramentas de análise de dados e geração de conteúdo do Leadly revolucionaram nossas estratégias de marketing. Os insights automatizados nos ajudaram a direcionar campanhas com muito mais precisão."
            }
          ];
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="py-20 bg-gradient-to-b from-gray-50 to-white">Carregando...</div>;
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          O que nossos clientes dizem
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Descubra como empresas estão transformando seus departamentos com nossa plataforma de IA
        </p>
        
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
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
