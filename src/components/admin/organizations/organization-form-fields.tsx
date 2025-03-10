
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "./schema";
import { usePlans } from "./hooks/use-plans";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationFormFieldsProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  cnpjValidated?: boolean;
}

export const OrganizationFormFields = ({ form, cnpjValidated = false }: OrganizationFormFieldsProps) => {
  const { plans, isLoading: plansLoading } = usePlans();
  
  return (
    <>
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
                  disabled={cnpjValidated}
                  className={cnpjValidated ? "bg-gray-50" : ""}
                />
              </FormControl>
              {!cnpjValidated && <FormMessage />}
              {cnpjValidated && (
                <p className="text-xs text-green-600 mt-1">
                  CNPJ validado com sucesso
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano</FormLabel>
              {plansLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
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
              )}
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
    </>
  );
};
