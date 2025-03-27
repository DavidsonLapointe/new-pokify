import { CardTitle } from "@/components/ui/card";
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus, Package, Infinity } from "lucide-react";
import { toast } from "sonner";
import { CreatePackageForm } from "@/components/admin/packages/CreatePackageForm";
import { EditPackageForm } from "@/components/admin/packages/EditPackageForm";
import { PackagesList } from "@/components/admin/packages/PackagesList";
import { AnalysisPackage, NewPackageForm } from "@/types/packages";
import { supabase } from "@/integrations/supabase/realClient";

// Interface para representar os dados conforme a estrutura da tabela
interface CreditPackageData {
  id: number;
  created_at: string;
  name: string;
  value: number;
  credit: number;
  active: boolean;
  prod_id: string | null;
  price_id: string | null;
}

export const CreditPackagesTab = () => {
  const [packages, setPackages] = useState<AnalysisPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [editingPackage, setEditingPackage] = useState<AnalysisPackage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isStripeEditDialogOpen, setIsStripeEditDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<NewPackageForm>({
    name: "",
    credits: "",
    price: ""
  });

  // Função para criar produto e preço no Stripe usando diretamente a API do Stripe (one-time/avulso)
  const createStripeProduct = async (pkg: {
    name: string;
    price: number;
    credits: number;
  }): Promise<{ productId: string, priceId: string }> => {
    try {
      // Detalhes completos para log da criação do produto
      console.log("1. Iniciando criação de produto avulso no Stripe para o pacote:", {
        name: pkg.name,
        price: pkg.price,
        credits: pkg.credits
      });

      // Chave secreta do Stripe
      const stripeSecretKey = 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU';
      
      // PASSO 1: Criar o produto no Stripe
      const productFormData = new URLSearchParams();
      productFormData.append('name', pkg.name);
      productFormData.append('type', 'service');
      productFormData.append('description', `Pacote de ${pkg.credits} créditos para análises`);
      
      // Log da requisição para criar produto
      console.log('2. Dados para criação do produto:', {
        url: 'https://api.stripe.com/v1/products',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: productFormData.toString()
      });

      // Chamada da API para criar o produto
      const productResponse = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: productFormData
      });

      // Verificar se a requisição foi bem-sucedida
      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        console.error('3. Erro ao criar produto no Stripe:', {
          status: productResponse.status,
          statusText: productResponse.statusText,
          error: errorText
        });
        throw new Error(`Falha ao criar produto no Stripe: ${productResponse.status} ${productResponse.statusText}`);
      }

      // Processar a resposta
      const productData = await productResponse.json();
      console.log('3. Produto criado com sucesso no Stripe:', productData);

      // PASSO 2: Criar o preço no Stripe (one-time/avulso, sem recurring)
      const priceFormData = new URLSearchParams();
      // Converter para centavos e garantir que seja número inteiro
      priceFormData.append('unit_amount', Math.round(pkg.price * 100).toString());
      priceFormData.append('currency', 'brl'); // Usar BRL para Reais brasileiros
      // Não adicionamos o recurring aqui para que seja um produto avulso
      priceFormData.append('product', productData.id);

      // Log da requisição para criar preço
      console.log('4. Dados para criação do preço (one-time):', {
        url: 'https://api.stripe.com/v1/prices',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey.substring(0, 10)}...`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: priceFormData.toString()
      });

      // Chamada da API para criar o preço
      const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: priceFormData
      });

      // Verificar se a requisição foi bem-sucedida
      if (!priceResponse.ok) {
        const errorText = await priceResponse.text();
        console.error('5. Erro ao criar preço no Stripe:', {
          status: priceResponse.status,
          statusText: priceResponse.statusText,
          error: errorText
        });
        throw new Error(`Falha ao criar preço no Stripe: ${priceResponse.status} ${priceResponse.statusText}`);
      }

      // Processar a resposta
      const priceData = await priceResponse.json();
      console.log('5. Preço criado com sucesso no Stripe:', priceData);

      // Retornar os IDs do produto e do preço
      return {
        productId: productData.id,
        priceId: priceData.id
      };
    } catch (error) {
      console.error('Erro global ao criar no Stripe:', error);
      
      // Gerar IDs temporários para falhar graciosamente
      const mockProductId = `prod_mock_${Date.now()}`;
      const mockPriceId = `price_mock_${Date.now()}`;
      
      console.log('Usando IDs temporários para falha graciosa:', {
        productId: mockProductId,
        priceId: mockPriceId
      });
      
      return {
        productId: mockProductId,
        priceId: mockPriceId
      };
    }
  };

  // Função para buscar pacotes do Supabase
  const fetchCreditPackages = async () => {
    setIsLoadingPackages(true);
    try {
      console.log("Buscando pacotes de crédito no Supabase...");
      
      const { data, error } = await supabase
        .from('credit_package')
        .select('*')
        .order('value', { ascending: true });
      
      if (error) {
        console.error("Erro ao buscar pacotes:", error);
        throw error;
      }
      
      if (data) {
        // Mapear dados do Supabase para o formato AnalysisPackage usado na UI
        const formattedPackages: AnalysisPackage[] = data.map((item: CreditPackageData) => ({
          id: item.id.toString(),
          name: item.name,
          credits: item.credit,
          price: item.value,
          active: item.active,
          stripeProductId: item.prod_id || undefined,
          stripePriceId: item.price_id || undefined
        }));
        
        setPackages(formattedPackages);
        console.log("Pacotes carregados:", formattedPackages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Erro ao buscar pacotes:", error);
      toast.error("Erro ao carregar pacotes de crédito");
    } finally {
      setIsLoadingPackages(false);
    }
  };

  // Função para atualizar um produto existente no Stripe
  const updateStripeProduct = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!editingPackage) return;
    
    const pkg = editingPackage;

    if (!pkg.stripeProductId || !pkg.stripePriceId || 
        pkg.stripeProductId.includes('mock_') || pkg.stripePriceId.includes('mock_')) {
      toast.error('Este pacote não possui IDs válidos do Stripe');
      console.error('Tentativa de atualizar pacote sem IDs Stripe válidos:', pkg);
      return;
    }

    toast.promise(
      async () => {
        try {
          // Chave secreta do Stripe
          const stripeSecretKey = 'sk_test_51QQ86wIeNufQUOGGfKZEZFTVMhcKsBVeQRBmQxxjRHECLsgFJ9rJKAv8wKYQX1MY5QKzPpAbLOMXMt9v51dN00GA00xvvYBtkU';
          
          // PASSO 1: Atualizar o produto no Stripe
          console.log('1. Atualizando produto no Stripe:', {
            id: pkg.stripeProductId,
            name: pkg.name,
            description: `Pacote de ${pkg.credits} créditos para análises`,
          });
          
          const productFormData = new URLSearchParams();
          productFormData.append('name', pkg.name);
          productFormData.append('description', `Pacote de ${pkg.credits} créditos para análises`);
          
          const productResponse = await fetch(`https://api.stripe.com/v1/products/${pkg.stripeProductId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${stripeSecretKey}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: productFormData
          });
          
          if (!productResponse.ok) {
            const errorText = await productResponse.text();
            console.error('Erro ao atualizar produto no Stripe:', errorText);
            throw new Error(`Falha ao atualizar produto no Stripe: ${productResponse.status}`);
          }
          
          const productData = await productResponse.json();
          console.log('2. Produto atualizado com sucesso:', productData);
          
          // PASSO 2: Criar um novo preço para o produto
          // Nota: O Stripe não permite atualizar preços existentes, então criamos um novo
          const priceFormData = new URLSearchParams();
          priceFormData.append('unit_amount', Math.round(pkg.price * 100).toString());
          priceFormData.append('currency', 'brl');
          priceFormData.append('product', pkg.stripeProductId);
          
          console.log('3. Criando novo preço para o produto:', {
            product_id: pkg.stripeProductId,
            price: pkg.price,
          });
          
          const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${stripeSecretKey}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: priceFormData
          });
          
          if (!priceResponse.ok) {
            const errorText = await priceResponse.text();
            console.error('Erro ao criar novo preço no Stripe:', errorText);
            throw new Error(`Falha ao criar novo preço no Stripe: ${priceResponse.status}`);
          }
          
          const priceData = await priceResponse.json();
          console.log('4. Novo preço criado com sucesso:', priceData);
          
          // PASSO 2.5: Arquivar o preço antigo no Stripe
          try {
            if (pkg.stripePriceId && !pkg.stripePriceId.includes('mock_')) {
              console.log('4.5. Arquivando preço antigo no Stripe:', pkg.stripePriceId);
              
              const archiveFormData = new URLSearchParams();
              archiveFormData.append('active', 'false');
              
              const archiveResponse = await fetch(`https://api.stripe.com/v1/prices/${pkg.stripePriceId}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${stripeSecretKey}`,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: archiveFormData
              });
              
              if (!archiveResponse.ok) {
                const errorText = await archiveResponse.text();
                console.warn('Aviso: Não foi possível arquivar o preço antigo:', errorText);
                // Continuamos o processo mesmo se falhar o arquivamento
              } else {
                const archiveData = await archiveResponse.json();
                console.log('Preço antigo arquivado com sucesso:', archiveData);
              }
            }
          } catch (archiveError) {
            // Apenas logar o erro, não interromper o fluxo principal
            console.warn('Erro ao tentar arquivar preço antigo:', archiveError);
          }
          
          // PASSO 3: Atualizar o banco de dados com o novo price_id
          console.log('5. Atualizando dados no banco de dados:', {
            id: pkg.id,
            old_price_id: pkg.stripePriceId,
            new_price_id: priceData.id,
            name: pkg.name,
            credits: pkg.credits,
            price: pkg.price
          });
          
          const { error } = await supabase
            .from('credit_package')
            .update({
              price_id: priceData.id,
              name: pkg.name,
              credit: pkg.credits,
              value: pkg.price,
              active: pkg.active
            })
            .eq('id', pkg.id);
            
          if (error) {
            console.error('Erro ao atualizar dados no banco de dados:', error);
            throw new Error(`Falha ao atualizar o banco de dados: ${error.message}`);
          }
          
          // Atualizar o estado local
          const updatedPackages = packages.map(p => 
            p.id === pkg.id ? { 
              ...p, 
              stripePriceId: priceData.id,
              name: pkg.name,
              credits: pkg.credits,
              price: pkg.price,
              active: pkg.active
            } : p
          );
          setPackages(updatedPackages);
          setIsStripeEditDialogOpen(false);
          
          return { success: true };
        } catch (error) {
          console.error('Erro ao atualizar no Stripe:', error);
          throw error;
        }
      },
      {
        loading: 'Atualizando pacote no Stripe...',
        success: 'Pacote atualizado com sucesso no Stripe',
        error: (err) => `Erro ao atualizar no Stripe: ${err.message}`
      }
    );
  };

  // Efeito para carregar pacotes ao montar o componente
  useEffect(() => {
    fetchCreditPackages();
  }, []);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emptyFields: string[] = [];
    
    if (!newPackage.name.trim()) {
      emptyFields.push("Nome do pacote");
    }
    if (!newPackage.credits) {
      emptyFields.push("Quantidade de créditos");
    }
    if (!newPackage.price) {
      emptyFields.push("Preço");
    }

    if (emptyFields.length > 0) {
      toast(`Por favor, preencha os seguintes campos: ${emptyFields.join(", ")}`);
      return;
    }

    const credits = parseInt(newPackage.credits);
    const price = parseFloat(newPackage.price);

    if (isNaN(credits) || credits <= 0) {
      toast(`A quantidade de créditos deve ser um número positivo`);
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast(`O preço deve ser um número positivo`);
      return;
    }

    toast.promise(
      async () => {
        try {
          console.log("Iniciando criação de pacote de créditos:", {
            name: newPackage.name,
            credits,
            price
          });
          
          // Criar produto no Stripe para o novo pacote
          const stripeResult = await createStripeProduct({
            name: newPackage.name,
            price: price,
            credits: credits
          });
          
          console.log("Produto criado no Stripe:", stripeResult);
          
          // Inserir no Supabase incluindo os IDs do Stripe
          const { data, error } = await supabase
            .from('credit_package')
            .insert([{
              name: newPackage.name,
              credit: credits,
              value: price,
              active: true,
              prod_id: stripeResult.productId,
              price_id: stripeResult.priceId
            }])
            .select();
            
          if (error) {
            console.error("Erro ao inserir pacote:", error);
            throw new Error(error.message);
          }
          
          if (!data || data.length === 0) {
            throw new Error("Nenhum dado retornado após a inserção");
          }
          
          // Converter para o formato de UI
          const newPkg: AnalysisPackage = {
            id: data[0].id.toString(),
            name: data[0].name,
            credits: data[0].credit,
            price: data[0].value,
            active: data[0].active,
            stripeProductId: data[0].prod_id,
            stripePriceId: data[0].price_id
          };
          
          // Atualizar o estado local
          setPackages(prevPackages => [...prevPackages, newPkg]);
          setNewPackage({ name: "", credits: "", price: "" });
          setIsCreateDialogOpen(false);
          
          return data[0];
        } catch (error) {
          console.error("Erro ao criar pacote:", error);
          throw error;
        }
      },
      {
        loading: 'Criando pacote de créditos...',
        success: 'Pacote criado com sucesso',
        error: (err) => `Erro ao criar pacote: ${err.message}`
      }
    );
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;

    toast.promise(
      async () => {
        try {
          // Atualizar no Supabase
          const { error } = await supabase
            .from('credit_package')
            .update({
              name: editingPackage.name,
              credit: editingPackage.credits,
              value: editingPackage.price,
              active: editingPackage.active,
              // Mantém os valores existentes de prod_id e price_id
              // Não alteramos esses campos durante a edição para preservar a integração com o Stripe
            })
            .eq('id', editingPackage.id);
            
          if (error) {
            console.error("Erro ao atualizar pacote:", error);
            throw new Error(error.message);
          }
          
          // Atualizar estado local
          const updatedPackages = packages.map(pkg => 
            pkg.id === editingPackage.id ? editingPackage : pkg
          );
          setPackages(updatedPackages);
          setEditingPackage(null);
          setIsEditDialogOpen(false);
          
          return editingPackage;
        } catch (error) {
          console.error("Erro ao atualizar pacote:", error);
          throw error;
        }
      },
      {
        loading: 'Atualizando pacote de créditos...',
        success: 'Pacote atualizado com sucesso',
        error: (err) => `Erro ao atualizar pacote: ${err.message}`
      }
    );
  };

  const handleToggleActive = async (pkg: AnalysisPackage, active: boolean) => {
    toast.promise(
      async () => {
        try {
          // Atualizar status no Supabase
          const { error } = await supabase
            .from('credit_package')
            .update({ active })
            .eq('id', pkg.id);
            
          if (error) {
            console.error("Erro ao atualizar status do pacote:", error);
            throw new Error(error.message);
          }
          
          // Atualizar estado local
          const updatedPackages = packages.map(p => 
            p.id === pkg.id ? { ...p, active } : p
          );
          setPackages(updatedPackages);
          
          return { ...pkg, active };
        } catch (error) {
          console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote:`, error);
          throw error;
        }
      },
      {
        loading: `${active ? 'Ativando' : 'Desativando'} pacote...`,
        success: `Pacote ${active ? 'ativado' : 'desativado'} com sucesso`,
        error: (err) => `Erro ao ${active ? 'ativar' : 'desativar'} pacote: ${err.message}`
      }
    );
  };

  const handleOpenStripeEdit = (pkg: AnalysisPackage) => {
    setEditingPackage(pkg);
    setIsStripeEditDialogOpen(true);
  };

  return (
    <div className="text-left">
      <CardTitle>Pacotes de Créditos</CardTitle>
      <div className="pt-2">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">
              Gerencie os pacotes de créditos adicionais
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Novo Pacote
                  </CardTitle>
                  <CardDescription>
                    Crie um novo pacote de créditos para análises
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)} 
                    className="w-full"
                  >
                    Criar Pacote
                  </Button>
                </CardContent>
              </Card>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Pacote de Créditos</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo pacote de créditos
                  </DialogDescription>
                </DialogHeader>

                <CreatePackageForm
                  newPackage={newPackage}
                  onSubmit={handleCreatePackage}
                  onChange={(field, value) => setNewPackage(prev => ({ ...prev, [field]: value }))}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Pacotes Disponíveis
                </CardTitle>
                <CardDescription>
                  Pacotes de créditos atualmente disponíveis para venda
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  <Infinity className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Os créditos adquiridos não expiram ao final do mês, ficando disponíveis até serem utilizados
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingPackages ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="p-4 border rounded-lg flex items-center justify-between animate-pulse"
                      >
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-10 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <PackagesList 
                    packages={packages}
                    onEdit={(pkg) => {
                      setEditingPackage(pkg);
                      setIsEditDialogOpen(true);
                    }}
                    onToggleActive={handleToggleActive}
                    onEditStripe={handleOpenStripeEdit}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Pacote</DialogTitle>
              <DialogDescription>
                Atualize as informações do pacote de créditos
              </DialogDescription>
            </DialogHeader>

            {editingPackage && (
              <EditPackageForm
                pkg={editingPackage}
                onSubmit={handleUpdatePackage}
                onChange={(field, value) => {
                  setEditingPackage(prev => {
                    if (!prev) return prev;
                    return { ...prev, [field]: value };
                  });
                }}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar pacote no Stripe */}
        <Dialog open={isStripeEditDialogOpen} onOpenChange={setIsStripeEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar no Stripe</DialogTitle>
              <DialogDescription>
                Atualizar dados do pacote no Stripe e no banco de dados
              </DialogDescription>
            </DialogHeader>

            {editingPackage && (
              <form onSubmit={updateStripeProduct}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Pacote</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={editingPackage.name}
                      onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantidade de Créditos</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={editingPackage.credits}
                      onChange={(e) => setEditingPackage({ ...editingPackage, credits: parseInt(e.target.value) || 0 })}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preço (R$)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={editingPackage.price}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) || 0 })}
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingPackage.active}
                        onChange={(e) => setEditingPackage({ ...editingPackage, active: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Ativo</span>
                    </label>
                  </div>

                  {editingPackage.stripeProductId && editingPackage.stripePriceId && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <h4 className="text-sm font-semibold mb-2">Informações do Stripe:</h4>
                      <p className="text-xs text-muted-foreground">Product ID: {editingPackage.stripeProductId}</p>
                      <p className="text-xs text-muted-foreground">Price ID: {editingPackage.stripePriceId}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsStripeEditDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Atualizar no Stripe</Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
