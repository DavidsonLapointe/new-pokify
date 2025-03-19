
import { Lead } from "@/types/leads";
import { v4 as uuidv4 } from "uuid";

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
        duration: 325,
        createdAt: "2023-05-15T14:30:00Z"
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
