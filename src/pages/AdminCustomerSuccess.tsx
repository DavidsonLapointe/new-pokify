import { useState } from "react";
import { Organization } from "@/types";
import { OrganizationSelector } from "@/components/admin/customer-success/OrganizationSelector";
import { OrganizationOverview } from "@/components/admin/customer-success/OrganizationOverview";
import { UsersStatistics } from "@/components/admin/customer-success/UsersStatistics";
import { AIExecutionsChart } from "@/components/admin/customer-success/AIExecutionsChart";
import { UserLogsList } from "@/components/admin/customer-success/UserLogsList";
import { ModulesStatus } from "@/components/admin/customer-success/ModulesStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";

const AdminCustomerSuccess = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOrganizationChange = (organization: Organization | null) => {
    setLoading(true);
    // Simulate loading time to show skeleton
    setTimeout(() => {
      setSelectedOrganization(organization);
      setLoading(false);
    }, 800);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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
      </div>

      <div className="space-y-4">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-left">
            Selecione uma empresa para analisar
          </label>
          <div className="w-full max-w-3xl">
            <OrganizationsSearch value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
        <OrganizationSelector 
          onOrganizationChange={handleOrganizationChange}
          searchTerm={searchTerm}
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-48 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
          </div>
          <Skeleton className="w-full h-72 rounded-lg" />
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
      ) : selectedOrganization ? (
        <div className="space-y-6">
          {/* OrganizationOverview - Full width */}
          <div className="w-full">
            <OrganizationOverview organization={selectedOrganization} />
          </div>
          
          {/* ModulesStatus and UsersStatistics - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ModulesStatus - Half width */}
            <div>
              <ModulesStatus organizationId={selectedOrganization.id} />
            </div>

            {/* UsersStatistics - Half width */}
            <div>
              <UsersStatistics 
                users={selectedOrganization.users || []} 
                organizationName={selectedOrganization.name}
              />
            </div>
          </div>

          {/* AIExecutionsChart - Full width */}
          <div className="w-full">
            <AIExecutionsChart organizationId={selectedOrganization.id} />
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
