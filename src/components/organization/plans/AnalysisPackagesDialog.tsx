
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileBarChart, Check } from "lucide-react";
import { useState } from "react";
import { PaymentGatewayDialog } from "./PaymentGatewayDialog";

interface AnalysisPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  active: boolean;
}

interface AnalysisPackagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPackage: (pkg: AnalysisPackage) => void;
}

export function AnalysisPackagesDialog({
  open,
  onOpenChange,
  onSelectPackage,
}: AnalysisPackagesDialogProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<AnalysisPackage | null>(null);
  
  // Mock packages - in production, this would come from your API
  const packages: AnalysisPackage[] = [
    {
      id: "1",
      name: "Pacote Básico",
      credits: 100,
      price: 199.90,
      active: true,
    },
    {
      id: "2",
      name: "Pacote Intermediário",
      credits: 500,
      price: 899.90,
      active: true,
    },
    {
      id: "3",
      name: "Pacote Avançado",
      credits: 1000,
      price: 1599.90,
      active: false,
    }
  ];

  const handleSelectPackage = (pkg: AnalysisPackage) => {
    setSelectedPackageId(pkg.id);
    setSelectedPackage(pkg);
    setIsPaymentDialogOpen(true);
    onSelectPackage(pkg);
  };

  const handlePaymentDialogClose = (open: boolean) => {
    setIsPaymentDialogOpen(open);
    if (!open) {
      setSelectedPackageId(null);
      setSelectedPackage(null);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Selecione um pacote de créditos</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {packages
              .filter(pkg => pkg.active)
              .map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPackageId === pkg.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {selectedPackageId === pkg.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <FileBarChart className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pkg.credits} créditos para análise
                    </p>
                    <p className="font-medium">
                      R$ {pkg.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      <PaymentGatewayDialog
        open={isPaymentDialogOpen}
        onOpenChange={handlePaymentDialogClose}
        package={selectedPackage}
      />
    </>
  );
}
