
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LossReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const PREDEFINED_REASONS = [
  "Preço muito alto",
  "Escolheu concorrente",
  "Não tem necessidade no momento",
  "Não conseguimos contato",
  "Produto não atende às necessidades",
  "Outro",
];

export const LossReasonDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: LossReasonDialogProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleConfirm = () => {
    if (selectedReason === "Outro" && otherReason) {
      onConfirm(otherReason);
    } else if (selectedReason) {
      onConfirm(selectedReason);
    } else {
      // No reason selected, use a default
      onConfirm("Não especificado");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Motivo da Perda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Selecione o motivo da perda</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === "Outro" && (
            <div className="space-y-2">
              <Label htmlFor="otherReason">Especifique o motivo</Label>
              <Textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Descreva o motivo da perda"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
