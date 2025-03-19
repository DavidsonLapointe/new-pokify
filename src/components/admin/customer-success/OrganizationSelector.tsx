
import { useState, useEffect } from "react";
import { Organization } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatOrganizationData } from "@/utils/organizationUtils";
import { toast } from "sonner";
import { mockCustomerSuccessOrganizations } from "@/mocks/customerSuccessMocks";

interface OrganizationSelectorProps {
  onOrganizationChange: (organization: Organization | null) => void;
  searchTerm?: string;
}

export const OrganizationSelector = ({ onOrganizationChange, searchTerm }: OrganizationSelectorProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

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

  const handleOrganizationChange = async (orgId: string) => {
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
  const filteredOrganizations = searchTerm 
    ? organizations.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.cnpj && org.cnpj.includes(searchTerm)) ||
        (org.fantasyName && org.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : organizations;

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-medium mb-2 text-left">
        Selecione uma empresa para analisar
      </label>
      <Select 
        onValueChange={handleOrganizationChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {filteredOrganizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
              {org.status === "pending" && <span className="ml-2 text-xs text-amber-500"> (Pendente)</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
