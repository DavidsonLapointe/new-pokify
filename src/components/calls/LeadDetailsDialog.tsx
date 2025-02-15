
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
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LeadCalls } from "./types";
import { Contact2, ListChecks, Phone } from "lucide-react";
import { getLeadName } from "./utils";

interface LeadDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadCalls;
}

export const LeadDetailsDialog = ({
  isOpen,
  onClose,
  lead,
}: LeadDetailsDialogProps) => {
  const lastSuccessfulCall = lead.calls
    .filter(call => call.status === "success" && call.analysis)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const leadInfo = lastSuccessfulCall?.analysis?.leadInfo;
  const leadName = getLeadName(lead);

  if (!lastSuccessfulCall?.analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-10">
            <DialogTitle>Informações do Lead</DialogTitle>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {leadName && (
              <div className="flex items-center gap-1">
                <Contact2 className="h-4 w-4" />
                {leadName}
              </div>
            )}
            {leadInfo?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {leadInfo.phone}
              </div>
            )}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="lead" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="lead">Ficha do Lead</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 overflow-hidden">
            <TabsContent value="lead" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Ficha do Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                    <div className="space-y-6">
                      {leadInfo && (
                        <>
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-4">
                              <Contact2 className="w-4 h-4" />
                              Informações de Contato
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              {leadName && (
                                <div>
                                  <p className="text-sm font-medium">
                                    {leadInfo.personType === "pf" ? "Nome" : "Razão Social"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {leadName}
                                  </p>
                                </div>
                              )}
                              {leadInfo.phone && (
                                <div>
                                  <p className="text-sm font-medium">Telefone</p>
                                  <p className="text-sm text-muted-foreground">
                                    {leadInfo.phone}
                                  </p>
                                </div>
                              )}
                              {leadInfo.email && (
                                <div>
                                  <p className="text-sm font-medium">Email</p>
                                  <p className="text-sm text-muted-foreground">
                                    {leadInfo.email}
                                  </p>
                                </div>
                              )}
                              {leadInfo.company && (
                                <div>
                                  <p className="text-sm font-medium">Empresa</p>
                                  <p className="text-sm text-muted-foreground">
                                    {leadInfo.company}
                                  </p>
                                </div>
                              )}
                              {leadInfo.position && (
                                <div>
                                  <p className="text-sm font-medium">Cargo</p>
                                  <p className="text-sm text-muted-foreground">
                                    {leadInfo.position}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {leadInfo.interests && leadInfo.interests.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                                <ListChecks className="w-4 h-4" />
                                Interesses
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {leadInfo.interests.map((interest, index) => (
                                  <Badge key={index} variant="secondary">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {leadInfo.painPoints && leadInfo.painPoints.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Pontos de Dor</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {leadInfo.painPoints.map((point, index) => (
                                  <li key={index} className="text-sm text-muted-foreground">
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {leadInfo.budget && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Orçamento</h4>
                              <p className="text-sm text-muted-foreground">
                                {leadInfo.budget}
                              </p>
                            </div>
                          )}

                          {leadInfo.nextSteps && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Próximos Passos</h4>
                              <p className="text-sm text-muted-foreground">
                                {leadInfo.nextSteps}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Resumo da Última Chamada</CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)]">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Resumo da Conversa</h4>
                        <p className="text-sm text-muted-foreground">
                          {lastSuccessfulCall.analysis.summary}
                        </p>
                      </div>
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
