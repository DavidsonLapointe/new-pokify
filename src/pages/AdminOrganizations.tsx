
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationCard } from "@/components/admin/organizations/OrganizationCard";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { Organization, User } from "@/types/organization";

const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Tech Solutions Ltda",
    nomeFantasia: "Tech Solutions",
    plan: "Enterprise",
    users: [
      {
        id: 1,
        name: "Admin User 1",
        email: "admin1@tech.com",
        phone: "(11) 99999-9999",
        role: "company_admin",
        status: "active",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:30:00.000Z",
        permissions: { integrations: ["view", "edit"] },
        logs: [],
        organization: {} as Organization, // Será atualizado após a criação
        avatar: ""
      },
      {
        id: 2,
        name: "Admin User 2",
        email: "admin2@tech.com",
        phone: "(11) 99999-9998",
        role: "company_admin",
        status: "inactive",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:30:00.000Z",
        permissions: { integrations: ["view"] },
        logs: [],
        organization: {} as Organization,
        avatar: ""
      },
      {
        id: 3,
        name: "Seller 1",
        email: "seller1@tech.com",
        phone: "(11) 99999-9997",
        role: "seller",
        status: "active",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:30:00.000Z",
        permissions: { calls: ["view"] },
        logs: [],
        organization: {} as Organization,
        avatar: ""
      },
    ],
    status: "active",
    integratedCRM: null,
    integratedLLM: "GPT-4O",
    email: "contato@techsolutions.com",
    phone: "(11) 99999-9999",
    cnpj: "00.000.000/0000-01",
    adminName: "João Silva",
    adminEmail: "joao@techsolutions.com",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Vendas Diretas S.A.",
    nomeFantasia: "Vendas Diretas",
    plan: "Professional",
    users: [
      {
        id: 4,
        name: "Admin User 3",
        email: "admin3@vendas.com",
        phone: "(11) 99999-9996",
        role: "company_admin",
        status: "active",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:30:00.000Z",
        permissions: { integrations: ["view", "edit"] },
        logs: [],
        organization: {} as Organization,
        avatar: ""
      },
      {
        id: 5,
        name: "Seller 2",
        email: "seller2@vendas.com",
        phone: "(11) 99999-9995",
        role: "seller",
        status: "active",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:30:00.000Z",
        permissions: { calls: ["view"] },
        logs: [],
        organization: {} as Organization,
        avatar: ""
      },
    ],
    status: "active",
    integratedCRM: "Pipedrive",
    integratedLLM: "Claude AI",
    email: "contato@vendasdiretas.com",
    phone: "(11) 88888-8888",
    cnpj: "00.000.000/0000-02",
    adminName: "Maria Santos",
    adminEmail: "maria@vendasdiretas.com",
    createdAt: "2024-02-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Global Comercio",
    nomeFantasia: "Global",
    plan: "Basic",
    users: [
      {
        id: 6,
        name: "Admin User 4",
        email: "admin4@global.com",
        phone: "(11) 99999-9994",
        role: "company_admin",
        status: "active",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:30:00.000Z",
        permissions: { integrations: ["view", "edit"] },
        logs: [],
        organization: {} as Organization,
        avatar: ""
      },
    ],
    status: "inactive",
    integratedCRM: null,
    integratedLLM: null,
    email: "contato@global.com",
    phone: "(11) 77777-7777",
    cnpj: "00.000.000/0000-03",
    adminName: "Pedro Costa",
    adminEmail: "pedro@global.com",
    createdAt: "2024-03-01T00:00:00.000Z"
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
