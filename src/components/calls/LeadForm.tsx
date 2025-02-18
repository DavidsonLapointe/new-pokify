
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { UseFormReturn } from "react-hook-form";

interface LeadFormProps {
  form: UseFormReturn<LeadFormData>;
  personType: "pf" | "pj";
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: LeadFormData) => void;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

export function LeadForm({
  form,
  personType,
  hasPhoneIntegration,
  hasEmailIntegration,
  handlePhoneChange,
  handleDocumentChange,
  onSubmit,
  showCancelButton,
  onCancel,
}: LeadFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="personType"
          render={({ field }) => (
            <FormItem className="mb-1">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="pf" />
                    </FormControl>
                    <FormLabel className="font-normal text-sm m-0">
                      Pessoa Física
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="pj" />
                    </FormControl>
                    <FormLabel className="font-normal text-sm m-0">
                      Pessoa Jurídica
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Nome *</FormLabel>
                <FormControl>
                  <Input className="h-8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Sobrenome</FormLabel>
                <FormControl>
                  <Input className="h-8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  Telefone {hasPhoneIntegration && "*"}
                </FormLabel>
                <FormControl>
                  <Input 
                    className="h-8"
                    {...field}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                  />
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
                <FormLabel className="text-sm">
                  Email {hasEmailIntegration && "*"}
                </FormLabel>
                <FormControl>
                  <Input 
                    className="h-8"
                    {...field}
                    type="email"
                    placeholder="exemplo@email.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {personType === "pf" ? (
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">CPF</FormLabel>
                <FormControl>
                  <Input 
                    className="h-8"
                    {...field}
                    onChange={handleDocumentChange}
                    placeholder="000.000.000-00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Razão Social *</FormLabel>
                    <FormControl>
                      <Input className="h-8" {...field} />
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
                    <FormLabel className="text-sm">Nome Fantasia</FormLabel>
                    <FormControl>
                      <Input className="h-8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">CNPJ *</FormLabel>
                  <FormControl>
                    <Input 
                      className="h-8"
                      {...field}
                      onChange={handleDocumentChange}
                      placeholder="00.000.000/0000-00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Endereço</h3>
          <div className="grid grid-cols-12 gap-2">
            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem className="col-span-8">
                  <FormLabel className="text-sm">Logradouro</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="Rua, Avenida, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel className="text-sm">Número</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="123" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-12 gap-2">
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel className="text-sm">Complemento</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="Apto, Sala, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel className="text-sm">Bairro</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="Bairro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-12 gap-2">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel className="text-sm">CEP</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="00000-000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel className="text-sm">Cidade</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="Cidade" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="text-sm">Estado</FormLabel>
                  <FormControl>
                    <Input className="h-8" {...field} placeholder="UF" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          {showCancelButton && (
            <Button
              type="button"
              variant="cancel"
              onClick={onCancel}
              size="sm"
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" size="sm">
            {showCancelButton ? "Cadastrar Lead" : "Iniciar Contato"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

