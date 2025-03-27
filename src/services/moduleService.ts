import { supabase } from "@/integrations/supabase/realClient";
import type { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";

// Type for module in the database
export interface ModuleData {
  id?: number;
  created_at?: string;
  active: boolean;
  coming_soon: boolean;
  name: string;
  value: number;
  credit_per_use: number | null;
  icone: string;
  button_label: string;
  areas_ids: string[];
  short_description: string;
  long_description: string;
  benefit: string[];
  how_works: string[];
  price_id?: string;
  prod_id?: string;
}

// Convert Plan to ModuleData for database storage
export const convertPlanToModuleData = (plan: Partial<Plan>): ModuleData => {
  return {
    active: plan.active || false,
    coming_soon: plan.comingSoon || false,
    name: plan.name || '',
    value: plan.price || 0,
    credit_per_use: plan.credits || null,
    icone: plan.icon || 'MessageCircle',
    button_label: plan.actionButtonText || 'Contratar',
    areas_ids: plan.areas || [],
    short_description: plan.shortDescription || '',
    long_description: plan.description || '',
    benefit: Array.isArray(plan.benefits) ? plan.benefits : [],
    how_works: Array.isArray(plan.howItWorks) ? plan.howItWorks : [],
    price_id: plan.stripePriceId,
    prod_id: plan.stripeProductId
  };
};

// Convert ModuleData to Plan for UI display
export const convertModuleDataToPlan = (moduleData: ModuleData): Plan => {
  return {
    id: moduleData.id || Date.now(),
    active: moduleData.active,
    comingSoon: moduleData.coming_soon,
    name: moduleData.name,
    price: moduleData.value,
    credits: moduleData.credit_per_use,
    icon: moduleData.icone,
    actionButtonText: moduleData.button_label,
    areas: moduleData.areas_ids,
    shortDescription: moduleData.short_description,
    description: moduleData.long_description,
    benefits: moduleData.benefit,
    howItWorks: moduleData.how_works,
    stripePriceId: moduleData.price_id,
    stripeProductId: moduleData.prod_id
  };
};

// Create a product in Stripe using API
export const createStripeProduct = async (module: Partial<Plan>) => {
  try {
    console.log('Creating Stripe product for module:', module.name);
    
    // Chave secreta do Stripe
    const stripeSecretKey = 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU';
    
    // PASSO 1: Criar o produto no Stripe
    const productFormData = new URLSearchParams();
    productFormData.append('name', module.name || 'Módulo sem nome');
    productFormData.append('type', 'service');
    productFormData.append('description', module.shortDescription || '');
    
    // Adicionar metadados relevantes
    if (module.credits) {
      productFormData.append('metadata[credits]', module.credits.toString());
    }
    
    console.log('Enviando requisição para criar produto no Stripe:', {
      url: 'https://api.stripe.com/v1/products',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: productFormData.toString()
    });

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
      console.error('Erro ao criar produto no Stripe:', {
        status: productResponse.status,
        statusText: productResponse.statusText,
        error: errorText
      });
      throw new Error(`Falha ao criar produto no Stripe: ${productResponse.status} ${productResponse.statusText}`);
    }

    // Processar a resposta
    const productData = await productResponse.json();
    console.log('Produto criado com sucesso no Stripe:', productData);

    // PASSO 2: Criar o preço no Stripe (one-time/avulso, sem recurring)
    const priceFormData = new URLSearchParams();
    // Converter para centavos e garantir que seja número inteiro
    priceFormData.append('unit_amount', Math.round((module.price || 0) * 100).toString());
    priceFormData.append('currency', 'brl'); // Usar BRL para Reais brasileiros
    // Não adicionamos o recurring aqui para que seja um produto avulso
    priceFormData.append('product', productData.id);

    console.log('Enviando requisição para criar preço no Stripe:', {
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
      console.error('Erro ao criar preço no Stripe:', {
        status: priceResponse.status,
        statusText: priceResponse.statusText,
        error: errorText
      });
      throw new Error(`Falha ao criar preço no Stripe: ${priceResponse.status} ${priceResponse.statusText}`);
    }

    // Processar a resposta
    const priceData = await priceResponse.json();
    console.log('Preço criado com sucesso no Stripe:', priceData);

    // Retornar os IDs do produto e do preço
    return {
      productId: productData.id,
      priceId: priceData.id
    };
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

// Função para atualizar o produto no Stripe
export const updateStripeProduct = async (module: Partial<Plan>) => {
  if (!module.stripeProductId || !module.stripePriceId || 
      module.stripeProductId.includes('mock_') || module.stripePriceId.includes('mock_')) {
    console.error('Não é possível atualizar produto sem IDs Stripe válidos:', module);
    // Criar novo produto se não tiver IDs válidos
    return createStripeProduct(module);
  }

  try {
    console.log('Atualizando produto no Stripe:', module.name);
    
    // Chave secreta do Stripe
    const stripeSecretKey = 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU';
    
    // PASSO 1: Atualizar o produto no Stripe
    const productFormData = new URLSearchParams();
    productFormData.append('name', module.name || 'Módulo sem nome');
    productFormData.append('description', module.shortDescription || '');
    
    if (module.credits) {
      productFormData.append('metadata[credits]', module.credits.toString());
    }
    
    console.log('Enviando requisição para atualizar produto no Stripe:', {
      url: `https://api.stripe.com/v1/products/${module.stripeProductId}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: productFormData.toString()
    });

    // Atualizar o produto
    const productResponse = await fetch(`https://api.stripe.com/v1/products/${module.stripeProductId}`, {
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
      console.error('Erro ao atualizar produto no Stripe:', {
        status: productResponse.status,
        statusText: productResponse.statusText,
        error: errorText
      });
      throw new Error(`Falha ao atualizar produto no Stripe: ${productResponse.status} ${productResponse.statusText}`);
    }

    // Processar a resposta
    const productData = await productResponse.json();
    console.log('Produto atualizado com sucesso no Stripe:', productData);

    // PASSO 2: Criar novo preço (Stripe não permite atualizar preços existentes)
    const priceFormData = new URLSearchParams();
    priceFormData.append('unit_amount', Math.round((module.price || 0) * 100).toString());
    priceFormData.append('currency', 'brl');
    priceFormData.append('product', module.stripeProductId);

    console.log('Enviando requisição para criar novo preço no Stripe:', {
      url: 'https://api.stripe.com/v1/prices',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: priceFormData.toString()
    });

    // Criar novo preço
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
      console.error('Erro ao criar novo preço no Stripe:', {
        status: priceResponse.status,
        statusText: priceResponse.statusText,
        error: errorText
      });
      throw new Error(`Falha ao criar novo preço no Stripe: ${priceResponse.status} ${priceResponse.statusText}`);
    }

    // Processar a resposta
    const priceData = await priceResponse.json();
    console.log('Novo preço criado com sucesso no Stripe:', priceData);

    // PASSO 3: Arquivar o preço antigo no Stripe
    try {
      const archiveFormData = new URLSearchParams();
      archiveFormData.append('active', 'false');
      
      console.log('Arquivando preço antigo no Stripe:', module.stripePriceId);
      
      const archiveResponse = await fetch(`https://api.stripe.com/v1/prices/${module.stripePriceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: archiveFormData
      });
      
      if (!archiveResponse.ok) {
        const errorText = await archiveResponse.text();
        console.warn('Aviso: Não foi possível arquivar o preço antigo:', errorText);
        // Continuamos o processo mesmo se falhar o arquivamento
      } else {
        const archiveData = await archiveResponse.json();
        console.log('Preço antigo arquivado com sucesso:', archiveData);
      }
    } catch (archiveError) {
      // Apenas logar o erro, não interromper o fluxo principal
      console.warn('Erro ao tentar arquivar preço antigo:', archiveError);
    }

    // Retornar os IDs do produto e do novo preço
    return {
      productId: productData.id,
      priceId: priceData.id
    };
  } catch (error) {
    console.error('Erro ao atualizar no Stripe:', error);
    
    // Retornar os IDs existentes para não perder a referência
    return {
      productId: module.stripeProductId || `prod_mock_${Date.now()}`,
      priceId: module.stripePriceId || `price_mock_${Date.now()}`
    };
  }
};

// Fetch all modules from the database
export const fetchModules = async (): Promise<Plan[]> => {
  try {
    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching modules:', error);
      throw error;
    }
    
    // Convert each module from database format to Plan format
    return (data || []).map(convertModuleDataToPlan);
  } catch (error) {
    console.error('Error in fetchModules:', error);
    throw error;
  }
};

// Create a new module
export const createModule = async (moduleData: Partial<Plan>): Promise<Plan> => {
  try {
    // First create the Stripe product and price
    const stripeIds = await createStripeProduct(moduleData);
    
    // Add the Stripe IDs to the module data
    const moduleWithStripe = {
      ...moduleData,
      stripeProductId: stripeIds.productId,
      stripePriceId: stripeIds.priceId
    };
    
    // Convert to database format
    const dbModule = convertPlanToModuleData(moduleWithStripe);
    
    // Insert into database
    const { data, error } = await supabase
      .from('modulos')
      .insert(dbModule)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating module:', error);
      throw error;
    }
    
    // Convert back to Plan format and return
    return convertModuleDataToPlan(data);
  } catch (error) {
    console.error('Error in createModule:', error);
    throw error;
  }
};

// Update an existing module
export const updateModule = async (id: number, moduleData: Partial<Plan>): Promise<Plan> => {
  try {
    // Update the product and price in Stripe first
    const stripeIds = await updateStripeProduct(moduleData);
    
    // Add/update the Stripe IDs in the module data
    const moduleWithStripe = {
      ...moduleData,
      stripeProductId: stripeIds.productId,
      stripePriceId: stripeIds.priceId
    };
    
    // Convert to database format
    const dbModule = convertPlanToModuleData(moduleWithStripe);
    
    // Update in database
    const { data, error } = await supabase
      .from('modulos')
      .update(dbModule)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating module:', error);
      throw error;
    }
    
    // Convert back to Plan format and return
    return convertModuleDataToPlan(data);
  } catch (error) {
    console.error('Error in updateModule:', error);
    throw error;
  }
};

// Delete a module
export const deleteModule = async (id: number): Promise<void> => {
  try {
    // Get the module data first to get the Stripe IDs
    const { data: moduleData, error: fetchError } = await supabase
      .from('modulos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching module for deletion:', fetchError);
      throw fetchError;
    }
    
    // Delete from database
    const { error } = await supabase
      .from('modulos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
    
    // If the module had Stripe IDs, archive the product
    if (moduleData?.prod_id && !moduleData.prod_id.includes('mock_')) {
      try {
        // Chave secreta do Stripe
        const stripeSecretKey = 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU';
        
        // Arquivar o produto no Stripe
        const productFormData = new URLSearchParams();
        productFormData.append('active', 'false');
        
        console.log('Arquivando produto no Stripe:', moduleData.prod_id);
        
        const productResponse = await fetch(`https://api.stripe.com/v1/products/${moduleData.prod_id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: productFormData
        });
        
        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          console.warn('Aviso: Não foi possível arquivar o produto:', errorText);
        } else {
          const productData = await productResponse.json();
          console.log('Produto arquivado com sucesso:', productData);
        }
      } catch (archiveError) {
        // Apenas logar o erro, não interromper o fluxo principal
        console.warn('Erro ao tentar arquivar produto no Stripe:', archiveError);
      }
    }
    
    console.log('Module deleted successfully:', id);
  } catch (error) {
    console.error('Error in deleteModule:', error);
    throw error;
  }
};
