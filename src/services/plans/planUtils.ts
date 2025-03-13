
import { Plan } from "@/components/admin/plans/plan-form-schema";

export function mapDbPlanToPlan(dbPlan: any): Plan {
  return {
    id: dbPlan.id,
    name: dbPlan.name,
    price: parseFloat(dbPlan.price),
    shortDescription: dbPlan.short_description || "",
    description: dbPlan.description,
    benefits: dbPlan.benefits || [], 
    howItWorks: dbPlan.how_it_works || [],
    active: dbPlan.active,
    comingSoon: dbPlan.coming_soon || false,
    actionButtonText: dbPlan.action_button_text || "Contratar",
    stripeProductId: dbPlan.stripe_product_id,
    stripePriceId: dbPlan.stripe_price_id,
    credits: dbPlan.credits,
    // Map benefits to features as well to maintain compatibility
    features: dbPlan.benefits || [],
  };
}

export function processFeaturesInput(features: any): string[] {
  if (features === undefined) {
    return [];
  }
  
  if (Array.isArray(features)) {
    return features;
  } else if (typeof features === 'string') {
    // Convertemos explicitamente para string e então usamos split
    return features.split('\n').filter((f: string) => f.trim().length > 0);
  } else if (features === null) {
    // Handle null case explicitly
    return [];
  }
  
  // Fallback para qualquer outro caso
  return [];
}
