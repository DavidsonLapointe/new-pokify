
import { useState } from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ButtonGroup } from "@/components/ui/button";
import { ArrowUpZA, ArrowDownAZ } from "lucide-react";
import { Call, StatusMap } from "@/types/calls";

interface CallsTableProps {
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
  sortDirection: 'asc' | 'desc' | null;
  onSort: () => void;
}

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
  sortDirection,
  onSort,
}: CallsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onSort}>
              Nome do Lead
              <button 
                className="ml-1 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onSort();
                }}
              >
                {sortDirection === 'asc' ? (
                  <ArrowDownAZ className="h-4 w-4 text-gray-500" />
                ) : sortDirection === 'desc' ? (
                  <ArrowUpZA className="h-4 w-4 text-gray-500" />
                ) : (
                  <ArrowDownAZ className="h-4 w-4 text-gray-300" />
                )}
              </button>
            </div>
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id}>
            <TableCell className="font-medium">
              {call.leadInfo.firstName} {call.leadInfo.lastName}
            </TableCell>
            <TableCell>{call.leadInfo.email}</TableCell>
            <TableCell>{call.leadInfo.phone}</TableCell>
            <TableCell>{formatDate(call.date)}</TableCell>
            <TableCell>{call.duration}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${statusMap[call.status].color}`}>
                {statusMap[call.status].label}
              </span>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <button
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                onClick={() => onPlayAudio(call.audioUrl)}
              >
                Ouvir
              </button>
              {call.analysis && (
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  onClick={() => onViewAnalysis(call)}
                >
                  Ver Análise
                </button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
