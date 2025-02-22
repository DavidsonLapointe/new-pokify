
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useState } from "react";
import { Organization } from "@/types/organization-types";

export default function OrganizationCompany() {
  const { user, updateUser } = useUser();
  const [organization, setOrganization] = useState<Organization>(user.organization);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Se o campo for parte do endereço
    if (["logradouro", "numero", "complemento", "bairro", "cidade", "estado", "cep"].includes(name)) {
      setOrganization(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setOrganization(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      // Simulando upload - em produção, isto seria uma chamada real à API
      const logoUrl = URL.createObjectURL(file);
      
      setOrganization(prev => ({
        ...prev,
        logo: logoUrl
      }));

      // Atualiza o usuário com a nova organização
      updateUser({
        ...user,
        organization: {
          ...user.organization,
          logo: logoUrl
        }
      });

      toast.success("Logo atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar logo");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Atualiza o usuário com a nova organização
    updateUser({
      ...user,
      organization
    });

    toast.success("Dados atualizados com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Minha Empresa</h1>
        <p className="text-muted-foreground">
          Gerencie as informações da sua empresa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="mb-6">
            <AvatarUpload
              currentImage={organization.logo}
              name={organization.name}
              onImageUpload={handleLogoUpload}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Esta imagem será exibida no cabeçalho do sistema
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Razão Social</Label>
              <Input
                id="name"
                name="name"
                value={organization.name}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                name="nomeFantasia"
                value={organization.nomeFantasia}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={organization.cnpj}
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
                value={organization.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={organization.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-medium mb-4">Endereço</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                name="logradouro"
                value={organization.address?.logradouro || ""}
                onChange={handleInputChange}
                placeholder="Rua, Avenida, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                name="numero"
                value={organization.address?.numero || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                name="complemento"
                value={organization.address?.complemento || ""}
                onChange={handleInputChange}
                placeholder="Apto, Sala, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                name="bairro"
                value={organization.address?.bairro || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={organization.address?.cep || ""}
                onChange={handleInputChange}
                placeholder="00000-000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                name="cidade"
                value={organization.address?.cidade || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                name="estado"
                value={organization.address?.estado || ""}
                onChange={handleInputChange}
                placeholder="UF"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
