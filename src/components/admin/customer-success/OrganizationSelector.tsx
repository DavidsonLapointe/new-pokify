
import { useState, useEffect } from "react";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { formatOrganizationData } from "@/utils/organizationUtils";
import { toast } from "sonner";
import { mockCustomerSuccessOrganizations } from "@/mocks/customerSuccessMocks";
import { Card } from "@/components/ui/card";

interface OrganizationSelectorProps {
  onOrganizationChange: (organization: Organization | null) => void;
  searchTerm: string;
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
      <div className="w-full space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {filteredOrganizations.length > 0 ? (
        <div className="space-y-2 mt-2">
          {filteredOrganizations.map((org) => (
            <Card 
              key={org.id}
              className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleOrganizationClick(org.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{org.name}</div>
                  {org.nomeFantasia && (
                    <div className="text-sm text-gray-500">{org.nomeFantasia}</div>
                  )}
                </div>
                {org.status === "pending" && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Pendente</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : searchTerm && searchTerm.trim() !== "" ? (
        <div className="text-center p-6 border-2 border-dashed rounded-lg mt-2">
          <p className="text-gray-500">Nenhuma empresa encontrada com este termo</p>
        </div>
      ) : null}
    </div>
  );
};
