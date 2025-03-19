import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getOrganizationById } from "@/mocks/customerSuccessMocks";

interface Module {
  id: string;
  name: string;
  status: "not_contracted" | "contracted" | "configured" | "setup";
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
      
      // Buscar dados da organização (do mock ou Supabase)
      let organization;
      
      try {
        // Primeira tentativa: buscar do Supabase
        const { data: orgData, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizationId)
          .single();
        
        if (error) throw error;
        organization = orgData;
      } catch (e) {
        // Se falhar, usar dados mockados
        console.log("Usando dados mockados para módulos");
        organization = getOrganizationById(organizationId);
        
        if (!organization) {
          throw new Error("Organização não encontrada");
        }
      }
      
      // Determinar quais módulos estão disponíveis e seu status
      const defaultModules = [
        { id: 'call-analysis', name: 'Análise de Chamadas', status: 'not_contracted' as const },
        { id: 'crm-integration', name: 'Integração com CRM', status: 'not_contracted' as const },
        { id: 'lead-scoring', name: 'Pontuação de Leads', status: 'not_contracted' as const },
        { id: 'sales-coaching', name: 'Coaching de Vendas', status: 'not_contracted' as const },
      ];
      
      // Determinar módulos contratados com base no plano
      let contractedModules: string[] = [];
      
      if (organization.plan === 'enterprise') {
        contractedModules = ['call-analysis', 'crm-integration', 'lead-scoring', 'sales-coaching'];
      } else if (organization.plan === 'premium') {
        contractedModules = ['call-analysis', 'crm-integration'];
      } else {
        contractedModules = ['call-analysis'];
      }
      
      // Atualizar status dos módulos com base nos recursos configurados
      const updatedModules = defaultModules.map(module => {
        if (contractedModules.includes(module.id)) {
          // Use the status directly from moduleStatus if available
          if (organization.features?.moduleStatus?.[module.id]) {
            return { 
              ...module, 
              status: organization.features.moduleStatus[module.id] as 'not_contracted' | 'contracted' | 'configured' | 'setup' 
            };
          }
          // Otherwise use the old logic
          else if (module.id === 'call-analysis' && organization.features?.calls) {
            return { ...module, status: 'configured' as const };
          } else if (module.id === 'crm-integration' && organization.features?.crm) {
            return { ...module, status: 'configured' as const };
          } else if (module.id === 'lead-scoring' && organization.features?.scoring) {
            return { ...module, status: 'configured' as const };
          } else if (module.id === 'sales-coaching') {
            return { ...module, status: 'setup' as const };
          } else {
            return { ...module, status: 'contracted' as const };
          }
        }
        return module;
      });
      
      setModules(updatedModules);
      
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
        return <Badge className="bg-yellow-500 text-white border-0">Contratada</Badge>;
      case 'configured':
        return <Badge className="bg-green-500 text-white border-0">Configurada</Badge>;
      case 'setup':
        return <Badge className="bg-blue-500 text-white border-0">Setup</Badge>;
      default:
        return <Badge className="bg-red-500 text-white border-0">Não contratada</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="p-5">
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
                <div>
                  {getStatusBadge(module.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
