
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useState } from "react";
import { Organization } from "@/types/organization-types";
import { CompanyForm } from "@/components/organization/company/CompanyForm";

export default function OrganizationCompany() {
  const { user, updateUser } = useUser();
  
  // Initialize with default empty organization if not present
  const defaultOrganization: Organization = {
    id: '',
    name: '',
    nomeFantasia: '',
    plan: '',
    users: [],
    status: 'active',
    email: '',
    phone: '',
    cnpj: '',
    adminName: '',
    adminEmail: '',
    createdAt: new Date().toISOString(),
    integratedCRM: null,
    integratedLLM: null,
    contractStatus: 'completed',
    paymentStatus: 'completed',
    registrationStatus: 'completed',
    address: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  };

  const [organization, setOrganization] = useState<Organization>(
    user?.organization || defaultOrganization
  );

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
          ...organization,
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
