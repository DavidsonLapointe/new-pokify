
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
        <TableHead className="text-xs sticky top-0 bg-background">Duração do arquivo</TableHead>
        <TableHead className="text-xs sticky top-0 bg-background">
          <div className="flex items-center gap-1">
            Status do Upload
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
              <TooltipContent side="bottom" align="end" className="p-3 max-w-[400px] -translate-x-[150px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 shrink-0">Processado</Badge>
                    <span className="text-xs">Uploads que foram processados com sucesso pelo sistema</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-red-100 text-red-700 shrink-0">Erro</Badge>
                    <span className="text-xs">Uploads que falharam durante o processamento e precisam ser reprocessados</span>
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
