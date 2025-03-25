import { Button } from "@/components/ui/button";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { AnalysisPackage } from "@/types/packages";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface PackagesListProps {
  packages: AnalysisPackage[];
  isLoading?: boolean;
  onEdit: (pkg: AnalysisPackage) => void;
  onToggleActive: (pkg: AnalysisPackage) => void;
}

export function PackagesList({ packages, isLoading = false, onEdit, onToggleActive }: PackagesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="p-4 border rounded-lg flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {packages.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Nenhum pacote disponível</p>
        </div>
      ) : (
        packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-4 border rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors group ${!pkg.active ? 'opacity-60' : ''}`}
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
                <CustomSwitch
                  checked={pkg.active}
                  onCheckedChange={() => {
                    onToggleActive(pkg);
                    toast.success(`Pacote ${pkg.active ? 'desativado' : 'ativado'} com sucesso`);
                  }}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
