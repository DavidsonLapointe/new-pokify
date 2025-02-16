
import { Button } from "@/components/ui/button";
import { CallsHeader } from "@/components/calls/CallsHeader";
import { Upload, UserPlus } from "lucide-react";

interface LeadsPageHeaderProps {
  onUploadClick: () => void;
  onNewLeadClick: () => void;
}

export const LeadsPageHeader = ({ onUploadClick, onNewLeadClick }: LeadsPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CallsHeader 
        title="Análise de Leads"
        description="Visualize e gerencie todos os leads e suas chamadas"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onUploadClick}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>

        <Button onClick={onNewLeadClick}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>
    </div>
  );
};
