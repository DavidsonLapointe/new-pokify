
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const briefingSchema = z.object({
  segmento: z.string().min(2, {
    message: "O segmento deve ter pelo menos 2 caracteres.",
  }),
  regioes: z.string().min(2, {
    message: "As regiões devem ter pelo menos 2 caracteres.",
  }),
  porte: z.string().min(2, {
    message: "O porte da empresa deve ter pelo menos 2 caracteres.",
  }),
  numeroFuncionarios: z.string().min(1, {
    message: "Informe o número de funcionários.",
  }),
  principaisProdutos: z.string().min(10, {
    message: "Descreva os principais produtos ou serviços (mínimo 10 caracteres).",
  }),
  diferenciaisCompetitivos: z.string().min(10, {
    message: "Descreva os diferenciais competitivos (mínimo 10 caracteres).",
  }),
  principaisObjecoes: z.string().min(10, {
    message: "Descreva as principais objeções (mínimo 10 caracteres).",
  }),
  publicoAlvo: z.string().min(10, {
    message: "Descreva o público-alvo (mínimo 10 caracteres).",
  }),
  possuiConcorrentes: z.boolean().default(false),
  concorrentes: z.string().optional(),
  observacoesAdicionais: z.string().optional(),
});

type BriefingFormValues = z.infer<typeof briefingSchema>;

export const CompanyBriefingSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  const defaultValues: Partial<BriefingFormValues> = {
    segmento: "",
    regioes: "",
    porte: "",
    numeroFuncionarios: "",
    principaisProdutos: "",
    diferenciaisCompetitivos: "",
    principaisObjecoes: "",
    publicoAlvo: "",
    possuiConcorrentes: false,
    concorrentes: "",
    observacoesAdicionais: "",
  };

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(briefingSchema),
    defaultValues,
  });

  function onSubmit(data: BriefingFormValues) {
    console.log(data);
    toast.success("Briefing salvo com sucesso!");
    setIsEditing(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Briefing da Empresa</h3>
          <p className="text-sm text-muted-foreground">
            Forneça informações sobre sua empresa para otimizar as ferramentas de IA
          </p>
        </div>
        {!isEditing && (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="segmento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segmento de Atuação</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} placeholder="Ex: Tecnologia, Saúde, Educação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="porte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porte da Empresa</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} placeholder="Ex: Pequeno, Médio, Grande" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regioes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regiões Atendidas</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} placeholder="Ex: Sudeste, Nacional, Global" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroFuncionarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Funcionários</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} placeholder="Ex: 10-50, 51-200, 201+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="principaisProdutos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principais Produtos/Serviços</FormLabel>
                <FormControl>
                  <Textarea 
                    disabled={!isEditing} 
                    placeholder="Descreva os principais produtos ou serviços oferecidos pela sua empresa" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicoAlvo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Público-alvo</FormLabel>
                <FormControl>
                  <Textarea 
                    disabled={!isEditing} 
                    placeholder="Descreva o perfil dos seus clientes ideais" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diferenciaisCompetitivos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diferenciais Competitivos</FormLabel>
                <FormControl>
                  <Textarea 
                    disabled={!isEditing} 
                    placeholder="O que faz sua empresa se destacar da concorrência?" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="principaisObjecoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principais Objeções</FormLabel>
                <FormControl>
                  <Textarea 
                    disabled={!isEditing} 
                    placeholder="Quais são as objeções mais comuns que os clientes apresentam?" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="possuiConcorrentes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    disabled={!isEditing}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Possui Concorrentes Diretos</FormLabel>
                  <FormDescription>
                    Marque esta opção se sua empresa possui concorrentes diretos no mercado
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch("possuiConcorrentes") && (
            <FormField
              control={form.control}
              name="concorrentes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principais Concorrentes</FormLabel>
                  <FormControl>
                    <Textarea 
                      disabled={!isEditing} 
                      placeholder="Liste os principais concorrentes da sua empresa" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="observacoesAdicionais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações Adicionais</FormLabel>
                <FormControl>
                  <Textarea 
                    disabled={!isEditing} 
                    placeholder="Informações adicionais relevantes para o contexto da empresa" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type={isEditing ? "submit" : "button"}
            onClick={isEditing ? undefined : () => setIsEditing(true)}
          >
            {isEditing ? "Salvar Briefing" : "Editar Informações"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
