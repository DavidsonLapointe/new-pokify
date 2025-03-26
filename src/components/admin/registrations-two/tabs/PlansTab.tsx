import { CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, CreditCard, Users, Database, Mail } from "lucide-react";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/realClient";

// Definição de interface para o tipo de plano conforme estrutura da tabela
interface PlanData {
  id: number;
  name: string;
  price_id: string | null;
  value: number;
  credit: number;
  description: string;
  short_description: string;
  resources: string;
  active: boolean;
  created_at: string;
}

// Interface temporária para a criação de planos (compatível com UI)
interface PlanCreate {
  id: number;
  name: string;
  price: number;
  credits: number; 
  description: string;
  shortDescription: string;
  benefits: string[];
  active: boolean;
  priceId?: string;
}

export const PlansTab = () => {
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [plans, setPlans] = useState<PlanCreate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast: uiToast } = useToast();

  // Função para buscar planos do Supabase
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      console.log("Iniciando busca de planos no Supabase...");
      
      const { data, error } = await supabase
        .from('planos')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Mapear dados do Supabase para o formato PlanCreate usado na UI
        const formattedPlans: PlanCreate[] = data.map((item: PlanData) => ({
          id: item.id,
          name: item.name,
          price: item.value,
          credits: item.credit,
          description: item.description,
          shortDescription: item.short_description,
          benefits: item.resources ? item.resources.split(',').filter(b => b.trim()) : [],
          active: item.active,
          priceId: item.price_id || ''
        }));
        
        setPlans(formattedPlans);
        console.log("Planos carregados:", formattedPlans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      let errorMessage = 'Erro ao carregar planos';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      uiToast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Função para criar produto e preço no Stripe
  const createStripeProduct = async (plan: {
    name: string;
    price: number;
    shortDescription?: string;
  }): Promise<{ productId: string, priceId: string }> => {
    try {
      console.log("Preparando para criar produto no Stripe:", {
        name: plan.name,
        price: plan.price,
        description: plan.shortDescription
      });
      
      // Utiliza o fetch para fazer uma chamada à sua API que gerenciará a criação no Stripe
      const response = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: plan.name,
          description: plan.shortDescription || plan.name,
          amount: Math.round(plan.price * 100), // Converte para centavos
          interval: 'month',
          apiKey: 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU'
        }),
      });

      const responseText = await response.text();
      console.log("Resposta bruta da API:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Resposta inválida do servidor: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar produto no Stripe');
      }

      console.log("Stripe response:", data);
      
      return { 
        productId: data.productId, 
        priceId: data.priceId 
      };
    } catch (error) {
      console.error('Erro ao criar produto no Stripe:', error);
      throw error;
    }
  };

  // Plans handlers
  const handleEditPlan = (plan: PlanCreate) => {
    // Converte para o formato esperado pelo Dialog
    const dialogPlan: Plan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      credits: plan.credits,
      description: plan.description,
      shortDescription: plan.shortDescription,
      benefits: plan.benefits,
      active: plan.active // Adicionado para resolver erro de tipagem
    };
    
    setSelectedPlan(dialogPlan);
    setEditPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(undefined);
    setEditPlanDialogOpen(true);
    console.log("Abrindo modal para criar novo plano");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setEditPlanDialogOpen(open);
    if (!open) {
      setSelectedPlan(undefined);
      console.log("Modal fechado, seleção de plano resetada");
    }
  };

  const handleSavePlan = async (planData: Plan) => {
    try {
      setIsLoading(true);
      console.log("Dados recebidos do formulário:", planData);
      
      // Verifica se os dados são válidos
      if (!planData.name || !planData.price) {
        throw new Error("Nome e preço são obrigatórios");
      }
      
      // Formatação dos benefícios para armazenamento
      let resources = '';
      if (Array.isArray(planData.benefits)) {
        resources = planData.benefits.join(',');
      } else if (planData.benefits) {
        resources = String(planData.benefits).split('\n').filter(b => b.trim()).join(',');
      }
      
      // Verifica se estamos editando ou criando
      const isEditing = planData.id && Number(planData.id) > 0 && planData.id !== 100;
      
      console.log("Operação:", isEditing ? "Atualização" : "Criação", "de plano");
      
      // Se estamos editando um plano existente
      if (isEditing) {
        // Prepare dados para atualização
        const updateData = {
          name: planData.name,
          value: planData.price,
          credit: planData.credits,
          description: planData.description || '',
          short_description: planData.shortDescription || '',
          resources: resources,
          active: planData.active !== undefined ? planData.active : true
        };
        
        console.log("Dados para atualização:", updateData);
        
        // Atualizar no Supabase
        const { error } = await supabase
          .from('planos')
          .update(updateData)
          .eq('id', planData.id);
          
        if (error) {
          console.error("Erro ao atualizar plano no Supabase:", error);
          throw error;
        }

        uiToast({
          title: "Plano atualizado com sucesso",
          description: `O plano ${planData.name} foi atualizado.`
        });
      } 
      // Se estamos criando um novo plano
      else {
        let stripeProductId = null;
        let stripePriceId = null;
        
        // Tentar criar produto no Stripe, mas continuar mesmo se falhar
        try {
          console.log("Iniciando criação no Stripe...");
          
          // A API do Stripe não está disponível (erro 404), então vamos ignorar esta parte
          // e salvar o plano apenas no Supabase por enquanto
          
          // Comentando a chamada da API do Stripe que está retornando 404
          /*
          const stripeData = await createStripeProduct({
            name: planData.name,
            price: planData.price,
            shortDescription: planData.shortDescription
          });
          
          stripeProductId = stripeData.productId;
          stripePriceId = stripeData.priceId;
          */
          
          // Apenas log para debug
          console.log("Integração com Stripe será implementada posteriormente");
          
        } catch (stripeError) {
          console.error('Erro ao criar produto no Stripe:', stripeError);
          // Continuar com a criação no Supabase mesmo com erro no Stripe
          uiToast({
            title: "Aviso",
            description: "Plano será criado apenas no Supabase. A integração com Stripe será feita posteriormente.",
            variant: "default"
          });
        }
        
        // Prepare dados para inserção no Supabase
        // Removemos o campo stripe_product_id que não existe na tabela
        const insertData = {
          name: planData.name,
          price_id: null, // Este campo existe na tabela
          value: planData.price,
          credit: planData.credits || 0,
          description: planData.description || '',
          short_description: planData.shortDescription || '',
          resources: resources,
          active: true
          // Removido o campo stripe_product_id que estava causando erro
        };
        
        console.log("Dados para inserção no Supabase:", insertData);
        
        // Inserir no Supabase
        const { data, error } = await supabase
          .from('planos')
          .insert([insertData])
          .select();
          
        if (error) {
          console.error("Erro ao inserir plano no Supabase:", error);
          throw error;
        }
        
        console.log("Resposta do Supabase após inserção:", data);
        
        if (data && data.length > 0) {
          console.log("Plano criado com sucesso:", data[0]);
          
          // Converter o item retornado para o formato usado na UI
          const newPlan: PlanCreate = {
            id: data[0].id,
            name: data[0].name,
            price: data[0].value,
            credits: data[0].credit,
            description: data[0].description,
            shortDescription: data[0].short_description,
            benefits: data[0].resources ? data[0].resources.split(',') : [],
            active: data[0].active,
            priceId: data[0].price_id || ''
            // Removido o campo stripeProductId que não existe na tabela
          };
          
          setPlans(prev => [...prev, newPlan]);
          
          uiToast({
            title: "Plano criado com sucesso",
            description: `O plano ${newPlan.name} foi criado.`
          });
        } else {
          console.error("Nenhum dado retornado após inserção");
          throw new Error("Falha ao criar plano: nenhum dado retornado");
        }
      }
      
      // Fechar o modal e atualizar a lista
      setEditPlanDialogOpen(false);
      await fetchPlans(); // Recarregar para ter dados atualizados
      
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Tratamento para erros do Supabase que podem vir em formato de objeto
        errorMessage = JSON.stringify(error);
      }
      
      uiToast({
        title: "Erro ao salvar plano",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-left">
      <CardTitle>Planos</CardTitle>
      <div className="pt-2">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Gerencie os planos disponíveis na plataforma
              </p>
            </div>
            
            <Button onClick={handleCreatePlan} className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum plano cadastrado</h3>
              <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                Crie seu primeiro plano para disponibilizar às organizações.
              </p>
              <Button onClick={handleCreatePlan} className="bg-purple-500 hover:bg-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Plano
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 pt-6 flex-grow flex flex-col">
                    {/* Nome do plano e preço */}
                    <div className="flex flex-col mb-2">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <div className="text-purple-500 font-medium mt-1">
                        R$ {plan.price.toFixed(2)}<span className="text-sm text-gray-500">/mês</span>
                      </div>
                    </div>
                    
                    {/* Descrição */}
                    <div className="h-12 mb-6">
                      <p className="text-sm text-gray-500">
                        {plan.shortDescription}
                      </p>
                    </div>
                    
                    {/* Container para créditos */}
                    <div className="h-16 flex items-center justify-center mb-6">
                      {plan.credits && (
                        <div className="bg-gray-100 rounded-md p-3 w-full flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm">{plan.credits} créditos mensais</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Container para recursos inclusos */}
                    <div className="mb-4">
                      <div className="h-10 flex items-center">
                        <h4 className="font-medium text-sm text-gray-600">Recursos inclusos:</h4>
                      </div>
                      <Separator className="mb-4" />
                      <ul className="space-y-2">
                        {plan.benefits && Array.isArray(plan.benefits) && plan.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600 text-left">
                            <div className="h-5 w-5 bg-purple-100 flex items-center justify-center flex-shrink-0 mr-2 rounded-full">
                              <Check className="h-3 w-3 text-purple-500" />
                            </div>
                            <span className="text-left">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Spacer flexível */}
                    <div className="flex-grow min-h-[20px]"></div>
                    
                    {/* Botão de edição */}
                    <div className="h-12 flex items-center mt-4">
                      <Button 
                        onClick={() => handleEditPlan(plan)} 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar Plano
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <EditPlanDialog
            open={editPlanDialogOpen}
            onOpenChange={handleDialogOpenChange}
            plan={selectedPlan}
            onSave={handleSavePlan}
          />
        </div>
      </div>
    </div>
  );
};
