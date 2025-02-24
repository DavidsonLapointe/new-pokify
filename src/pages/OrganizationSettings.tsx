import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { OrganizationSettingsForm } from "@/components/organization/OrganizationSettingsForm";
import { mockUsers } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const mockDefaultData = {
  organization: {
    id: "1",
    name: "Tech Solutions",
    nomeFantasia: "Tech Solutions Ltda",
    plan: "Professional",
    users: [],
    status: "active",
    integratedCRM: null,
    integratedLLM: "OpenAI",
    email: "contato@techsolutions.com",
    phone: "(11) 99999-9999",
    cnpj: "12.345.678/0001-90",
    adminName: "João Silva",
    adminEmail: "joao.silva@techsolutions.com",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  address: {
    logradouro: "Rua Exemplo",
    numero: "123",
    complemento: "Apto 456",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01000-000"
  }
};

const OrganizationSettings = () => {
  const { toast } = useToast();
  const [organizationData, setOrganizationData] = useState(mockDefaultData.organization);
  const [addressData, setAddressData] = useState(mockDefaultData.address);

  const handleOrganizationUpdate = (updatedOrganization: any) => {
    setOrganizationData(updatedOrganization);
    toast({
      title: "Dados da empresa atualizados com sucesso!",
      description: "As informações da sua empresa foram atualizadas.",
    });
  };

  const handleAddressUpdate = (updatedAddress: any) => {
    setAddressData(updatedAddress);
    toast({
      title: "Endereço atualizado com sucesso!",
      description: "O endereço da sua empresa foi atualizado.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">
            Configurações da Organização
          </CardTitle>
          <CardDescription>
            Atualize as informações da sua empresa.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <OrganizationSettingsForm
            organization={organizationData}
            address={addressData}
            onOrganizationUpdate={handleOrganizationUpdate}
            onAddressUpdate={handleAddressUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
