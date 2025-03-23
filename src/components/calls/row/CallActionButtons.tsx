
import { Button } from "@/components/ui/button";
import { Call } from "@/types/calls";

interface CallActionButtonsProps {
  call: Call;
  isProcessing: boolean;
  onReprocess: () => void;
}

export const CallActionButtons = ({
  call,
  isProcessing,
  onReprocess,
}: CallActionButtonsProps) => {
  if (call.status === "failed") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onReprocess}
        disabled={isProcessing}
        className="text-[#9b87f5] border-[#9b87f5]/20 hover:bg-[#9b87f5]/10 hover:text-[#7E69AB] hover:border-[#9b87f5]/50 transition-colors text-[11px] h-6 px-2"
      >
        {isProcessing ? "Reprocessando..." : "Reprocessar"}
      </Button>
    );
  }

  return null;
};
