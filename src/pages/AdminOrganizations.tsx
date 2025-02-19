import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Organization } from "@/types/organization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { OrganizationsHeader } from "@/components/admin/organizations/OrganizationsHeader";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { CreateOrganizationDialog } from "@/components/admin/organizations/CreateOrganizationDialog";
import { mockUsers } from "@/types/organization";

const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Empresa ABC",
    nomeFantasia: "ABC Ltda",
    plan: "professional",
    users: [
      {
        id: 1,
        name: "Admin ABC",
        email: "admin@abc.com",
        phone: "(11) 99999-9999",
        role: "company_admin",
        status: "active",
        createdAt: "2024-01-01T00:00:00.000Z",
        lastAccess: "2024-03-15T10:00:00.000Z",
        permissions: {
          menuAccess: {
            dashboard: true,
            calls: true,
            leads: true,
            integrations: true,
            settings: true,
            plan: true,
            profile: true
          }
        },
        logs: []
      },
      {
        id: 2,
        name: "Vendedor ABC",
        email: "vendedor@abc.com",
        phone: "(11) 98888-8888",
        role: "seller",
        status: "active",
        createdAt: "2024-01-02T00:00:00.000Z",
        lastAccess: "2024-03-15T11:00:00.000Z",
        permissions: {
          menuAccess: {
            dashboard: true,
            calls: true,
            leads: true,
            integrations: false,
            settings: false,
            plan: true,
            profile: true
          }
        },
        logs: []
      }
    ],
    status: "active",
    integratedCRM: "HubSpot",
    integratedLLM: "GPT-4",
    email: "contato@abc.com",
    phone: "(11) 3333-3333",
    cnpj: "12.345.678/0001-90",
    adminName: "Admin ABC",
    adminEmail: "admin@abc.com",
    contractSignedAt: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Empresa XYZ",
    nomeFantasia: "XYZ Soluções",
    plan: "basic",
    users: [
      {
        id: 3,
        name: "Admin XYZ",
        email: "admin@xyz.com",
        phone: "(11) 77777-7777",
        role: "company_admin",
        status: "pending",
        createdAt: "2024-02-15T00:00:00.000Z",
        lastAccess: "2024-02-28T12:00:00.000Z",
        permissions: {
          menuAccess: {
            dashboard: true,
            calls: true,
            leads: true,
            integrations: true,
            settings: true,
            plan: true,
            profile: true
          }
        },
        logs: []
      },
      {
        id: 4,
        name: "Vendedor XYZ",
        email: "vendedor@xyz.com",
        phone: "(11) 66666-6666",
        role: "seller",
        status: "inactive",
        createdAt: "2024-02-16T00:00:00.000Z",
        lastAccess: "2024-02-28T13:00:00.000Z",
        permissions: {
          menuAccess: {
            dashboard: true,
            calls: true,
            leads: true,
            integrations: false,
            settings: false,
            plan: true,
            profile: true
          }
        },
        logs: []
      }
    ],
    status: "pending",
    pendingReason: "contract_signature",
    integratedCRM: null,
    integratedLLM: null,
    email: "contato@xyz.com",
    phone: "(11) 2222-2222",
    cnpj: "98.765.432/0001-12",
    adminName: "Admin XYZ",
    adminEmail: "admin@xyz.com",
    createdAt: "2024-02-15T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Empresa DEF",
    nomeFantasia: "DEF Solutions",
    plan: "enterprise",
    users: [
      {
        id: 5,
        name: "Admin DEF",
        email: "admin@def.com",
        phone: "(11) 55555-5555",
        role: "company_admin",
        status: "active",
        createdAt: "2024-03-01T00:00:00.000Z",
        lastAccess: "2024-03-15T14:00:00.000Z",
        permissions: {
          menuAccess: {
            dashboard: true,
            calls: true,
            leads: true,
            integrations: true,
            settings: true,
            plan: true,
            profile: true
          }
        },
        logs: []
      },
      {
        id: 6,
        name: "Vendedor DEF",
        email: "vendedor@def.com",
        phone: "(11) 44444-4444",
        role: "seller",
        status: "active",
        createdAt: "2024-03-02T00:00:00.000Z",
        lastAccess: "2024-03-15T15:00:00.000Z",
        permissions: {
          menuAccess: {
            dashboard: true,
            calls: true,
            leads: true,
            integrations: false,
            settings: false,
            plan: true,
            profile: true
          }
        },
        logs: []
      }
    ],
    status: "active",
    integratedCRM: "Salesforce",
    integratedLLM: "Bard",
    email: "contato@def.com",
    phone: "(11) 1111-1111",
    cnpj: "54.321.876/0001-56",
    adminName: "Admin DEF",
    adminEmail: "admin@def.com",
    contractSignedAt: "2024-03-01T00:00:00.000Z",
    createdAt: "2024-03-01T00:00:00.000Z"
  }
];

const AdminOrganizations = () => {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredOrganizations = mockOrganizations.filter((org) => {
    const searchTerm = search.toLowerCase();
    return (
      org.name.toLowerCase().includes(searchTerm) ||
      org.nomeFantasia?.toLowerCase().includes(searchTerm) ||
      org.cnpj.includes(searchTerm)
    );
  });

  return (
    <div className="container py-10">
      <OrganizationsHeader onCreateNew={() => setIsCreateDialogOpen(true)} />

      <div className="mt-4">
        <OrganizationsSearch value={search} onChange={setSearch} />
      </div>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razão Social</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell className="font-medium">{organization.name}</TableCell>
                <TableCell>{organization.nomeFantasia}</TableCell>
                <TableCell>{organization.cnpj}</TableCell>
                <TableCell>{organization.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant={organization.status === "active" ? "secondary" : "destructive"}
                  >
                    {organization.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateOrganizationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default AdminOrganizations;
