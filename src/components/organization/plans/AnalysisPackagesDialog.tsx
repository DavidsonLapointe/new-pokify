
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileBarChart2, PackageCheck } from "lucide-react";
import { PaymentGatewayDialog } from "./PaymentGatewayDialog";
import { toast } from "sonner";

interface AnalysisPackagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPackagePurchased?: () => void;
}

export function AnalysisPackagesDialog({ 
  open, 
  onOpenChange,
  onPackagePurchased 
}: AnalysisPackagesDialogProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    name: string;
    credits: number;
    price: number;
  } | null>(null);

  const packages = [
    {
      id: "small",
      name: "Pacote Pequeno",
      credits: 50,
      price: 99,
      popular: false
    },
    {
      id: "medium",
      name: "Pacote Médio",
      credits: 150,
      price: 199,
      popular: true
    },
    {
      id: "large",
      name: "Pacote Grande",
      credits: 300,
      price: 299,
      popular: false
    }
  ];

  const handlePackageSelect = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    toast.success(`Pacote de ${selectedPackage?.credits} créditos adicionado com sucesso!`);
    setShowPaymentDialog(false);
    onOpenChange(false);
    if (onPackagePurchased) {
      onPackagePurchased();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileBarChart2 className="h-5 w-5 text-primary" />
              Pacotes de créditos para análises adicionais
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`border p-4 hover:border-primary hover:shadow-sm transition-all ${
                  pkg.popular ? "border-primary shadow-sm" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                      Mais popular
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{pkg.name}</h3>
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <strong>{pkg.credits}</strong> créditos
                      </span>
                    </div>
                    <div className="text-2xl font-semibold">
                      R$ {pkg.price.toFixed(2)}
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Não expiram</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Disponíveis imediatamente</span>
                    </li>
                  </ul>

                  <Button
                    className="w-full"
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    Comprar pacote
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {selectedPackage && (
        <PaymentGatewayDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          packageDetails={{
            name: selectedPackage.name,
            price: selectedPackage.price,
            description: `${selectedPackage.credits} créditos para análise de arquivos`
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
