
import React from "react";
import { Organization } from "@/types";
import { OrganizationFormFields } from "./organization-form-fields";
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
            <OrganizationFormFields form={form} />

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
