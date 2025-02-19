
import { useState, useEffect } from "react";
import { LeadsPageHeader } from "@/components/leads/LeadsPageHeader";
import { LeadsTable } from "@/components/calls/table/LeadsTable";
import { CreateLeadDialog } from "@/components/calls/CreateLeadDialog";
import { CallHistoryDialog } from "@/components/calls/CallHistoryDialog";
import { UploadCallsDialog } from "@/components/calls/UploadCallsDialog";
import { OrganizationLayout } from "@/components/OrganizationLayout";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { LeadCalls, Call } from "@/types/calls";
import { Organization, User } from "@/types/organization";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    role: "seller" as const,
    status: "active" as const,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccess: "2024-03-15T14:30:00.000Z",
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
    logs: [
      {
        id: 1,
        date: "2024-03-15T14:30:00.000Z",
        action: "Acessou o sistema"
      }
    ]
  }
];

const mockLeads: LeadCalls[] = [
  {
    id: "1",
    personType: "pf",
    firstName: "João",
    lastName: "Silva",
    calls: [
      {
        id: "1",
        date: "2024-03-10T10:00:00.000Z",
        duration: "05:23",
        mediaType: "audio",
        status: "success",
        phone: "(11) 99999-9999",
        leadInfo: {
          name: "João Silva",
          email: "joao@email.com",
        },
        analysis: {
          summary: "O cliente demonstrou interesse no produto...",
          sentiment: {
            temperature: "warm",
            reason: "Cliente demonstrou interesse"
          },
        },
        emptyLead: false,
      },
    ],
    crmInfo: {
      funnel: "Funil de Vendas",
      stage: "Prospecção",
    },
    createdAt: "2024-03-01T00:00:00.000Z",
  },
  {
    id: "2",
    personType: "pj",
    razaoSocial: "Empresa XPTO",
    cnpj: "12.345.678/0001-00",
    calls: [],
    crmInfo: {
      funnel: "Funil de Vendas B2B",
      stage: "Qualificação",
    },
    createdAt: "2024-03-05T00:00:00.000Z",
  },
];

const mockCurrentOrganization: Organization = {
  id: 1,
  name: "Empresa ABC",
  nomeFantasia: "ABC Ltda",
  plan: "professional",
  users: mockUsers,
  status: "active",
  pendingReason: null,
  integratedCRM: "HubSpot",
  integratedLLM: "GPT-4",
  email: "contato@abc.com",
  phone: "(11) 3333-3333",
  cnpj: "12.345.678/0001-90",
  adminName: "Admin ABC",
  adminEmail: "admin@abc.com",
  contractSignedAt: "2024-01-01T00:00:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
};

const OrganizationLeads = () => {
  const [leads, setLeads] = useState<LeadCalls[]>(mockLeads);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [isCallHistoryOpen, setIsCallHistoryOpen] = useState(false);
  const [isUploadCallsOpen, setIsUploadCallsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser] = useState<User>(mockUsers[0]);

  useEffect(() => {
    console.log("currentUser:", currentUser);
  }, [currentUser]);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleCreateLead = (data: LeadFormData) => {
    const newLead: LeadCalls = {
      id: Math.random().toString(),
      personType: data.personType,
      firstName: data.firstName,
      lastName: data.lastName,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      calls: [],
      createdAt: new Date().toISOString(),
    };
    setLeads([...leads, newLead]);
    setIsCreateLeadOpen(false);
  };

  const handleShowHistory = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setIsCallHistoryOpen(true);
  };

  const handleShowUpload = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setIsUploadCallsOpen(true);
  };

  const handleUploadCalls = (newCalls: Call[]) => {
    if (!selectedLead) return;

    const updatedLead: LeadCalls = {
      ...selectedLead,
      calls: [...(selectedLead.calls || []), ...newCalls],
    };

    setLeads(
      leads.map((lead) => (lead.id === selectedLead.id ? updatedLead : lead))
    );
    setIsUploadCallsOpen(false);
  };

  const filteredLeads = leads.filter((lead) => {
    const searchTerm = searchQuery.toLowerCase();
    if (lead.personType === "pf") {
      return (
        (lead.firstName && lead.firstName.toLowerCase().includes(searchTerm)) ||
        (lead.lastName && lead.lastName.toLowerCase().includes(searchTerm)) ||
        (lead.calls && lead.calls.some(call => call.leadInfo.email.toLowerCase().includes(searchTerm))) ||
        (lead.calls && lead.calls.some(call => call.phone.toLowerCase().includes(searchTerm)))
      );
    } else {
      return (
        (lead.razaoSocial && lead.razaoSocial.toLowerCase().includes(searchTerm)) ||
        (lead.cnpj && lead.cnpj.toLowerCase().includes(searchTerm))
      );
    }
  });

  return (
    <OrganizationLayout>
      <div className="container mx-auto py-10">
        <LeadsPageHeader
          onNewLeadClick={() => setIsCreateLeadOpen(true)}
          currentUser={currentUser}
          organization={mockCurrentOrganization}
        />

        <LeadsTable
          leads={filteredLeads}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          formatDate={formatDate}
          onShowHistory={handleShowHistory}
          onShowUpload={handleShowUpload}
        />

        <CreateLeadDialog
          hasPhoneIntegration={true}
          hasEmailIntegration={true}
          onCreateLead={handleCreateLead}
          isOpen={isCreateLeadOpen}
          onOpenChange={setIsCreateLeadOpen}
        />

        {selectedLead && (
          <>
            <CallHistoryDialog
              lead={selectedLead}
              isOpen={isCallHistoryOpen}
              onOpenChange={setIsCallHistoryOpen}
              formatDate={formatDate}
            />

            <UploadCallsDialog
              lead={selectedLead}
              isOpen={isUploadCallsOpen}
              onOpenChange={setIsUploadCallsOpen}
              onUpload={handleUploadCalls}
            />
          </>
        )}
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationLeads;
