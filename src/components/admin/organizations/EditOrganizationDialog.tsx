
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/types";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrganizationFormFields } from "./organization-form-fields";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface EditOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization;
  onSave: (organization: Organization) => void;
}

export const EditOrganizationDialog = ({
  open,
  onOpenChange,
  organization,
  onSave,
}: EditOrganizationDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      razaoSocial: organization.name,
      nomeFantasia: organization.nomeFantasia || "",
      cnpj: organization.cnpj || "",
      email: organization.email || "",
      phone: organization.phone || "",
      plan: (organization.plan.toLowerCase() || "professional") as "basic" | "professional" | "enterprise",
      adminName: organization.adminName || "",
      adminEmail: organization.adminEmail || "",
      status: organization.status,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  const getAvailableStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "active":
        return [{ value: "inactive", label: "Inativo" }];
      case "inactive":
        return [{ value: "active", label: "Ativo" }];
      case "pending":
        return [{ value: "inactive", label: "Inativo" }];
      default:
        return [];
    }
  };

  const getPendingReasonDescription = (reason: string | null | undefined) => {
    if (!reason) return null;

    const reasons: { [key: string]: { description: string, action: string } } = {
      contract_signature: {
        description: "O contrato ainda não foi assinado pelo cliente.",
        action: "Envie um lembrete de assinatura ou entre em contato com o cliente."
      },
      payment: {
        description: "O pagamento não foi confirmado.",
        action: "Verifique o status do pagamento ou entre em contato com o cliente."
      },
      pro_rata_payment: {
        description: "O pagamento pro-rata ainda não foi realizado.",
        action: "Envie um lembrete de pagamento ou entre em contato com o cliente."
      },
      user_validation: {
        description: "O usuário administrador não validou seus dados ou não criou uma senha.",
        action: "Envie um novo e-mail de validação ou entre em contato com o administrador."
      },
      approval: {
        description: "A empresa está aguardando aprovação administrativa.",
        action: "Analise as informações da empresa e aprove-a se estiver tudo correto."
      }
    };

    return reasons[reason] || { 
      description: "Pendência não especificada.", 
      action: "Entre em contato com o suporte técnico."
    };
  };

  const onSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("Submitting form with values:", values);
      
      const { data, error } = await supabase
        .from('organizations')
        .update({
          name: values.razaoSocial,
          nome_fantasia: values.nomeFantasia,
          cnpj: values.cnpj,
          email: values.email,
          phone: values.phone,
          plan: values.plan,
          admin_name: values.adminName,
          admin_email: values.adminEmail,
          status: values.status
        })
        .eq('id', organization.id)
        .select();
      
      if (error) {
        console.error("Erro ao atualizar organização no Supabase:", error);
        toast({
          title: "Erro ao atualizar empresa",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Organização atualizada com sucesso no Supabase:", data);

      const updatedOrganization: Organization = {
        ...organization,
        name: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cnpj: values.cnpj,
        email: values.email,
        phone: values.phone,
        plan: values.plan,
        adminName: values.adminName,
        adminEmail: values.adminEmail,
        status: values.status,
      };

      onSave(updatedOrganization);
      
      toast({
        title: "Empresa atualizada com sucesso",
        description: "As alterações foram salvas.",
      });
    } catch (err) {
      console.error("Erro ao processar atualização:", err);
      toast({
        title: "Erro ao atualizar empresa",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const availableStatusOptions = getAvailableStatusOptions(organization.status);
  const pendingInfo = organization.status === "pending" ? 
    getPendingReasonDescription(organization.pendingReason) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Atualize os dados da empresa.
          </DialogDescription>
        </DialogHeader>

        {organization.status === "pending" && pendingInfo && (
          <Card className="border-yellow-200 bg-yellow-50 mb-4">
            <CardContent className="pt-4">
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Pendência: {getPendingReasonDescription(organization.pendingReason)?.description}</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Ação recomendada: {pendingInfo.action}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <OrganizationFormFields form={form} />

            <div className="border-t pt-4 mt-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Status da Empresa:</FormLabel>
                      <Badge className={getStatusColor(organization.status)}>
                        {getStatusLabel(organization.status)}
                      </Badge>
                    </div>
                    <Select 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o novo status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="cancel"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
