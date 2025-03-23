
import { Button } from "@/components/ui/button";
import { Call } from "@/types/calls";
import { 
  Play, 
  FileVideo,
  FileAudio
} from "lucide-react";

interface CallMediaButtonsProps {
  call: Call;
  onPlayAudio: (audioUrl: string) => void;
  onPlayVideo: (call: Call) => void;
}

export const CallMediaButtons = ({
  call,
  onPlayAudio,
  onPlayVideo,
}: CallMediaButtonsProps) => {
  if (!call.audioUrl) return null;

  const isVideo = call.mediaType === "video";

  const handlePlay = () => {
    if (isVideo) {
      onPlayVideo(call);
    } else {
      onPlayAudio(call.audioUrl);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handlePlay}
      className="w-7 h-7 text-[#9b87f5] hover:text-[#7E69AB] transition-colors border-[#9b87f5]/20 hover:border-[#9b87f5]/50 hover:bg-[#9b87f5]/10"
      title={isVideo ? "Ver vídeo" : "Ouvir áudio"}
    >
      {isVideo ? (
        <FileVideo className="h-3.5 w-3.5" />
      ) : (
        <FileAudio className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};
