
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TestimonialsHeader } from "@/components/admin/testimonials/TestimonialsHeader";
import { TestimonialsList } from "@/components/admin/testimonials/TestimonialsList";
import { EditTestimonialDialog } from "@/components/admin/testimonials/EditTestimonialDialog";
import { useTestimonials } from "@/hooks/admin/useTestimonials";
import { Testimonial } from "@/types/testimonial";

const AdminTestimonials = () => {
  const { 
    testimonials, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
  } = useTestimonials();
  
  const [open, setOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

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
    <div className="space-y-6">
      <TestimonialsHeader />
      
      <div className="flex justify-end">
        <Button onClick={handleAddTestimonial}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Depoimento
        </Button>
      </div>

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
  );
};

export default AdminTestimonials;
