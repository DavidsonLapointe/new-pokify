
import { useState } from "react";
import { Organization } from "@/types";
import { OrganizationSelector } from "@/components/admin/customer-success/OrganizationSelector";
import { OrganizationOverview } from "@/components/admin/customer-success/OrganizationOverview";
import { UsersStatistics } from "@/components/admin/customer-success/UsersStatistics";
import { AIExecutionsChart } from "@/components/admin/customer-success/AIExecutionsChart";
import { UserLogsList } from "@/components/admin/customer-success/UserLogsList";
import { ModulesStatus } from "@/components/admin/customer-success/ModulesStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const AdminCustomerSuccess = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOrganizationChange = (organization: Organization | null) => {
    setLoading(true);
    // Simulate loading time to show skeleton
    setTimeout(() => {
      setSelectedOrganization(organization);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold">Customer Success</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie o sucesso dos clientes Leadly
          </p>
        </div>
        <Badge variant="success" className="text-xs self-start sm:self-auto">
          Beta
        </Badge>
      </div>

      <OrganizationSelector onOrganizationChange={handleOrganizationChange} />

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-48 rounded-lg" />
          <Skeleton className="w-full h-72 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
      ) : selectedOrganization ? (
        <div className="space-y-6">
          {/* OrganizationOverview - Full width */}
          <div className="w-full">
            <OrganizationOverview organization={selectedOrganization} />
          </div>
          
          {/* Grid layout for Ferramentas de IA and AIExecutionsChart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ferramentas de IA */}
            <div>
              <ModulesStatus organizationId={selectedOrganization.id} />
            </div>
            
            {/* AIExecutionsChart */}
            <div>
              <AIExecutionsChart organizationId={selectedOrganization.id} />
            </div>
          </div>

          {/* UsersStatistics - Full width */}
          <div className="w-full">
            <UsersStatistics 
              users={selectedOrganization.users || []} 
              organizationName={selectedOrganization.name}
            />
          </div>

          {/* UserLogsList - Full width */}
          <div className="w-full">
            <UserLogsList organizationId={selectedOrganization.id} />
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed rounded-lg">
          <p className="text-lg text-gray-500">
            Selecione uma empresa para visualizar suas informações
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerSuccess;
