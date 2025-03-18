
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";

interface AdminDataSectionProps {
  form: UseFormReturn<CreateOrganizationFormData>;
}

export const AdminDataSection = ({ form }: AdminDataSectionProps) => {
  return (
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
  );
};
