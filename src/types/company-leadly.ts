
export interface CompanyLeadly {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone?: string | null;
  logo?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateCompanyLeadlyDTO {
  name?: string;
  cnpj?: string;
  email?: string;
  phone?: string | null;
  logo?: string | null;
}
