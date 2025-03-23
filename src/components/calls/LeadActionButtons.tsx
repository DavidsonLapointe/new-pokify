
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { LeadCalls } from "./types";

interface LeadActionButtonsProps {
  lead: LeadCalls;
  onEditLead: (lead: LeadCalls) => void;
}

export const LeadActionButtons = ({ lead, onEditLead }: LeadActionButtonsProps) => {
  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditLead(lead)}
        className="text-[#7E69AB] hover:text-[#9b87f5] h-7 w-7"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};
