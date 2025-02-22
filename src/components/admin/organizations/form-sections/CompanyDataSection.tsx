
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Organization } from "@/types";

interface CompanyDataSectionProps {
  organization: Organization;
}

export function CompanyDataSection({ organization }: CompanyDataSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
        <h3 className="text-lg font-medium text-[#1A1F2C]">Dados da Empresa</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F1F0FB] rounded-lg">
        <div>
          <FormLabel className="text-[#6E59A5]">Razão Social</FormLabel>
          <Input value={organization.name} readOnly className="bg-white border-[#E5DEFF]" />
        </div>
        <div>
          <FormLabel className="text-[#6E59A5]">Nome Fantasia</FormLabel>
          <Input value={organization.nomeFantasia} readOnly className="bg-white border-[#E5DEFF]" />
        </div>
        <div>
          <FormLabel className="text-[#6E59A5]">CNPJ</FormLabel>
          <Input value={organization.cnpj} readOnly className="bg-white border-[#E5DEFF]" />
        </div>
      </div>
    </div>
  );
}
