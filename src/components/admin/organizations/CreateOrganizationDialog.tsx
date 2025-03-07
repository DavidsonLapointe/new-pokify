
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OrganizationFormFields } from "./organization-form-fields";
import { useOrganizationForm } from "./use-organization-form";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { validateCNPJ, formatCNPJ } from "@/utils/cnpjValidation";
import { useToast } from "@/hooks/use-toast";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateOrganizationDialog = ({
  open,
  onOpenChange,
  onSuccess = () => {}
}: CreateOrganizationDialogProps) => {
  const { form, onSubmit, checkCnpjExists } = useOrganizationForm(() => {
    onOpenChange(false);
    onSuccess();
  });

  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCheckingCnpj, setIsCheckingCnpj] = useState(false);
  const [cnpjValidated, setCnpjValidated] = useState(false);

  // Reset form and step when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setStep(1);
      setCnpjValidated(false);
    }
  }, [open, form]);

  const handleCnpjNext = async () => {
    // Get the CNPJ value
    const cnpj = form.getValues("cnpj");
    
    // Format CNPJ as user types and update the form
    const formattedCnpj = formatCNPJ(cnpj);
    form.setValue("cnpj", formattedCnpj);
    
    // Validate format
    if (!validateCNPJ(cnpj)) {
      form.setError("cnpj", { 
        type: "manual", 
        message: "CNPJ inválido. Verifique o número informado." 
      });
      return;
    }
    
    // Check if CNPJ already exists in the database
    setIsCheckingCnpj(true);
    try {
      const exists = await checkCnpjExists(cnpj);
      
      if (exists) {
        form.setError("cnpj", { 
          type: "manual", 
          message: "Este CNPJ já está cadastrado no sistema." 
        });
        setIsCheckingCnpj(false);
        return;
      }
      
      // If everything is valid, proceed to the next step
      setCnpjValidated(true);
      setStep(2);
      toast({
        title: "CNPJ Validado",
        description: "O CNPJ é válido. Continue o cadastro.",
      });
      
      // Clear any existing errors on the CNPJ field
      form.clearErrors("cnpj");
    } catch (error) {
      console.error("Erro ao verificar CNPJ:", error);
      toast({
        title: "Erro ao verificar CNPJ",
        description: "Ocorreu um erro ao verificar o CNPJ. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingCnpj(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-semibold text-[#1A1F2C]">Nova Empresa</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {step === 1 
              ? "Informe o CNPJ da empresa para verificação."
              : "Preencha os dados da empresa e do administrador inicial."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {step === 1 ? (
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
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                  onClick={handleCnpjNext}
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
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
              <div className="bg-white rounded-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-1 bg-[#9b87f5] rounded-full"></div>
                  <h3 className="text-base font-medium text-[#1A1F2C]">Dados da Empresa</h3>
                </div>
                <OrganizationFormFields form={form} cnpjValidated={cnpjValidated} />
              </div>
              
              <div className="flex justify-end space-x-4 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                  Criar Empresa
                </Button>
              </div>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
