
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
    // 1. Primeiro, criar o pacote de análise no Supabase
    const { data, error } = await supabase
      .from('analysis_packages')
      .insert([{
        name: packageData.name,
        credits: parseInt(packageData.credits),
        price: parseFloat(packageData.price)
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar pacote de análise:', error);
      throw error;
    }
    
    const newPackage = mapDbPackageToPackage(data);
    
    // 2. Criar o produto e preço no Stripe
    try {
      const stripeData = await updateStripeProduct({
        stripeProductId: '',  // Vazio para criar novo produto
        stripePriceId: '',    // Vazio para criar novo preço
        name: newPackage.name,
        description: `${newPackage.credits} créditos para análise de arquivos`,
        price: newPackage.price,
        active: true,
        credits: newPackage.credits
      });
      
      if (stripeData) {
        // 3. Atualizar o pacote com os IDs do Stripe
        const { error: updateError } = await supabase
          .from('analysis_packages')
          .update({
            stripe_product_id: stripeData.product.id,
            stripe_price_id: stripeData.price?.id
          })
          .eq('id', newPackage.id);
          
        if (updateError) {
          console.error('Erro ao atualizar IDs do Stripe no pacote:', updateError);
        } else {
          newPackage.stripeProductId = stripeData.product.id;
          newPackage.stripePriceId = stripeData.price?.id;
        }
      }
    } catch (stripeError) {
      console.error('Erro ao criar produto no Stripe:', stripeError);
      toast.error('O pacote foi criado, mas houve um erro ao registrá-lo no Stripe.');
    }
    
    return newPackage;
  } catch (error) {
    console.error('Erro ao criar pacote de análise:', error);
    toast.error('Não foi possível criar o pacote de análise.');
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
    
    // 1. Atualizar pacote no Supabase
    const { data, error } = await supabase
      .from('analysis_packages')
      .update({
        name: packageData.name,
        credits: packageData.credits,
        price: packageData.price,
        active: packageData.active
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar pacote de análise ${id}:`, error);
      throw error;
    }
    
    const updatedPackage = mapDbPackageToPackage(data);
    
    // 2. Atualizar produto no Stripe se já existir um ID do Stripe
    if (currentPackage.stripe_product_id) {
      try {
        await updateStripeProduct({
          stripeProductId: currentPackage.stripe_product_id,
          stripePriceId: currentPackage.stripe_price_id || '',
          name: updatedPackage.name,
          description: `${updatedPackage.credits} créditos para análise de arquivos`,
          price: updatedPackage.price,
          active: updatedPackage.active,
          credits: updatedPackage.credits
        });
      } catch (stripeError) {
        console.error('Erro ao atualizar produto no Stripe:', stripeError);
        toast.error('O pacote foi atualizado, mas houve um erro ao atualizá-lo no Stripe.');
      }
    } else {
      // Se não existir um ID do Stripe, criar novo produto
      try {
        const stripeData = await updateStripeProduct({
          stripeProductId: '',
          stripePriceId: '',
          name: updatedPackage.name,
          description: `${updatedPackage.credits} créditos para análise de arquivos`,
          price: updatedPackage.price,
          active: updatedPackage.active,
          credits: updatedPackage.credits
        });
        
        if (stripeData) {
          // Atualizar o pacote com os IDs do Stripe
          const { error: updateError } = await supabase
            .from('analysis_packages')
            .update({
              stripe_product_id: stripeData.product.id,
              stripe_price_id: stripeData.price?.id
            })
            .eq('id', updatedPackage.id);
            
          if (updateError) {
            console.error('Erro ao atualizar IDs do Stripe no pacote:', updateError);
          }
        }
      } catch (stripeError) {
        console.error('Erro ao criar produto no Stripe:', stripeError);
        toast.error('O pacote foi atualizado, mas houve um erro ao registrá-lo no Stripe.');
      }
    }
    
    return updatedPackage;
  } catch (error) {
    console.error(`Erro ao atualizar pacote de análise ${id}:`, error);
    toast.error('Não foi possível atualizar o pacote de análise.');
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
    
    // 1. Atualizar status no Supabase
    const { error } = await supabase
      .from('analysis_packages')
      .update({ active })
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote de análise ${id}:`, error);
      throw error;
    }
    
    // 2. Atualizar produto no Stripe se já existir um ID do Stripe
    if (currentPackage.stripe_product_id) {
      try {
        await updateStripeProduct({
          stripeProductId: currentPackage.stripe_product_id,
          stripePriceId: currentPackage.stripe_price_id || '',
          name: currentPackage.name,
          description: `${currentPackage.credits} créditos para análise de arquivos`,
          price: currentPackage.price,
          active: active,
          credits: currentPackage.credits
        });
      } catch (stripeError) {
        console.error('Erro ao atualizar status do produto no Stripe:', stripeError);
        toast.error(`O pacote foi ${active ? 'ativado' : 'desativado'}, mas houve um erro ao atualizá-lo no Stripe.`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote ${id}:`, error);
    toast.error(`Não foi possível ${active ? 'ativar' : 'desativar'} o pacote de análise.`);
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
