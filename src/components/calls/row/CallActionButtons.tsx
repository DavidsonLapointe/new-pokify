
import { Button } from "@/components/ui/button";
import { Call } from "@/types/calls";

interface CallActionButtonsProps {
  call: Call;
  isProcessing: boolean;
  onProcess: () => void;
  onReprocess: () => void;
}

export const CallActionButtons = ({
  call,
  isProcessing,
  onProcess,
  onReprocess,
}: CallActionButtonsProps) => {
  if (call.status === "failed") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onReprocess}
        disabled={isProcessing}
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors text-[11px] h-6 px-2"
      >
        {isProcessing ? "Reprocessando..." : "Reprocessar"}
      </Button>
    );
  }

  if (call.status === "pending") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onProcess}
        disabled={isProcessing}
        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-colors text-[11px] h-6 px-2"
      >
        {isProcessing ? "Processando..." : "Processar"}
      </Button>
    );
  }

  return null;
};
