
import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/types";
import { mockOrganizations } from "@/mocks";

export const useOrganizations = () => {
  const fetchOrganizations = async (): Promise<Organization[]> => {
    // Simula uma chamada de API com um delay
    return new Promise((resolve) => {
      console.log("Buscando organizações mockadas");
      setTimeout(() => {
        console.log(`Retornando ${mockOrganizations.length} organizações mockadas`);
        resolve(mockOrganizations);
      }, 800);
    });
  };

  const { 
    data: organizations = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    staleTime: 0, // Desabilitar cache para sempre buscar dados novos
    refetchOnWindowFocus: true
  });

  return {
    organizations,
    isLoading,
    error,
    refetch
  };
};
