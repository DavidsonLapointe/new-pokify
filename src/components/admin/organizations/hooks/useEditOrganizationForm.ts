
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Organization, OrganizationStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { createOrganizationSchema, type CreateOrganizationFormData } from "../schema";

export const useEditOrganizationForm = (
  organization: Organization,
  onSave: (organization: Organization) => void,
  onClose: () => void
) => {
  const { toast } = useToast();
  
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      razaoSocial: organization.name,
      nomeFantasia: organization.nomeFantasia || "",
      cnpj: organization.cnpj || "",
      email: organization.email || "",
      phone: organization.phone || "",
      plan: typeof organization.plan === 'string' ? organization.plan : organization.plan.id,
      adminName: organization.adminName || "",
      adminEmail: organization.adminEmail || "",
      status: organization.status,
    },
  });

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
          status: values.status as string // Cast to string for the database
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

      // After update, fetch the updated plan name
      const { data: planData } = await supabase
        .from('plans')
        .select('name')
        .eq('id', values.plan)
        .single();

      const planName = planData?.name || "Plano não especificado";

      const updatedOrganization: Organization = {
        ...organization,
        name: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cnpj: values.cnpj,
        email: values.email,
        phone: values.phone,
        plan: values.plan,
        planName: planName, // Use the fetched plan name
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

  return {
    form,
    onSubmit
  };
};
