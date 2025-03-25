import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnalysisPackage } from "@/types/packages";
import { Dispatch, SetStateAction } from "react";

interface EditPackageFormProps {
  editingPackage: AnalysisPackage;
  setEditingPackage: Dispatch<SetStateAction<AnalysisPackage>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditPackageForm({ editingPackage, setEditingPackage, onSubmit }: EditPackageFormProps) {
  const handleChange = (field: keyof AnalysisPackage, value: string | number) => {
    setEditingPackage(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Nome do Pacote</Label>
        <Input
          id="edit-name"
          value={editingPackage.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-credits">Quantidade de Créditos</Label>
        <Input
          id="edit-credits"
          type="number"
          value={editingPackage.credits}
          onChange={(e) => handleChange("credits", parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-price">Preço (R$)</Label>
        <Input
          id="edit-price"
          type="number"
          step="0.01"
          value={editingPackage.price}
          onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditingPackage(null)}
        >
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
