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
  prod_id: string | null;
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
  prodId?: string;
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
          priceId: item.price_id || '',
          prodId: item.prod_id || ''
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

  // Função para criar produto e preço no Stripe usando diretamente a API do Stripe
  const createStripeProduct = async (plan: {
    name: string;
    price: number;
    shortDescription?: string;
  }): Promise<{ productId: string, priceId: string }> => {
    try {
      // Detalhes completos para log da criação do produto
      console.log("1. Iniciando criação no Stripe para o plano:", {
        name: plan.name,
        price: plan.price,
        description: plan.shortDescription || plan.name
      });

      // Chave secreta do Stripe
      const stripeSecretKey = 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU';
      
      // PASSO 1: Criar o produto no Stripe
      const productFormData = new URLSearchParams();
      productFormData.append('name', plan.name);
      productFormData.append('type', 'service');
      productFormData.append('description', plan.shortDescription || plan.name);
      
      // Log da requisição para criar produto
      console.log('2. Dados para criação do produto:', {
        url: 'https://api.stripe.com/v1/products',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: productFormData.toString()
      });

      try {
        // Chamada da API para criar o produto
        const productResponse = await fetch('https://api.stripe.com/v1/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: productFormData
        });

        // Verificar se a requisição foi bem-sucedida
        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          console.error('3. Erro ao criar produto no Stripe:', {
            status: productResponse.status,
            statusText: productResponse.statusText,
            error: errorText
          });
          throw new Error(`Falha ao criar produto no Stripe: ${productResponse.status} ${productResponse.statusText}`);
        }

        // Processar a resposta
        const productData = await productResponse.json();
        console.log('3. Produto criado com sucesso no Stripe:', productData);

        // PASSO 2: Criar o preço no Stripe
        const priceFormData = new URLSearchParams();
        // Converter para centavos e garantir que seja número inteiro
        priceFormData.append('unit_amount', Math.round(plan.price * 100).toString());
        priceFormData.append('currency', 'brl'); // Usar BRL para Reais brasileiros
        priceFormData.append('recurring[interval]', 'month');
        priceFormData.append('product', productData.id);

        // Log da requisição para criar preço
        console.log('4. Dados para criação do preço:', {
          url: 'https://api.stripe.com/v1/prices',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: priceFormData.toString()
        });

        // Chamada da API para criar o preço
        const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: priceFormData
        });

        // Verificar se a requisição foi bem-sucedida
        if (!priceResponse.ok) {
          const errorText = await priceResponse.text();
          console.error('5. Erro ao criar preço no Stripe:', {
            status: priceResponse.status,
            statusText: priceResponse.statusText,
            error: errorText
          });
          throw new Error(`Falha ao criar preço no Stripe: ${priceResponse.status} ${priceResponse.statusText}`);
        }

        // Processar a resposta
        const priceData = await priceResponse.json();
        console.log('5. Preço criado com sucesso no Stripe:', priceData);

        // Retornar os IDs do produto e do preço
        return {
          productId: productData.id,
          priceId: priceData.id
        };
      } catch (apiError) {
        console.error('Erro na chamada da API Stripe:', apiError);
        
        // Gerar IDs temporários em caso de erro
        const mockProductId = `prod_mock_${Date.now()}`;
        const mockPriceId = `price_mock_${Date.now()}`;
        
        console.log('Usando IDs temporários após erro de API:', {
          productId: mockProductId,
          priceId: mockPriceId
        });
        
        throw new Error(`Erro na API Stripe: ${apiError.message}`);
      }
    } catch (error) {
      console.error('Erro global ao criar no Stripe:', error);
      
      // Gerar IDs temporários para falhar graciosamente
      const mockProductId = `prod_mock_${Date.now()}`;
      const mockPriceId = `price_mock_${Date.now()}`;
      
      console.log('Usando IDs temporários para falha graciosa:', {
        productId: mockProductId,
        priceId: mockPriceId
      });
      
      return {
        productId: mockProductId,
        priceId: mockPriceId
      };
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
      console.log("1. INÍCIO - Dados recebidos do formulário:", planData);
      
      // Verifica se os dados são válidos
      if (!planData.name || !planData.price) {
        console.error("Erro: Nome e preço são obrigatórios");
        throw new Error("Nome e preço são obrigatórios");
      }
      
      // Formatação dos benefícios para armazenamento
      let resources = '';
      if (Array.isArray(planData.benefits)) {
        resources = planData.benefits.join(',');
      } else if (planData.benefits) {
        resources = String(planData.benefits).split('\n').filter(b => b.trim()).join(',');
      }
      console.log("2. Resources formatados:", resources);
      
      // CORREÇÃO: Verificação melhorada para identificar se é uma edição ou criação
      // IDs temporários como 100, 101, 102, etc. são considerados como novos planos
      const isEditing = planData.id && 
                       Number(planData.id) > 0 && 
                       Number(planData.id) < 100;  // IDs < 100 são reais, >= 100 são temporários
      
      console.log("3. Operação:", isEditing ? "Atualização" : "Criação", "de plano. ID:", planData.id);
      
      // Se estamos editando um plano existente
      if (isEditing) {
        // Código para atualização
        const updateData = {
          name: planData.name,
          value: planData.price,
          credit: planData.credits,
          description: planData.description || '',
          short_description: planData.shortDescription || '',
          resources: resources,
          active: planData.active !== undefined ? planData.active : true
          // Nota: não atualizamos price_id e prod_id durante a edição para preservar 
          // a integração com o Stripe existente
        };
        
        console.log("4. Dados para atualização:", updateData);
        
        const { error } = await supabase
          .from('planos')
          .update(updateData)
          .eq('id', planData.id);
          
        if (error) {
          console.error("5. Erro ao atualizar plano no Supabase:", error);
          throw error;
        }

        console.log("5. Plano atualizado com sucesso");
        uiToast({
          title: "Plano atualizado com sucesso",
          description: `O plano ${planData.name} foi atualizado.`
        });
      } 
      // Se estamos criando um novo plano
      else {
        console.log("4. Iniciando criação de novo plano (dados completos):", JSON.stringify(planData, null, 2));
        
        // Variáveis para armazenar IDs do Stripe
        let stripeProductId = null;
        let stripePriceId = null;
        let stripeIntegrated = false;
        
        // Tentar criar produto no Stripe
        try {
          console.log("5. Iniciando criação no Stripe para o plano:", planData.name);
          
          // Criar produto e preço no Stripe
          const stripeResult = await createStripeProduct({
            name: planData.name,
            price: planData.price,
            shortDescription: planData.shortDescription
          });
          
          stripeProductId = stripeResult.productId;
          stripePriceId = stripeResult.priceId;
          stripeIntegrated = !stripeProductId.includes('mock');
          
          console.log("6. Resultado da operação Stripe:", { 
            productId: stripeProductId, 
            priceId: stripePriceId,
            isRealStripeIntegration: stripeIntegrated,
            timestamp: new Date().toISOString()
          });
        } catch (stripeError) {
          console.error('6. Erro detalhado na criação no Stripe:', {
            message: stripeError.message,
            stack: stripeError.stack,
            name: stripeError.name,
            timestamp: new Date().toISOString()
          });
          
          // Gerar IDs temporários
          stripeProductId = `prod_mock_${Date.now()}`;
          stripePriceId = `price_mock_${Date.now()}`;
          stripeIntegrated = false;
          
          console.log("6.1 IDs temporários gerados após erro:", { 
            stripeProductId, 
            stripePriceId,
            timestamp: new Date().toISOString()
          });
          
          uiToast({
            title: "Aviso",
            description: "Plano será criado sem integração real com Stripe: " + 
                        (stripeError instanceof Error ? stripeError.message : String(stripeError)),
            variant: "destructive"
          });
        }
        
        // Prepare dados para inserção no Supabase, agora incluindo prod_id
        const insertData = {
          name: planData.name,
          price_id: stripePriceId,
          prod_id: stripeProductId,
          value: planData.price,
          credit: planData.credits || 0,
          description: planData.description || '',
          short_description: planData.shortDescription || '',
          resources: resources,
          active: true
        };
        
        console.log("7. Dados para inserção no Supabase:", JSON.stringify(insertData, null, 2));
        
        // Inserir no Supabase
        const { data, error } = await supabase
          .from('planos')
          .insert([insertData])
          .select();
          
        if (error) {
          console.error("8. Erro ao inserir plano no Supabase:", error);
          throw error;
        }
        
        console.log("8. Resposta do Supabase após inserção:", data);
        
        if (data && data.length > 0) {
          console.log("9. Plano criado com sucesso:", data[0]);
          
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
            priceId: data[0].price_id || '',
            prodId: data[0].prod_id || ''
          };
          
          setPlans(prev => [...prev, newPlan]);
          
          // Mensagem baseada no tipo de integração com Stripe
          if (stripeIntegrated) {
            uiToast({
              title: "Plano criado com sucesso",
              description: `O plano ${newPlan.name} foi criado com integração completa ao Stripe.`
            });
          } else {
            uiToast({
              title: "Plano criado com ID temporário",
              description: `O plano ${newPlan.name} foi criado com ID temporário do Stripe.`
            });
          }
        } else {
          console.error("9. Nenhum dado retornado após inserção");
          throw new Error("Falha ao criar plano: nenhum dado retornado");
        }
      }
      
      // Fechar o modal e atualizar a lista
      setEditPlanDialogOpen(false);
      console.log("10. Modal fechado, atualizando lista...");
      await fetchPlans(); // Recarregar para ter dados atualizados
      console.log("11. Lista atualizada com sucesso");
      
    } catch (error) {
      console.error("ERRO CRÍTICO ao salvar plano:", error);
      
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
      console.log("FIM do processo de salvar plano");
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
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        {plan.priceId && plan.priceId.includes('mock') && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-1">
                            ID Temporário
                          </span>
                        )}
                      </div>
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
            disablePriceEdit={true}
          />
        </div>
      </div>
    </div>
  );
};
