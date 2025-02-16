
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  isVisible: boolean;
  message: string;
}

export const ProcessingOverlay = ({ isVisible, message }: ProcessingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in-0 duration-200">
      <div className="bg-white rounded-lg p-6 shadow-lg w-80 space-y-4 animate-in zoom-in-50 duration-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-center">{message}</p>
        </div>
        <Progress value={40} className="h-1.5" />
      </div>
    </div>
  );
};
