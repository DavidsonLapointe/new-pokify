
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const mockOrganization: Organization = {
    id: "1",
    name: "Empresa Exemplo LTDA",
    nomeFantasia: "Empresa Exemplo",
    cnpj: "12.345.678/0001-90",
    plan: "professional",
    status: "pending",
    pendingReason: "contract_signature",
    email: "contato@exemplo.com",
    phone: "(11) 99999-9999",
    adminName: "João Silva",
    adminEmail: "joao@exemplo.com",
    users: [],
    integratedCRM: null,
    integratedLLM: null,
    createdAt: new Date().toISOString(),
  };
  
  const organization = location.state?.organization || mockOrganization;

  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados do formulário:", data);
      
      if (organization && organization.id) {
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ 
            status: 'active',
            pending_reason: null 
          })
          .eq('id', organization.id);
          
        if (updateError) {
          console.error("Erro ao atualizar organização:", updateError);
          throw updateError;
        }
      }
      
      toast({
        title: "Cadastro confirmado!",
        description: "Você já pode fazer login no sistema.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao confirmar cadastro",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Dados do suporte:", supportForm);
      
      toast({
        title: "Mensagem enviada!",
        description: "Retornaremos em breve.",
      });

      setShowSupportForm(false);
      setSupportForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <h1 className="text-xl font-semibold text-primary">Leadly</h1>
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1F2C] mb-2">
            Bem-vindo à Leadly!
          </h2>
          <p className="text-[#8E9196] max-w-2xl mx-auto">
            Complete seu cadastro para começar a transformar suas chamadas em oportunidades de negócio
          </p>
        </div>

        <Card className="w-full shadow-lg border-[#E5DEFF]">
          <CardHeader className="border-b border-[#E5DEFF] bg-[#F1F0FB] rounded-t-lg">
            <CardTitle className="text-[#6E59A5]">Confirmar Registro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para concluir seu cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ConfirmRegistrationForm 
              organization={organization} 
              onSubmit={handleSubmit}
              onShowTerms={() => setShowTerms(true)}
              onShowPrivacyPolicy={() => setShowPrivacyPolicy(true)} 
            />
          </CardContent>
        </Card>

        <div className="text-center mt-6 mb-8">
          <button 
            onClick={() => setShowSupportForm(true)}
            className="text-sm text-[#8E9196] hover:underline transition-all"
          >
            Precisa de ajuda? Entre em contato com nosso suporte
          </button>
        </div>
      </div>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
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

      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
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

      <Dialog open={showSupportForm} onOpenChange={setShowSupportForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Envie sua mensagem</DialogTitle>
            <DialogDescription>
              Sua mensagem será enviada para suporte@leadly.com.br. Nossa equipe responderá o mais breve possível.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-0.5">
                Seu Nome <span>*</span>
              </Label>
              <Input
                id="name"
                value={supportForm.name}
                onChange={(e) => setSupportForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-0.5">
                Seu Email <span>*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={supportForm.email}
                onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-0.5">
                Mensagem <span>*</span>
              </Label>
              <Textarea
                id="message"
                value={supportForm.message}
                onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                Enviar mensagem
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
