
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlans } from "./hooks/use-plans";
import { StatusSelector } from "./dialog-sections/StatusSelector";
import { OrganizationStatus } from "@/types/organization-types";

interface OrganizationFormFieldsProps {
  form: any;
  showStatus?: boolean;
  cnpjValidated?: boolean;
}

export const OrganizationFormFields = ({ form, showStatus = false, cnpjValidated }: OrganizationFormFieldsProps) => {
  const { plans, isLoading } = usePlans();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="razaoSocial"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Razão Social</FormLabel>
            <FormControl>
              <Input placeholder="Razão Social da empresa" {...field} />
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
              <Input placeholder="Nome Fantasia" {...field} />
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
                placeholder="Apenas números"
                {...field}
                onChange={(e) => {
                  // Strip non-numeric characters and limit length
                  const value = e.target.value.replace(/\D/g, '').slice(0, 14);
                  field.onChange(value);
                }}
                readOnly={cnpjValidated}
                className={cnpjValidated ? "bg-gray-100" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plano</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="" disabled>
                    Carregando planos...
                  </SelectItem>
                ) : (
                  plans.map((plan) => (
                    <SelectItem key={plan.id} value={String(plan.id)}>
                      {plan.name} - R$ {plan.price.toFixed(2)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input
                placeholder="(XX) XXXXX-XXXX"
                {...field}
                onChange={(e) => {
                  // Strip non-numeric characters
                  const value = e.target.value.replace(/\D/g, '');
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="adminName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Administrador</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
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
              <Input placeholder="admin@empresa.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {showStatus && (
        <div className="col-span-full">
          <StatusSelector form={form} currentStatus="active" />
        </div>
      )}
    </div>
  );
};
