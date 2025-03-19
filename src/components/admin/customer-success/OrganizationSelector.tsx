
import { useState, useEffect, useRef } from "react";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { formatOrganizationData } from "@/utils/organizationUtils";
import { toast } from "sonner";
import { mockCustomerSuccessOrganizations } from "@/mocks/customerSuccessMocks";
import { Badge } from "@/components/ui/badge";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { UserCheck, Building, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrganizationSelectorProps {
  onOrganizationChange: (organization: Organization | null) => void;
  searchTerm: string;
}

export const OrganizationSelector = ({ onOrganizationChange, searchTerm }: OrganizationSelectorProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedOrgs = data.map(org => formatOrganizationData(org));
          setOrganizations(formattedOrgs);
          setUseMockData(false);
        } else {
          // If no data from Supabase, use mock data
          console.log("Usando dados mockados para organizações na página de Customer Success");
          setOrganizations(mockCustomerSuccessOrganizations);
          setUseMockData(true);
        }
      } catch (error) {
        console.error("Erro ao carregar organizações:", error);
        
        // Fall back to mock data
        console.log("Usando dados mockados devido a erro na API");
        setOrganizations(mockCustomerSuccessOrganizations);
        setUseMockData(true);
        
        toast.warning("Usando dados de exemplo para demonstração");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrganizationClick = async (orgId: string) => {
    try {
      let selectedOrg: Organization | null = null;
      
      if (useMockData) {
        // Use mock data
        selectedOrg = mockCustomerSuccessOrganizations.find(org => org.id === orgId) || null;
      } else {
        // Use Supabase data
        const { data, error } = await supabase
          .from('organizations')
          .select(`
            *,
            profiles(*)
          `)
          .eq('id', orgId)
          .single();

        if (error) throw error;

        // Formatando os dados da organização com seus usuários
        selectedOrg = formatOrganizationData({
          ...data,
          users: data.profiles || []
        });
      }

      onOrganizationChange(selectedOrg);
    } catch (error) {
      console.error("Erro ao carregar detalhes da organização:", error);
      toast.error("Erro ao carregar detalhes da organização");
      onOrganizationChange(null);
    }
  };

  // Filter organizations based on searchTerm
  const filteredOrganizations = searchTerm && searchTerm.trim() !== ""
    ? organizations.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.cnpj && org.cnpj.includes(searchTerm)) ||
        (org.nomeFantasia && org.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
    
  if (loading) {
    return (
      <div className="relative w-full">
        <div className="animate-pulse space-y-1.5 overflow-hidden rounded-md border border-input p-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-9 bg-slate-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {searchTerm && searchTerm.trim() !== "" && (
        <div className="absolute z-10 w-full">
          <Command ref={commandRef} className="rounded-lg border shadow-md">
            <CommandList>
              {filteredOrganizations.length > 0 ? (
                <CommandGroup heading="Empresas">
                  {filteredOrganizations.map((org) => (
                    <CommandItem
                      key={org.id}
                      onSelect={() => handleOrganizationClick(org.id)}
                      className="flex items-center justify-between p-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{org.name}</div>
                          {org.nomeFantasia && (
                            <div className="text-xs text-muted-foreground">{org.nomeFantasia}</div>
                          )}
                        </div>
                      </div>
                      {org.status === "active" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : org.status === "pending" ? (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="py-6 text-center text-sm">
                  Nenhuma empresa encontrada com este termo
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
