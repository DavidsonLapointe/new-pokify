
import { Call, StatusMap } from "@/types/calls";
import { LeadCalls } from "./types";
import { getLeadName, getLeadDetails } from "./utils";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlayCircle, FileText, Video, HelpCircle } from "lucide-react";
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { LeadTemperatureBadge } from "./LeadTemperatureBadge";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sticky top-0 bg-background">Data e Hora</TableHead>
                    <TableHead className="text-xs sticky top-0 bg-background">Vendedor</TableHead>
                    <TableHead className="text-xs sticky top-0 bg-background">Duração</TableHead>
                    <TableHead className="text-xs sticky top-0 bg-background">
                      <div className="flex items-center gap-1">
                        Status da Chamada
                        <Tooltip defaultOpen={false}>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto hover:bg-transparent"
                              type="button"
                            >
                              <HelpCircle className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="start" className="p-3">
                            <div className="space-y-3">
                              <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">Processada</Badge>
                                <span className="text-xs">Chamadas que foram atendidas e processadas com sucesso pelo sistema</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pendente</Badge>
                                <span className="text-xs">Chamadas que ainda estão aguardando processamento ou intervenção manual</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-red-100 text-red-700">Erro</Badge>
                                <span className="text-xs">Chamadas que falharam durante o processamento e precisam ser verificadas</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs sticky top-0 bg-background">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedLead?.calls?.map((call) => {
                    const status = statusMap[call.status];
                    const StatusIcon = status.icon;
                    const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

                    return (
                      <TableRow key={call.id} className="text-xs">
                        <TableCell className="py-2">{formatDate(call.date)}</TableCell>
                        <TableCell className="py-2">{call.seller}</TableCell>
                        <TableCell className="py-2">{call.duration}</TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="secondary"
                            className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${status.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMediaPlay(call)}
                              className="hover:text-primary h-7 w-7"
                            >
                              <MediaIcon className="h-4 w-4" />
                            </Button>
                            
                            {call.status === "success" && call.analysis && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewAnalysis(call)}
                                className="hover:text-primary h-7 w-7"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Visualizar Vídeo</DialogTitle>
          </DialogHeader>
          <div className="mt-4 aspect-video">
            <video
              src={selectedMediaUrl}
              controls
              className="w-full h-full"
            >
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      <LeadDetailsDialog
        isOpen={showLeadDetails}
        lead={selectedLead}
        onClose={() => setShowLeadDetails(false)}
      />
    </TooltipProvider>
  );
};
