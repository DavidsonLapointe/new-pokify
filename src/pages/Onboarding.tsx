import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface OrganizationData {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  email_empresa: string;
  telefone_empresa: string;
  plano_id: string;
  status_empresa: string;
}

interface AdminData {
  id: string;
  name: string;
  email: string;
  tel: string;
}

interface PlanData {
  id: string;
  name: string;
  value: number;
  description: string;
  resources: string;
}

interface AddressData {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// Componente de indicador de progresso
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                index + 1 === currentStep 
                  ? "bg-primary text-white" 
                  : index + 1 < currentStep 
                    ? "bg-primary-100 text-primary border-2 border-primary" 
                    : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`text-xs mt-1 ${index + 1 === currentStep ? "text-primary font-medium" : "text-gray-500"}`}>
              {index === 0 ? "Empresa" : index === 1 ? "Endereço" : "Plano"}
            </span>
          </div>
          
          {index < totalSteps - 1 && (
            <div className={`h-[2px] flex-1 mx-2 ${
              index + 1 < currentStep ? "bg-primary" : "bg-gray-200"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Onboarding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const organizationId = searchParams.get("id");
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [addressData, setAddressData] = useState<AddressData>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: ""
  });
  
  // Form state
  const [formData, setFormData] = useState({
    // Empresa data
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    email_empresa: "",
    telefone_empresa: "",
    
    // Admin data
    admin_name: "",
    admin_email: "",
    admin_password: "",
    admin_confirm_password: "",
    
    // Address data
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: ""
  });
  
  // Fetch organization data by ID
  const fetchOrganizationData = async () => {
    if (!organizationId) {
      setError("ID da organização não fornecido");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Fetch organization data
      const { data: orgData, error: orgError } = await supabase
        .from("organization")
        .select("*")
        .eq("id", organizationId)
        .single();
      
      if (orgError) {
        throw new Error(`Erro ao buscar dados da organização: ${orgError.message}`);
      }
      
      if (!orgData) {
        throw new Error("Organização não encontrada");
      }
      
      setOrganizationData(orgData);
      
      // Fetch admin data (user from profiles with this organization_id)
      const { data: adminUserData, error: adminError } = await supabase
        .from("profiles")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("function", "admin")
        .single();
      
      if (adminError && adminError.code !== "PGRST116") {
        console.error("Erro ao buscar dados do administrador:", adminError);
      }
      
      if (adminUserData) {
        setAdminData(adminUserData);
      }
      
      // Fetch plan data
      if (orgData.plano_id) {
        const { data: planInfo, error: planError } = await supabase
          .from("planos")
          .select("*")
          .eq("id", orgData.plano_id)
          .single();
        
        if (planError) {
          console.error("Erro ao buscar dados do plano:", planError);
        } else {
          setPlanData(planInfo);
        }
      }
      
      // Initialize form data with fetched data
      setFormData((prevData) => ({
        ...prevData,
        cnpj: orgData.cnpj || "",
        razao_social: orgData.razao_social || "",
        nome_fantasia: orgData.nome_fantasia || "",
        email_empresa: orgData.email_empresa || "",
        telefone_empresa: orgData.telefone_empresa || "",
        admin_name: adminUserData?.name || "",
        admin_email: adminUserData?.email || "",
        admin_password: "",
        admin_confirm_password: "",
      }));
      
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrganizationData();
  }, [organizationId]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Handle CEP search
  const handleCepSearch = async () => {
    if (formData.cep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Digite um CEP válido com 8 dígitos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado",
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prevData) => ({
        ...prevData,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço",
        variant: "destructive",
      });
    }
  };
  
  // Validate password
  const validatePassword = () => {
    if (formData.admin_password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }
    
    if (formData.admin_password !== formData.admin_confirm_password) {
      return "As senhas não coincidem";
    }
    
    return null;
  };
  
  // Validate form data for current step
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (
        !formData.cnpj ||
        !formData.razao_social ||
        !formData.nome_fantasia ||
        !formData.email_empresa ||
        !formData.telefone_empresa ||
        !formData.admin_name ||
        !formData.admin_email
      ) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return false;
      }
      
      if (formData.admin_password || formData.admin_confirm_password) {
        const passwordError = validatePassword();
        if (passwordError) {
          toast({
            title: "Erro na senha",
            description: passwordError,
            variant: "destructive",
          });
          return false;
        }
      }
    } else if (currentStep === 2) {
      if (
        !formData.cep ||
        !formData.rua ||
        !formData.numero ||
        !formData.bairro ||
        !formData.cidade ||
        !formData.uf
      ) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  // Handle next step
  const handleNextStep = () => {
    // Avança para a próxima etapa sem validação obrigatória
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Apenas na submissão final fazemos a validação completa
    if (!validateCurrentStep()) return;
    
    setSaving(true);
    try {
      // Update organization data
      const { error: orgUpdateError } = await supabase
        .from("organization")
        .update({
          cnpj: formData.cnpj,
          razao_social: formData.razao_social,
          nome_fantasia: formData.nome_fantasia,
          email_empresa: formData.email_empresa,
          telefone_empresa: formData.telefone_empresa,
        })
        .eq("id", organizationId);
      
      if (orgUpdateError) {
        throw new Error(`Erro ao atualizar organização: ${orgUpdateError.message}`);
      }
      
      // Update admin user if exists, otherwise create
      if (adminData) {
        const updateData: any = {
          name: formData.admin_name,
          email: formData.admin_email,
        };
        
        // Only update password if provided
        if (formData.admin_password) {
          // For real implementation, you would handle password update through Auth API
          console.log("Password would be updated here");
        }
        
        const { error: adminUpdateError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", adminData.id);
        
        if (adminUpdateError) {
          throw new Error(`Erro ao atualizar administrador: ${adminUpdateError.message}`);
        }
      }
      
      // Save address data as a JSON field in organization
      const addressUpdate = {
        address: {
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
        }
      };
      
      const { error: addressUpdateError } = await supabase
        .from("organization")
        .update(addressUpdate)
        .eq("id", organizationId);
      
      if (addressUpdateError) {
        throw new Error(`Erro ao atualizar endereço: ${addressUpdateError.message}`);
      }
      
      toast({
        title: "Sucesso!",
        description: "Dados salvos com sucesso",
      });
      
      // Redirect to a success page or dashboard
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
      toast({
        title: "Erro ao salvar",
        description: err instanceof Error ? err.message : "Erro ao salvar dados",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razao_social">Razão Social</Label>
                  <Input
                    id="razao_social"
                    name="razao_social"
                    value={formData.razao_social}
                    onChange={handleInputChange}
                    placeholder="Razão Social da Empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                  <Input
                    id="nome_fantasia"
                    name="nome_fantasia"
                    value={formData.nome_fantasia}
                    onChange={handleInputChange}
                    placeholder="Nome Fantasia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_empresa">Email da Empresa</Label>
                  <Input
                    id="email_empresa"
                    name="email_empresa"
                    value={formData.email_empresa}
                    onChange={handleInputChange}
                    placeholder="email@empresa.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone_empresa">Telefone da Empresa</Label>
                  <Input
                    id="telefone_empresa"
                    name="telefone_empresa"
                    value={formData.telefone_empresa}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Dados do Administrador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin_name">Nome</Label>
                  <Input
                    id="admin_name"
                    name="admin_name"
                    value={formData.admin_name}
                    onChange={handleInputChange}
                    placeholder="Nome do Administrador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_email">Email</Label>
                  <Input
                    id="admin_email"
                    name="admin_email"
                    value={formData.admin_email}
                    onChange={handleInputChange}
                    placeholder="email@administrador.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_password">Senha</Label>
                  <Input
                    id="admin_password"
                    name="admin_password"
                    value={formData.admin_password}
                    onChange={handleInputChange}
                    placeholder="******"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_confirm_password">Confirmar Senha</Label>
                  <Input
                    id="admin_confirm_password"
                    name="admin_confirm_password"
                    value={formData.admin_confirm_password}
                    onChange={handleInputChange}
                    placeholder="******"
                    type="password"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                  />
                </div>
                <Button 
                  variant="outline"
                  onClick={handleCepSearch}
                  className="mb-0.5"
                >
                  Buscar
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  name="rua"
                  value={formData.rua}
                  onChange={handleInputChange}
                  placeholder="Nome da Rua"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  placeholder="Apto, Sala, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  placeholder="Nome do Bairro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Nome da Cidade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  name="uf"
                  value={formData.uf}
                  onChange={handleInputChange}
                  placeholder="UF"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Detalhes do Plano</h3>
            
            {planData ? (
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl">{planData.name}</CardTitle>
                  <CardDescription>
                    <span className="text-xl font-bold text-primary">
                      R$ {planData.value.toFixed(2)}
                    </span>
                    {" "}/ mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{planData.description}</p>
                    
                    {planData.resources && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Recursos Incluídos:</h4>
                        <ul className="space-y-1">
                          {planData.resources.split(',').map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Nenhum plano encontrado para esta organização
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
              <p className="text-sm text-amber-800">
                Ao finalizar o cadastro, você confirma os dados da empresa e concorda com os termos de uso do serviço.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Navigation buttons based on current step
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button 
            onClick={handleNextStep}
            className="flex items-center gap-2 ml-auto"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={saving}
            className="flex items-center gap-2 ml-auto"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Finalizar Cadastro
          </Button>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>Ocorreu um erro ao carregar os dados</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/auth")}>Voltar para o login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-8 px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Onboarding</CardTitle>
          <CardDescription>
            Complete as informações para finalizar o cadastro da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          
          {renderStepContent()}
          {renderNavButtons()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
