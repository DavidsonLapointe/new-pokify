
import { Lead } from '@/types/leads';
import { v4 as uuidv4 } from 'uuid';

// Generate mock lead data with call history
export const leadsOrganizacao1: Lead[] = [
  {
    id: uuidv4(),
    firstName: "Carlos",
    lastName: "Oliveira",
    status: "active",  // Updated to new status
    temperature: "hot",
    personType: "pj", 
    contactType: "phone",
    contactValue: "(11) 97654-3210",
    email: "carlos@empresa.com.br",
    company: "Empresa Tecnologia Ltda",
    razaoSocial: "Empresa Tecnologia Ltda",
    cnpj: "12.345.678/0001-90",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    lastContactDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    callCount: 3,
    calls: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        duration: "4:23",
        status: "success",
        fileName: "ligacao_carlos_01.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        duration: "7:45",
        status: "success",
        fileName: "ligacao_carlos_02.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        duration: "2:18",
        status: "success",
        fileName: "ligacao_carlos_03.mp3"
      }
    ],
    source: "Site",
    crmInfo: {
      funnel: "Vendas",
      stage: "Qualificação"
    },
    notes: [
      {
        id: uuidv4(),
        content: "Cliente interessado no módulo financeiro",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        createdBy: {
          id: "1",
          name: "Maria Santos"
        }
      }
    ]
  },
  {
    id: uuidv4(),
    firstName: "Ana",
    lastName: "Silva",
    status: "active",  // Updated to new status
    temperature: "warm",
    personType: "pf",
    contactType: "phone",
    contactValue: "(21) 98765-4321",
    email: "ana.silva@email.com",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    callCount: 2,
    calls: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        duration: "5:30",
        status: "success",
        fileName: "ana_silva_call_01.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        duration: "3:45",
        status: "failed",
        fileName: "ana_silva_call_02.mp3"
      }
    ],
    source: "Indicação",
    crmInfo: {
      funnel: "Vendas",
      stage: "Negociação"
    }
  },
  {
    id: uuidv4(),
    firstName: "Roberto",
    lastName: "Martins",
    status: "active",  // Updated to new status
    temperature: "cold",
    personType: "pj",
    contactType: "email",
    contactValue: "roberto@consultorias.com.br",
    company: "RM Consultorias",
    razaoSocial: "RM Consultorias e Serviços Ltda",
    cnpj: "23.456.789/0001-23",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    callCount: 0,
    source: "LinkedIn",
    crmInfo: {
      funnel: "Marketing",
      stage: "Lead Frio"
    }
  },
  {
    id: uuidv4(),
    firstName: "Juliana",
    lastName: "Costa",
    status: "active",  // Updated to new status
    temperature: "hot",
    personType: "pj",
    contactType: "phone",
    contactValue: "(11) 91234-5678",
    email: "juliana@innovatech.com.br",
    company: "InnovaTech",
    razaoSocial: "InnovaTech Soluções Digitais Ltda",
    cnpj: "34.567.890/0001-45",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    callCount: 4,
    calls: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        duration: "12:05",
        status: "success",
        fileName: "juliana_innovatech_01.mp4"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        duration: "8:15",
        status: "success",
        fileName: "juliana_innovatech_02.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
        duration: "5:40",
        status: "success",
        fileName: "juliana_innovatech_03.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 15).toISOString(),
        duration: "3:22",
        status: "failed",
        fileName: "juliana_innovatech_04.mp3"
      }
    ],
    source: "Google Ads",
    crmInfo: {
      funnel: "Vendas",
      stage: "Proposta"
    },
    notes: [
      {
        id: uuidv4(),
        content: "Cliente solicitou proposta para 30 usuários",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        createdBy: {
          id: "2",
          name: "Maria Santos"
        }
      },
      {
        id: uuidv4(),
        content: "Demonstração realizada com sucesso para equipe de gestão",
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        createdBy: {
          id: "2",
          name: "Maria Santos"
        }
      }
    ]
  },
  {
    id: uuidv4(),
    firstName: "Pedro",
    lastName: "Almeida",
    status: "inactive",  // Set as inactive to demonstrate both statuses
    temperature: "cold",
    personType: "pf",
    contactType: "phone",
    contactValue: "(31) 98888-7777",
    email: "pedro.almeida@email.com",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    callCount: 1,
    calls: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 15).toISOString(),
        duration: "1:45",
        status: "failed",
        fileName: "pedro_almeida_01.mp3"
      }
    ],
    source: "Instagram",
    crmInfo: {
      funnel: "Marketing",
      stage: "Perdido"
    },
    notes: [
      {
        id: uuidv4(),
        content: "Lead não tem interesse no momento, solicitou não ser mais contactado",
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        createdBy: {
          id: "2",
          name: "Maria Santos"
        }
      }
    ]
  },
  {
    id: uuidv4(),
    firstName: "Mariana",
    lastName: "Santos",
    status: "active",  // Updated to new status
    temperature: "hot",
    personType: "pj",
    contactType: "phone",
    contactValue: "(47) 99876-5432",
    email: "mariana@techinova.com.br",
    company: "TechInova",
    razaoSocial: "TechInova Sistemas de Gestão Ltda",
    cnpj: "45.678.901/0001-67",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    callCount: 3,
    calls: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        duration: "15:22",
        status: "success",
        fileName: "mariana_techinova_01.mp4"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        duration: "7:18",
        status: "success",
        fileName: "mariana_techinova_02.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 8).toISOString(),
        duration: "4:53",
        status: "success",
        fileName: "mariana_techinova_03.mp3"
      }
    ],
    source: "Webinar",
    crmInfo: {
      funnel: "Vendas",
      stage: "Demonstração"
    },
    notes: [
      {
        id: uuidv4(),
        content: "Cliente agendou uma segunda demonstração com a equipe técnica",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        createdBy: {
          id: "2",
          name: "Maria Santos"
        }
      }
    ]
  },
  
  // New lead with 10 mixed status calls
  {
    id: uuidv4(),
    firstName: "Fernando",
    lastName: "Costa",
    status: "inactive",  // Set as inactive to demonstrate both statuses
    temperature: "warm",
    personType: "pj",
    contactType: "phone",
    contactValue: "(11) 99123-4567",
    email: "fernando@techsystems.com.br",
    company: "Tech Systems",
    razaoSocial: "Tech Systems Soluções em TI Ltda",
    cnpj: "56.789.123/0001-89",
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    callCount: 10,
    calls: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        duration: "8:45",
        status: "success",
        fileName: "fernando_call_01.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        duration: "6:12",
        status: "failed",
        fileName: "fernando_call_02.mp4"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        duration: "10:34",
        status: "success",
        fileName: "fernando_call_03.mp4"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        duration: "3:21",
        status: "failed",
        fileName: "fernando_call_04.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 9).toISOString(),
        duration: "7:18",
        status: "success",
        fileName: "fernando_call_05.mp4"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 11).toISOString(),
        duration: "5:50",
        status: "failed",
        fileName: "fernando_call_06.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 15).toISOString(),
        duration: "9:23",
        status: "success",
        fileName: "fernando_call_07.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 18).toISOString(),
        duration: "4:55",
        status: "success",
        fileName: "fernando_call_08.mp4"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 21).toISOString(),
        duration: "2:40",
        status: "failed",
        fileName: "fernando_call_09.mp3"
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 25).toISOString(),
        duration: "11:07",
        status: "success",
        fileName: "fernando_call_10.mp4"
      }
    ],
    source: "Evento",
    crmInfo: {
      funnel: "Vendas",
      stage: "Qualificação"
    },
    notes: [
      {
        id: uuidv4(),
        content: "Cliente solicitou que a empresa não faça mais contato",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        createdBy: {
          id: "2",
          name: "Maria Santos"
        }
      },
      {
        id: uuidv4(),
        content: "Solicitou orçamento para 20 usuários",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        createdBy: {
          id: "2",
          name: "Maria Santos"
        }
      }
    ]
  }
];
