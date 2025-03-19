
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-72 rounded-lg" />
            <Skeleton className="lg:col-span-1 h-72 rounded-lg" />
            <Skeleton className="lg:col-span-3 h-64 rounded-lg" />
          </div>
        </div>
      ) : selectedOrganization ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <OrganizationOverview organization={selectedOrganization} />
          </div>

          <div className="lg:col-span-2">
            <AIExecutionsChart organizationId={selectedOrganization.id} />
          </div>

          <div className="lg:col-span-1">
            <ModulesStatus organizationId={selectedOrganization.id} />
          </div>

          <div className="lg:col-span-3">
            <UsersStatistics 
              users={selectedOrganization.users || []} 
              organizationName={selectedOrganization.name}
            />
          </div>

          <div className="lg:col-span-3">
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
