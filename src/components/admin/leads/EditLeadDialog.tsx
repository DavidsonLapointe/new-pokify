import { useState, useEffect } from "react";
import { LeadlyLead } from "@/pages/AdminLeads";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LossReasonDialog } from "./LossReasonDialog";

interface EditLeadDialogProps {
  lead: LeadlyLead;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updatedLead: LeadlyLead) => void;
}

type PersonType = "pf" | "pj";

interface LeadFormData {
  name: string;
  phone: string;
  status: string;
  personType: PersonType;
  email?: string;
  companyName?: string;
  employeeCount?: string;
  sector?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const EditLeadDialog = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
}: EditLeadDialogProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: lead.name,
    phone: lead.phone,
    status: lead.status,
    personType: "pj", // Default to PJ
    email: lead.email || "",
    companyName: lead.companyName || "",
    employeeCount: lead.employeeCount || "",
    sector: lead.sector || "",
    address: lead.address || "",
    city: lead.city || "",
    state: lead.state || "",
    zipCode: lead.zipCode || "",
  });

  const [previousStatus, setPreviousStatus] = useState(lead.status);
  const [showLossReasonDialog, setShowLossReasonDialog] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        phone: lead.phone,
        status: lead.status,
        personType: lead.personType || "pj",
        email: lead.email || "",
        companyName: lead.companyName || "",
        employeeCount: lead.employeeCount || "",
        sector: lead.sector || "",
        address: lead.address || "",
        city: lead.city || "",
        state: lead.state || "",
        zipCode: lead.zipCode || "",
      });
      setPreviousStatus(lead.status);
    }
  }, [lead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    if (value === "perda" && previousStatus !== "perda") {
      setShowLossReasonDialog(true);
    }
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handlePersonTypeChange = (value: PersonType) => {
    setFormData((prev) => ({ ...prev, personType: value }));
  };

  const handleSave = () => {
    const updatedLead: LeadlyLead = {
      ...lead,
      name: formData.name,
      phone: formData.phone,
      status: formData.status,
      personType: formData.personType,
      email: formData.email,
      companyName: formData.companyName,
      employeeCount: formData.employeeCount,
      sector: formData.sector,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    };

    onUpdateLead(updatedLead);
    toast.success("Lead atualizado com sucesso!");
    onClose();
  };

  const handleLossReasonConfirm = (reason: string) => {
    setShowLossReasonDialog(false);
    setFormData((prev) => ({ ...prev, lossReason: reason }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className={`
            max-w-md 
            ${formData.personType === 'pj' ? 'max-h-[90vh]' : 'max-h-[70vh]'}
            mx-auto 
            overflow-y-auto
          `}
        >
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contactar">Contactar</SelectItem>
                  <SelectItem value="qualificacao">Qualificação</SelectItem>
                  <SelectItem value="nutricao_mkt">Nutrição Mkt</SelectItem>
                  <SelectItem value="email_onboarding">Email Onboarding</SelectItem>
                  <SelectItem value="ganho">Ganho</SelectItem>
                  <SelectItem value="perda">Perda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Pessoa</Label>
              <RadioGroup
                value={formData.personType}
                onValueChange={handlePersonTypeChange}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pj" id="pj" />
                  <Label htmlFor="pj" className="cursor-pointer">Pessoa Jurídica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pf" id="pf" />
                  <Label htmlFor="pf" className="cursor-pointer">Pessoa Física</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {formData.personType === "pj" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Empresa</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Quantidade de Funcionários</Label>
                  <Input
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Setor</Label>
                  <Input
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LossReasonDialog
        isOpen={showLossReasonDialog}
        onClose={() => setShowLossReasonDialog(false)}
        onConfirm={handleLossReasonConfirm}
      />
    </>
  );
};
