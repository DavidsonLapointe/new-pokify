
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Call, StatusMap } from "@/types/calls";
import { FileText, PlayCircle, Video } from "lucide-react";

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
  const StatusIcon = status.icon;
  const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

  const handleReprocess = () => {
    console.log("Reprocessando chamada:", call.id);
  };

  const handleProcess = () => {
    console.log("Processando chamada:", call.id);
  };

  return (
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
              className="hover:text-primary h-7 w-7"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}

          {call.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReprocess}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              Reprocessar
            </Button>
          )}

          {call.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleProcess}
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-colors"
            >
              Processar
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
