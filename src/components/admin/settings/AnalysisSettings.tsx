import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Lock } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  minConfidenceScore: z.coerce.number().min(0).max(100),
  maxProcessingTime: z.coerce.number().min(1),
  batchSize: z.coerce.number().min(1).max(100),
});

const AnalysisSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minConfidenceScore: 80,
      maxProcessingTime: 300,
      batchSize: 10,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações de análise salvas com sucesso!");
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Parâmetros de Análise
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Configure os parâmetros utilizados na análise de áudios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="minConfidenceScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score Mínimo de Confiança (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Score mínimo de confiança para aceitar uma análise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxProcessingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo Máximo de Processamento (segundos)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tempo máximo permitido para processamento de um áudio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho do Lote</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Quantidade de áudios processados simultaneamente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="button"
              onClick={isEditing ? form.handleSubmit(onSubmit) : handleEditClick}
              variant={isEditing ? "default" : "secondary"}
              className="bg-black text-white"
            >
              {isEditing ? "Salvar Alterações" : "Editar Informações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnalysisSettings;
