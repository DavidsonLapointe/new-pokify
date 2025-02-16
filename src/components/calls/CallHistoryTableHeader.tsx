
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export const CallHistoryTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-xs sticky top-0 bg-background">Data e Hora</TableHead>
        <TableHead className="text-xs sticky top-0 bg-background">Vendedor</TableHead>
        <TableHead className="text-xs sticky top-0 bg-background">Duração</TableHead>
        <TableHead className="text-xs sticky top-0 bg-background">
          <div className="flex items-center gap-1">
            Status da Chamada
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto hover:bg-transparent"
                  type="button"
                >
                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Processada</Badge>
                    <span className="text-xs">Chamadas que foram atendidas e processadas com sucesso pelo sistema</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pendente</Badge>
                    <span className="text-xs">Chamadas que ainda estão aguardando processamento ou intervenção manual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-red-100 text-red-700">Erro</Badge>
                    <span className="text-xs">Chamadas que falharam durante o processamento e precisam ser verificadas</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableHead>
        <TableHead className="text-xs sticky top-0 bg-background">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
