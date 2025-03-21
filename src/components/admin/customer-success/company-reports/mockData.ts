
import { CompanyData } from "./types";

// Mock data generator with 15 companies
export const generateMockData = (): CompanyData[] => {
  const companies = [
    { 
      name: "TechSolutions Brasil", 
      activeUsers: 24, 
      interactions: 187, 
      modules: { 
        count: 4, 
        names: ["CRM Avançado", "Dashboard Analítico", "Gestão de Leads", "Automação de Marketing"] 
      },
      lastActivity: "Hoje",
      unusedPermissions: {
        count: 3,
        tabs: ["Dashboard Financeiro", "Relatórios de Vendas"],
        functions: ["Exportar para Excel"]
      }
    },
    { 
      name: "GloboTech", 
      activeUsers: 18, 
      interactions: 143, 
      modules: { 
        count: 3, 
        names: ["CRM Avançado", "Gestão de Leads", "Dashboard Analítico"] 
      },
      lastActivity: "Hoje",
      unusedPermissions: {
        count: 2,
        tabs: ["Análise de Dados"],
        functions: ["Configurações Avançadas"]
      }
    },
    { 
      name: "Conecta Software", 
      activeUsers: 15, 
      interactions: 112, 
      modules: { 
        count: 3, 
        names: ["Automação de Marketing", "Gestão de Leads", "Integração de APIs"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 4,
        tabs: ["Dashboard Analítico", "Relatórios Personalizados"],
        functions: ["Exportar para CSV", "Enviar por Email"]
      }
    },
    { 
      name: "Sistemas Integrados SA", 
      activeUsers: 12, 
      interactions: 98, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Gestão de Leads"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 1,
        tabs: [],
        functions: ["Configurações Avançadas"]
      }
    },
    { 
      name: "DataSoft", 
      activeUsers: 10, 
      interactions: 87, 
      modules: { 
        count: 3, 
        names: ["Dashboard Analítico", "CRM Básico", "Gestão de Projeto"] 
      },
      lastActivity: "Há 2 dias",
      unusedPermissions: {
        count: 5,
        tabs: ["Gestão de Equipes", "Análise de Desempenho", "Dashboard Avançado"],
        functions: ["Importação em Massa", "Exportar Relatórios"]
      }
    },
    { 
      name: "NeoTech", 
      activeUsers: 8, 
      interactions: 76, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Automação de Marketing"] 
      },
      lastActivity: "Há 3 dias",
      unusedPermissions: {
        count: 2,
        tabs: ["Análise de Campanhas"],
        functions: ["Configuração de Automações"]
      }
    },
    { 
      name: "ByteCode Systems", 
      activeUsers: 7, 
      interactions: 62, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 3 dias",
      unusedPermissions: {
        count: 0,
        tabs: [],
        functions: []
      }
    },
    { 
      name: "Inovação Digital", 
      activeUsers: 6, 
      interactions: 54, 
      modules: { 
        count: 2, 
        names: ["Gestão de Leads", "Dashboard Básico"] 
      },
      lastActivity: "Há 4 dias",
      unusedPermissions: {
        count: 3,
        tabs: ["Automação de Marketing", "Relatórios Personalizados"],
        functions: ["Acesso a API"]
      }
    },
    { 
      name: "TecnoPro Soluções", 
      activeUsers: 16, 
      interactions: 123, 
      modules: { 
        count: 3, 
        names: ["CRM Avançado", "Dashboard Analítico", "Gestão de Vendas"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 2,
        tabs: ["Integração com ERPs"],
        functions: ["Configurações de Sistema"]
      }
    },
    { 
      name: "Nexus IT", 
      activeUsers: 14, 
      interactions: 105, 
      modules: { 
        count: 2, 
        names: ["Automação de Vendas", "CRM Avançado"] 
      },
      lastActivity: "Hoje",
      unusedPermissions: {
        count: 4,
        tabs: ["Gestão de Dados", "Relatórios Avançados"],
        functions: ["Exportação Avançada", "Configurações Administrativas"]
      }
    },
    { 
      name: "Alpha Tecnologia", 
      activeUsers: 9, 
      interactions: 82, 
      modules: { 
        count: 2, 
        names: ["CRM Básico", "Integração de Leads"] 
      },
      lastActivity: "Há 2 dias",
      unusedPermissions: {
        count: 1,
        tabs: ["Análise de Desempenho"],
        functions: []
      }
    },
    { 
      name: "Digitel Sistemas", 
      activeUsers: 11, 
      interactions: 94, 
      modules: { 
        count: 3, 
        names: ["Automação de Marketing", "Dashboard Analítico", "CRM Básico"] 
      },
      lastActivity: "Ontem",
      unusedPermissions: {
        count: 3,
        tabs: ["CRM Avançado"],
        functions: ["Gestão de Usuários", "Configurações de Email"]
      }
    },
    { 
      name: "SoftWay Brasil", 
      activeUsers: 5, 
      interactions: 48, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 5 dias",
      unusedPermissions: {
        count: 2,
        tabs: ["Dashboard Básico"],
        functions: ["Configurações de Notificações"]
      }
    },
    { 
      name: "Conexão Digital", 
      activeUsers: 4, 
      interactions: 42, 
      modules: { 
        count: 1, 
        names: ["Gestão de Leads"] 
      },
      lastActivity: "Há 5 dias",
      unusedPermissions: {
        count: 0,
        tabs: [],
        functions: []
      }
    },
    { 
      name: "DataCore Brasil", 
      activeUsers: 3, 
      interactions: 35, 
      modules: { 
        count: 1, 
        names: ["CRM Básico"] 
      },
      lastActivity: "Há 6 dias",
      unusedPermissions: {
        count: 1,
        tabs: [],
        functions: ["Exportar Contatos"]
      }
    }
  ];
  
  return companies;
};
