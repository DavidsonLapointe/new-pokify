
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Organization } from "@/types";
import { useState } from "react";
import { Lock } from "lucide-react";

interface CompanyDataSectionProps {
  organization: Organization;
}

export function CompanyDataSection({ organization }: CompanyDataSectionProps) {
  const [name, setName] = useState(organization.name);
  const [fantasyName, setFantasyName] = useState(organization.nomeFantasia || "");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
        <h3 className="text-lg font-medium text-[#1A1F2C] flex items-center gap-0.5">
          Dados da Empresa <span>*</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F1F0FB] rounded-lg">
        <div>
          <FormLabel className="text-[#6E59A5]">Razão Social</FormLabel>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="bg-white border-[#E5DEFF]" 
          />
        </div>
        <div>
          <FormLabel className="text-[#6E59A5]">Nome Fantasia</FormLabel>
          <Input 
            value={fantasyName} 
            onChange={(e) => setFantasyName(e.target.value)} 
            className="bg-white border-[#E5DEFF]" 
          />
        </div>
        <div className="relative">
          <FormLabel className="text-[#6E59A5] flex items-center gap-1">
            CNPJ
            <Lock size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500 font-normal">(não editável)</span>
          </FormLabel>
          <Input 
            value={organization.cnpj} 
            readOnly 
            className="bg-gray-50 border-[#E5DEFF] cursor-not-allowed pr-10" 
          />
          <div className="absolute right-3 top-9">
            <Lock size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
