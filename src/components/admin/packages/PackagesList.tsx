
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AnalysisPackage } from "@/types/packages";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface PackagesListProps {
  packages: AnalysisPackage[];
  onEdit: (pkg: AnalysisPackage) => void;
  onToggleActive: (pkg: AnalysisPackage, active: boolean) => void;
}

export function PackagesList({ packages, onEdit, onToggleActive }: PackagesListProps) {
  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="p-4 border rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors group"
        >
          <div>
            <h3 className="font-medium">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pkg.credits} {pkg.credits === 1 ? 'crédito' : 'créditos'} para análises de arquivos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-medium">
              R$ {pkg.price.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => onEdit(pkg)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Switch
                  checked={pkg.active}
                  onCheckedChange={(checked) => {
                    onToggleActive(pkg, checked);
                    toast.success(`Pacote ${checked ? 'ativado' : 'desativado'} com sucesso`);
                  }}
                />
                <span className={`text-sm ${pkg.active ? 'text-green-600' : 'text-red-600'}`}>
                  {pkg.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
