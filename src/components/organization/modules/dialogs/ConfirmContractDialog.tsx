
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap } from "lucide-react";
import { Link } from "@/components/ui/link";
import { Tool } from "../types";

interface ConfirmContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTool: Tool | null;
  tools: Tool[];
  onConfirm: () => void;
  onOpenTerms: (e: React.MouseEvent) => void;
}

export const ConfirmContractDialog: React.FC<ConfirmContractDialogProps> = ({
  open,
  onOpenChange,
  selectedTool,
  tools,
  onConfirm,
  onOpenTerms
}) => {
  // Formatação de preço em formato brasileiro
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const tool = tools.find(t => t.id === selectedTool?.id);

  if (!tool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Contratar Módulo
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            Você está prestes a contratar o módulo "{tool.title}". 
            O valor de {formatPrice(tool.price)} será cobrado como setup (pagamento único).
          </p>
          
          {tool.credits && (
            <div className="bg-amber-50 p-3 rounded-md mb-4 flex items-start text-sm">
              <Zap className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-amber-800">
                Este módulo consome <strong>{tool.credits}</strong> créditos por execução.
              </p>
            </div>
          )}
          
          <div className="bg-amber-50 p-3 rounded-md mb-6 flex items-start text-sm">
            <CreditCard className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-amber-800">
              A cobrança será realizada no cartão de crédito já cadastrado no sistema.
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            Ao confirmar, você concorda com os{" "}
            <Link 
              href="#"
              className="text-primary underline hover:text-primary/90"
              onClick={onOpenTerms}
            >
              termos de uso
            </Link>{" "}
            deste módulo.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirmar Contratação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
