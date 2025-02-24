
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Contract() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, [id]);

  const loadOrganization = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrganization(data);
    } catch (error: any) {
      console.error('Erro ao carregar organização:', error);
      toast.error("Erro ao carregar dados da empresa");
    }
  };

  const handleSignContract = async () => {
    if (!agreed) {
      toast.error("Você precisa concordar com os termos do contrato");
      return;
    }

    setLoading(true);

    try {
      // Atualiza o status do contrato
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          contract_signed_at: new Date().toISOString(),
          pending_reason: 'pro_rata_payment'
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Envia o email de confirmação
      const { error: emailError } = await supabase.functions.invoke('send-organization-emails', {
        body: {
          organizationId: id,
          type: 'payment',
          data: {
            paymentUrl: `${window.location.origin}/payment/${id}`,
            proRataAmount: 99.90 // Valor exemplo, idealmente seria calculado
          }
        }
      });

      if (emailError) throw emailError;

      toast.success("Contrato assinado com sucesso!");
      navigate("/confirm-registration", { 
        state: { organization } 
      });
    } catch (error: any) {
      console.error('Erro ao assinar contrato:', error);
      toast.error("Erro ao processar assinatura do contrato");
    } finally {
      setLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-primary mb-2">Leadly</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Contrato de Prestação de Serviços
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contrato de Adesão</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>1. Das Partes</h3>
            <p>
              <strong>CONTRATADA:</strong> Leadly Tecnologia LTDA., pessoa jurídica de direito privado...
            </p>
            <p>
              <strong>CONTRATANTE:</strong> {organization.name}, CNPJ {organization.cnpj}...
            </p>

            <h3>2. Do Objeto</h3>
            <p>
              O presente contrato tem por objeto a prestação de serviços de análise 
              de chamadas telefônicas através de inteligência artificial...
            </p>

            <h3>3. Das Obrigações</h3>
            <ul>
              <li>A CONTRATADA se compromete a...</li>
              <li>A CONTRATANTE se compromete a...</li>
            </ul>

            <h3>4. Dos Valores</h3>
            <p>
              Pelo serviço objeto deste contrato, a CONTRATANTE pagará à CONTRATADA 
              o valor mensal conforme o plano contratado...
            </p>

            {/* Adicione mais cláusulas conforme necessário */}
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e aceito os termos do contrato
              </label>
            </div>
            <Button 
              onClick={handleSignContract} 
              disabled={!agreed || loading}
              className="w-full"
            >
              {loading ? "Processando..." : "Assinar Contrato"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
