
import { LeadlyLead } from "@/pages/AdminLeads";

export const mockLeadlyLeads: LeadlyLead[] = [
  // Status: contactar (4 examples)
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    createdAt: "2023-08-15T14:30:00Z",
    status: "contactar",
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
    status: "contactar",
    notes: []
  },
  {
    id: "3",
    name: "Ricardo Mendes",
    phone: "(11) 95555-1234",
    createdAt: "2023-09-05T08:20:00Z",
    status: "contactar",
    personType: "pj",
    companyName: "Mendes Tecnologia",
    notes: []
  },
  {
    id: "4",
    name: "Fernanda Costa",
    phone: "(47) 98888-7777",
    createdAt: "2023-09-10T11:45:00Z",
    status: "contactar",
    notes: []
  },
  
  // Status: qualificacao (4 examples)
  {
    id: "5",
    name: "Roberto Almeida",
    phone: "(51) 94321-0987",
    createdAt: "2023-08-19T11:20:00Z",
    status: "qualificacao",
    notes: [
      {
        id: "note-4",
        content: "Cliente indicado pelo Pedro Santos",
        createdAt: new Date("2023-08-19T13:45:00Z"),
        userName: "Ana Marketing"
      }
    ]
  },
  {
    id: "6",
    name: "Carolina Martins",
    phone: "(31) 97777-8888",
    createdAt: "2023-08-22T09:30:00Z",
    status: "qualificacao",
    personType: "pj",
    companyName: "Martins & Associados",
    email: "carolina@martins.com.br",
    notes: []
  },
  {
    id: "7",
    name: "Antônio Ferreira",
    phone: "(85) 96666-5555",
    createdAt: "2023-08-25T14:10:00Z",
    status: "qualificacao",
    notes: [
      {
        id: "note-5",
        content: "Cliente com grande potencial para o módulo financeiro",
        createdAt: new Date("2023-08-25T16:45:00Z"),
        userName: "Bruno Vendas"
      }
    ]
  },
  {
    id: "8",
    name: "Isabela Rocha",
    phone: "(27) 95544-3322",
    createdAt: "2023-09-01T10:30:00Z",
    status: "qualificacao",
    personType: "pj",
    companyName: "Rocha Consultoria",
    employeeCount: "15",
    sector: "Consultoria Financeira",
    notes: []
  },
  
  // Status: nutricao_mkt (4 examples)
  {
    id: "9",
    name: "Lucia Ferreira",
    phone: "(41) 95432-1098",
    createdAt: "2023-08-18T16:30:00Z",
    status: "nutricao_mkt",
    notes: []
  },
  {
    id: "10",
    name: "Carlos Eduardo Santos",
    phone: "(19) 94433-2211",
    createdAt: "2023-08-28T13:45:00Z",
    status: "nutricao_mkt",
    personType: "pj",
    companyName: "Santos Engenharia",
    employeeCount: "45",
    sector: "Construção Civil",
    notes: [
      {
        id: "note-6",
        content: "Enviado material sobre automação de processos",
        createdAt: new Date("2023-08-28T15:20:00Z"),
        userName: "Ana Marketing"
      }
    ]
  },
  {
    id: "11",
    name: "Mariana Lima",
    phone: "(81) 93322-1100",
    createdAt: "2023-09-03T09:15:00Z",
    status: "nutricao_mkt",
    notes: []
  },
  {
    id: "12",
    name: "Paulo Henrique Dias",
    phone: "(62) 92211-0099",
    createdAt: "2023-09-07T14:50:00Z",
    status: "nutricao_mkt",
    personType: "pj",
    companyName: "Dias Soluções Digitais",
    email: "paulo@diassolucoes.com.br",
    employeeCount: "12",
    sector: "Tecnologia",
    notes: []
  },
  
  // Status: email_onboarding (4 examples)
  {
    id: "13",
    name: "Pedro Santos",
    phone: "(31) 96543-2109",
    createdAt: "2023-08-17T09:45:00Z",
    status: "email_onboarding",
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
    id: "14",
    name: "Gustavo Moreira",
    phone: "(48) 91100-9988",
    createdAt: "2023-09-12T10:10:00Z",
    status: "email_onboarding",
    personType: "pj",
    companyName: "Moreira Advocacia",
    email: "gustavo@moreiraadvocacia.com.br",
    employeeCount: "8",
    sector: "Jurídico",
    notes: []
  },
  {
    id: "15",
    name: "Juliana Campos",
    phone: "(13) 90099-8877",
    createdAt: "2023-09-15T16:30:00Z",
    status: "email_onboarding",
    notes: [
      {
        id: "note-7",
        content: "Cliente está analisando a proposta enviada",
        createdAt: new Date("2023-09-15T17:45:00Z"),
        userName: "Bruno Vendas"
      }
    ]
  },
  {
    id: "16",
    name: "Leandro Vieira",
    phone: "(84) 98877-6655",
    createdAt: "2023-09-18T11:20:00Z",
    status: "email_onboarding",
    personType: "pj",
    companyName: "Vieira Comércio Ltda",
    email: "leandro@vieiracomercio.com.br",
    employeeCount: "23",
    sector: "Varejo",
    notes: []
  },
  
  // Status: ganho (4 examples)
  {
    id: "17",
    name: "Amanda Oliveira",
    phone: "(71) 97766-5544",
    createdAt: "2023-08-20T09:30:00Z",
    status: "ganho",
    personType: "pj",
    companyName: "Oliveira Tech",
    email: "amanda@oliveiratech.com.br",
    employeeCount: "35",
    sector: "Tecnologia",
    notes: [
      {
        id: "note-8",
        content: "Cliente contratou o plano anual",
        createdAt: new Date("2023-08-20T14:15:00Z"),
        userName: "Carlos Vendedor"
      }
    ]
  },
  {
    id: "18",
    name: "Rafael Cunha",
    phone: "(67) 96655-4433",
    createdAt: "2023-09-02T15:40:00Z",
    status: "ganho",
    notes: []
  },
  {
    id: "19",
    name: "Sandra Pereira",
    phone: "(91) 95544-3322",
    createdAt: "2023-09-08T13:20:00Z",
    status: "ganho",
    personType: "pj",
    companyName: "Pereira Consultoria",
    email: "sandra@pereiraconsultoria.com.br",
    employeeCount: "7",
    sector: "Consultoria",
    notes: [
      {
        id: "note-9",
        content: "Cliente finalizou o onboarding com sucesso",
        createdAt: new Date("2023-09-08T16:45:00Z"),
        userName: "Ana Marketing"
      }
    ]
  },
  {
    id: "20",
    name: "Thiago Mendonça",
    phone: "(24) 94433-2211",
    createdAt: "2023-09-20T10:10:00Z",
    status: "ganho",
    notes: []
  },
  
  // Status: perda (4 examples)
  {
    id: "21",
    name: "Marcelo Souza",
    phone: "(54) 93322-1100",
    createdAt: "2023-08-30T11:30:00Z",
    status: "perda",
    lossReason: "Orçamento insuficiente",
    notes: [
      {
        id: "note-10",
        content: "Cliente achou o valor acima do orçamento disponível",
        createdAt: new Date("2023-08-30T14:20:00Z"),
        userName: "Bruno Vendas"
      }
    ]
  },
  {
    id: "22",
    name: "Luciana Gomes",
    phone: "(86) 92211-0099",
    createdAt: "2023-09-06T16:15:00Z",
    status: "perda",
    lossReason: "Concorrente",
    personType: "pj",
    companyName: "Gomes Soluções",
    email: "luciana@gomessolucoes.com.br",
    employeeCount: "18",
    sector: "Serviços",
    notes: []
  },
  {
    id: "23",
    name: "Henrique Castro",
    phone: "(98) 91100-9988",
    createdAt: "2023-09-14T09:40:00Z",
    status: "perda",
    lossReason: "Sem necessidade atual",
    notes: [
      {
        id: "note-11",
        content: "Cliente decidiu adiar a implementação para o próximo ano",
        createdAt: new Date("2023-09-14T11:30:00Z"),
        userName: "Carlos Vendedor"
      }
    ]
  },
  {
    id: "24",
    name: "Patrícia Barros",
    phone: "(88) 90099-8877",
    createdAt: "2023-09-17T14:30:00Z",
    status: "perda",
    lossReason: "Falta de funcionalidades",
    personType: "pj",
    companyName: "Barros Contabilidade",
    email: "patricia@barroscontabilidade.com.br",
    employeeCount: "9",
    sector: "Contabilidade",
    notes: []
  },
  
  // Additional entries (4 more with mixed statuses)
  {
    id: "25",
    name: "Leonardo Ribeiro",
    phone: "(16) 98877-6655",
    createdAt: "2023-09-21T10:45:00Z",
    status: "contactar",
    personType: "pj",
    companyName: "Ribeiro Automação",
    email: "leonardo@ribeiroautomacao.com.br",
    employeeCount: "27",
    sector: "Automação Industrial",
    notes: []
  },
  {
    id: "26",
    name: "Camila Duarte",
    phone: "(34) 97766-5544",
    createdAt: "2023-09-22T13:15:00Z",
    status: "qualificacao",
    notes: [
      {
        id: "note-12",
        content: "Cliente interessado em conhecer mais sobre o módulo de atendimento",
        createdAt: new Date("2023-09-22T15:30:00Z"),
        userName: "Ana Marketing"
      }
    ]
  },
  {
    id: "27",
    name: "Diego Nogueira",
    phone: "(43) 96655-4433",
    createdAt: "2023-09-23T09:20:00Z",
    status: "nutricao_mkt",
    personType: "pj",
    companyName: "Nogueira Logística",
    email: "diego@nogueiralogistica.com.br",
    employeeCount: "42",
    sector: "Logística",
    notes: []
  },
  {
    id: "28",
    name: "Beatriz Monteiro",
    phone: "(17) 95544-3322",
    createdAt: "2023-09-24T14:50:00Z",
    status: "ganho",
    notes: [
      {
        id: "note-13",
        content: "Cliente já finalizou o cadastro e está utilizando a plataforma",
        createdAt: new Date("2023-09-24T16:15:00Z"),
        userName: "Bruno Vendas"
      }
    ]
  }
];
