
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeadCalls } from "@/components/calls/types";
import { Upload } from "lucide-react";
import { useState } from "react";
import { Lead } from "@/types/calls";

interface UploadCallsDialogProps {
  lead: LeadCalls;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (calls: Lead[]) => void;
}

export const UploadCallsDialog = ({
  lead,
  isOpen,
  onOpenChange,
  onUpload,
}: UploadCallsDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Aqui seria implementada a lógica de upload dos arquivos
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Upload de Chamadas - {lead.personType === "pf"
              ? `${lead.firstName} ${lead.lastName}`
              : lead.razaoSocial}
          </DialogTitle>
        </DialogHeader>
        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-200"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold">Arraste arquivos aqui</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ou clique para selecionar arquivos
          </p>
          <Button className="mt-4">Selecionar Arquivos</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
