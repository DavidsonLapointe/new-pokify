
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";

interface StatusSectionProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  currentStatus: string;
}

export const StatusSection = ({ form, currentStatus }: StatusSectionProps) => {
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

  const availableStatusOptions = getAvailableStatusOptions(currentStatus);

  return (
    <div className="border-t pt-4 mt-4">
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Status da Empresa:</FormLabel>
              <Badge className={getStatusColor(currentStatus)}>
                {getStatusLabel(currentStatus)}
              </Badge>
            </div>
            <Select onValueChange={field.onChange}>
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
  );
};
