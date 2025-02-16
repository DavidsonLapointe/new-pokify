
import { Button } from "@/components/ui/button";
import { Call } from "@/types/calls";
import { FileText, PlayCircle, Video } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CallMediaButtonsProps {
  call: Call;
  onMediaPlay: (call: Call) => void;
  onViewAnalysis: (call: Call) => void;
}

export const CallMediaButtons = ({
  call,
  onMediaPlay,
  onViewAnalysis,
}: CallMediaButtonsProps) => {
  const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMediaPlay(call)}
            className="hover:text-primary h-7 w-7"
          >
            <MediaIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{call.mediaType === "video" ? "Assistir o vídeo desta chamada" : "Ouvir o áudio desta chamada"}</p>
        </TooltipContent>
      </Tooltip>
      
      {call.status === "success" && call.analysis && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewAnalysis(call)}
              className="h-7 w-7"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Transcrição e resumo desta chamada</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};
