
import { LeadCalls } from "./types";

/**
 * Gets the formatted name of a lead based on its type (person or company)
 */
export const getLeadName = (lead: LeadCalls): string => {
  if (lead.personType === "pj" && lead.razaoSocial) {
    return lead.razaoSocial;
  }
  
  return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
};
