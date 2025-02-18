
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
  audioRetentionDays: z.coerce.number().min(1),
  analysisRetentionDays: z.coerce.number().min(1),
  transcriptionRetentionDays: z.coerce.number().min(1),
});

const RetentionSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioRetentionDays: 30,
      analysisRetentionDays: 90,
      transcriptionRetentionDays: 60,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações de retenção salvas com sucesso!");
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Regras de Retenção
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Configure os períodos de retenção para diferentes tipos de dados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="audioRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retenção de Áudios (dias)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Período de retenção para arquivos de áudio originais.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="analysisRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retenção de Análises (dias)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Período de retenção para análises geradas pelo sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transcriptionRetentionDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retenção de Transcrições (dias)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Período de retenção para transcrições de áudio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="button"
              onClick={isEditing ? form.handleSubmit(onSubmit) : handleEditClick}
              variant={isEditing ? "default" : "secondary"}
              className="hover:bg-secondary/80 transition-colors"
            >
              {isEditing ? "Salvar Alterações" : "Editar Informações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RetentionSettings;
