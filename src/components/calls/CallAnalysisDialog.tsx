
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
import { Contact2, Phone } from "lucide-react";

interface CallAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis?: CallAnalysis;
}

export const CallAnalysisDialog = ({
  isOpen,
  onClose,
  analysis,
}: CallAnalysisDialogProps) => {
  if (!analysis) return null;

  const getLeadName = (leadInfo: typeof analysis.leadInfo) => {
    if (leadInfo.personType === "pf") {
      return `${leadInfo.firstName} ${leadInfo.lastName || ""}`;
    }
    return leadInfo.razaoSocial;
  };

  const leadName = getLeadName(analysis.leadInfo);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Análise da Chamada</DialogTitle>
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
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="summary" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="summary">Descrição</TabsTrigger>
            <TabsTrigger value="transcription">Transcrição</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 overflow-hidden">
            <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Descrição da Chamada</CardTitle>
                  <CardDescription>
                    Resumo e pontos principais da conversa
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)]">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Resumo da Conversa</h4>
                        <p className="text-sm text-muted-foreground">
                          {analysis.summary}
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcription" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Transcrição da Conversa</CardTitle>
                  <CardDescription>
                    Transcrição completa da chamada gerada por IA
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
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
