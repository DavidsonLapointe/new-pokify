
import React from "react";
import { FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";
import { OrganizationStatus } from "@/types/organization-types";

interface StatusSelectorProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  currentStatus: OrganizationStatus;
}

export const StatusSelector = ({ form, currentStatus }: StatusSelectorProps) => {
  const getAvailableStatusOptions = (currentStatus: OrganizationStatus) => {
    switch (currentStatus) {
      case "active":
        return [{ value: "inactive", label: "Inativo" }];
      case "inactive":
        return [{ value: "active", label: "Ativo" }];
      case "pending":
        return [{ value: "inactive", label: "Inativo" }];
      case "suspended":
        return [{ value: "active", label: "Ativo" }, { value: "inactive", label: "Inativo" }];
      case "canceled":
        return [{ value: "active", label: "Ativo" }];
      default:
        return [];
    }
  };

  const availableStatusOptions = getAvailableStatusOptions(currentStatus);

  // Handling the value change with proper type casting
  const handleValueChange = (value: string) => {
    // Only set the value if it's a valid organization status
    if (value === "active" || value === "pending" || value === "inactive" || 
        value === "suspended" || value === "canceled") {
      form.setValue("status", value as OrganizationStatus);
    }
  };

  return (
    <>
      <Select onValueChange={handleValueChange}>
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
    </>
  );
};
