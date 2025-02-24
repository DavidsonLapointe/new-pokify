
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { setupStripeProducts } from '@/services/setupStripeProducts';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function SetupStripeProducts() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando setup dos produtos...');
      const result = await setupStripeProducts('plans'); // Especifica que são planos
      console.log('Resultado:', result);
      toast.success('Planos criados com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar planos. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button
        onClick={handleSetup}
        disabled={isLoading}
        size="lg"
        variant="default"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando planos...
          </>
        ) : (
          'Criar Planos Stripe'
        )}
      </Button>
    </div>
  );
}
