
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { TestimonialsList } from "@/components/admin/testimonials/TestimonialsList";
import { EditTestimonialDialog } from "@/components/admin/testimonials/EditTestimonialDialog";
import { useTestimonials } from "@/hooks/admin/useTestimonials";
import { Testimonial } from "@/types/testimonial";

export const TestimonialsTab = () => {
  const { 
    testimonials, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
  } = useTestimonials();
  
  const [open, setOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  // Testimonials handlers
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setOpen(true);
  };

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setOpen(true);
  };

  const handleSaveTestimonial = (testimonial: Testimonial) => {
    if (editingTestimonial) {
      updateTestimonial(testimonial);
    } else {
      addTestimonial(testimonial);
    }
    setOpen(false);
  };

  const handleDeleteTestimonial = (id: string) => {
    deleteTestimonial(id);
  };

  return (
    <div className="text-left">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <CardTitle>Depoimentos</CardTitle>
          <p className="text-muted-foreground">
            Gerencie os depoimentos exibidos na página inicial do site.
          </p>
        </div>
        <Button onClick={handleAddTestimonial}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Depoimento
        </Button>
      </div>
      
      <div className="pt-6">
        <div className="space-y-6">
          <TestimonialsList 
            testimonials={testimonials}
            onEdit={handleEditTestimonial}
            onDelete={handleDeleteTestimonial}
          />

          <EditTestimonialDialog
            open={open}
            onOpenChange={setOpen}
            testimonial={editingTestimonial}
            onSave={handleSaveTestimonial}
          />
        </div>
      </div>
    </div>
  );
};
