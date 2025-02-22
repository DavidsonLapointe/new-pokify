
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useState } from "react";
import { Organization } from "@/types/organization-types";
import { CompanyForm } from "@/components/organization/company/CompanyForm";

export default function OrganizationCompany() {
  const { user, updateUser } = useUser();
  const [organization, setOrganization] = useState<Organization>(user.organization);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
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
      const logoUrl = URL.createObjectURL(file);
      
      setOrganization(prev => ({
        ...prev,
        logo: logoUrl
      }));

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

      <CompanyForm
        organization={organization}
        onLogoUpload={handleLogoUpload}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
