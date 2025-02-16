
import { Call, StatusMap } from "@/types/calls";
import { LeadCalls } from "./types";
import { getLeadName, getLeadDetails } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { CallHistoryTableHeader } from "./CallHistoryTableHeader";
import { CallHistoryTableRow } from "./CallHistoryTableRow";
import { CallVideoModal } from "./CallVideoModal";

interface CallHistoryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLead: LeadCalls | null;
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

export const CallHistory = ({
  isOpen,
  onOpenChange,
  selectedLead,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallHistoryProps) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState("");
  const [showLeadDetails, setShowLeadDetails] = useState(false);

  const handleMediaPlay = (call: Call) => {
    const isVideo = call.mediaType === "video";
    if (isVideo) {
      setSelectedMediaUrl(call.audioUrl);
      setShowVideoModal(true);
    } else {
      onPlayAudio(call.audioUrl);
    }
  };

  const handleViewAnalysis = (call: Call) => {
    onViewAnalysis(call);
    setShowLeadDetails(true);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Histórico de Chamadas - {getLeadName(selectedLead)}
            </DialogTitle>
            <DialogDescription>
              {getLeadDetails(selectedLead)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto min-h-0 mt-4">
            <div className="relative">
              <Table>
                <CallHistoryTableHeader />
                <TableBody>
                  {selectedLead?.calls?.map((call) => (
                    <CallHistoryTableRow
                      key={call.id}
                      call={call}
                      status={statusMap[call.status]}
                      onMediaPlay={handleMediaPlay}
                      onViewAnalysis={handleViewAnalysis}
                      formatDate={formatDate}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CallVideoModal
        isOpen={showVideoModal}
        onOpenChange={setShowVideoModal}
        videoUrl={selectedMediaUrl}
      />

      <LeadDetailsDialog
        isOpen={showLeadDetails}
        lead={selectedLead}
        onClose={() => setShowLeadDetails(false)}
      />
    </TooltipProvider>
  );
};
