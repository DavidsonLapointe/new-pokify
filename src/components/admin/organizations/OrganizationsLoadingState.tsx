
import React from "react";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Carregando empresas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Falha ao carregar empresas</p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center border rounded-md">
        <p className="text-muted-foreground mb-4">Nenhuma empresa encontrada</p>
        <button 
          onClick={onCreateNew} 
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Cadastrar Empresa
        </button>
      </div>
    );
  }

  return null;
};
