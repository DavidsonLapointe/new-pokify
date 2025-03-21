
import { useState } from "react";
import { TestimonialsHeader } from "@/components/admin/testimonials/TestimonialsHeader";
import { TestimonialsList } from "@/components/admin/testimonials/TestimonialsList";
import { EditTestimonialDialog } from "@/components/admin/testimonials/EditTestimonialDialog";
import { Testimonial } from "@/components/admin/testimonials/types";

export default function AdminTestimonials() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const handleCreateNew = () => {
    setSelectedTestimonial(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <TestimonialsHeader onCreateNew={handleCreateNew} />
      
      <TestimonialsList onEdit={handleEdit} />
      
      <EditTestimonialDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        testimonial={selectedTestimonial}
      />
    </div>
  );
}
