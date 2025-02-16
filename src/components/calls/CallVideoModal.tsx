
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CallVideoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
}

export const CallVideoModal = ({
  isOpen,
  onOpenChange,
  videoUrl,
}: CallVideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Visualizar Vídeo</DialogTitle>
        </DialogHeader>
        <div className="mt-4 aspect-video">
          <video
            src={videoUrl}
            controls
            className="w-full h-full"
          >
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};
