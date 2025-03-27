import { Button } from "@/components/ui/button";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { AnalysisPackage } from "@/types/packages";
import { Pencil, Edit, CreditCard, CreditCardIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PackagesListProps {
  packages: AnalysisPackage[];
  isLoading?: boolean;
  onEdit: (pkg: AnalysisPackage) => void;
  onToggleActive: (pkg: AnalysisPackage, active: boolean) => Promise<void>;
  onEditStripe?: (pkg: AnalysisPackage) => void;
}

export function PackagesList({ packages, isLoading = false, onEdit, onToggleActive, onEditStripe }: PackagesListProps) {
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
    <div className="space-y-3">
      {packages.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          Nenhum pacote de créditos cadastrado.
        </div>
      ) : (
        packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="font-medium">{pkg.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CreditCard className="h-3.5 w-3.5" /> 
                {pkg.credits} créditos
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">{formatCurrency(pkg.price)}</span>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => onEdit(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar pacote</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {onEditStripe && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary" 
                          onClick={() => onEditStripe(pkg)}
                        >
                          <CreditCardIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar no Stripe</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <Switch 
                  checked={pkg.active} 
                  onCheckedChange={(checked) => onToggleActive(pkg, checked)}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
