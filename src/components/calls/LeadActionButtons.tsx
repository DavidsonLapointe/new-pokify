
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { LeadCalls } from "./types";
import { AIInteractionsModal } from "./AIInteractionsModal";
import { useState } from "react";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadActionButtonsProps {
  lead: LeadCalls;
  onEditLead: (lead: LeadCalls) => void;
}

export const LeadActionButtons = ({ lead, onEditLead }: LeadActionButtonsProps) => {
  const [isInteractionsModalOpen, setIsInteractionsModalOpen] = useState(false);
  
  // Format date function for the interactions modal
  const formatDate = (date: string) => {
    return formatRelative(new Date(date), new Date(), { locale: ptBR });
  };

  const handleOpenInteractionsModal = () => {
    setIsInteractionsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditLead(lead)}
          className="h-8 w-8 text-[#9b87f5] hover:text-[#7E69AB]"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar lead</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenInteractionsModal}
          className="h-8 w-8 text-[#9b87f5] hover:text-[#7E69AB]"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver interações IA</span>
        </Button>
      </div>

      {isInteractionsModalOpen && (
        <AIInteractionsModal
          isOpen={isInteractionsModalOpen}
          onOpenChange={setIsInteractionsModalOpen}
          lead={lead}
          formatDate={formatDate}
        />
      )}
    </>
  );
};
