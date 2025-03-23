
import React, { useState } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { toast } from "sonner";
import { CompanyLeadly, UpdateCompanyLeadlyDTO } from "@/types/company-leadly";

interface MinhaEmpresaTabProps {
  defaultCompany: CompanyLeadly;
}

export const MinhaEmpresaTab = ({ defaultCompany }: MinhaEmpresaTabProps) => {
  const [company, setCompany] = useState<CompanyLeadly>(defaultCompany);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = async (file: File) => {
    try {
      // In a real app, this would upload to storage
      const logoUrl = URL.createObjectURL(file);
      
      setCompany(prev => ({
        ...prev,
        logo: logoUrl
      }));

      toast.success("Logo atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar logo");
      console.error(error);
    }
  };

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingCompany(true);
    
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateData: UpdateCompanyLeadlyDTO = {
        nome_fantasia: company.nome_fantasia,
        email: company.email,
        phone: company.phone,
        logo: company.logo,
      };
      
      console.log("Company data updated:", updateData);
      
      toast.success("Dados da empresa atualizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados da empresa");
      console.error(error);
    } finally {
      setIsLoadingCompany(false);
    }
  };

  return (
    <>
      <CardTitle>Minha Empresa</CardTitle>
      <CardContent className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-medium mb-2">Minha Empresa</h1>
            <p className="text-muted-foreground">
              Gerencie as informações da sua empresa
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <form onSubmit={handleSubmitCompany} className="space-y-8">
              {/* Logo Upload Section */}
              <div className="mb-6">
                <AvatarUpload
                  currentImage={company.logo}
                  name={company.razao_social}
                  onImageUpload={handleLogoUpload}
                  isLogo={true}
                />
                
                <div className="mt-3 text-center text-sm text-muted-foreground">
                  <p>Esta imagem será exibida no cabeçalho do sistema</p>
                  <p>Tamanho recomendado: 180×90 pixels</p>
                  <p>Para melhor visualização, utilize uma imagem com fundo transparente (PNG)</p>
                </div>
              </div>

              {/* Company Info Section */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="razao_social">Razão Social</Label>
                  <Input
                    id="razao_social"
                    name="razao_social"
                    value={company.razao_social}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                  <Input
                    id="nome_fantasia"
                    name="nome_fantasia"
                    value={company.nome_fantasia}
                    onChange={handleInputChange}
                    placeholder="Digite o nome fantasia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={company.cnpj}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={company.email}
                    onChange={handleInputChange}
                    placeholder="Digite o email da empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={company.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Digite o telefone da empresa"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoadingCompany}>
                  {isLoadingCompany ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </>
  );
};
