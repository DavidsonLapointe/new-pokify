// Mock client para substituir o Supabase
// Este arquivo fornece uma implementação mockada das funcionalidades do Supabase

// Interface básica para simular a resposta do Supabase
interface MockResponse<T> {
  data: T | null;
  error: Error | null;
}

// Dados mockados para simular tabelas
const mockData: Record<string, any[]> = {
  'profiles': [
    {
      id: 'mock-id-1',
      name: 'Admin Leadly',
      email: 'admin@leadly.com',
      tel: '11999999999',
      function: 'second_brain_master',
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      last_login: '2023-03-25T10:00:00Z',
      organization_id: null,
      permissions: {
        dashboard: true,
        organizations: true,
        users: true,
        modules: true,
        plans: true,
        "credit-packages": true,
        financial: true,
        integrations: true,
        prompt: true,
        settings: true,
        profile: true
      }
    },
    {
      id: 'mock-id-2',
      name: 'Funcionário Leadly',
      email: 'employee@leadly.com',
      tel: '11888888888',
      function: 'second_brain_employee',
      status: 'active',
      created_at: '2023-02-01T00:00:00Z',
      last_login: '2023-03-20T14:30:00Z',
      organization_id: null,
      permissions: {
        dashboard: true,
        organizations: false,
        users: false,
        modules: false,
        plans: false,
        "credit-packages": false,
        financial: false,
        integrations: false,
        prompt: false,
        settings: false,
        profile: true
      }
    }
  ]
};

// Classe para simular o cliente do Supabase
class MockSupabaseClient {
  // Método para simular funções edge
  functions = {
    invoke: async (functionName: string, options?: { body?: any }): Promise<MockResponse<any>> => {
      console.log(`[Mock] Invocando função edge: ${functionName}`, options?.body);
      
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Retorna uma resposta de sucesso genérica
      return {
        data: { success: true },
        error: null
      };
    }
  };

  // Método para simular consultas ao banco de dados
  from(table: string) {
    console.log(`[Mock] Acessando tabela: ${table}`);
    
    const queryBuilder = {
      select: (columns: string = '*') => {
        console.log(`[Mock] Selecionando colunas: ${columns}`);
        
        // Retorna um objeto com uma Promise e then para que possa ser chamado como Promise ou com then diretamente
        const result = {
          data: mockData[table] || [],
          error: null
        };
        
        const selectionResult = {
          ...queryBuilder,
          eq: (column: string, value: any) => {
            console.log(`[Mock] Filtrando ${column} = ${value}`);
            result.data = result.data.filter(item => item[column] === value);
            return selectionResult;
          },
          neq: (column: string, value: any) => {
            console.log(`[Mock] Filtrando ${column} != ${value}`);
            result.data = result.data.filter(item => item[column] !== value);
            return selectionResult;
          },
          gt: (column: string, value: any) => {
            console.log(`[Mock] Filtrando ${column} > ${value}`);
            result.data = result.data.filter(item => item[column] > value);
            return selectionResult;
          },
          lt: (column: string, value: any) => {
            console.log(`[Mock] Filtrando ${column} < ${value}`);
            result.data = result.data.filter(item => item[column] < value);
            return selectionResult;
          },
          gte: (column: string, value: any) => {
            console.log(`[Mock] Filtrando ${column} >= ${value}`);
            result.data = result.data.filter(item => item[column] >= value);
            return selectionResult;
          },
          lte: (column: string, value: any) => {
            console.log(`[Mock] Filtrando ${column} <= ${value}`);
            result.data = result.data.filter(item => item[column] <= value);
            return selectionResult;
          },
          limit: (count: number) => {
            console.log(`[Mock] Limitando a ${count} resultados`);
            result.data = result.data.slice(0, count);
            return selectionResult;
          },
          order: (column: string, options?: { ascending?: boolean }) => {
            console.log(`[Mock] Ordenando por ${column} (asc: ${options?.ascending})`);
            const asc = options?.ascending ?? true;
            result.data = [...result.data].sort((a, b) => {
              if (asc) {
                return a[column] > b[column] ? 1 : -1;
              } else {
                return a[column] < b[column] ? 1 : -1;
              }
            });
            return selectionResult;
          },
          single: () => {
            console.log(`[Mock] Retornando resultado único`);
            return Promise.resolve({
              data: result.data.length > 0 ? result.data[0] : null,
              error: null
            });
          },
          // Implementa then para compatibilidade com Promise
          then: (callback: (result: MockResponse<any>) => void) => {
            callback(result);
            return Promise.resolve(result);
          },
        };
        
        return selectionResult;
      },
      insert: (data: any) => {
        console.log(`[Mock] Inserindo dados:`, data);
        
        // Normalize data to always be an array
        const dataArray = Array.isArray(data) ? data : [data];
        const newItems = dataArray.map(item => ({ 
          ...item, 
          id: 'mock-id-' + Date.now(),
          created_at: new Date().toISOString()
        }));
        
        // Adiciona os novos itens aos dados mockados
        if (!mockData[table]) {
          mockData[table] = [];
        }
        mockData[table].push(...newItems);
        
        const result = {
          data: newItems.length === 1 ? newItems[0] : newItems,
          error: null
        };
        
        const insertResult = {
          select: () => {
            return {
              single: () => {
                return Promise.resolve({
                  data: newItems.length === 1 ? newItems[0] : null,
                  error: null
                });
              },
              then: (callback: (result: MockResponse<any>) => void) => {
                callback({
                  data: newItems.length === 1 ? newItems[0] : newItems,
                  error: null
                });
                return Promise.resolve({
                  data: newItems.length === 1 ? newItems[0] : newItems,
                  error: null
                });
              }
            };
          },
          then: (callback: (result: MockResponse<any>) => void) => {
            callback(result);
            return Promise.resolve(result);
          }
        };
        
        return insertResult;
      },
      update: (data: any) => {
        console.log(`[Mock] Atualizando dados:`, data);
        return {
          eq: (column: string, value: any) => {
            console.log(`[Mock] Filtrando update ${column} = ${value}`);
            
            // Atualiza o item nos dados mockados
            if (mockData[table]) {
              const index = mockData[table].findIndex(item => item[column] === value);
              if (index !== -1) {
                mockData[table][index] = {
                  ...mockData[table][index],
                  ...data,
                  updated_at: new Date().toISOString()
                };
              }
            }
            
            return {
              then: (callback: (result: MockResponse<any>) => void) => {
                callback({
                  data: data,
                  error: null
                });
              }
            };
          },
          then: (callback: (result: MockResponse<any>) => void) => {
            callback({
              data: data,
              error: null
            });
          }
        };
      },
      delete: () => {
        console.log(`[Mock] Excluindo dados`);
        return {
          eq: (column: string, value: any) => {
            console.log(`[Mock] Filtrando delete ${column} = ${value}`);
            
            // Remove o item dos dados mockados
            if (mockData[table]) {
              const index = mockData[table].findIndex(item => item[column] === value);
              if (index !== -1) {
                mockData[table].splice(index, 1);
              }
            }
            
            return {
              then: (callback: (result: MockResponse<any>) => void) => {
                callback({
                  data: null,
                  error: null
                });
              }
            };
          }
        };
      },
      single: () => {
        console.log(`[Mock] Retornando resultado único`);
        return Promise.resolve({
          data: mockData[table] ? mockData[table][0] : null,
          error: null
        });
      },
      then: (callback: (result: MockResponse<any>) => void) => {
        callback({
          data: mockData[table] || [],
          error: null
        });
      }
    };
    
    return queryBuilder;
  }

  // Método para simular autenticação
  auth = {
    getSession: async () => {
      return {
        data: {
          session: {
            user: {
              id: 'mock-user-id',
              email: 'mock@example.com',
              user_metadata: {
                name: 'Usuário Mockado'
              }
            }
          }
        },
        error: null
      };
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      console.log(`[Mock] Login com email: ${credentials.email}`);
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email: credentials.email,
            user_metadata: {
              name: 'Usuário Mockado'
            }
          },
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      };
    },
    signOut: async () => {
      console.log('[Mock] Logout realizado');
      return { error: null };
    }
  };
}

// Exporta uma instância do cliente mockado
export const supabase = new MockSupabaseClient();
