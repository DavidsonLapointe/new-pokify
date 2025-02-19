
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProcessingOverlay } from "./ProcessingOverlay";
import { Call } from "@/types/calls";
import { v4 as uuidv4 } from "uuid";

interface UploadCallDialogProps {
  leadId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: (call?: Call) => void;
  onCancel?: () => void;
  leadInfo?: Call["leadInfo"];
}

export const UploadCallDialog = ({
  leadId,
  isOpen,
  onOpenChange,
  onUploadSuccess,
  onCancel,
  leadInfo,
}: UploadCallDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const getLeadName = () => {
    if (!leadInfo) return "";
    return leadInfo.personType === "pf"
      ? `${leadInfo.firstName} ${leadInfo.lastName || ""}`
      : leadInfo.razaoSocial || "";
  };

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

  const handleCancel = () => {
    if (!isUploading) {
      onCancel?.();
      onOpenChange(false);
      setFile(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Simula o upload e processamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Cria o objeto da nova chamada
      const newCall: Call = {
        id: uuidv4(),
        leadId,
        date: new Date().toISOString(),
        duration: "0:00",
        status: "success" as const,
        phone: leadInfo?.phone || "",
        seller: "Sistema",
        audioUrl: URL.createObjectURL(file),
        mediaType: file.type.startsWith('video/') ? "video" : "audio",
        leadInfo: leadInfo || {
          personType: "pf",
          firstName: "",
          phone: ""
        },
      };
      
      // Chama o callback de sucesso que vai atualizar o lead
      onUploadSuccess?.(newCall);
      
      // Fecha o modal e limpa o estado
      onOpenChange(false);
      setFile(null);
      
      // Mostra mensagem de sucesso
      toast({
        title: "Chamada processada com sucesso",
        description: "O arquivo foi processado e adicionado ao histórico do lead.",
      });
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open && !isUploading) {
            handleCancel();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Arquivo {getLeadName() ? `- ${getLeadName()}` : ''}</DialogTitle>
            <DialogDescription>
              Faça o upload do arquivo de áudio ou vídeo da chamada para processamento.
            </DialogDescription>
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
                  disabled={isUploading}
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
                variant="default"
                onClick={handleCancel}
                disabled={isUploading}
                className="bg-[#F1F1F1] text-primary hover:bg-[#E5E5E5]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleProcess}
                disabled={!file || isUploading}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Processar arquivo
                  </>
                )}
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
