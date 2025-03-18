
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AdminIntegration } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditIntegrationDialog } from "./EditIntegrationDialog";

export const AdminIntegrationsList = () => {
  const [integrations, setIntegrations] = useState<AdminIntegration[]>([
    {
      id: "1",
      name: "HubSpot",
      type: "crm",
      isActive: true,
    },
    {
      id: "3",
      name: "GPT-4O",
      type: "llm",
      isActive: false,
    },
    {
      id: "4",
      name: "WhatsApp Oficial",
      type: "whatsapp",
      isActive: true,
    }
  ]);

  const [editingIntegration, setEditingIntegration] = useState<AdminIntegration | null>(null);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "crm":
        return "CRM";
      case "llm":
        return "Modelo LLM";
      case "whatsapp":
        return "WhatsApp";
      case "call":
        return "Chamada";
      default:
        return type;
    }
  };

  const handleUpdateIntegration = (updatedIntegration: AdminIntegration) => {
    setIntegrations(current => 
      current.map(integration => 
        integration.id === updatedIntegration.id ? updatedIntegration : integration
      )
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Tipo</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell className="font-medium text-left">{integration.name}</TableCell>
              <TableCell className="text-left">{getTypeLabel(integration.type)}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={integration.isActive ? "secondary" : "destructive"}
                  className={`
                    ${integration.isActive 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-red-100 text-red-800 hover:bg-red-100"}
                  `}
                >
                  {integration.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setEditingIntegration(integration)}
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingIntegration && (
        <EditIntegrationDialog
          integration={editingIntegration}
          open={!!editingIntegration}
          onOpenChange={(open) => {
            if (!open) setEditingIntegration(null);
          }}
          onUpdateIntegration={handleUpdateIntegration}
        />
      )}
    </div>
  );
};
