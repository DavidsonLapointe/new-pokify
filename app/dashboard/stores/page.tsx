'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Plus, Store, Loader2 } from 'lucide-react';
import { StoreList } from '@/components/stores/store-list';
import { StoreForm } from './store-form';
import { getStores } from '@/lib/supabase';
import { toast } from 'sonner';

interface Store {
  id: string;
  name: string;
  platform: string;
  url: string;
  products: number;
  orders: number;
  revenue: number;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Constantes para limites
  const maxStores = 5;
  const storesCount = stores.length;
  const canAddStore = storesCount < maxStores;
  
  // Buscar lojas do Supabase
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getStores();
      
      if (error) {
        console.error('Erro ao buscar lojas:', error);
        toast.error('Erro ao carregar suas lojas');
        return;
      }
      
      // Converter dados do Supabase para o formato esperado pelo componente
      const formattedStores = data?.map((store: any) => ({
        id: store.id,
        name: store.name,
        platform: store.platform,
        url: store.url || '',
        products: store.products_count || 0,
        orders: store.orders_count || 0,
        revenue: 0, // Valor padrão já que não temos essa informação no Supabase
      })) || [];
      
      setStores(formattedStores);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      toast.error('Erro ao carregar suas lojas');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar lojas ao montar o componente
  useEffect(() => {
    fetchStores();
  }, []);
  
  // Atualizar lojas ao fechar o modal de criação
  const handleStoreFormClose = () => {
    setIsCreateStoreOpen(false);
    fetchStores(); // Atualizar a lista após adicionar uma nova loja
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Suas Lojas</h1>
        <p className="text-muted-foreground">
          Gerencie suas lojas conectadas à plataforma Pokify
        </p>
      </div>
      
      {/* Contador de lojas e botão de criação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="space-y-1">
          <h3 className="font-medium">Limite de Lojas</h3>
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">{storesCount} de {maxStores} lojas utilizadas</span>
          </div>
          {!canAddStore ? (
            <p className="text-xs text-rose-600">Você atingiu o limite de lojas disponíveis</p>
          ) : (
            <p className="text-xs text-blue-600">Você ainda pode adicionar {maxStores - storesCount} {maxStores - storesCount === 1 ? 'loja' : 'lojas'}</p>
          )}
        </div>
        <Button 
          onClick={() => setIsCreateStoreOpen(true)}
          disabled={!canAddStore}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Loja
        </Button>
      </div>
      
      {/* Alerta de limite de lojas */}
      {!canAddStore && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limite de lojas atingido</AlertTitle>
          <AlertDescription>
            Você atingiu o limite de {maxStores} lojas do seu plano atual. 
            Para adicionar mais lojas, considere fazer upgrade do seu plano.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Lista de lojas */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Lojas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as suas lojas conectadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stores.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Você ainda não possui lojas cadastradas</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsCreateStoreOpen(true)}
                disabled={!canAddStore}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Loja
              </Button>
            </div>
          ) : (
            <StoreList stores={stores} />
          )}
        </CardContent>
      </Card>
      
      {/* Formulário de criação de loja */}
      <StoreForm 
        open={isCreateStoreOpen} 
        onClose={handleStoreFormClose} 
        storesCount={storesCount}
      />
    </div>
  );
}
