
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewPackageForm } from "@/types/packages";

interface CreatePackageFormProps {
  newPackage: NewPackageForm;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof NewPackageForm, value: string) => void;
  onCancel: () => void;
}

export function CreatePackageForm({ newPackage, onSubmit, onChange, onCancel }: CreatePackageFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Pacote *</Label>
        <Input
          id="name"
          value={newPackage.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ex: Pacote Premium"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="credits">Quantidade de Créditos *</Label>
        <Input
          id="credits"
          type="number"
          value={newPackage.credits}
          onChange={(e) => onChange("credits", e.target.value)}
          placeholder="Ex: 100"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={newPackage.price}
          onChange={(e) => onChange("price", e.target.value)}
          placeholder="Ex: 199.90"
          required
        />
      </div>

      <p className="text-sm text-muted-foreground">* Campos obrigatórios</p>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="cancel"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit">
          Criar Pacote
        </Button>
      </div>
    </form>
  );
}
