
import { useState, useEffect } from "react";
import { Organization } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatOrganizationData } from "@/utils/organizationUtils";
import { toast } from "sonner";

interface OrganizationSelectorProps {
  onOrganizationChange: (organization: Organization | null) => void;
}

export const OrganizationSelector = ({ onOrganizationChange }: OrganizationSelectorProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        const formattedOrgs = data.map(org => formatOrganizationData(org));
        setOrganizations(formattedOrgs);
      } catch (error) {
        console.error("Erro ao carregar organizações:", error);
        toast.error("Erro ao carregar lista de organizações");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrganizationChange = async (orgId: string) => {
    try {
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
      const organization = formatOrganizationData({
        ...data,
        users: data.profiles || []
      });

      onOrganizationChange(organization);
    } catch (error) {
      console.error("Erro ao carregar detalhes da organização:", error);
      toast.error("Erro ao carregar detalhes da organização");
      onOrganizationChange(null);
    }
  };

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-medium mb-2">
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
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
