
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tool } from "../types";

interface CancelModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancelModuleId: string | null;
  cancelReason: string;
  onCancelReasonChange: (reason: string) => void;
  onConfirm: () => void;
  tools: Tool[];
}

export const CancelModuleDialog: React.FC<CancelModuleDialogProps> = ({
  open,
  onOpenChange,
  cancelModuleId,
  cancelReason,
  onCancelReasonChange,
  onConfirm,
  tools
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Cancelar Módulo
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p>
            Você está prestes a cancelar o módulo "{tools.find(t => t.id === cancelModuleId)?.title}".
            Esta ação não pode ser desfeita.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Motivo do cancelamento</Label>
            <Textarea 
              id="cancelReason" 
              placeholder="Por favor, informe o motivo do cancelamento"
              value={cancelReason}
              onChange={(e) => onCancelReasonChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Voltar
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
