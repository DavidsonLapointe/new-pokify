
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { setupStripeProducts } from '@/services/setupStripeProducts';
import { toast } from 'sonner';

export function SetupStripeProducts() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const result = await setupStripeProducts();
      console.log('Produtos criados:', result);
      toast.success('Produtos e preços criados com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar produtos e preços');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button
        onClick={handleSetup}
        disabled={isLoading}
      >
        {isLoading ? 'Criando produtos...' : 'Criar Produtos Stripe'}
      </Button>
    </div>
  );
}
