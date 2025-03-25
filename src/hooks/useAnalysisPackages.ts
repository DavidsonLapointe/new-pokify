import { useState, useEffect, useCallback } from 'react';
import { AnalysisPackage } from '@/types';
import { 
  fetchAnalysisPackages as fetchPackagesService,
  createAnalysisPackage,
  updateAnalysisPackage,
  toggleAnalysisPackageStatus
} from '@/services/mockAnalysisPackageService';
import { toast } from 'sonner';

export const useAnalysisPackages = () => {
  const [packages, setPackages] = useState<AnalysisPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPackagesService();
      setPackages(data);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error fetching analysis packages:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      return false;
    }
  }, []);

  const addPackage = useCallback(async (packageData: Partial<AnalysisPackage>) => {
    try {
      const newPackage = await createAnalysisPackage(packageData);
      setPackages(prev => [...prev, newPackage]);
      toast.success('Pacote de análise criado com sucesso!');
      return newPackage;
    } catch (err) {
      console.error('Error creating analysis package:', err);
      toast.error('Erro ao criar pacote de análise');
      throw err;
    }
  }, []);

  const updatePackage = useCallback(async (id: string, packageData: Partial<AnalysisPackage>) => {
    try {
      const updatedPackage = await updateAnalysisPackage(id, packageData);
      if (updatedPackage) {
        setPackages(prev => 
          prev.map(pkg => pkg.id === id ? updatedPackage : pkg)
        );
        toast.success('Pacote de análise atualizado com sucesso!');
      }
      return updatedPackage;
    } catch (err) {
      console.error('Error updating analysis package:', err);
      toast.error('Erro ao atualizar pacote de análise');
      throw err;
    }
  }, []);

  const togglePackageStatus = useCallback(async (id: string) => {
    try {
      const updatedPackage = await toggleAnalysisPackageStatus(id);
      if (updatedPackage) {
        setPackages(prev => 
          prev.map(pkg => pkg.id === id ? updatedPackage : pkg)
        );
        const statusMessage = updatedPackage.active ? 'ativado' : 'desativado';
        toast.success(`Pacote de análise ${statusMessage} com sucesso!`);
      }
      return updatedPackage;
    } catch (err) {
      console.error('Error toggling analysis package status:', err);
      toast.error('Erro ao alterar status do pacote de análise');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    isLoading,
    error,
    refetch: fetchPackages,
    addPackage,
    updatePackage,
    togglePackageStatus
  };
};
