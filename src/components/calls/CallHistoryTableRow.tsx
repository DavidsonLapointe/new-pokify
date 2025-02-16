
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Call, StatusMap } from "@/types/calls";
import { FileText, PlayCircle, Video } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface CallHistoryTableRowProps {
  call: Call;
  status: StatusMap[keyof StatusMap];
  onMediaPlay: (call: Call) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

export const CallHistoryTableRow = ({
  call,
  status,
  onMediaPlay,
  onViewAnalysis,
  formatDate,
}: CallHistoryTableRowProps) => {
  const { toast } = useToast();
  const [showReprocessDialog, setShowReprocessDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  
  const StatusIcon = status.icon;
  const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

  const handleReprocess = () => {
    setShowReprocessDialog(true);
  };

  const handleProcess = () => {
    setShowProcessDialog(true);
  };

  const confirmReprocess = () => {
    setShowReprocessDialog(false);
    toast({
      title: "Reprocessando chamada",
      description: "Aguarde enquanto a chamada é reprocessada...",
      duration: 3000,
    });
    console.log("Reprocessando chamada:", call.id);
  };

  const confirmProcess = () => {
    setShowProcessDialog(false);
    toast({
      title: "Processando chamada",
      description: "Aguarde enquanto a chamada é processada...",
      duration: 3000,
    });
    console.log("Processando chamada:", call.id);
  };

  return (
    <>
      <TableRow className="text-xs">
        <TableCell className="py-2">{formatDate(call.date)}</TableCell>
        <TableCell className="py-2">{call.seller}</TableCell>
        <TableCell className="py-2">{call.duration}</TableCell>
        <TableCell className="py-2">
          <Badge
            variant="secondary"
            className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${status.color}`}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMediaPlay(call)}
              className="hover:text-primary h-7 w-7"
            >
              <MediaIcon className="h-4 w-4" />
            </Button>
            
            {call.status === "success" && call.analysis && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewAnalysis(call)}
                className="h-7 w-7"
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}

            {call.status === "failed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReprocess}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors text-[11px] h-6 px-2"
              >
                Reprocessar
              </Button>
            )}

            {call.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleProcess}
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-colors text-[11px] h-6 px-2"
              >
                Processar
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showReprocessDialog} onOpenChange={setShowReprocessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reprocessar chamada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reprocessar esta chamada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReprocess}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reprocessar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Processar chamada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja processar esta chamada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmProcess}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Processar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
