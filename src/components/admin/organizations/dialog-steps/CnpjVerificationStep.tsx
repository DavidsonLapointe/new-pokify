import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { formatCNPJ } from "@/utils/cnpjValidation";
import { UseFormReturn } from "react-hook-form";
import { CreateOrganizationFormData } from "../schema";

interface CnpjVerificationStepProps {
  form: UseFormReturn<CreateOrganizationFormData>;
  isCheckingCnpj: boolean;
  onNext: () => Promise<void>;
  onCancel: () => void;
}

export const CnpjVerificationStep = ({
  form,
  isCheckingCnpj,
  onNext,
  onCancel
}: CnpjVerificationStepProps) => {
  return (
    <div className="py-4">
      <FormField
        control={form.control}
        name="cnpj"
        render={({ field }) => (
          <FormItem className="max-w-md mx-auto">
            <FormLabel className="text-base">CNPJ da Empresa</FormLabel>
            <FormControl>
              <Input 
                placeholder="00.000.000/0000-00" 
                {...field}
                onChange={(e) => {
                  // Keep only numbers for validation
                  const value = e.target.value.replace(/[^\d]/g, '');
                  // Limit to 14 digits
                  const truncated = value.slice(0, 14);
                  // Format for display
                  const formatted = formatCNPJ(truncated);
                  field.onChange(formatted);
                }}
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-2">
              Informe o CNPJ para verificarmos se é válido e se já existe no sistema.
            </p>
          </FormItem>
        )}
      />
      
      <div className="flex justify-end space-x-4 mt-6 pt-3 border-t">
        <Button
          type="button"
          variant="cancel"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="button" 
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          onClick={onNext}
          disabled={!form.getValues("cnpj") || isCheckingCnpj}
        >
          {isCheckingCnpj ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Verificando
            </>
          ) : (
            "Verificar e Continuar"
          )}
        </Button>
      </div>
    </div>
  );
};
