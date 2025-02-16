
import { Call, StatusMap } from "@/types/calls";
import { LeadCalls } from "./types";
import { getLeadName, getLeadDetails, getLastCallTemperature, temperatureConfig } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardList, Flame } from "lucide-react";
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { CallHistoryTableHeader } from "./CallHistoryTableHeader";
import { CallHistoryTableRow } from "./CallHistoryTableRow";
import { CallVideoModal } from "./CallVideoModal";
import { CallAnalysisDialog } from "./CallAnalysisDialog";

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
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showCallAnalysis, setShowCallAnalysis] = useState(false);

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
    setSelectedCall(call);
    setShowCallAnalysis(true);
  };

  const temperature = selectedLead ? getLastCallTemperature(selectedLead.calls) : null;
  const tempConfig = temperature ? temperatureConfig[temperature] : null;

  return (
    <TooltipProvider delayDuration={0}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <DialogTitle>
                Histórico de Chamadas - {getLeadName(selectedLead)}
              </DialogTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowLeadDetails(true)}
                    className="h-8 w-8 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <ClipboardList className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver relatório completo do lead</p>
                </TooltipContent>
              </Tooltip>
              {tempConfig && (
                <Badge
                  variant="secondary"
                  className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${tempConfig.color}`}
                >
                  <Flame className="w-3 h-3 mr-1" />
                  {tempConfig.label}
                </Badge>
              )}
            </div>
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

      {selectedCall && (
        <CallAnalysisDialog
          isOpen={showCallAnalysis}
          onClose={() => {
            setShowCallAnalysis(false);
            setSelectedCall(null);
          }}
          analysis={selectedCall.analysis}
          call={{
            date: selectedCall.date,
            duration: selectedCall.duration,
          }}
        />
      )}
    </TooltipProvider>
  );
};
