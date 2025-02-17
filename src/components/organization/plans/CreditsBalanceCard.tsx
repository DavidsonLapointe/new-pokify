
import { AlertCircle, FileBarChart, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CreditsBalanceCardProps {
  monthlyQuota: number;
  used: number;
  additionalCredits: number;
  onBuyMoreCredits: () => void;
  isLoading?: boolean;
}

export function CreditsBalanceCard({
  monthlyQuota,
  used,
  additionalCredits,
  onBuyMoreCredits,
  isLoading = false,
}: CreditsBalanceCardProps) {
  const usagePercentage = (used / monthlyQuota) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          Créditos para análise de arquivos
        </CardTitle>
        <CardDescription>
          Gerencie seus créditos para análise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Créditos do Plano Mensal */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Créditos do plano mensal</span>
              <span className="font-medium">{used}/{monthlyQuota}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Expiram ao final do mês
            </p>
          </div>
        </div>

        {/* Créditos Adicionais */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Créditos adicionais disponíveis</span>
            <span className="font-medium">{additionalCredits}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Não expiram e são consumidos após o término dos créditos mensais
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Ordem de consumo dos créditos</p>
                <p className="text-sm text-muted-foreground">
                  O sistema utilizará primeiro os créditos do plano mensal. Os créditos adicionais serão consumidos apenas quando o saldo mensal estiver zerado.
                </p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={onBuyMoreCredits}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Comprar análises adicionais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
