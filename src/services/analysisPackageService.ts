import { supabase } from "@/integrations/supabase/client";
import { AnalysisPackage, NewPackageForm } from "@/types/packages";
import { toast } from "sonner";
import { updateStripeProduct } from "@/services/stripeService";

export async function fetchAnalysisPackages(): Promise<AnalysisPackage[]> {
  try {
    const { data, error } = await supabase
      .from('analysis_packages')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar pacotes de análise:', error);
      throw error;
    }
    
    return data.map(mapDbPackageToPackage);
  } catch (error) {
    console.error('Erro ao buscar pacotes de análise:', error);
    toast.error('Não foi possível carregar os pacotes de análise.');
    return [];
  }
}

export async function createAnalysisPackage(packageData: NewPackageForm): Promise<AnalysisPackage | null> {
  try {
    toast.loading('Criando pacote e produto no Stripe...');
    
    // 1. Primeiro, criar o produto e preço no Stripe
    try {
      const stripeData = await updateStripeProduct({
        stripeProductId: '',  // Vazio para criar novo produto
        stripePriceId: '',    // Vazio para criar novo preço
        name: packageData.name,
        description: `${packageData.credits} créditos para análise de arquivos`,
        price: parseFloat(packageData.price),
        active: true,
        credits: parseInt(packageData.credits)
      });
      
      if (!stripeData || !stripeData.product || !stripeData.price) {
        throw new Error('Dados inválidos retornados pelo Stripe');
      }
      
      // 2. Criar o pacote de análise no Supabase com os IDs do Stripe
      const { data, error } = await supabase
        .from('analysis_packages')
        .insert([{
          name: packageData.name,
          credits: parseInt(packageData.credits),
          price: parseFloat(packageData.price),
          stripe_product_id: stripeData.product.id,
          stripe_price_id: stripeData.price.id
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar pacote de análise:', error);
        throw error;
      }
      
      const newPackage = mapDbPackageToPackage(data);
      toast.dismiss();
      toast.success('Pacote criado e registrado no Stripe com sucesso!');
      
      return newPackage;
    } catch (stripeError) {
      console.error('Erro ao criar produto no Stripe:', stripeError);
      throw new Error(`Erro ao criar produto no Stripe: ${stripeError.message}`);
    }
  } catch (error) {
    console.error('Erro ao criar pacote de análise:', error);
    toast.dismiss();
    toast.error(`Não foi possível criar o pacote de análise: ${error.message}`);
    return null;
  }
}

export async function updateAnalysisPackage(id: string, packageData: Partial<AnalysisPackage>): Promise<AnalysisPackage | null> {
  try {
    // Buscar pacote atual para ter informações completas
    const { data: currentPackage, error: fetchError } = await supabase
      .from('analysis_packages')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Erro ao buscar pacote atual ${id}:`, fetchError);
      throw fetchError;
    }
    
    toast.loading('Atualizando pacote e produto no Stripe...');
    
    // 1. Atualizar produto no Stripe
    try {
      // Se já existe um ID do Stripe, atualiza; caso contrário, cria um novo
      const stripeProductId = currentPackage.stripe_product_id || '';
      const stripePriceId = currentPackage.stripe_price_id || '';
      
      const stripeData = await updateStripeProduct({
        stripeProductId,
        stripePriceId,
        name: packageData.name || currentPackage.name,
        description: `${packageData.credits || currentPackage.credits} créditos para análise de arquivos`,
        price: packageData.price || currentPackage.price,
        active: packageData.active !== undefined ? packageData.active : currentPackage.active,
        credits: packageData.credits || currentPackage.credits
      });
      
      if (!stripeData || !stripeData.product || !stripeData.price) {
        throw new Error('Dados inválidos retornados pelo Stripe');
      }
      
      // 2. Atualizar pacote no Supabase com os IDs do Stripe
      const updateData: any = {
        name: packageData.name,
        credits: packageData.credits,
        price: packageData.price,
        active: packageData.active,
        stripe_product_id: stripeData.product.id,
        stripe_price_id: stripeData.price.id
      };
      
      // Remover campos indefinidos
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );
      
      const { data, error } = await supabase
        .from('analysis_packages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Erro ao atualizar pacote de análise ${id}:`, error);
        throw error;
      }
      
      const updatedPackage = mapDbPackageToPackage(data);
      toast.dismiss();
      toast.success('Pacote atualizado e sincronizado com o Stripe com sucesso!');
      
      return updatedPackage;
    } catch (stripeError) {
      console.error('Erro ao atualizar produto no Stripe:', stripeError);
      throw new Error(`Erro ao atualizar produto no Stripe: ${stripeError.message}`);
    }
  } catch (error) {
    console.error(`Erro ao atualizar pacote de análise ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível atualizar o pacote de análise: ${error.message}`);
    return null;
  }
}

export async function togglePackageActive(id: string, active: boolean): Promise<boolean> {
  try {
    // Buscar pacote atual para ter informações completas
    const { data: currentPackage, error: fetchError } = await supabase
      .from('analysis_packages')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Erro ao buscar pacote atual ${id}:`, fetchError);
      throw fetchError;
    }
    
    toast.loading(`${active ? 'Ativando' : 'Desativando'} pacote e produto no Stripe...`);
    
    // 1. Atualizar produto no Stripe se já existir um ID do Stripe
    if (currentPackage.stripe_product_id) {
      try {
        const stripeData = await updateStripeProduct({
          stripeProductId: currentPackage.stripe_product_id,
          stripePriceId: currentPackage.stripe_price_id || '',
          name: currentPackage.name,
          description: `${currentPackage.credits} créditos para análise de arquivos`,
          price: currentPackage.price,
          active: active,
          credits: currentPackage.credits
        });
        
        if (!stripeData.success) {
          throw new Error('Erro ao atualizar status do produto no Stripe');
        }
      } catch (stripeError) {
        console.error('Erro ao atualizar status do produto no Stripe:', stripeError);
        throw new Error(`Erro ao atualizar status no Stripe: ${stripeError.message}`);
      }
    }
    
    // 2. Atualizar status no Supabase
    const { error } = await supabase
      .from('analysis_packages')
      .update({ active })
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote de análise ${id}:`, error);
      throw error;
    }
    
    toast.dismiss();
    toast.success(`Pacote ${active ? 'ativado' : 'desativado'} com sucesso!`);
    
    return true;
  } catch (error) {
    console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível ${active ? 'ativar' : 'desativar'} o pacote: ${error.message}`);
    return false;
  }
}

function mapDbPackageToPackage(dbPackage: any): AnalysisPackage {
  return {
    id: dbPackage.id,
    name: dbPackage.name,
    credits: dbPackage.credits,
    price: parseFloat(dbPackage.price),
    active: dbPackage.active,
    stripeProductId: dbPackage.stripe_product_id,
    stripePriceId: dbPackage.stripe_price_id
  };
}
