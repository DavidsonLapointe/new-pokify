
import React from "react";
import { FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";

interface StatusSelectorProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  currentStatus: string;
}

export const StatusSelector = ({ form, currentStatus }: StatusSelectorProps) => {
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

  // Handling the value change with proper type casting
  const handleValueChange = (value: string) => {
    // Only set the value if it's one of the allowed status values
    if (value === "active" || value === "pending" || value === "inactive") {
      form.setValue("status", value);
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
