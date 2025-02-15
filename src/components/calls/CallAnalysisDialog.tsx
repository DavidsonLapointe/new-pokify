
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CallAnalysis } from "@/types/calls";
import { Contact2, Phone, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CallAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis?: CallAnalysis;
  call: {
    date: string;
    duration: string;
  };
}

export const CallAnalysisDialog = ({
  isOpen,
  onClose,
  analysis,
  call,
}: CallAnalysisDialogProps) => {
  if (!analysis) return null;

  const getLeadName = (leadInfo: typeof analysis.leadInfo) => {
    if (leadInfo.personType === "pf") {
      return `${leadInfo.firstName} ${leadInfo.lastName || ""}`;
    }
    return leadInfo.razaoSocial;
  };

  const leadName = getLeadName(analysis.leadInfo);
  const formattedDate = format(new Date(call.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Análise da Chamada</DialogTitle>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Duração:</span>
                {call.duration}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {leadName && (
                <div className="flex items-center gap-1">
                  <Contact2 className="h-4 w-4" />
                  {leadName}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {analysis.leadInfo.phone}
              </div>
              {analysis.leadInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {analysis.leadInfo.email}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="transcription" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="transcription">Transcrição</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 overflow-hidden">
            <TabsContent value="transcription" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Transcrição da Chamada</CardTitle>
                  <CardDescription>
                    Transcrição completa de toda a conversa
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)]">
                  <ScrollArea className="h-full pr-4">
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {analysis.transcription}
                    </p>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Resumo da Chamada</CardTitle>
                  <CardDescription>
                    Resumo dos principais pontos da conversa
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)]">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        {analysis.summary}
                      </p>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
