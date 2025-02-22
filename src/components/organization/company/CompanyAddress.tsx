
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/types/organization-types";

interface CompanyAddressProps {
  address?: Address;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyAddress({ address, onInputChange }: CompanyAddressProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
      <h2 className="text-lg font-medium mb-4">Endereço</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input
            id="logradouro"
            name="logradouro"
            value={address?.logradouro || ""}
            onChange={onInputChange}
            placeholder="Rua, Avenida, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            name="numero"
            value={address?.numero || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            name="complemento"
            value={address?.complemento || ""}
            onChange={onInputChange}
            placeholder="Apto, Sala, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            name="bairro"
            value={address?.bairro || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            name="cep"
            value={address?.cep || ""}
            onChange={onInputChange}
            placeholder="00000-000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            name="cidade"
            value={address?.cidade || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Input
            id="estado"
            name="estado"
            value={address?.estado || ""}
            onChange={onInputChange}
            placeholder="UF"
          />
        </div>
      </div>
    </div>
  );
}
