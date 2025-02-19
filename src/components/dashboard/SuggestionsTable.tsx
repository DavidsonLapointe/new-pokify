
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SuggestionTableProps } from "./types/suggestions";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Check, X, AlertCircle } from "lucide-react";

export const SuggestionsTable = ({ suggestions, onUpdateStatus }: SuggestionTableProps) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<string | null>(null);

  const handleStatusUpdate = (id: string, newStatus: "pending" | "implemented" | "rejected") => {
    onUpdateStatus?.(id, newStatus);
    toast.success("Status atualizado com sucesso!");
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const renderStatusActions = (suggestion: Suggestion) => {
    const baseButtonClass = "h-8 px-3 text-xs";
    const isActive = (status: string) => suggestion.status === status;

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isActive("implemented") ? "default" : "outline"}
          className={`${baseButtonClass} ${isActive("implemented") ? "bg-green-600" : "hover:bg-green-100"}`}
          onClick={() => handleStatusUpdate(suggestion.id, "implemented")}
        >
          <Check className="h-4 w-4 mr-1" />
          Implementada
        </Button>
        <Button
          size="sm"
          variant={isActive("pending") ? "default" : "outline"}
          className={`${baseButtonClass} ${isActive("pending") ? "bg-yellow-600" : "hover:bg-yellow-100"}`}
          onClick={() => handleStatusUpdate(suggestion.id, "pending")}
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          Pendente
        </Button>
        <Button
          size="sm"
          variant={isActive("rejected") ? "default" : "outline"}
          className={`${baseButtonClass} ${isActive("rejected") ? "bg-red-600" : "hover:bg-red-100"}`}
          onClick={() => handleStatusUpdate(suggestion.id, "rejected")}
        >
          <X className="h-4 w-4 mr-1" />
          Rejeitada
        </Button>
      </div>
    );
  };

  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      implemented: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }[status];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
        {status === "pending" && "Pendente"}
        {status === "implemented" && "Implementada"}
        {status === "rejected" && "Rejeitada"}
      </span>
    );
  };

  return (
    <>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Sub-tipo</TableHead>
              <TableHead className="max-w-[500px]">Sugestão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <TableRow key={suggestion.id}>
                  <TableCell>{new Date(suggestion.date).toLocaleDateString()}</TableCell>
                  <TableCell>{suggestion.leadName}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {suggestion.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {suggestion.subType}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[500px]">
                    <button 
                      onClick={() => {
                        setSelectedSuggestion(suggestion.suggestion);
                        setOpenDialog(true);
                      }}
                      className="text-left hover:underline focus:outline-none"
                    >
                      {truncateText(suggestion.suggestion)}
                    </button>
                  </TableCell>
                  <TableCell>{renderStatusBadge(suggestion.status)}</TableCell>
                  <TableCell>{renderStatusActions(suggestion)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma sugestão encontrada para o período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Texto completo da sugestão</AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-foreground">
              {selectedSuggestion}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
