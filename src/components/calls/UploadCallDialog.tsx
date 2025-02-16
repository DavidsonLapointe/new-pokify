
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProcessingOverlay } from "./ProcessingOverlay";

interface UploadCallDialogProps {
  leadId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
  onCancel?: () => void;
}

export const UploadCallDialog = ({
  leadId,
  isOpen,
  onOpenChange,
  onUploadSuccess,
  onCancel,
}: UploadCallDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('audio/') || selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo de áudio ou vídeo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Aqui seria implementada a lógica de upload e processamento
      // 1. Upload do arquivo
      // 2. Envio para processamento LLM
      // 3. Atualização do status

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando processamento

      toast({
        title: "Arquivo enviado com sucesso",
        description: "O arquivo será processado em breve.",
      });
      
      onUploadSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Chamada</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">Arquivo de áudio ou vídeo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {file.name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleProcess}
                disabled={!file || isUploading}
              >
                {isUploading ? "Processando..." : "Processar arquivo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProcessingOverlay 
        isVisible={isUploading} 
        message="Processando arquivo. Por favor, aguarde..."
      />
    </>
  );
};
