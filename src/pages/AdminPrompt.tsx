
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um prompt antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Aqui você pode implementar a lógica de envio do prompt
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      toast({
        title: "Sucesso",
        description: "Prompt processado com sucesso!",
      });
      setPrompt("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o prompt.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Prompt</h1>
          <p className="text-muted-foreground mt-1">
            Use inteligência artificial para gerar conteúdo
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Digite seu prompt aqui..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Enviar Prompt"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPrompt;
