
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

export const AdminIntegrationsList = () => {
  const [integrations] = useState<AdminIntegration[]>([
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
  ]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "crm":
        return "CRM";
      case "llm":
        return "Modelo LLM";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell className="font-medium">{integration.name}</TableCell>
              <TableCell>{getTypeLabel(integration.type)}</TableCell>
              <TableCell>
                <Badge variant={integration.isActive ? "default" : "secondary"}>
                  {integration.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
