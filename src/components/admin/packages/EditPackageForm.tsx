import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AnalysisPackage } from "@/types/packages";

interface EditPackageFormProps {
  package_: AnalysisPackage;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (field: string, value: any) => void;
  onCancel: () => void;
}

export const EditPackageForm = ({
  package_,
  onSubmit,
  onChange,
  onCancel
}: EditPackageFormProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onChange(name, type === 'number' ? parseFloat(value) : value);
  };

  const handleSwitchChange = (checked: boolean) => {
    onChange('active', checked);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Pacote</Label>
        <Input
          id="name"
          name="name"
          value={package_.name}
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
          value={package_.credits}
          onChange={(e) => onChange('credits', parseInt(e.target.value))}
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
          value={package_.price}
          onChange={(e) => onChange('price', parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="active" 
          checked={package_.active} 
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="active">Pacote Ativo</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

