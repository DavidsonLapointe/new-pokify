
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useState } from "react";
import { Organization } from "@/types/organization-types";
import { CompanyForm } from "@/components/organization/company/CompanyForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethodCard } from "@/components/organization/plans/PaymentMethodCard";
import { PlanTabContent } from "@/components/organization/plans/PlanTabContent";
import { Building2, CreditCard, Package } from "lucide-react";

export default function OrganizationCompany() {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState("company-data");
  
  // Initialize with default empty organization if not present
  const defaultOrganization: Organization = {
    id: '',
    name: '',
    nomeFantasia: '',
    plan: '',
    planName: '',
    users: [],
    status: 'active',
    pendingReason: null,
    email: '',
    phone: '',
    cnpj: '',
    adminName: '',
    adminEmail: '',
    contractSignedAt: null,
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
          Gerencie as informações da sua empresa, plano e método de pagamento
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="company-data" className="flex items-center gap-2">
            <Building2 size={16} />
            Dados da Empresa
          </TabsTrigger>
          <TabsTrigger value="my-plan" className="flex items-center gap-2">
            <Package size={16} />
            Meu Plano
          </TabsTrigger>
          <TabsTrigger value="payment-method" className="flex items-center gap-2">
            <CreditCard size={16} />
            Método de Pagamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company-data" className="mt-4">
          <CompanyForm
            organization={organization}
            onLogoUpload={handleLogoUpload}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </TabsContent>

        <TabsContent value="my-plan" className="mt-4">
          <PlanTabContent />
        </TabsContent>

        <TabsContent value="payment-method" className="mt-4">
          <PaymentMethodCard
            organizationId={organization.id}
            onPaymentMethodUpdated={() => toast.success("Método de pagamento atualizado")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
