
import React, { useEffect, useRef } from "react";
import { Building2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Organization, User } from "@/types/organization";

interface OrganizationCardProps {
  organization: Organization;
  onEdit: (organization: Organization) => void;
}

export const OrganizationCard = ({ organization, onEdit }: OrganizationCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Delay the initial render slightly to prevent ResizeObserver issues
    const timeoutId = setTimeout(() => {
      if (cardRef.current) {
        // Force a reflow
        cardRef.current.style.display = 'none';
        cardRef.current.offsetHeight; // Trigger reflow
        cardRef.current.style.display = '';
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const activeUsers = organization.users.filter(user => user.status === "active");
  const activeAdmins = activeUsers.filter(user => user.role === "admin").length;
  const activeSellers = activeUsers.filter(user => user.role === "seller").length;

  return (
    <Card ref={cardRef} className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {organization.name}
            </CardTitle>
            <CardDescription className="mt-1">
              <span className="font-medium text-sm">Plano:</span> {organization.plan}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(organization);
            }}
          >
            <Pencil className="w-4 h-4 text-primary hover:text-primary/80" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Usuários ativos</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium cursor-help">{activeUsers.length}</span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Administradores: {activeAdmins}</p>
                  <p>Vendedores: {activeSellers}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">CRM</span>
            <span className={`font-medium ${!organization.integratedCRM ? "text-yellow-600" : ""}`}>
              {organization.integratedCRM || "Pendente de integração"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">LLM</span>
            <span className={`font-medium ${!organization.integratedLLM ? "text-yellow-600" : ""}`}>
              {organization.integratedLLM || "Pendente de integração"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                organization.status === "active"
                  ? "bg-green-100 text-green-700"
                  : organization.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {organization.status === "active"
                ? "Ativo"
                : organization.status === "pending"
                ? "Pendente"
                : "Inativo"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
