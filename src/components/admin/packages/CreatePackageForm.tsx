import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewPackageForm } from "@/types/packages";

interface CreatePackageFormProps {
  newPackage: NewPackageForm;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (field: string, value: string) => void;
  onCancel: () => void;
}

export const CreatePackageForm = ({
  newPackage,
  onSubmit,
  onChange,
  onCancel
}: CreatePackageFormProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Pacote</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Pacote Básico"
          value={newPackage.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="credits">Quantidade de Créditos</Label>
        <Input
          id="credits"
          name="credits"
          type="number"
          min="1"
          placeholder="Ex: 50"
          value={newPackage.credits}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Ex: 99.90"
          value={newPackage.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Pacote
        </Button>
      </div>
    </form>
  );
};
