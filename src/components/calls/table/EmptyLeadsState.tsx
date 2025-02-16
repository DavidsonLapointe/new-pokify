
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CreateLeadDialog } from "../CreateLeadDialog";

interface EmptyLeadsStateProps {
  isCreateLeadOpen: boolean;
  setIsCreateLeadOpen: (open: boolean) => void;
}

export const EmptyLeadsState = ({
  isCreateLeadOpen,
  setIsCreateLeadOpen
}: EmptyLeadsStateProps) => {
  const handleCreateLead = (data: any) => {
    console.log("Novo lead:", data);
    setIsCreateLeadOpen(false);
  };

  const handleUploadClick = (data: any) => {
    console.log("Upload para novo lead:", data);
    setIsCreateLeadOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="bg-muted/50 rounded-full p-3 mb-4">
        <UserPlus className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Cadastre um novo lead para começar a fazer upload de chamadas e análises.
      </p>
      <Button 
        variant="secondary" 
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
