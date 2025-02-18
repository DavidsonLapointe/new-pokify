
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface NoFunnelAlertProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  onCreateFunnel: () => void;
}

export const NoFunnelAlert = ({ isOpen, onClose, onCreateFunnel }: NoFunnelAlertProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nenhum Funil Cadastrado</AlertDialogTitle>
          <AlertDialogDescription>
            Para cadastrar uma nova etapa, é necessário primeiro criar pelo menos um funil.
            Clique no botão "Novo Funil" ao lado para criar um.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onClose(false)}
            className="bg-[#F1F1F1] text-primary hover:bg-[#E5E5E5]"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onCreateFunnel}>
            Criar Novo Funil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
