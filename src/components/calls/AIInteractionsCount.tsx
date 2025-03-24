
import { useState } from "react";
import { Call } from "@/types/calls";
import { Button } from "@/components/ui/button";
import { LeadCalls } from "./types";
import { AIInteractionsModal } from "./AIInteractionsModal";

interface AIInteractionsCountProps {
  calls: Call[];
  lead?: LeadCalls;
  formatDate?: (date: string) => string;
}

export const AIInteractionsCount = ({ calls, lead, formatDate = (date) => new Date(date).toLocaleDateString() }: AIInteractionsCountProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Count different types of interactions
  const successCalls = calls.filter(call => call.status === "success");
  
  const callAnalysisCount = successCalls.filter(call => 
    call.analysis?.summary).length;
  
  const chatAnalysisCount = successCalls.filter(call => 
    call.analysis?.chatMessages && 
    call.analysis.chatMessages.length > 0).length;
  
  const reportCount = successCalls.filter(call => 
    call.analysis?.report).length;

  const totalInteractions = callAnalysisCount + chatAnalysisCount + reportCount;

  if (totalInteractions === 0) {
    return <span className="text-xs text-gray-400 text-center block">0</span>;
  }

  const handleOpenModal = () => {
    if (lead) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant="link" 
        className="p-0 h-auto font-medium text-xs text-blue-600 hover:text-blue-800 mx-auto"
        onClick={handleOpenModal}
        disabled={!lead}
      >
        {totalInteractions}
      </Button>
      
      {lead && (
        <AIInteractionsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          lead={lead}
          formatDate={formatDate}
        />
      )}
    </>
  );
};
