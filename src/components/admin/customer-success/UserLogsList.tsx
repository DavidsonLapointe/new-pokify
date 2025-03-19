
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { randomDate } from "@/mocks/utils";

interface UserLog {
  id: string;
  user_id: string;
  action: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  details?: string;
}

interface UserLogsListProps {
  organizationId: string;
}

export const UserLogsList = ({ organizationId }: UserLogsListProps) => {
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const logsPerPage = 10;

  useEffect(() => {
    if (organizationId) {
      setLogs([]);
      setPage(1);
      fetchLogs();
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && page > 1) {
      fetchLogs();
    }
  }, [page]);

  const generateMockLogs = (profiles: any[], page: number) => {
    const actionTypes = [
      'Acesso ao sistema',
      'Alteração de perfil',
      'Upload de gravação',
      'Análise de conversa',
      'Exportação de relatório',
      'Criação de lead',
      'Visualização de dashboard',
      'Integração com CRM',
      'Configuração de módulo',
      'Atualização de dados cadastrais'
    ];
    
    const detailsTemplates = {
      'Acesso ao sistema': ['Login realizado com sucesso', 'Acesso via aplicativo móvel'],
      'Alteração de perfil': ['Alteração de senha', 'Atualização de dados pessoais', 'Alteração de permissões'],
      'Upload de gravação': ['Upload de áudio', 'Upload de vídeo', 'Upload via integração'],
      'Análise de conversa': ['Análise automática', 'Análise manual', 'Reanálise solicitada'],
      'Exportação de relatório': ['Relatório mensal', 'Relatório detalhado', 'Relatório de performance'],
      'Criação de lead': ['Lead criado manualmente', 'Lead importado do CRM', 'Lead vinculado à conversa'],
      'Visualização de dashboard': ['Dashboard de vendas', 'Dashboard analítico', 'Dashboard de performance'],
      'Integração com CRM': ['Conexão com API', 'Sincronização de dados', 'Configuração de webhook'],
      'Configuração de módulo': ['Ativação de módulo', 'Personalização de configurações', 'Desativação de funcionalidade'],
      'Atualização de dados cadastrais': ['Atualização de CNPJ', 'Atualização de endereço', 'Atualização de contato']
    };

    // Gera data aleatória dos últimos 30 dias (mais recente para logs na primeira página)
    const maxDaysAgo = page === 1 ? 7 : 30;
    
    // Gera mais logs para a primeira página para garantir que tenha conteúdo
    const mockLogsCount = Math.min(profiles.length * 3, logsPerPage);
    
    const mockLogs: UserLog[] = [];
    
    for (let i = 0; i < mockLogsCount; i++) {
      const profile = profiles[i % profiles.length];
      const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const detailOptions = detailsTemplates[action as keyof typeof detailsTemplates] || [''];
      const detail = detailOptions[Math.floor(Math.random() * detailOptions.length)];
      
      // Gera data aleatória dos últimos dias, mais recente para primeira página
      const daysAgo = page === 1 ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      // Adiciona hora aleatória
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      
      mockLogs.push({
        id: `log-${profile.id}-${i}-${Date.now()}`,
        user_id: profile.id,
        user_name: profile.name,
        user_email: profile.email,
        action: action,
        details: detail,
        created_at: date.toISOString()
      });
    }
    
    // Ordena por data mais recente primeiro
    return mockLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Busca os perfis para gerar logs
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, email, last_access')
        .eq('organization_id', organizationId)
        .order('last_access', { ascending: false });
      
      if (error) throw error;
      
      if (profiles && profiles.length > 0) {
        const mockLogs = generateMockLogs(profiles, page);
        
        setLogs(prevLogs => page === 1 ? mockLogs : [...prevLogs, ...mockLogs]);
        setHasMore(mockLogs.length === logsPerPage);
      } else {
        // Se não encontrar perfis, cria pelo menos alguns logs fictícios
        const fakeLogs = Array.from({ length: 5 }, (_, i) => ({
          id: `fake-log-${i}`,
          user_id: `user-${i}`,
          user_name: `Usuário ${i + 1}`,
          user_email: `usuario${i + 1}@exemplo.com.br`,
          action: 'Acesso ao sistema',
          details: 'Login realizado com sucesso',
          created_at: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString()
        }));
        
        setLogs(prevLogs => page === 1 ? fakeLogs : [...prevLogs, ...fakeLogs]);
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
      toast.error("Erro ao carregar logs de usuários");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreLogs = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.user_name}</div>
                      <div className="text-xs text-gray-500">{log.user_email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {loading ? "Carregando logs..." : "Nenhum log encontrado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {hasMore && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={loadMoreLogs}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
