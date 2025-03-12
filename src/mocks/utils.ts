
// Utilitários para gerar dados mock

// Gera um número aleatório entre min e max
export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Gera uma data aleatória entre startDate e hoje
export const randomDate = (startDate: Date, endDate: Date = new Date()): Date => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
};

// Gera um array de logs com atividades aleatórias
export const generateRandomLogs = (count: number) => {
  const activities = [
    'Login no sistema',
    'Alteração de perfil',
    'Upload de conversa',
    'Análise de lead',
    'Exportação de relatório',
    'Alteração de senha',
    'Integração com CRM',
    'Alteração de configurações',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(),
    activity: activities[Math.floor(Math.random() * activities.length)]
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Gera um CNPJ aleatório formatado
export const generateRandomCNPJ = () => {
  const numbers = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10));
  return `${numbers.slice(0, 2).join('')}.${numbers.slice(2, 5).join('')}.${numbers.slice(5, 8).join('')}/0001-${numbers.slice(8, 10).join('')}`;
};
