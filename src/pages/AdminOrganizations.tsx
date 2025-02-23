
import React, { useState } from "react";
import { Organization } from "@/types";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { EditOrganizationDialog } from "@/components/admin/organizations/EditOrganizationDialog";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { OrganizationsTable } from "@/components/admin/organizations/OrganizationsTable";
import { ActiveUsersDialog } from "@/components/admin/organizations/ActiveUsersDialog";

const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Tech Solutions Ltd",
    nomeFantasia: "TechSol",
    plan: "Professional",
    users: [],
    status: "active",
    integratedCRM: "Salesforce",
    integratedLLM: "GPT-4",
    email: "contact@techsol.com",
    phone: "(11) 98765-4321",
    cnpj: "12.345.678/0001-90",
    adminName: "Maria Silva",
    adminEmail: "maria@techsol.com",
    createdAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Global Services Inc",
    nomeFantasia: "GlobalServ",
    plan: "Enterprise",
    users: [],
    status: "pending",
    pendingReason: "contract_signature",
    integratedCRM: null,
    integratedLLM: null,
    email: "info@globalserv.com",
    phone: "(11) 91234-5678",
    cnpj: "98.765.432/0001-10",
    adminName: "João Santos",
    adminEmail: "joao@globalserv.com",
    createdAt: "2024-02-20T14:30:00.000Z"
  },
  {
    id: 3,
    name: "Innovation Labs",
    nomeFantasia: "InnLabs",
    plan: "Professional",
    users: [],
    status: "active",
    integratedCRM: "Hubspot",
    integratedLLM: "GPT-4",
    email: "hello@innlabs.com",
    phone: "(11) 94444-3333",
    cnpj: "45.678.901/0001-23",
    adminName: "Ana Oliveira",
    adminEmail: "ana@innlabs.com",
    createdAt: "2024-03-01T09:15:00.000Z"
  }
];

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    setOrganizations(orgs => 
      orgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
    );
    setEditingOrganization(null);
  };

  const handleShowActiveUsers = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  const filteredOrganizations = organizations.filter((org) =>
    [org.name, org.nomeFantasia, org.cnpj].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <OrganizationsHeader onCreateNew={() => setIsCreateDialogOpen(true)} />
      
      <OrganizationsSearch 
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <OrganizationsTable 
        organizations={filteredOrganizations}
        onEditOrganization={handleEditOrganization}
        onShowActiveUsers={handleShowActiveUsers}
      />

      <CreateOrganizationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />

      {editingOrganization && (
        <EditOrganizationDialog
          open={!!editingOrganization}
          onOpenChange={(open) => !open && setEditingOrganization(null)}
          organization={editingOrganization}
          onSave={handleUpdateOrganization}
        />
      )}

      <ActiveUsersDialog
        organization={selectedOrganization}
        onClose={() => setSelectedOrganization(null)}
      />
    </div>
  );
};

export default Organizations;
