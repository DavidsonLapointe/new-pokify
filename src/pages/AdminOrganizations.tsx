
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationCard } from "@/components/admin/organizations/OrganizationCard";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { Organization } from "@/types/organization";

const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Tech Solutions Ltda",
    nomeFantasia: "Tech Solutions",
    plan: "Enterprise",
    users: [
      { role: "admin", status: "active" },
      { role: "admin", status: "inactive" },
      { role: "seller", status: "active" },
      { role: "seller", status: "active" },
      { role: "seller", status: "active" },
      { role: "seller", status: "inactive" },
    ],
    status: "active",
    integratedCRM: null,
    integratedLLM: "GPT-4O",
    email: "contato@techsolutions.com",
    phone: "(11) 99999-9999",
    cnpj: "00.000.000/0000-01",
    adminName: "João Silva",
    adminEmail: "joao@techsolutions.com",
  },
  {
    id: 2,
    name: "Vendas Diretas S.A.",
    nomeFantasia: "Vendas Diretas",
    plan: "Professional",
    users: [
      { role: "admin", status: "active" },
      { role: "seller", status: "active" },
      { role: "seller", status: "active" },
    ],
    status: "active",
    integratedCRM: "Pipedrive",
    integratedLLM: "Claude AI",
    email: "contato@vendasdiretas.com",
    phone: "(11) 88888-8888",
    cnpj: "00.000.000/0000-02",
    adminName: "Maria Santos",
    adminEmail: "maria@vendasdiretas.com",
  },
  {
    id: 3,
    name: "Global Comercio",
    nomeFantasia: "Global",
    plan: "Basic",
    users: [
      { role: "admin", status: "active" },
      { role: "seller", status: "inactive" },
    ],
    status: "inactive",
    integratedCRM: null,
    integratedLLM: null,
    email: "contato@global.com",
    phone: "(11) 77777-7777",
    cnpj: "00.000.000/0000-03",
    adminName: "Pedro Costa",
    adminEmail: "pedro@global.com",
  },
];

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const filteredOrganizations = organizations.filter((org) =>
    [org.name, org.nomeFantasia, org.cnpj].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <OrganizationsHeader onCreateNew={() => setIsCreateDialogOpen(true)} />
        
        <OrganizationsSearch 
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard 
              key={org.id} 
              organization={org}
              onEdit={handleEditOrganization}
            />
          ))}
        </div>

        <CreateOrganizationDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
        />

        {editingOrganization && (
          <EditOrganizationDialog
            open={!!editingOrganization}
            onOpenChange={(open) => !open && setEditingOrganization(null)}
            organization={editingOrganization}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Organizations;
