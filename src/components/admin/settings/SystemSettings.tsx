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
  maxConcurrentJobs: z.coerce.number().min(1),
  jobQueueTimeout: z.coerce.number().min(1),
  systemMaintenanceWindow: z.coerce.number().min(1).max(24),
});

const SystemSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxConcurrentJobs: 5,
      jobQueueTimeout: 300,
      systemMaintenanceWindow: 4,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Configurações do sistema salvas com sucesso!");
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Configurações do Sistema
          {!isEditing && <Lock className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Configure os parâmetros gerais do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maxConcurrentJobs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de Jobs Concorrentes</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Número máximo de jobs executados simultaneamente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobQueueTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout da Fila de Jobs (segundos)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tempo máximo que um job pode ficar na fila.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemMaintenanceWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Janela de Manutenção (horas)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </FormControl>
                  <FormDescription>
                    Duração da janela de manutenção do sistema.
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

export default SystemSettings;
