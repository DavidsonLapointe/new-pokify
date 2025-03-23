import { LeadCalls } from "./types";

export const getLeadName = (lead: LeadCalls): string => {
  if (lead.personType === "pj" && lead.razaoSocial) {
    return lead.razaoSocial;
  }
  
  return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
};
