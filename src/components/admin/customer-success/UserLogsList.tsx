
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserLog {
  id: string;
  user_id: string;
  action: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
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
      fetchLogs();
    }
  }, [organizationId, page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Simulando busca de logs - em um ambiente real você teria uma tabela de logs
      // Esta é uma simulação baseada nos acessos dos usuários
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, email, last_access')
        .eq('organization_id', organizationId)
        .order('last_access', { ascending: false })
        .range((page - 1) * logsPerPage, page * logsPerPage - 1);
      
      if (error) throw error;
      
      // Criar logs fictícios baseados nos últimos acessos
      const mockLogs: UserLog[] = profiles
        .filter(profile => profile.last_access)
        .map((profile, index) => ({
          id: `log-${profile.id}-${index}`,
          user_id: profile.id,
          user_name: profile.name,
          user_email: profile.email,
          action: 'Acesso ao sistema',
          created_at: profile.last_access
        }));
      
      setLogs(prevLogs => page === 1 ? mockLogs : [...prevLogs, ...mockLogs]);
      setHasMore(mockLogs.length === logsPerPage);
      
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
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
