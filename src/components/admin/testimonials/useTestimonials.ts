
import { useState, useEffect } from 'react';
import { Testimonial } from './types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Use mock data for development
const initialTestimonials: Testimonial[] = [
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

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Load testimonials from local storage or use mock data
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // In a production environment, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('testimonials')
        //   .select('*')
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        
        // For development, we'll use local storage with fallback to mock data
        const storedTestimonials = localStorage.getItem('testimonials');
        if (storedTestimonials) {
          setTestimonials(JSON.parse(storedTestimonials));
        } else {
          setTestimonials(initialTestimonials);
          localStorage.setItem('testimonials', JSON.stringify(initialTestimonials));
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(initialTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Add a new testimonial
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const newTestimonial: Testimonial = {
        id: uuidv4(),
        ...testimonial
      };

      // In production, would insert to Supabase
      // const { error } = await supabase
      //   .from('testimonials')
      //   .insert(newTestimonial);
      
      // if (error) throw error;

      // For development, store in local storage
      const updatedTestimonials = [...testimonials, newTestimonial];
      setTestimonials(updatedTestimonials);
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
      
      return newTestimonial;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  };

  // Update an existing testimonial
  const updateTestimonial = async (testimonial: Testimonial) => {
    try {
      // In production, would update in Supabase
      // const { error } = await supabase
      //   .from('testimonials')
      //   .update(testimonial)
      //   .eq('id', testimonial.id);
      
      // if (error) throw error;

      // For development, update in local storage
      const updatedTestimonials = testimonials.map(t => 
        t.id === testimonial.id ? testimonial : t
      );
      
      setTestimonials(updatedTestimonials);
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
      
      return testimonial;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      // In production, would delete from Supabase
      // const { error } = await supabase
      //   .from('testimonials')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;

      // For development, remove from local storage
      const updatedTestimonials = testimonials.filter(t => t.id !== id);
      setTestimonials(updatedTestimonials);
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  };

  return {
    testimonials,
    loading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
}
