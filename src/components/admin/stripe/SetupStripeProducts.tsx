
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function SetupStripeProducts() {
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const setupProducts = async (type: 'credits' | 'plans') => {
    const setState = type === 'credits' ? setIsLoadingCredits : setIsLoadingPlans;
    setState(true);
    
    try {
      toast.loading(`Criando produtos para ${type === 'credits' ? 'pacotes de créditos' : 'planos'} no Stripe...`);
      
      const { data, error } = await supabase.functions.invoke('setup-stripe-products', {
        body: { 
          type, 
          sync: true // Habilitar sincronização com as tabelas do Supabase
        },
      });
      
      if (error) {
        console.error(`Erro ao criar produtos para ${type}:`, error);
        toast.dismiss();
        toast.error(`Erro ao criar produtos para ${type === 'credits' ? 'pacotes de créditos' : 'planos'} no Stripe`);
        return;
      }
      
      console.log(`Produtos para ${type} criados com sucesso:`, data);
      toast.dismiss();
      toast.success(`Produtos para ${type === 'credits' ? 'pacotes de créditos' : 'planos'} criados com sucesso! Os dados foram sincronizados com o banco de dados.`);
    } catch (error) {
      console.error(`Erro ao criar produtos para ${type}:`, error);
      toast.dismiss();
      toast.error(`Erro ao criar produtos para ${type === 'credits' ? 'pacotes de créditos' : 'planos'} no Stripe: ${error.message}`);
    } finally {
      setState(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Produtos no Stripe</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure os produtos padrão no Stripe para planos e pacotes de créditos.
          Isso criará os produtos no Stripe e sincronizará com o banco de dados.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => setupProducts('credits')}
          disabled={isLoadingCredits}
        >
          {isLoadingCredits ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando produtos para pacotes...
            </>
          ) : (
            'Configurar Pacotes de Créditos'
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setupProducts('plans')}
          disabled={isLoadingPlans}
        >
          {isLoadingPlans ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando produtos para planos...
            </>
          ) : (
            'Configurar Planos'
          )}
        </Button>
      </div>
    </div>
  );
}
