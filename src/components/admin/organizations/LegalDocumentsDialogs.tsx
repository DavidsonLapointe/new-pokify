
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Termos de Uso</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao acessar e utilizar a plataforma Leadly, você concorda em cumprir estes Termos de Uso.
            Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyPolicyDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Política de Privacidade</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold mb-4">1. Coleta de Dados</h2>
          <p className="mb-4">
            A Leadly coleta e processa informações pessoais necessárias para fornecer nossos serviços.
            Protegemos seus dados de acordo com as leis de proteção de dados aplicáveis.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SupportFormDialog({ 
  open, 
  onOpenChange,
  children 
}: TermsDialogProps & { children: React.ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Envie sua mensagem</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
