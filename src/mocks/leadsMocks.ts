
import { Lead } from "@/types/leads";
import { v4 as uuidv4 } from "uuid";
import { LeadlyLead } from "@/pages/AdminLeads";

export const mockLeads: Lead[] = [
  {
    id: uuidv4(),
    organizationId: "org-123",
    status: "qualified",
    temperature: "hot",
    personType: "pj",
    firstName: "João",
    lastName: "Silva",
    email: "joao@empresa.com",
    phone: "(11) 98765-4321",
    company: "Empresa ABC",
    razaoSocial: "Empresa ABC Ltda",
    cnpj: "12.345.678/0001-90",
    lastContactDate: "2023-05-20T14:30:00Z",
    createdAt: "2023-05-15T14:30:00Z",
    updatedAt: "2023-05-20T14:30:00Z",
    crmId: "crm-123",
    crmLink: "https://crm.example.com/lead/crm-123",
    source: "call",
    notes: [
      {
        id: uuidv4(),
        content: "Cliente interessado em nossa solução premium",
        createdAt: "2023-05-15T15:00:00Z",
        createdBy: {
          id: "user-123",
          name: "Vendedor 1"
        }
      }
    ],
    calls: [
      {
        id: uuidv4(),
        fileName: "call-01.mp3",
        duration: "5:25",
        date: "2023-05-15T14:30:00Z",
        status: "success"
      }
    ]
  },
  {
    id: uuidv4(),
    organizationId: "org-123",
    status: "negotiation",
    temperature: "warm",
    personType: "pf",
    firstName: "Maria",
    lastName: "Oliveira",
    email: "maria@example.com",
    phone: "(11) 91234-5678",
    cpf: "123.456.789-00",
    lastContactDate: "2023-05-22T10:15:00Z",
    createdAt: "2023-05-16T10:15:00Z",
    updatedAt: "2023-05-22T10:15:00Z",
    crmId: "crm-456",
    crmLink: "https://crm.example.com/lead/crm-456",
    source: "website",
    notes: [
      {
        id: uuidv4(),
        content: "Cliente solicitou uma demonstração",
        createdAt: "2023-05-16T11:00:00Z",
        createdBy: {
          id: "user-123",
          name: "Vendedor 1"
        }
      },
      {
        id: uuidv4(),
        content: "Demonstração agendada para 25/05",
        createdAt: "2023-05-22T10:15:00Z",
        createdBy: {
          id: "user-456",
          name: "Gestor"
        }
      }
    ],
    calls: []
  }
];

// Define the exported leadsOrganizacao1 used in other components
export const leadsOrganizacao1 = mockLeads;

// Mock data for leadly leads (from landing page)
export const mockLeadlyLeads: LeadlyLead[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    createdAt: "2023-08-15T14:30:00Z",
    notes: [
      {
        id: "note-1",
        content: "Cliente interessado em uma demonstração do produto",
        createdAt: new Date("2023-08-15T16:30:00Z"),
        userName: "Carlos Vendedor"
      }
    ]
  },
  {
    id: "2",
    name: "Maria Oliveira",
    phone: "(21) 97654-3210",
    createdAt: "2023-08-16T10:15:00Z",
    notes: []
  },
  {
    id: "3",
    name: "Pedro Santos",
    phone: "(31) 96543-2109",
    createdAt: "2023-08-17T09:45:00Z",
    notes: [
      {
        id: "note-2",
        content: "Cliente solicitou material por e-mail",
        createdAt: new Date("2023-08-17T11:20:00Z"),
        userName: "Ana Marketing"
      },
      {
        id: "note-3",
        content: "Material enviado, aguardando feedback",
        createdAt: new Date("2023-08-18T14:10:00Z"),
        userName: "Carlos Vendedor"
      }
    ]
  },
  {
    id: "4",
    name: "Lucia Ferreira",
    phone: "(41) 95432-1098",
    createdAt: "2023-08-18T16:30:00Z",
    notes: []
  },
  {
    id: "5",
    name: "Roberto Almeida",
    phone: "(51) 94321-0987",
    createdAt: "2023-08-19T11:20:00Z",
    notes: [
      {
        id: "note-4",
        content: "Cliente indicado pelo Pedro Santos",
        createdAt: new Date("2023-08-19T13:45:00Z"),
        userName: "Ana Marketing"
      }
    ]
  }
];
