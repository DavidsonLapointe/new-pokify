
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Call, StatusMap } from "@/types/calls";
import { FileAudio, FileVideo, Play, ClipboardCheck } from "lucide-react";

interface CallHistoryTableRowProps {
  call: Call;
  status: StatusMap["success" | "failed"];
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
  const isProcessed = call.status === "success";
  const hasAudioOrVideo = call.audioUrl || call.videoUrl;
  const callDate = call.date ? new Date(call.date) : null;
  
  const formattedDate = callDate 
    ? `${formatDate(callDate.toISOString())} às ${callDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    : "Data não disponível";

  return (
    <TableRow>
      <TableCell className="font-medium text-xs">{formattedDate}</TableCell>
      <TableCell className="text-xs">{call.seller || "Sistema"}</TableCell>
      <TableCell className="text-xs">{call.duration || "00:00"}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <div
            className={`rounded-full w-2 h-2 ${
              isProcessed ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs">{status.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1.5">
          {hasAudioOrVideo && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-[#9b87f5] hover:text-[#7E69AB] transition-colors border-[#9b87f5]/20 hover:border-[#9b87f5]/50 hover:bg-[#9b87f5]/10"
                  onClick={() => onMediaPlay(call)}
                >
                  {call.mediaType === "video" ? (
                    <FileVideo className="h-4 w-4" />
                  ) : (
                    <FileAudio className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {call.mediaType === "video" ? "Ver vídeo" : "Ouvir áudio"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {call.mediaType === "video" ? "Ver vídeo" : "Ouvir áudio"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}

          {isProcessed && call.analysis && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-[#9b87f5] hover:text-[#7E69AB] transition-colors border-[#9b87f5]/20 hover:border-[#9b87f5]/50 hover:bg-[#9b87f5]/10"
                  onClick={() => onViewAnalysis(call)}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="sr-only">Ver análise</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver análise detalhada</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
