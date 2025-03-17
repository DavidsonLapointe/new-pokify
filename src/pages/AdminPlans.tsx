
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/plans/planFetchService";

const AdminPlans = () => {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-red-500">Erro ao carregar planos. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os planos disponíveis para suas organizações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id} className="border">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.shortDescription}
                </p>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="font-medium mb-2">Funções incluídas:</h4>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full bg-primary">Editar Plano</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;
