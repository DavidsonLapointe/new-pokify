
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { LeadCalls } from "./types";
import { getLeadName, LeadType, leadTypeConfig } from "./utils";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadTypeBadge } from "./LeadTypeBadge";

interface LeadDetailsDialogProps {
  lead: LeadCalls;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (lead: LeadCalls) => void;
}

// List of allowed lead types
const allowedLeadTypes = ["client", "prospect", "employee", "candidate", "supplier", "partner"];

export const LeadDetailsDialog = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
}: LeadDetailsDialogProps) => {
  const [editedLead, setEditedLead] = useState<LeadCalls>({ ...lead });

  const handleInputChange = (field: keyof LeadCalls, value: string) => {
    setEditedLead((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLead(editedLead);
    onClose();
  };

  // Get the status badge color based on current status
  const getStatusBadgeClass = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  // Get status label for display
  const getStatusLabel = (status: string) => {
    return status === "active" ? "Ativo" : "Inativo";
  };

  // Get available status options (only show statuses different from current)
  const getAvailableStatusOptions = () => {
    const currentStatus = lead.status || "active";
    return currentStatus === "active" 
      ? [{ value: "inactive", label: "Inativo" }] 
      : [{ value: "active", label: "Ativo" }];
  };

  // Get available lead type options (filter out the current lead type)
  const getAvailableLeadTypeOptions = () => {
    const currentLeadType = lead.leadType;
    return Object.entries(leadTypeConfig)
      .filter(([key]) => 
        allowedLeadTypes.includes(key) && 
        key !== currentLeadType
      )
      .map(([key, config]) => ({
        value: key,
        label: config.label
      }));
  };
  
  // Get person type label based on the current type (using abbreviated format)
  const getPersonTypeLabel = (type: "pf" | "pj") => {
    return type === "pf" ? "PF" : "PJ";
  };
  
  // Get available person type options (only show the type different from current)
  const getAvailablePersonTypeOptions = () => {
    const currentType = lead.personType;
    return currentType === "pf" 
      ? [{ value: "pj", label: "Pessoa Jurídica" }] 
      : [{ value: "pf", label: "Pessoa Física" }];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogClose asChild>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Lead: {getLeadName(lead)}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Tipo de Pessoa */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="personType">
                    Tipo de Pessoa Atual:
                  </Label>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {getPersonTypeLabel(lead.personType)}
                  </Badge>
                </div>
                <Select
                  value={editedLead.personType}
                  onValueChange={(value) => handleInputChange("personType", value as "pf" | "pj")}
                >
                  <SelectTrigger id="personType">
                    <SelectValue>
                      {editedLead.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePersonTypeOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Lead */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="leadType">
                    Tipo de Lead Atual:
                  </Label>
                  {lead.leadType && <LeadTypeBadge leadType={lead.leadType} />}
                </div>
                <Select
                  value={editedLead.leadType || "client"}
                  onValueChange={(value) => handleInputChange("leadType", value as LeadType)}
                >
                  <SelectTrigger id="leadType">
                    <SelectValue>
                      {leadTypeConfig[editedLead.leadType || "client"]?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableLeadTypeOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nome e Sobrenome - agora sempre visíveis */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nome
                </Label>
                <Input
                  id="firstName"
                  value={editedLead.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Sobrenome
                </Label>
                <Input
                  id="lastName"
                  value={editedLead.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>

            {/* Show razaoSocial only for pessoa jurídica */}
            {editedLead.personType === "pj" && (
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">
                  Razão Social
                </Label>
                <Input
                  id="razaoSocial"
                  value={editedLead.razaoSocial || ""}
                  onChange={(e) => handleInputChange("razaoSocial", e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editedLead.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={editedLead.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>

            {/* Status do Lead - Updated with badge showing current status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="status">
                  Status atual:
                </Label>
                <Badge className={getStatusBadgeClass(lead.status || "active")}>
                  {getStatusLabel(lead.status || "active")}
                </Badge>
              </div>
              <Select
                value={editedLead.status || "active"}
                onValueChange={(value) => handleInputChange("status", value as "active" | "inactive")}
              >
                <SelectTrigger id="status">
                  <SelectValue>
                    {getStatusLabel(editedLead.status || "active")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {getAvailableStatusOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
