
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CreateLeadDialog } from "../CreateLeadDialog";
import { LeadFormData } from "@/schemas/leadFormSchema";

interface EmptyLeadsStateProps {
  isCreateLeadOpen: boolean;
  setIsCreateLeadOpen: (open: boolean) => void;
}

export const EmptyLeadsState = ({
  isCreateLeadOpen,
  setIsCreateLeadOpen
}: EmptyLeadsStateProps) => {
  const handleCreateLead = (data: LeadFormData) => {
    console.log("Novo lead:", data);
    setIsCreateLeadOpen(false);
  };

  const handleUploadClick = () => {
    console.log("Upload para novo lead");
    setIsCreateLeadOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="bg-[#F1F0FB] rounded-full p-3 mb-4">
        <UserPlus className="w-6 h-6 text-[#9b87f5]" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Cadastre um novo lead para começar a fazer upload de arquivos de audio e video dele.
      </p>
      <Button 
        variant="default"
        className="bg-[#9b87f5] text-white hover:bg-[#8b76f4]"
        onClick={() => setIsCreateLeadOpen(true)}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Cadastrar Novo Lead
      </Button>

      <CreateLeadDialog
        hasPhoneIntegration={true}
        hasEmailIntegration={true}
        onCreateLead={handleCreateLead}
        onUploadClick={handleUploadClick}
        isOpen={isCreateLeadOpen}
        onOpenChange={setIsCreateLeadOpen}
      />
    </div>
  );
};
