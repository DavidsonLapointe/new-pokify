
export interface CompanyLeadly {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  phone?: string | null;
  logo?: string | null;
  created_at: string;
  updated_at: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface UpdateCompanyLeadlyDTO {
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  email?: string;
  phone?: string | null;
  logo?: string | null;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}
