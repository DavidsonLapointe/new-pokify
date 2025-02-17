
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/organization";
import { X } from "lucide-react";

interface IntegrationAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hasIntegrationsAccess: boolean;
  integrationUsers: User[];
  missingIntegrations: {
    crm: boolean;
    llm: boolean;
  };
}

export const IntegrationAlertDialog = ({
  isOpen,
  onOpenChange,
  hasIntegrationsAccess,
  integrationUsers,
  missingIntegrations,
}: IntegrationAlertDialogProps) => {
  const navigate = useNavigate();

  const getMissingIntegrationsText = () => {
    const missing = [];
    if (missingIntegrations.crm) missing.push("CRM");
    if (missingIntegrations.llm) missing.push("LLM");
    return missing.join(" e ");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </Button>

        <AlertDialogHeader>
          <AlertDialogTitle>Integrações Necessárias</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Para cadastrar novos leads, é necessário ter as integrações de {getMissingIntegrationsText()} ativas.
            </p>

            {hasIntegrationsAccess ? (
              <div className="space-y-4">
                <p>
                  Como você tem acesso às integrações, pode configurá-las agora mesmo:
                </p>
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/organization/integrations");
                  }}
                >
                  Configurar Integrações
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  Por favor, entre em contato com um dos usuários abaixo que têm acesso
                  para configurar as integrações:
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  {integrationUsers.map((user) => (
                    <li key={user.id} className="text-sm">
                      <span className="font-medium">{user.name}</span>
                      {user.email && (
                        <span className="text-muted-foreground"> - {user.email}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
