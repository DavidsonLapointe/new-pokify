
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConfirmRegistrationFormData } from "../types";

interface PersonalDataSectionProps {
  form: UseFormReturn<ConfirmRegistrationFormData>;
}

export function PersonalDataSection({ form }: PersonalDataSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
        <h3 className="text-lg font-medium text-[#1A1F2C]">Seus Dados</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Nome Completo</FormLabel>
              <FormControl>
                <Input {...field} className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="border-[#E5DEFF]" />
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
              <FormLabel className="text-[#6E59A5]">Telefone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
