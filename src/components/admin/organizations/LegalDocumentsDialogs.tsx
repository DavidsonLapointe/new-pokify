
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId?: string;
  moduleName?: string;
}

export function TermsDialog({ open, onOpenChange, moduleId, moduleName }: TermsDialogProps) {
  // Definir termos específicos para cada módulo com base no moduleId
  const getModuleTerms = () => {
    switch (moduleId) {
      case "video":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">1. Termos de Uso - Prospecção com Vídeo</h2>
            <p className="mb-4">
              Ao contratar o módulo de Prospecção com Vídeo, você concorda em utilizar os avatares digitais 
              e vídeos gerados exclusivamente para fins comerciais legítimos, respeitando os direitos de imagem 
              e propriedade intelectual.
            </p>
            <h2 className="text-lg font-semibold mb-4">2. Limitações de Uso</h2>
            <p className="mb-4">
              Os vídeos gerados por este módulo consomem 5 créditos por execução e estão sujeitos às políticas 
              de uso justo da plataforma. A criação de conteúdo que viole direitos de terceiros ou que contenha 
              material ofensivo não é permitida.
            </p>
          </>
        );
      case "inbound":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">1. Termos de Uso - Atendente Inbound</h2>
            <p className="mb-4">
              Ao contratar o módulo de Atendente Inbound, você concorda em utilizar o assistente virtual para 
              fins de atendimento ao cliente e qualificação de leads, em conformidade com a legislação de proteção 
              de dados vigente.
            </p>
            <h2 className="text-lg font-semibold mb-4">2. Limitações de Uso</h2>
            <p className="mb-4">
              O assistente virtual é treinado para respostas específicas baseadas nas informações fornecidas. 
              Cada interação consome 3 créditos e há um limite mensal conforme seu plano. O cliente é responsável 
              pela precisão das informações fornecidas ao assistente.
            </p>
          </>
        );
      case "call":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">1. Termos de Uso - Análise de Call</h2>
            <p className="mb-4">
              Ao contratar o módulo de Análise de Call, você confirma que possui autorização para gravar e analisar 
              chamadas com seus clientes, em conformidade com a legislação de proteção de dados e privacidade.
            </p>
            <h2 className="text-lg font-semibold mb-4">2. Limitações de Uso</h2>
            <p className="mb-4">
              Cada análise de chamada consome 10 créditos. As gravações devem ter qualidade de áudio adequada 
              para garantir a precisão das análises. A plataforma não se responsabiliza por análises imprecisas 
              decorrentes de problemas de qualidade nas gravações originais.
            </p>
          </>
        );
      case "nutrition":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">1. Termos de Uso - Nutrição de Leads</h2>
            <p className="mb-4">
              Ao contratar o módulo de Nutrição de Leads, você se compromete a utilizar as funcionalidades de automação 
              de marketing em conformidade com as leis anti-spam e de proteção de dados aplicáveis.
            </p>
            <h2 className="text-lg font-semibold mb-4">2. Limitações de Uso</h2>
            <p className="mb-4">
              Cada campanha de nutrição consome 2 créditos. O cliente é responsável por obter as permissões 
              necessárias dos destinatários para envio de comunicações. O módulo não deve ser utilizado para envio 
              de conteúdo não solicitado ou spam.
            </p>
          </>
        );
      case "assistant":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">1. Termos de Uso - Assistente de Prospecção</h2>
            <p className="mb-4">
              Ao contratar o módulo de Assistente de Prospecção, você concorda em utilizar as informações geradas 
              pela IA apenas para fins comerciais legítimos, respeitando a privacidade de terceiros e as leis aplicáveis.
            </p>
            <h2 className="text-lg font-semibold mb-4">2. Limitações de Uso</h2>
            <p className="mb-4">
              Cada pesquisa ou sugestão gerada pelo assistente consome 7 créditos. O módulo oferece recomendações 
              baseadas em dados disponíveis, mas o cliente é responsável pela validação e uso adequado dessas informações.
            </p>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao acessar e utilizar a plataforma Leadly, você concorda em cumprir estes Termos de Uso.
              Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
            </p>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {moduleName ? `Termos de Uso - ${moduleName}` : "Termos de Uso"}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {getModuleTerms()}
          
          <h2 className="text-lg font-semibold mb-4">3. Responsabilidades</h2>
          <p className="mb-4">
            O cliente é inteiramente responsável pelo conteúdo gerado utilizando as ferramentas da plataforma,
            bem como pelo cumprimento de todas as leis e regulamentos aplicáveis relacionados ao seu uso.
          </p>
          
          <h2 className="text-lg font-semibold mb-4">4. Políticas de Cancelamento</h2>
          <p className="mb-4">
            O módulo pode ser cancelado a qualquer momento, porém o valor de setup não é reembolsável.
            Os créditos não utilizados serão mantidos em sua conta para uso em outros módulos disponíveis.
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
