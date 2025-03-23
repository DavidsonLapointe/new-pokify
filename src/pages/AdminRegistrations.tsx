
import { useState } from "react";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { CompanyLeadly } from "@/types/company-leadly";
import { AreasTab } from "@/components/admin/registrations/tabs/AreasTab";
import { EmpresasTab } from "@/components/admin/registrations/tabs/EmpresasTab";
import { FuncoesTab } from "@/components/admin/registrations/tabs/FuncoesTab";
import { MinhaEmpresaTab } from "@/components/admin/registrations/tabs/MinhaEmpresaTab";
import { UsuariosTab } from "@/components/admin/registrations/tabs/UsuariosTab";

const AdminRegistrations = () => {
  const { user } = useUser();
  
  // Create default company data
  const defaultCompany: CompanyLeadly = {
    id: user?.id || "",
    razao_social: "Empresa Exemplo",
    nome_fantasia: "",
    cnpj: "12.345.678/0001-90",
    email: "",
    phone: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastros 1</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CardHeader>
          <Tabs defaultValue="areas" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="areas">Áreas</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="funcoes">Funções por tipo de usuário</TabsTrigger>
              <TabsTrigger value="minha-empresa">Minha Empresa</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="areas">
              <AreasTab />
            </TabsContent>
            
            <TabsContent value="empresas">
              <EmpresasTab />
            </TabsContent>
            
            <TabsContent value="funcoes">
              <FuncoesTab />
            </TabsContent>
            
            <TabsContent value="minha-empresa">
              <MinhaEmpresaTab defaultCompany={defaultCompany} />
            </TabsContent>
            
            <TabsContent value="usuarios">
              <UsuariosTab />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </div>
    </div>
  );
};

export default AdminRegistrations;
