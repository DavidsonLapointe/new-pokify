
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PaymentGatewayDialog } from "./PaymentGatewayDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

interface AnalysisPackagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPackage?: (pkg: any) => void;
}

const packages = [
  {
    name: "Pacote Inicial",
    credits: 100,
    price: 99.90,
    features: [
      "100 créditos para análise",
      "Validade de 12 meses",
      "Suporte por email"
    ]
  },
  {
    name: "Pacote Plus",
    credits: 500,
    price: 449.90,
    features: [
      "500 créditos para análise",
      "Validade de 12 meses",
      "Suporte prioritário",
      "Relatórios avançados"
    ]
  },
  {
    name: "Pacote Enterprise",
    credits: 1000,
    price: 849.90,
    features: [
      "1000 créditos para análise",
      "Validade de 12 meses",
      "Suporte prioritário 24/7",
      "Relatórios avançados",
      "API dedicada"
    ]
  }
];

export function AnalysisPackagesDialog({
  open,
  onOpenChange,
  onSelectPackage
}: AnalysisPackagesDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePackageSelect = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Pacotes de Análise</DialogTitle>
            <DialogDescription>
              Escolha o pacote que melhor atende suas necessidades
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.name} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">{pkg.name}</h3>
                    <p className="text-3xl font-bold">
                      R$ {pkg.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pkg.credits} créditos
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    Selecionar pacote
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <PaymentGatewayDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        package={selectedPackage}
      />
    </>
  );
}
