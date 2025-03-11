
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Organization } from "@/types/organization-types";

interface CompanyBasicInfoProps {
  organization: Organization;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyBasicInfo({ organization, onInputChange }: CompanyBasicInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Razão Social</Label>
        <Input
          id="name"
          name="name"
          value={organization.name}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
        <Input
          id="nomeFantasia"
          name="nomeFantasia"
          value={organization.nomeFantasia}
          onChange={onInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          id="cnpj"
          name="cnpj"
          value={organization.cnpj}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={organization.email}
          onChange={onInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={organization.phone}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
}
