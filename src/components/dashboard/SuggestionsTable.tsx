
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
import { SuggestionTableProps, Suggestion } from "./types/suggestions";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Check, X, AlertCircle, PencilIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const SuggestionsTable = ({ suggestions, onUpdateStatus }: SuggestionTableProps) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<string | null>(null);
  const [editStatusDialog, setEditStatusDialog] = React.useState(false);
  const [selectedSuggestionForEdit, setSelectedSuggestionForEdit] = React.useState<Suggestion | null>(null);

  const handleStatusUpdate = (newStatus: "pending" | "implemented" | "rejected") => {
    if (selectedSuggestionForEdit) {
      onUpdateStatus?.(selectedSuggestionForEdit.id, newStatus);
      toast.success("Status atualizado com sucesso!");
      setEditStatusDialog(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSuggestionForEdit(suggestion);
                        setEditStatusDialog(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4 text-[#9b87f5] hover:text-[#7E69AB]" />
                    </Button>
                  </TableCell>
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
            <div className="flex justify-between items-start">
              <AlertDialogTitle>Texto completo da sugestão</AlertDialogTitle>
              <AlertDialogCancel className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </AlertDialogCancel>
            </div>
            <AlertDialogDescription className="mt-4 text-foreground">
              {selectedSuggestion}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editStatusDialog} onOpenChange={setEditStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status da Sugestão</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleStatusUpdate("implemented")}
            >
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Implementada
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleStatusUpdate("pending")}
            >
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Pendente
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleStatusUpdate("rejected")}
            >
              <X className="h-4 w-4 mr-2 text-red-500" />
              Rejeitada
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStatusDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
