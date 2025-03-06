
import React from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const OrganizationCalls = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ligações</h1>
          <p className="text-muted-foreground">
            Gerencie suas ligações e interações com clientes
          </p>
        </div>
        <Button>
          <Phone className="w-4 h-4 mr-2" />
          Nova Ligação
        </Button>
      </div>
      
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          Nenhuma ligação encontrada. Clique em "Nova Ligação" para começar.
        </p>
      </div>
    </div>
  );
};

export default OrganizationCalls;
