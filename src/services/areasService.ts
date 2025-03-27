import { supabase } from "@/integrations/supabase/realClient";
import { CompanyArea } from "@/components/admin/modules/module-form-schema";

// Fetch all areas from the database
export const fetchAreas = async (): Promise<CompanyArea[]> => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching areas:', error);
      throw error;
    }
    
    // Map database fields to CompanyArea interface
    return (data || []).map(area => ({
      id: area.id.toString(),
      name: area.name,
      description: area.description || '',
      isDefault: area.default
    }));
  } catch (error) {
    console.error('Error in fetchAreas:', error);
    throw error;
  }
};

// Fetch only default areas from the database
export const fetchDefaultAreas = async (): Promise<CompanyArea[]> => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('default', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching default areas:', error);
      throw error;
    }
    
    // Map database fields to CompanyArea interface
    return (data || []).map(area => ({
      id: area.id.toString(),
      name: area.name,
      description: area.description || '',
      isDefault: true
    }));
  } catch (error) {
    console.error('Error in fetchDefaultAreas:', error);
    throw error;
  }
};
