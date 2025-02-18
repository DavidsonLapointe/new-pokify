
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnalysisPackage } from "@/types/packages";

interface EditPackageFormProps {
  package_: AnalysisPackage;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof AnalysisPackage, value: string | number) => void;
  onCancel: () => void;
}

export function EditPackageForm({ package_, onSubmit, onChange, onCancel }: EditPackageFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Nome do Pacote</Label>
        <Input
          id="edit-name"
          value={package_.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-credits">Quantidade de Créditos</Label>
        <Input
          id="edit-credits"
          type="number"
          value={package_.credits}
          onChange={(e) => onChange("credits", parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-price">Preço (R$)</Label>
        <Input
          id="edit-price"
          type="number"
          step="0.01"
          value={package_.price}
          onChange={(e) => onChange("price", parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="cancel"
          onClick={onCancel}
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
