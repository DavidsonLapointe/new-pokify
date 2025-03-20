
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
import { Edit, Save, Globe, LinkIcon, ExternalLink, Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/ui/link";

const competitorSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  url: z.string().url("URL inválida").or(z.literal("")),
});

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
  competidores: z.array(competitorSchema).optional().default([]),
  observacoesAdicionais: z.string().optional(),
});

type BriefingFormValues = z.infer<typeof briefingSchema>;
type Competitor = z.infer<typeof competitorSchema>;

export const CompanyBriefingSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState<Competitor>({ name: "", url: "" });
  const [showCompetitorForm, setShowCompetitorForm] = useState(false);

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
    competidores: [],
    observacoesAdicionais: "",
  };

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(briefingSchema),
    defaultValues,
  });

  const watchPossuiConcorrentes = form.watch("possuiConcorrentes");
  const watchCompetidores = form.watch("competidores") || [];

  const handleAddCompetitor = () => {
    if (!newCompetitor.name) {
      toast.error("Nome do concorrente é obrigatório");
      return;
    }

    if (newCompetitor.url && !newCompetitor.url.startsWith("http")) {
      setNewCompetitor({
        ...newCompetitor,
        url: `https://${newCompetitor.url}`
      });
    }

    const updatedCompetidores = [...watchCompetidores, newCompetitor];
    form.setValue("competidores", updatedCompetidores);
    setNewCompetitor({ name: "", url: "" });
    setShowCompetitorForm(false);
  };

  const handleRemoveCompetitor = (index: number) => {
    const updatedCompetidores = [...watchCompetidores];
    updatedCompetidores.splice(index, 1);
    form.setValue("competidores", updatedCompetidores);
  };

  function onSubmit(data: BriefingFormValues) {
    console.log(data);
    toast.success("Briefing salvo com sucesso!");
    setIsEditing(false);
  }

  function formatURL(url: string): string {
    if (!url) return "";
    
    // Remove protocol and www
    let formatted = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    
    // Remove trailing slash
    formatted = formatted.replace(/\/$/, "");
    
    return formatted;
  }

  return (
    <div className="space-y-8">
      <div className="text-center pb-2">
        <h3 className="text-3xl font-semibold tracking-tight">Briefing da Empresa</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Forneça informações sobre sua empresa para otimizar as ferramentas de IA
        </p>
      </div>

      <Separator className="my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h4 className="text-md font-medium mb-4 text-gray-700">Informações Básicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="segmento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-left w-full">Segmento de Atuação</FormLabel>
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
                    <FormLabel className="font-medium text-left w-full">Porte da Empresa</FormLabel>
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
                    <FormLabel className="font-medium text-left w-full">Regiões Atendidas</FormLabel>
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
                    <FormLabel className="font-medium text-left w-full">Número de Funcionários</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditing} placeholder="Ex: 10-50, 51-200, 201+" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h4 className="text-md font-medium mb-4 text-gray-700">Produtos e Mercado</h4>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="principaisProdutos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-left w-full">Principais Produtos/Serviços</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={!isEditing} 
                        placeholder="Descreva os principais produtos ou serviços oferecidos pela sua empresa" 
                        className="min-h-[100px] resize-none"
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
                    <FormLabel className="font-medium text-left w-full">Público-alvo</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={!isEditing} 
                        placeholder="Descreva o perfil dos seus clientes ideais" 
                        className="min-h-[100px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h4 className="text-md font-medium mb-4 text-gray-700">Diferenciação e Desafios</h4>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="diferenciaisCompetitivos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-left w-full">Diferenciais Competitivos</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={!isEditing} 
                        placeholder="O que faz sua empresa se destacar da concorrência?" 
                        className="min-h-[100px] resize-none"
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
                    <FormLabel className="font-medium text-left w-full">Principais Objeções</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={!isEditing} 
                        placeholder="Quais são as objeções mais comuns que os clientes apresentam?" 
                        className="min-h-[100px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h4 className="text-md font-medium mb-4 text-gray-700">Concorrência</h4>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="possuiConcorrentes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
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

              {watchPossuiConcorrentes && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel className="font-medium text-left w-full flex items-center">
                      <span>Principais Concorrentes</span>
                      {isEditing && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => setShowCompetitorForm(true)}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Adicionar
                        </Button>
                      )}
                    </FormLabel>
                    
                    {showCompetitorForm && isEditing && (
                      <div className="p-4 border rounded-md bg-white mb-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <FormLabel>Nome do Concorrente</FormLabel>
                              <Input
                                placeholder="Ex: Empresa XYZ"
                                value={newCompetitor.name}
                                onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <FormLabel>URL do Site</FormLabel>
                              <Input
                                placeholder="Ex: www.empresaxyz.com"
                                value={newCompetitor.url}
                                onChange={(e) => setNewCompetitor({...newCompetitor, url: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setShowCompetitorForm(false);
                                setNewCompetitor({ name: "", url: "" });
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              type="button" 
                              size="sm"
                              onClick={handleAddCompetitor}
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {watchCompetidores.length > 0 ? (
                      <div className="rounded-md border bg-white">
                        <div className="divide-y">
                          {watchCompetidores.map((competidor, index) => (
                            <div key={index} className="p-3 flex justify-between items-center">
                              <div className="flex-1">
                                <div className="font-medium">{competidor.name}</div>
                                {competidor.url && (
                                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                                    <Globe className="w-3 h-3 mr-1" />
                                    <Link href={competidor.url} target="_blank" className="flex items-center hover:underline">
                                      {formatURL(competidor.url)}
                                      <ExternalLink className="w-3 h-3 ml-1" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                              {isEditing && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCompetitor(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="concorrentes"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                disabled={!isEditing} 
                                placeholder="Liste os principais concorrentes da sua empresa" 
                                className="min-h-[100px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="observacoesAdicionais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-left w-full">Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={!isEditing} 
                        placeholder="Informações adicionais relevantes para o contexto da empresa" 
                        className="min-h-[100px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button 
            type={isEditing ? "submit" : "button"}
            onClick={isEditing ? undefined : () => setIsEditing(true)}
            className="w-full md:w-auto"
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? (
              <><Save className="w-4 h-4 mr-2" /> Salvar Briefing</>
            ) : (
              <><Edit className="w-4 h-4 mr-2" /> Editar Informações</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
