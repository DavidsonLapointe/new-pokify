
import { Quote } from "lucide-react";

export const TestimonialsHeader = () => {
  return (
    <div className="flex items-center gap-3">
      <Quote className="h-6 w-6 text-primary" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Depoimentos</h1>
        <p className="text-muted-foreground">
          Gerencie os depoimentos exibidos na página inicial do site.
        </p>
      </div>
    </div>
  );
};
