
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Module {
  id: string;
  name: string;
  status: "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";
}

interface ModulesStatusProps {
  organizationId: string;
}

export const ModulesStatus = ({ organizationId }: ModulesStatusProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizationId) {
      fetchModules();
    }
  }, [organizationId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      
      // Buscar módulos contratados pela organização
      const { data: organization, error } = await supabase
        .from('organizations')
        .select('modules')
        .eq('id', organizationId)
        .single();
      
      if (error) throw error;
      
      // Determinar quais módulos estão disponíveis e seu status
      const defaultModules = [
        { id: 'call-analysis', name: 'Análise de Chamadas', status: 'not_contracted' as const },
        { id: 'crm-integration', name: 'Integração com CRM', status: 'not_contracted' as const },
        { id: 'lead-scoring', name: 'Pontuação de Leads', status: 'not_contracted' as const },
        { id: 'sales-coaching', name: 'Coaching de Vendas', status: 'not_contracted' as const },
        { id: 'smart-replies', name: 'Respostas Inteligentes', status: 'coming_soon' as const }
      ];
      
      // Se a organização tem módulos contratados
      if (organization.modules) {
        const contractedModules = typeof organization.modules === 'string' 
          ? organization.modules.split(',') 
          : organization.modules;
          
        // Atualizar status dos módulos contratados
        const updatedModules = defaultModules.map(module => {
          if (contractedModules.includes(module.id)) {
            return { ...module, status: 'contracted' as const };
          }
          return module;
        });
        
        setModules(updatedModules);
      } else {
        setModules(defaultModules);
      }
      
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      toast.error("Erro ao carregar status dos módulos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'contracted':
        return <Badge className="bg-green-500">Contratado</Badge>;
      case 'configured':
        return <Badge className="bg-blue-500">Configurado</Badge>;
      case 'setup':
        return <Badge className="bg-yellow-500">Em configuração</Badge>;
      case 'coming_soon':
        return <Badge className="bg-purple-500">Em breve</Badge>;
      default:
        return <Badge variant="outline">Não contratado</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ferramentas de IA</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <div 
                key={module.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{module.name}</span>
                {getStatusBadge(module.status)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
