
import React from "react";
import { Organization } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEditOrganizationForm } from "./hooks/useEditOrganizationForm";
import { StatusSection } from "./dialog-sections/StatusSection";
import { Badge } from "@/components/ui/badge";
import { mockModules } from "@/components/admin/modules/module-constants";
import { iconMap } from "@/components/admin/modules/module-constants";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlans } from "./hooks/use-plans";

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
  const { form, onSubmit } = useEditOrganizationForm(
    organization, 
    onSave, 
    () => onOpenChange(false)
  );
  const { plans } = usePlans();

  // Parse modules string to array if needed
  const organizationModules = organization.modules ? 
    (typeof organization.modules === 'string' ? 
      organization.modules.split(',') : 
      organization.modules) : 
    [];

  // Map module IDs to their names using the mockModules data
  const getModuleName = (moduleId: string) => {
    const module = mockModules.find(m => m.id.toString() === moduleId);
    return module ? module.name : moduleId;
  };

  // Get icon component for a module
  const getModuleIcon = (moduleId: string) => {
    const module = mockModules.find(m => m.id.toString() === moduleId);
    if (module && module.icon && iconMap[module.icon as keyof typeof iconMap]) {
      const IconComponent = iconMap[module.icon as keyof typeof iconMap];
      return <IconComponent className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Atualize os dados da empresa.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a razão social" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nomeFantasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Fantasia</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome fantasia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00.000.000/0000-00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans.length > 0 ? (
                          plans.map((plan) => (
                            <SelectItem key={plan.id} value={String(plan.id)}>
                              {plan.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-plans" disabled>
                            Nenhum plano disponível
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email da Empresa</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="contato@empresa.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone da Empresa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contracted Modules Section - Read Only */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Módulos Contratados</h3>
              {organizationModules.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {organizationModules.map((moduleId) => (
                    <Badge 
                      key={moduleId}
                      variant="outline" 
                      className="flex items-center gap-1 bg-primary-lighter"
                    >
                      {getModuleIcon(moduleId)}
                      {getModuleName(moduleId)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum módulo contratado.
                </p>
              )}
              <p className="text-xs text-muted-foreground italic mt-1">
                A contratação e cancelamento de módulos é realizada pelo usuário administrador da empresa.
              </p>
            </div>

            {/* Admin Data Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="bg-[#F8F6FF] p-3 rounded-lg border border-[#E5DEFF] mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-1 bg-[#9b87f5] rounded-full"></div>
                  <h3 className="text-base font-medium text-[#6E59A5]">Dados do Administrador</h3>
                </div>
                <p className="text-xs text-gray-600 ml-4 mt-1">
                  Informe os dados do usuário que será o administrador inicial da empresa
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Administrador</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do Administrador</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="admin@empresa.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Status Section - Moved to end */}
            <StatusSection 
              form={form} 
              currentStatus={organization.status} 
            />

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
