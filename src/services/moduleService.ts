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

// Mock function to create a Stripe product and price
export const createStripeProduct = async (module: Partial<Plan>) => {
  try {
    console.log('Creating Stripe product for module:', module.name);
    
    // Generate mock IDs for Stripe product and price
    const productId = `prod_${Math.random().toString(36).substring(2, 15)}`;
    const priceId = `price_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log('Mock Stripe product and price created successfully:', {
      productId,
      priceId
    });
    
    return {
      productId,
      priceId
    };
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    throw error;
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
    // First, check if the module already has Stripe IDs
    if (!moduleData.stripeProductId || !moduleData.stripePriceId) {
      // Create new Stripe product and price if needed
      const stripeIds = await createStripeProduct(moduleData);
      moduleData.stripeProductId = stripeIds.productId;
      moduleData.stripePriceId = stripeIds.priceId;
    }
    
    // Convert to database format
    const dbModule = convertPlanToModuleData(moduleData);
    
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
    // Delete from database
    const { error } = await supabase
      .from('modulos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
    
    console.log('Module deleted successfully:', id);
  } catch (error) {
    console.error('Error in deleteModule:', error);
    throw error;
  }
};
