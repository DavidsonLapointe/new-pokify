
import React from "react";
import { format } from "date-fns";
import { MoreVertical, FileText } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModuleSetup, SetupStatus } from "@/components/organization/modules/types";
import { getStatusColor, getStatusText } from "./utils/statusUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ModuleSetupsTableProps {
  setups: ModuleSetup[];
  onStatusChange: (id: string, newStatus: SetupStatus) => void;
  onOpenNotes: (setupId: string) => void;
}

export const ModuleSetupsTable: React.FC<ModuleSetupsTableProps> = ({
  setups,
  onStatusChange,
  onOpenNotes,
}) => {
  // Function to get activity count badge style
  const getActivityBadgeStyle = (completed: number, total: number) => {
    if (completed === 0) return "bg-purple-200 text-purple-700";
    if (completed === total) return "bg-green-200 text-green-700";
    return "bg-yellow-200 text-yellow-700";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-left">Empresa</TableHead>
            <TableHead className="font-medium">Módulo</TableHead>
            <TableHead className="font-medium text-left">Nome do Implantador</TableHead>
            <TableHead className="font-medium text-left whitespace-nowrap min-w-[140px]">Telefone</TableHead>
            <TableHead className="font-medium text-center">Data de Contratação</TableHead>
            <TableHead className="font-medium text-center">Status</TableHead>
            <TableHead className="font-medium text-center">Atividades</TableHead>
            <TableHead className="font-medium text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setups.length > 0 ? (
            setups.map((setup) => {
              // Calculate completed activities based on notes for demonstration
              const totalActivities = 2;
              const completedActivities = setup.notes && setup.notes.length > 0 ? Math.min(setup.notes.length, 2) : 0;
              
              return (
                <TableRow key={setup.id}>
                  <TableCell className="text-left">{setup.organizationName || setup.organizationId}</TableCell>
                  <TableCell>{setup.moduleName || setup.moduleId}</TableCell>
                  <TableCell className="text-left">{setup.contactName}</TableCell>
                  <TableCell className="text-left whitespace-nowrap">
                    {setup.contactPhone}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(setup.contractedAt, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(setup.status)}>
                      {getStatusText(setup.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={getActivityBadgeStyle(completedActivities, totalActivities)}
                    >
                      {completedActivities}/{totalActivities}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onOpenNotes(setup.id)}
                          className="h-8 w-8 p-0"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Anotações</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreVertical className="h-4 w-4 text-primary" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onStatusChange(setup.id, "pending")}
                          disabled={setup.status === "pending"}
                        >
                          Marcar como Pendente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(setup.id, "in_progress")}
                          disabled={setup.status === "in_progress"}
                        >
                          Marcar como Em Andamento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(setup.id, "completed")}
                          disabled={setup.status === "completed"}
                        >
                          Marcar como Concluído
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhuma implantação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
