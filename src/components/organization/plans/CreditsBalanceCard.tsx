import { useState, useEffect } from "react";
import { AlertCircle, FileBarChart, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchCreditBalance } from "@/services/mockCreditsService";

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
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState({
    total: monthlyQuota,
    used: used,
    additional: additionalCredits
  });

  useEffect(() => {
    fetchCreditsBalance();
  }, []);

  const fetchCreditsBalance = async () => {
    try {
      const data = await fetchCreditBalance();

      if (data) {
        setCredits({
          total: data.totalCredits,
          used: data.usedCredits,
          additional: data.additionalCredits
        });
      } else {
        // Fallback para os valores passados como props
        setCredits({
          total: monthlyQuota,
          used: used,
          additional: additionalCredits
        });
      }
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
      toast.error('Erro ao carregar saldo de créditos');
      // Fallback para os valores passados como props
      setCredits({
        total: monthlyQuota,
        used: used,
        additional: additionalCredits
      });
    } finally {
      setLoading(false);
    }
  };

  const usagePercentage = (credits.used / credits.total) * 100;

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          Saldo de Créditos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Créditos do Plano Mensal */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Créditos do plano mensal</span>
              <span className="font-medium">{credits.used}/{credits.total}</span>
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
            <span className="font-medium">{credits.additional}</span>
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
            Comprar créditos adicionais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
