
import { Lead } from '@/types/leads';
import { randomNumber, randomDate } from './utils';

// Gera leads mockados
export const generateMockLeads = (count: number): Lead[] => {
  const leads: Lead[] = [];
  
  const sources = ['Facebook', 'Google', 'Instagram', 'Site', 'Indicação', 'LinkedIn', 'Email Marketing'];
  const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const industries = ['Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Varejo', 'Manufatura', 'Serviços'];
  
  for (let i = 0; i < count; i++) {
    const isPF = Math.random() > 0.4;
    const createdDate = randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
    
    leads.push({
      id: `lead-${Math.random().toString(36).substr(2, 9)}`,
      type: isPF ? 'PF' : 'PJ',
      name: isPF 
        ? `${['João', 'Maria', 'Pedro', 'Ana', 'Carlos'][randomNumber(0, 4)]} ${['Silva', 'Oliveira', 'Santos', 'Souza', 'Ferreira'][randomNumber(0, 4)]}`
        : `${['Tech', 'Digital', 'Global', 'Smart', 'Next'][randomNumber(0, 4)]} ${['Solutions', 'Systems', 'Consulting', 'Services', 'Technologies'][randomNumber(0, 4)]}`,
      email: `contato${randomNumber(1, 1000)}@${isPF ? 'gmail.com' : 'empresa.com.br'}`,
      phone: `(${randomNumber(11, 99)}) ${randomNumber(91000, 99999)}-${randomNumber(1000, 9999)}`,
      source: sources[randomNumber(0, sources.length - 1)],
      status: statuses[randomNumber(0, statuses.length - 1)],
      temperature: ['hot', 'warm', 'cold'][randomNumber(0, 2)],
      value: Math.random() > 0.3 ? randomNumber(1000, 100000) : null,
      industry: industries[randomNumber(0, industries.length - 1)],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + randomNumber(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
      lastContactAt: Math.random() > 0.2 ? new Date(createdDate.getTime() + randomNumber(1, 15) * 24 * 60 * 60 * 1000).toISOString() : null,
      assignedTo: Math.random() > 0.3 ? `Vendedor ${randomNumber(1, 10)}` : null,
      notes: Math.random() > 0.5 ? `Notas sobre o lead ${i + 1}. ${Math.random() > 0.5 ? 'Cliente interessado.' : 'Aguardando retorno.'}` : null,
      // Dados específicos para pessoa física ou jurídica
      ...(isPF ? {
        cpf: `${randomNumber(100, 999)}.${randomNumber(100, 999)}.${randomNumber(100, 999)}-${randomNumber(10, 99)}`,
        birthDate: randomDate(new Date(1960, 0, 1), new Date(2000, 11, 31)).toISOString().split('T')[0],
      } : {
        cnpj: `${randomNumber(10, 99)}.${randomNumber(100, 999)}.${randomNumber(100, 999)}/0001-${randomNumber(10, 99)}`,
        companySize: ['1-10', '11-50', '51-200', '201-500', '501+'][randomNumber(0, 4)],
      })
    });
  }
  
  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Exporta leads mockados
export const mockLeads = generateMockLeads(100);
