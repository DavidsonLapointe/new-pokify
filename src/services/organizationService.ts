import { Organization } from "@/types";
import { createMensalidadeTitle } from "@/services/financial";
import { supabase } from "@/integrations/supabase/client";

export const handleOrganizationCreation = async (organization: Organization) => {
  try {
    // Create mensalidade title
    const title = await createMensalidadeTitle(organization, 99.90);
    if (!title) {
      throw new Error("Failed to create mensalidade title");
    }
    
    return title;
  } catch (error) {
    console.error("Error in handleOrganizationCreation:", error);
    throw error;
  }
};
