
import React from "react";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { StatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";
import { OrganizationStatus } from "@/types/organization-types";

interface StatusSectionProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  currentStatus: string | OrganizationStatus;
}

export const StatusSection = ({ form, currentStatus }: StatusSectionProps) => {
  // Convert currentStatus to OrganizationStatus type
  const status = currentStatus as OrganizationStatus;
  
  return (
    <div className="border-t pt-4 mt-4">
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Status da Empresa:</FormLabel>
              <StatusBadge status={status} />
            </div>
            <StatusSelector form={form} currentStatus={status} />
          </FormItem>
        )}
      />
    </div>
  );
};
