// Mock client para substituir o Supabase
// Este arquivo fornece uma implementação mockada das funcionalidades do Supabase

// Interface básica para simular a resposta do Supabase
interface MockResponse<T> {
  data: T | null;
  error: Error | null;
}

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
    
    return {
      select: (columns: string) => {
        console.log(`[Mock] Selecionando colunas: ${columns}`);
        return this;
      },
      eq: (column: string, value: any) => {
        console.log(`[Mock] Filtrando ${column} = ${value}`);
        return this;
      },
      neq: (column: string, value: any) => {
        console.log(`[Mock] Filtrando ${column} != ${value}`);
        return this;
      },
      gt: (column: string, value: any) => {
        console.log(`[Mock] Filtrando ${column} > ${value}`);
        return this;
      },
      lt: (column: string, value: any) => {
        console.log(`[Mock] Filtrando ${column} < ${value}`);
        return this;
      },
      gte: (column: string, value: any) => {
        console.log(`[Mock] Filtrando ${column} >= ${value}`);
        return this;
      },
      lte: (column: string, value: any) => {
        console.log(`[Mock] Filtrando ${column} <= ${value}`);
        return this;
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        console.log(`[Mock] Ordenando por ${column} (asc: ${options?.ascending})`);
        return this;
      },
      limit: (count: number) => {
        console.log(`[Mock] Limitando a ${count} resultados`);
        return this;
      },
      single: () => {
        console.log(`[Mock] Retornando resultado único`);
        return Promise.resolve({
          data: null,
          error: null
        });
      },
      then: (callback: (result: MockResponse<any>) => void) => {
        callback({
          data: null,
          error: null
        });
      }
    };
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
