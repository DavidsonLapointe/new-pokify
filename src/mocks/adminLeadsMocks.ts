
import { LeadlyLead } from "@/pages/AdminLeads";

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
