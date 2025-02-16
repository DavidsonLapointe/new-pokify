
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CallProcessingDialogsProps {
  showReprocessDialog: boolean;
  showProcessDialog: boolean;
  onReprocessDialogChange: (open: boolean) => void;
  onProcessDialogChange: (open: boolean) => void;
  onConfirmReprocess: () => void;
  onConfirmProcess: () => void;
}

export const CallProcessingDialogs = ({
  showReprocessDialog,
  showProcessDialog,
  onReprocessDialogChange,
  onProcessDialogChange,
  onConfirmReprocess,
  onConfirmProcess,
}: CallProcessingDialogsProps) => {
  return (
    <>
      <AlertDialog open={showReprocessDialog} onOpenChange={onReprocessDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reprocessar chamada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reprocessar esta chamada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmReprocess}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reprocessar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showProcessDialog} onOpenChange={onProcessDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Processar chamada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja processar esta chamada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmProcess}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Processar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
