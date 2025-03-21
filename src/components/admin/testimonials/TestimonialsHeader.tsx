
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TestimonialsHeaderProps {
  onCreateNew: () => void;
}

export function TestimonialsHeader({ onCreateNew }: TestimonialsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">Depoimentos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os depoimentos exibidos na página inicial
        </p>
      </div>
      <Button onClick={onCreateNew}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Depoimento
      </Button>
    </div>
  );
}
