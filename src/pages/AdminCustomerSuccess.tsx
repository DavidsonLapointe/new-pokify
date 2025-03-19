
import { useState } from "react";
import { Organization } from "@/types";
import { OrganizationSelector } from "@/components/admin/customer-success/OrganizationSelector";
import { OrganizationOverview } from "@/components/admin/customer-success/OrganizationOverview";
import { UsersStatistics } from "@/components/admin/customer-success/UsersStatistics";
import { AIExecutionsChart } from "@/components/admin/customer-success/AIExecutionsChart";
import { UserLogsList } from "@/components/admin/customer-success/UserLogsList";
import { ModulesStatus } from "@/components/admin/customer-success/ModulesStatus";

const AdminCustomerSuccess = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Customer Success</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie o sucesso dos clientes Leadly
        </p>
      </div>

      <OrganizationSelector onOrganizationChange={setSelectedOrganization} />

      {selectedOrganization ? (
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
            <UsersStatistics users={selectedOrganization.users || []} />
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
