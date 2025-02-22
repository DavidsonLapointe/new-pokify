
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConfirmRegistrationFormData } from "../types";

interface AddressSectionProps {
  form: UseFormReturn<ConfirmRegistrationFormData>;
}

export function AddressSection({ form }: AddressSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
        <h3 className="text-lg font-medium text-[#1A1F2C] flex items-center gap-0.5">
          Endereço da Empresa <span>*</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="logradouro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#6E59A5]">Logradouro</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Rua, Avenida, etc." className="border-[#E5DEFF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Número</FormLabel>
              <FormControl>
                <Input {...field} className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Complemento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Apto, Sala, etc." className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bairro"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Bairro</FormLabel>
              <FormControl>
                <Input {...field} className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Cidade</FormLabel>
              <FormControl>
                <Input {...field} className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">Estado</FormLabel>
              <FormControl>
                <Input {...field} placeholder="UF" maxLength={2} className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6E59A5]">CEP</FormLabel>
              <FormControl>
                <Input {...field} placeholder="00000-000" className="border-[#E5DEFF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
