
import { Lead } from '@/types/leads';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create dates from X days ago
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Helper function to generate random phone numbers
const generatePhone = (): string => {
  const area = Math.floor(Math.random() * 90 + 10);
  const prefix = Math.floor(Math.random() * 9000 + 1000);
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `(${area}) ${prefix}-${suffix}`;
};

// Helper function to generate leads by type
const generateLeadsByType = (
  type: 'client' | 'prospect' | 'employee' | 'candidate' | 'supplier' | 'partner',
  count: number
): Lead[] => {
  // Company domains based on lead type
  const domains: Record<string, string> = {
    client: 'empresa.com.br',
    prospect: 'prospectiva.com.br',
    employee: 'nossotime.com.br',
    candidate: 'perfis.com.br',
    supplier: 'fornecedores.com.br',
    partner: 'parceiros.com.br'
  };

  // Company name prefixes based on lead type
  const companyPrefixes: Record<string, string[]> = {
    client: ['Clientes', 'Compradores', 'Usuários', 'Assinantes'],
    prospect: ['Futuros', 'Potencial', 'Interesse', 'Oportunidade'],
    employee: ['Equipe', 'Colaboradores', 'Funcionários', 'Time'],
    candidate: ['Talentos', 'CV', 'Perfil', 'Vagas'],
    supplier: ['Fornece', 'Suprimentos', 'Parceiros', 'Distribuição'],
    partner: ['Aliança', 'Parceria', 'Colaboração', 'Representante']
  };

  // First names pool
  const firstNames = [
    'Miguel', 'Sofia', 'Davi', 'Alice', 'Arthur', 'Julia', 'Pedro', 'Isabella',
    'Gabriel', 'Manuela', 'Bernardo', 'Laura', 'Lucas', 'Luiza', 'Matheus',
    'Valentina', 'Rafael', 'Giovanna', 'Heitor', 'Maria', 'Enzo', 'Helena',
    'Guilherme', 'Beatriz', 'Nicolas', 'Lara', 'Lorenzo', 'Mariana', 'Gustavo', 'Nicole'
  ];

  // Last names pool
  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
    'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
    'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'
  ];

  // Status distribution (70% active, 30% inactive)
  const getStatus = (index: number): 'active' | 'inactive' => {
    return index % 10 < 7 ? 'active' : 'inactive';
  };

  // Temperature distribution
  const getTemperature = (index: number): 'cold' | 'warm' | 'hot' => {
    const mod = index % 3;
    if (mod === 0) return 'hot';
    if (mod === 1) return 'warm';
    return 'cold';
  };

  const leads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const personType = i % 3 === 0 ? 'pj' : 'pf';
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = getStatus(i);
    const temperature = getTemperature(i);
    const daysOffset = Math.floor(Math.random() * 90) + 1;  // 1 to 90 days ago
    const createdDate = daysAgo(daysOffset);
    const lastContactDate = status === 'active' ? daysAgo(Math.floor(Math.random() * daysOffset)) : undefined;
    const callCount = Math.floor(Math.random() * 5);  // 0 to 4 calls
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[type]}`;
    const phone = generatePhone();
    
    // Company info for PJ
    let companyName = '';
    let razaoSocial = '';
    
    if (personType === 'pj') {
      const prefix = companyPrefixes[type][Math.floor(Math.random() * companyPrefixes[type].length)];
      const suffix = Math.floor(Math.random() * 1000) + 1;
      companyName = `${prefix} ${suffix}`;
      razaoSocial = `${companyName} Ltda`;
    }

    // Generate calls if any
    const calls = [];
    if (callCount > 0) {
      for (let j = 0; j < callCount; j++) {
        const callDaysAgo = Math.floor(Math.random() * daysOffset);
        const callStatus = Math.random() > 0.3 ? 'success' : 'failed';
        const minutes = Math.floor(Math.random() * 10) + 1;
        const seconds = Math.floor(Math.random() * 60);
        
        calls.push({
          id: uuidv4(),
          date: daysAgo(callDaysAgo),
          duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
          status: callStatus,
          fileName: `${firstName.toLowerCase()}_${type}_${j + 1}.${Math.random() > 0.3 ? 'mp3' : 'mp4'}`
        });
      }
    }

    // CRM info
    const funnels = {
      client: 'Retenção',
      prospect: 'Vendas',
      employee: 'RH',
      candidate: 'Recrutamento',
      supplier: 'Compras',
      partner: 'Parceria'
    };
    
    const stages = {
      client: ['Cliente Ativo', 'Expansão', 'Renovação', 'Suporte'],
      prospect: ['Lead', 'Qualificação', 'Demonstração', 'Proposta', 'Negociação', 'Fechamento'],
      employee: ['Contratado', 'Em treinamento', 'Efetivado', 'Desligamento'],
      candidate: ['Triagem', 'Entrevista', 'Testes', 'Contratação'],
      supplier: ['Avaliação', 'Negociação', 'Contrato', 'Ativo'],
      partner: ['Prospecção', 'Negociação', 'Contrato', 'Ativo']
    };

    const funnel = funnels[type];
    const stage = stages[type][Math.floor(Math.random() * stages[type].length)];

    const lead: Lead = {
      id: uuidv4(),
      firstName,
      lastName,
      status,
      temperature,
      personType,
      contactType: Math.random() > 0.5 ? 'phone' : 'email',
      contactValue: Math.random() > 0.5 ? phone : email,
      email,
      phone,
      createdAt: createdDate,
      lastContactDate,
      callCount,
      calls,
      source: ['Site', 'Google', 'LinkedIn', 'Indicação', 'Evento', 'Email Marketing'][Math.floor(Math.random() * 6)],
      crmInfo: {
        funnel,
        stage
      },
      leadType: type
    };

    // Add company info for PJ
    if (personType === 'pj') {
      lead.company = companyName;
      lead.razaoSocial = razaoSocial;
      lead.cnpj = `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}/0001-${Math.floor(Math.random() * 90) + 10}`;
    } else {
      lead.cpf = `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`;
    }

    leads.push(lead);
  }

  return leads;
};

// Generate 15 leads for each type
const clientLeads = generateLeadsByType('client', 15);
const prospectLeads = generateLeadsByType('prospect', 15);
const employeeLeads = generateLeadsByType('employee', 15);
const candidateLeads = generateLeadsByType('candidate', 15);
const supplierLeads = generateLeadsByType('supplier', 15);
const partnerLeads = generateLeadsByType('partner', 15);

// Export all leads
export const leadsOrganizacao1: Lead[] = [
  ...clientLeads,
  ...prospectLeads,
  ...employeeLeads,
  ...candidateLeads,
  ...supplierLeads,
  ...partnerLeads
];
