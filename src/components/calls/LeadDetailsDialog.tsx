
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface LeadDetailsDialogProps {
  lead: LeadCalls;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (lead: LeadCalls) => void;
}

// List of allowed lead types
const allowedLeadTypes = ["client", "prospect", "employee", "candidate", "supplier"];

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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Lead: {getLeadName(lead)}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Tipo de Pessoa */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="personType" className="text-right">
                Tipo de Pessoa
              </Label>
              <Select
                value={editedLead.personType}
                onValueChange={(value) => handleInputChange("personType", value as "pf" | "pj")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de pessoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pf">Pessoa Física</SelectItem>
                  <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Lead */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leadType" className="text-right">
                Tipo de Lead
              </Label>
              <Select
                value={editedLead.leadType || "client"}
                onValueChange={(value) => handleInputChange("leadType", value as LeadType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de lead" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(leadTypeConfig)
                    .filter(([key]) => allowedLeadTypes.includes(key))
                    .map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campos condicionais baseados no tipo de pessoa */}
            {editedLead.personType === "pf" ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="firstName"
                    value={editedLead.firstName || ""}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Sobrenome
                  </Label>
                  <Input
                    id="lastName"
                    value={editedLead.lastName || ""}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="razaoSocial" className="text-right">
                  Razão Social
                </Label>
                <Input
                  id="razaoSocial"
                  value={editedLead.razaoSocial || ""}
                  onChange={(e) => handleInputChange("razaoSocial", e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}

            {/* Status do Lead */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={editedLead.status || "active"}
                onValueChange={(value) => handleInputChange("status", value as "active" | "inactive")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
