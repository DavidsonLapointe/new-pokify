
import { AreasTab } from "@/components/admin/registrations/tabs/AreasTab";
import { EmpresasTab } from "@/components/admin/registrations/tabs/EmpresasTab";
import { FuncoesTab } from "@/components/admin/registrations/tabs/FuncoesTab";
import { IntegracoesTab } from "@/components/admin/registrations/tabs/IntegracoesTab";
import { LeadsTab } from "@/components/admin/registrations/tabs/LeadsTab";
import { MinhaEmpresaTab } from "@/components/admin/registrations/tabs/MinhaEmpresaTab";
import { UsuariosTab } from "@/components/admin/registrations/tabs/UsuariosTab";
import { CompanyLeadly } from "@/types/company-leadly";

// Default company object for MinhaEmpresaTab
const defaultCompany: CompanyLeadly = {
  id: "default",
  razao_social: "Empresa Padrão",
  nome_fantasia: "Nome Fantasia Padrão",
  cnpj: "00.000.000/0001-00",
  email: "contato@empresa.com",
  phone: "(00) 0000-0000",
  logo: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export type RegistrationTwoTabValue = 
  | "empresas" 
  | "minha-empresa" 
  | "usuarios" 
  | "planos" 
  | "areas" 
  | "funcoes" 
  | "leads" 
  | "integracoes";

export const getTabComponent = (tabValue: RegistrationTwoTabValue) => {
  switch (tabValue) {
    case "empresas":
      return <EmpresasTab />;
    case "minha-empresa":
      return <MinhaEmpresaTab defaultCompany={defaultCompany} />;
    case "usuarios":
      return <UsuariosTab />;
    case "areas":
      return <AreasTab />;
    case "funcoes":
      return <FuncoesTab />;
    case "leads":
      return <LeadsTab />;
    case "integracoes":
      return <IntegracoesTab />;
    default:
      return null;
  }
};

export const getAvailableTabs = (): {
  value: RegistrationTwoTabValue;
  label: string;
}[] => {
  return [
    { value: "empresas", label: "Empresas" },
    { value: "minha-empresa", label: "Minha Empresa" },
    { value: "usuarios", label: "Usuários" },
    { value: "areas", label: "Áreas" },
    { value: "funcoes", label: "Funções" },
    { value: "leads", label: "Leads" },
    { value: "integracoes", label: "Integrações" }
  ];
};
