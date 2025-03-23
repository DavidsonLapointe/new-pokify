
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface OrganizationResult {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
}

export function GenerateMonthlyTitlesModal({ 
  open, 
  onOpenChange 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OrganizationResult[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleGenerateAllTitles = async () => {
    try {
      setIsLoadingAll(true);
      const { data, error } = await supabase.functions.invoke('create-monthly-titles', {
        body: { 
          generateAll: true,
          useCurrentDay: true 
        }
      });
      
      if (error) throw error;
      
      toast.success(`Títulos mensais gerados com sucesso: ${data.message}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao gerar títulos:', error);
      toast.error('Erro ao gerar títulos mensais');
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleSearchOrganization = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchResults([]);
      
      // Buscar organização por nome ou CNPJ
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, cnpj, plan')
        .or(`name.ilike.%${searchQuery}%,cnpj.ilike.%${searchQuery}%`)
        .limit(5);
        
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Erro ao buscar organização:', error);
      toast.error('Erro ao buscar organização');
    } finally {
      setIsSearching(false);
    }
  };

  const handleOrganizationSelect = (org: OrganizationResult) => {
    setSelectedOrganization(org);
    setSearchResults([]);
  };

  const handleGenerateSingleTitle = async () => {
    if (!selectedOrganization) {
      toast.error('Selecione uma organização primeiro');
      return;
    }
    
    try {
      setIsLoadingSingle(true);
      const { data, error } = await supabase.functions.invoke('create-monthly-titles', {
        body: { 
          organizationId: selectedOrganization.id,
          useCurrentDay: true
        }
      });
      
      if (error) throw error;
      
      toast.success(`Título mensal gerado com sucesso para ${selectedOrganization.name}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao gerar título:', error);
      toast.error('Erro ao gerar título mensal');
    } finally {
      setIsLoadingSingle(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gerar Títulos Mensais</DialogTitle>
          <DialogDescription>
            Escolha se deseja gerar títulos para todas as organizações ou para uma organização específica.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Todas as Organizações</TabsTrigger>
            <TabsTrigger value="single">Organização Específica</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="py-4">
            <p className="text-sm text-muted-foreground mb-6">
              Esta opção irá gerar títulos mensais para todas as organizações com assinaturas ativas
              que ainda não possuem um título mensal para o mês atual.
            </p>
            <DialogFooter>
              <Button 
                onClick={handleGenerateAllTitles} 
                disabled={isLoadingAll}
                className="w-full"
                variant="default"
              >
                {isLoadingAll && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Gerar Títulos para Todas as Organizações
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="single" className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-organization">Buscar organização (Razão Social ou CNPJ)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search-organization"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por razão social ou CNPJ"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchOrganization();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSearchOrganization} 
                    disabled={isSearching || !searchQuery.trim()}
                    type="button"
                    variant="secondary"
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {searchResults.length > 0 && (
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {searchResults.map((org) => (
                      <li 
                        key={org.id}
                        className="p-2 hover:bg-secondary rounded-sm cursor-pointer text-sm"
                        onClick={() => handleOrganizationSelect(org)}
                      >
                        <div className="font-medium">{org.name}</div>
                        <div className="text-xs text-muted-foreground">CNPJ: {org.cnpj}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedOrganization && (
                <div className="p-3 border rounded-md bg-secondary/30">
                  <h4 className="text-sm font-medium">Organização Selecionada</h4>
                  <p className="text-sm">{selectedOrganization.name}</p>
                  <p className="text-xs text-muted-foreground">CNPJ: {selectedOrganization.cnpj}</p>
                  <p className="text-xs text-muted-foreground">Plano: {selectedOrganization.plan}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  onClick={handleGenerateSingleTitle} 
                  disabled={isLoadingSingle || !selectedOrganization}
                  className="w-full"
                  variant="default"
                >
                  {isLoadingSingle && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Gerar Título para Organização Selecionada
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
