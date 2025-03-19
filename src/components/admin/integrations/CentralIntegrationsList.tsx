
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Integration } from "@/types/integration";
import { Edit, Key, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const CentralIntegrationsList = () => {
  const [centralIntegrations, setCentralIntegrations] = useState<Integration[]>([]);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  const handleDeleteIntegration = (id: string) => {
    setCentralIntegrations(centralIntegrations.filter(integration => integration.id !== id));
  };

  const toggleShowApiKey = (id: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (centralIntegrations.length === 0) {
    return (
      <div className="bg-muted/40 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhuma integração central configurada</h3>
        <p className="text-muted-foreground">
          Clique no botão "Nova Integração Central" para adicionar uma integração que afetará todo o sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {centralIntegrations.map((integration) => (
        <Card key={integration.id} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{integration.name}</CardTitle>
            <CardDescription>
              {integration.description || "Integração central"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {integration.apiKey && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Chave API</div>
                <div className="flex items-center">
                  <Input 
                    value={showApiKey[integration.id] ? integration.apiKey : '•'.repeat(16)} 
                    readOnly 
                    className="text-sm pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-[-40px]" 
                    onClick={() => toggleShowApiKey(integration.id)}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end pt-0 gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir integração</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta integração central? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
