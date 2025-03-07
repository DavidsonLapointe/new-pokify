
import { supabase } from "@/integrations/supabase/client";
import { AnalysisPackage, NewPackageForm } from "@/types/packages";
import { toast } from "sonner";

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
    
    return mapDbPackageToPackage(data);
  } catch (error) {
    console.error('Erro ao criar pacote de análise:', error);
    toast.error('Não foi possível criar o pacote de análise.');
    return null;
  }
}

export async function updateAnalysisPackage(id: string, packageData: Partial<AnalysisPackage>): Promise<AnalysisPackage | null> {
  try {
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
    
    return mapDbPackageToPackage(data);
  } catch (error) {
    console.error(`Erro ao atualizar pacote de análise ${id}:`, error);
    toast.error('Não foi possível atualizar o pacote de análise.');
    return null;
  }
}

export async function togglePackageActive(id: string, active: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('analysis_packages')
      .update({ active })
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote de análise ${id}:`, error);
      throw error;
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
