import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatOrganizationData } from "@/utils/organizationUtils";
import { LoaderCircle } from "lucide-react";
import { RemainingStepsCard } from "@/components/organization/setup/RemainingStepsCard";

interface ContractProps {
  paymentMode?: boolean;
}

export default function Contract({ paymentMode = false }: ContractProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);
  const [proRataValue, setProRataValue] = useState<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [notFoundReason, setNotFoundReason] = useState<string>("");
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [stepCompleted, setStepCompleted] = useState(false);
  
  // Track completion status of all steps
  const [contractSigned, setContractSigned] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, [id]);

  const loadOrganization = async () => {
    if (!id) {
      setNotFoundReason("ID não informado na URL");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Loading organization with ID:", id);
      
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) {
        setNotFoundReason("O ID fornecido não está no formato UUID válido");
        setLoading(false);
        return;
      }
      
      const { data, error, status } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id);
      
      setRawResponse({ data, error, status });
      
      if (error) {
        console.error("Error fetching organization:", error);
        setDebugInfo(`Error: ${error.message} | Code: ${error.code} | Details: ${error.details} | Status: ${status}`);
        throw error;
      }
      
      console.log("Raw response data:", data);
      
      if (!data || data.length === 0) {
        console.log("Organization not found with ID:", id);
        setNotFoundReason("A organização com o ID especificado não existe no banco de dados");
        setLoading(false);
        return;
      }
      
      const orgData = data[0];
      console.log("Organization data retrieved:", orgData);
      
      // Check status of each step
      setContractSigned(!!orgData.contract_signed_at);
      setPaymentCompleted(orgData.pending_reason !== 'pro_rata_payment' && 
                          orgData.pending_reason !== 'contract_signature');
      setRegistrationCompleted(orgData.status === 'active');
      
      if (paymentMode) {
        const { data: titleData, error: titleError } = await supabase
          .from('financial_titles')
          .select('*')
          .eq('organization_id', id)
          .eq('type', 'pro_rata')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (titleError) {
          console.error("Error fetching pro-rata title:", titleError);
        } else if (titleData) {
          console.log("Pro-rata title data:", titleData);
          setProRataValue(titleData.value ? parseFloat(titleData.value.toString()) : null);
        } else {
          console.log("No pro-rata title found");
        }
      }
      
      setOrganization(orgData);
    } catch (error: any) {
      console.error('Erro ao carregar organização:', error);
      setDebugInfo(`Erro carregando organização: ${error.message}`);
      toast.error("Erro ao carregar dados da empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async () => {
    if (!agreed) {
      toast.error("Você precisa concordar com os termos do contrato");
      return;
    }

    setProcessing(true);

    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          contract_signed_at: new Date().toISOString(),
          pending_reason: 'pro_rata_payment'
        })
        .eq('id', id);

      if (updateError) throw updateError;
      
      toast.success("Contrato assinado com sucesso!");
      setContractSigned(true);
      setStepCompleted(true);
      
      // Don't navigate automatically - let user choose next step
    } catch (error: any) {
      console.error('Erro ao assinar contrato:', error);
      toast.error("Erro ao processar assinatura do contrato");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          pending_reason: 'user_validation'
        })
        .eq('id', id);

      if (updateError) {
        console.error('Erro ao atualizar status da organização:', updateError);
        throw updateError;
      }

      toast.success("Pagamento processado com sucesso!");
      setPaymentCompleted(true);
      setStepCompleted(true);
      
      // Don't navigate automatically - let user choose next step
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
        <div className="text-center">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Carregando...</h2>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Empresa não encontrada</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível encontrar os dados da empresa solicitada.
            {notFoundReason && <span className="block mt-2 text-sm">{notFoundReason}</span>}
          </p>
          {debugInfo && (
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-left overflow-auto">
              <pre>{debugInfo}</pre>
              <p className="mt-2">ID buscado: {id}</p>
            </div>
          )}
          {rawResponse && (
            <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-left overflow-auto">
              <p className="font-bold">Resposta bruta da API:</p>
              <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
            </div>
          )}
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar para a página inicial
          </Button>
          {id && (
            <Button 
              onClick={() => loadOrganization()} 
              variant="outline"
              className="mt-2 ml-2"
            >
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // If a step was just completed, show the remaining steps card
  if (stepCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-primary mb-2">Leadly</h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              {paymentMode ? "Pagamento Concluído" : "Contrato Assinado"}
            </h2>
            <p className="text-gray-600 mt-2">
              {paymentMode 
                ? "Seu pagamento foi processado com sucesso!" 
                : "Seu contrato foi assinado com sucesso!"}
            </p>
          </div>
          
          <RemainingStepsCard 
            organizationId={id || ""}
            contractSigned={contractSigned}
            paymentCompleted={paymentCompleted}
            registrationCompleted={registrationCompleted}
            hideHomeButton={true}
          />
        </div>
      </div>
    );
  }

  if (paymentMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-primary mb-2">Leadly</h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Pagamento Pro Rata
            </h2>
          </div>

          {/* Show remaining steps if any step is already completed */}
          {(contractSigned || registrationCompleted) && (
            <RemainingStepsCard 
              organizationId={id || ""}
              contractSigned={contractSigned}
              paymentCompleted={paymentCompleted}
              registrationCompleted={registrationCompleted}
              hideHomeButton={true}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Finalizar Cadastro - Pagamento Pro Rata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#F1F0FB] rounded-lg">
                <h3 className="font-medium text-lg mb-2">Informações da Empresa</h3>
                <p><strong>Razão Social:</strong> {organization.name}</p>
                <p><strong>Nome Fantasia:</strong> {organization.nome_fantasia || 'N/A'}</p>
                <p><strong>CNPJ:</strong> {organization.cnpj}</p>
                <p><strong>Plano:</strong> {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}</p>
              </div>

              <div className="p-4 bg-[#F1F0FB] rounded-lg">
                <h3 className="font-medium text-lg mb-2">Detalhes do Pagamento</h3>
                <p className="mb-2">Valor pro rata: <strong>R$ {proRataValue?.toFixed(2) || '0.00'}</strong></p>
                <p className="text-sm text-gray-600">
                  Este é um pagamento único proporcional referente ao período restante do mês atual. 
                  A partir do próximo mês, será cobrado o valor integral do plano contratado.
                </p>
              </div>

              <div className="p-4 bg-[#F1F0FB] rounded-lg">
                <h3 className="font-medium text-lg mb-2">Formas de Pagamento</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Selecione uma forma de pagamento:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="card" checked />
                    <label htmlFor="card" className="text-sm font-medium">Cartão de Crédito</label>
                  </div>
                  <div className="border rounded p-3 mt-2">
                    <p className="text-center text-gray-500">Formulário de cartão seria exibido aqui</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePayment} 
                disabled={processing}
                className="w-full"
              >
                {processing ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  `Pagar R$ ${proRataValue?.toFixed(2) || '0.00'}`
                )}
              </Button>
            </CardFooter>
          </Card>
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

        {/* Show remaining steps if any step is already completed */}
        {(paymentCompleted || registrationCompleted) && (
          <RemainingStepsCard 
            organizationId={id || ""}
            contractSigned={contractSigned}
            paymentCompleted={paymentCompleted}
            registrationCompleted={registrationCompleted}
            hideHomeButton={true}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contrato de Adesão</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="p-4 bg-[#F1F0FB] rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-1">Informações da Empresa</h3>
              <p><strong>Razão Social:</strong> {organization.name}</p>
              <p><strong>Nome Fantasia:</strong> {organization.nome_fantasia || 'N/A'}</p>
              <p><strong>CNPJ:</strong> {organization.cnpj}</p>
              <p><strong>Plano:</strong> {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}</p>
            </div>

            <h3 className="text-lg font-semibold">1. Das Partes</h3>
            <p>
              <strong>CONTRATADA:</strong> Leadly Tecnologia LTDA., pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº 00.000.000/0001-00, com sede na Cidade de São Paulo, Estado de São Paulo, doravante denominada simplesmente LEADLY.
            </p>
            <p>
              <strong>CONTRATANTE:</strong> {organization.name}, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº {organization.cnpj}, com sede conforme cadastro realizado no sistema, neste ato representada por seu administrador, Sr(a). {organization.admin_name}, doravante denominada simplesmente CONTRATANTE.
            </p>

            <h3 className="text-lg font-semibold">2. Do Objeto</h3>
            <p>
              O presente contrato tem por objeto a prestação de serviços de análise 
              de chamadas telefônicas através de inteligência artificial, conforme plano {organization.plan} contratado 
              pela CONTRATANTE, que permitirá a análise, categorização e extração de insights de chamadas 
              telefônicas realizadas pela equipe comercial da CONTRATANTE.
            </p>

            <h3 className="text-lg font-semibold">3. Das Obrigações</h3>
            <p><strong>3.1 A CONTRATADA se compromete a:</strong></p>
            <ul>
              <li>Disponibilizar a plataforma Leadly para análise de chamadas conforme o plano contratado;</li>
              <li>Garantir a segurança e confidencialidade dos dados fornecidos pela CONTRATANTE;</li>
              <li>Fornecer suporte técnico em horário comercial;</li>
              <li>Manter a plataforma em funcionamento com disponibilidade mínima de 99% ao mês.</li>
            </ul>
            
            <p><strong>3.2 A CONTRATANTE se compromete a:</strong></p>
            <ul>
              <li>Utilizar a plataforma de acordo com as leis aplicáveis;</li>
              <li>Pagar pontualmente os valores acordados;</li>
              <li>Obter consentimento adequado para gravação e análise de chamadas;</li>
              <li>Não compartilhar credenciais de acesso com terceiros não autorizados.</li>
            </ul>

            <h3 className="text-lg font-semibold">4. Dos Valores</h3>
            <p>
              Pelo serviço objeto deste contrato, a CONTRATANTE pagará à CONTRATADA 
              o valor mensal conforme o plano contratado, sendo o primeiro pagamento proporcional (pro rata) 
              aos dias restantes do mês corrente. Os pagamentos subsequentes serão realizados 
              mensalmente, sempre no dia 10 de cada mês.
            </p>

            <h3 className="text-lg font-semibold">5. Da Vigência</h3>
            <p>
              O presente contrato tem vigência inicial de 12 (doze) meses, renovável automaticamente 
              por períodos iguais e sucessivos, salvo manifestação expressa em contrário por 
              qualquer das partes, com antecedência mínima de 30 (trinta) dias.
            </p>

            <h3 className="text-lg font-semibold">6. Da Rescisão</h3>
            <p>
              O presente contrato poderá ser rescindido:
            </p>
            <ul>
              <li>Por comum acordo entre as partes;</li>
              <li>Por iniciativa de qualquer das partes, mediante aviso prévio de 30 dias;</li>
              <li>Por descumprimento de qualquer cláusula contratual.</li>
            </ul>

            <h3 className="text-lg font-semibold">7. Das Disposições Gerais</h3>
            <p>
              As partes elegem o foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas 
              ou controvérsias oriundas do presente contrato, com renúncia expressa a qualquer outro, 
              por mais privilegiado que seja.
            </p>
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
              disabled={!agreed || processing}
              className="w-full"
            >
              {processing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Assinar Contrato"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
