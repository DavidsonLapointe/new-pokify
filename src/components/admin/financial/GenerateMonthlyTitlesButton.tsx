
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const GenerateMonthlyTitlesButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTitles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-monthly-titles', {
        body: {}
      });
      
      if (error) throw error;
      
      toast.success(`Títulos mensais gerados com sucesso: ${data.message}`);
    } catch (error) {
      console.error('Erro ao gerar títulos:', error);
      toast.error('Erro ao gerar títulos mensais');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateTitles}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      Gerar Títulos Mensais
    </Button>
  );
};
