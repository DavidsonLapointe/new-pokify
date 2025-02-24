
import { SetupStripeProducts } from "@/components/admin/stripe/SetupStripeProducts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);

  const handleSetupCreditProducts = async () => {
    setIsLoadingCredits(true);
    try {
      console.log('Iniciando setup dos produtos de créditos...');
      
      const { data, error } = await supabase.functions.invoke('setup-stripe-products', {
        body: { type: 'credits' }
      });

      if (error) {
        throw error;
      }

      console.log('Produtos criados:', data);
      toast.success('Pacotes de créditos criados com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar pacotes de créditos');
    } finally {
      setIsLoadingCredits(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white py-12">
      <div className="container">
        <h1 className="text-4xl font-bold text-center mb-8">Leadly</h1>
        <div className="max-w-xl mx-auto space-y-4">
          <SetupStripeProducts />
          
          <div className="p-4">
            <Button
              onClick={handleSetupCreditProducts}
              disabled={isLoadingCredits}
              size="lg"
              variant="secondary"
              className="w-full"
            >
              {isLoadingCredits ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando pacotes de créditos...
                </>
              ) : (
                'Criar Pacotes de Créditos'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
