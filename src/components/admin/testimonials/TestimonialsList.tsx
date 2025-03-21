
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Quote, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Testimonial } from "./types";
import { useTestimonials } from "./useTestimonials";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TestimonialsListProps {
  onEdit: (testimonial: Testimonial) => void;
}

export function TestimonialsList({ onEdit }: TestimonialsListProps) {
  const { testimonials, deleteTestimonial, loading } = useTestimonials();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  const handleDeleteClick = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (testimonialToDelete) {
      try {
        await deleteTestimonial(testimonialToDelete.id);
        toast.success("Depoimento excluído com sucesso");
      } catch (error) {
        toast.error("Erro ao excluir depoimento");
        console.error(error);
      } finally {
        setDeleteDialogOpen(false);
        setTestimonialToDelete(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <Card className="shadow-sm border-dashed border-2 p-8">
        <div className="text-center space-y-3">
          <Quote className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-xl font-medium">Nenhum depoimento cadastrado</h3>
          <p className="text-muted-foreground">
            Adicione depoimentos para exibir na página inicial
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center">
                  <Quote className="h-6 w-6 text-primary" />
                </div>
                
                <p className="text-gray-700 italic text-sm leading-relaxed line-clamp-4">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-4 pt-2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{testimonial.name}</h4>
                    <p className="text-xs text-gray-600 truncate">{testimonial.role}</p>
                    <p className="text-xs font-medium text-primary truncate">{testimonial.company}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(testimonial)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => handleDeleteClick(testimonial)}
                >
                  <Trash className="w-3.5 h-3.5 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir depoimento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o depoimento de{" "}
              <span className="font-medium">{testimonialToDelete?.name}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
