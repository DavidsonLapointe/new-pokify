
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface OrganizationsLoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isEmpty: boolean;
  onCreateNew: () => void;
}

export const OrganizationsLoadingState = ({
  isLoading,
  error,
  refetch,
  isEmpty,
  onCreateNew
}: OrganizationsLoadingStateProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">Carregando empresas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center border border-red-200 rounded-md bg-red-50">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-500 font-medium mb-2">Falha ao carregar empresas</p>
        <p className="text-red-400 text-sm mb-4">{error.message}</p>
        <Button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center border rounded-md">
        <p className="text-muted-foreground mb-4">Nenhuma empresa encontrada</p>
        <Button 
          onClick={onCreateNew} 
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Cadastrar Empresa
        </Button>
      </div>
    );
  }

  return null;
};
