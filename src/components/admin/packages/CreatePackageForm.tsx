import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewPackageForm } from "@/types/packages";
import { Dispatch, SetStateAction } from "react";

interface CreatePackageFormProps {
  newPackage: NewPackageForm;
  setNewPackage: Dispatch<SetStateAction<NewPackageForm>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreatePackageForm({ newPackage, setNewPackage, onSubmit }: CreatePackageFormProps) {
  const handleChange = (field: keyof NewPackageForm, value: string) => {
    setNewPackage(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Pacote *</Label>
        <Input
          id="name"
          value={newPackage.name}
          onChange={(e) => handleChange("name", e.target.value)}
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
          onChange={(e) => handleChange("credits", e.target.value)}
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
          onChange={(e) => handleChange("price", e.target.value)}
          placeholder="Ex: 199.90"
          required
        />
      </div>

      <p className="text-sm text-muted-foreground">* Campos obrigatórios</p>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setNewPackage({ name: "", credits: "", price: "" })}
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
