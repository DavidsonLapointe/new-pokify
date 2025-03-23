
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { GenerateMonthlyTitlesModal } from "./GenerateMonthlyTitlesModal";

export const GenerateMonthlyTitlesButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="gap-2"
      >
        Gerar Títulos Mensais
      </Button>
      
      <GenerateMonthlyTitlesModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
};
