
import { Button } from "@/components/ui/button";
import { Eye, Upload } from "lucide-react";
import { LeadCalls } from "./types";

interface LeadActionButtonsProps {
  lead: LeadCalls;
  onShowHistory: (lead: LeadCalls) => void;
  onShowUpload: (lead: LeadCalls) => void;
}

export const LeadActionButtons = ({ lead, onShowHistory, onShowUpload }: LeadActionButtonsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onShowHistory(lead)}
        className="text-[#7E69AB] hover:text-[#9b87f5] h-7 w-7"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onShowUpload(lead)}
        className="text-[#7E69AB] hover:text-[#9b87f5] h-7 w-7"
      >
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
};
