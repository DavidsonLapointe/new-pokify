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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CallAnalysis, LeadTemperature } from "@/types/calls";
import { Flame, Contact2, ListChecks, Phone } from "lucide-react";

interface CallAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis?: CallAnalysis;
}

const temperatureConfig: Record<LeadTemperature, { label: string; color: string }> = {
  cold: { label: "Lead Frio", color: "bg-blue-100 text-blue-800" },
  warm: { label: "Lead Morno", color: "bg-yellow-100 text-yellow-800" },
  hot: { label: "Lead Quente", color: "bg-red-100 text-red-800" },
};

export const CallAnalysisDialog = ({
  isOpen,
  onClose,
  analysis,
}: CallAnalysisDialogProps) => {
  if (!analysis) return null;

  const temperature = temperatureConfig[analysis.sentiment.temperature];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="space-y-2">
          <DialogTitle>Análise da Chamada</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {analysis.leadInfo.name && (
              <div className="flex items-center gap-1">
                <Contact2 className="h-4 w-4" />
                {analysis.leadInfo.name}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {analysis.leadInfo.phone}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="lead" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="lead">Ficha do Lead</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="transcription">Transcrição</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 overflow-hidden">
            <TabsContent value="lead" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Ficha do Lead</CardTitle>
                  <CardDescription>
                    Informações extraídas para envio ao CRM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-2 mb-4">
                          <Contact2 className="w-4 h-4" />
                          Informações de Contato
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {analysis.leadInfo.name && (
                            <div>
                              <p className="text-sm font-medium">Nome</p>
                              <p className="text-sm text-muted-foreground">
                                {analysis.leadInfo.name}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">Telefone</p>
                            <p className="text-sm text-muted-foreground">
                              {analysis.leadInfo.phone}
                            </p>
                          </div>
                          {analysis.leadInfo.email && (
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">
                                {analysis.leadInfo.email}
                              </p>
                            </div>
                          )}
                          {analysis.leadInfo.company && (
                            <div>
                              <p className="text-sm font-medium">Empresa</p>
                              <p className="text-sm text-muted-foreground">
                                {analysis.leadInfo.company}
                              </p>
                            </div>
                          )}
                          {analysis.leadInfo.position && (
                            <div>
                              <p className="text-sm font-medium">Cargo</p>
                              <p className="text-sm text-muted-foreground">
                                {analysis.leadInfo.position}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {analysis.leadInfo.interests && analysis.leadInfo.interests.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                            <ListChecks className="w-4 h-4" />
                            Interesses
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.leadInfo.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.leadInfo.painPoints && analysis.leadInfo.painPoints.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Pontos de Dor</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {analysis.leadInfo.painPoints.map((point, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.leadInfo.budget && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Orçamento</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis.leadInfo.budget}
                          </p>
                        </div>
                      )}

                      {analysis.leadInfo.nextSteps && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Próximos Passos</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis.leadInfo.nextSteps}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Resumo e Análise</CardTitle>
                  <CardDescription>
                    Resumo da conversa e análise de sentimento
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
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Temperatura do Lead</h4>
                        <Badge variant="secondary" className={`${temperature.color}`}>
                          <Flame className="w-3 h-3 mr-1" />
                          {temperature.label}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {analysis.sentiment.reason}
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
                    <p className="whitespace-pre-wrap">{analysis.transcription}</p>
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
