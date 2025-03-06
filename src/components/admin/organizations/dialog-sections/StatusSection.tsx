
import React from "react";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { StatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";

interface StatusSectionProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  currentStatus: string;
}

export const StatusSection = ({ form, currentStatus }: StatusSectionProps) => {
  return (
    <div className="border-t pt-4 mt-4">
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Status da Empresa:</FormLabel>
              <StatusBadge status={currentStatus} />
            </div>
            <StatusSelector form={form} currentStatus={currentStatus} />
          </FormItem>
        )}
      />
    </div>
  );
};
