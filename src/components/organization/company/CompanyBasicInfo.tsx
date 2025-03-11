
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Organization } from "@/types/organization-types";

interface CompanyBasicInfoProps {
  organization: Organization;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyBasicInfo({ organization, onInputChange }: CompanyBasicInfoProps) {
  const formatPhone = (value: string) => {
    if (!value) return '';
    
    // Remove formatação atual para trabalhar apenas com números
    value = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (DDD + número)
    value = value.slice(0, 11);
    
    // Se houver números, aplica a formatação
    if (value.length > 0) {
      // Formatar DDD
      if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value}`;
      }
      
      // Formatar número
      if (value.length > 10) {
        value = `(${value.slice(1, 3)}) ${value.slice(5, 10)}-${value.slice(10)}`;
      }
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name: 'phone',
        value
      }
    };
    
    onInputChange(event);
  };

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
          value={formatPhone(organization.phone)}
          onChange={handlePhoneChange}
        />
      </div>
    </div>
  );
}
