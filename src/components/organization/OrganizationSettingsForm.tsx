
import { useState } from "react";
import { Organization, Address } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface OrganizationSettingsFormProps {
  organization: Organization;
  address: Address;
  onOrganizationUpdate: (organization: Organization) => void;
  onAddressUpdate: (address: Address) => void;
}

export const OrganizationSettingsForm = ({
  organization,
  address,
  onOrganizationUpdate,
  onAddressUpdate,
}: OrganizationSettingsFormProps) => {
  const [orgData, setOrgData] = useState(organization);
  const [addressData, setAddressData] = useState(address);

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    onOrganizationUpdate(orgData);
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressUpdate(addressData);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmitOrganization}>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  name="name"
                  value={orgData.name}
                  onChange={handleOrganizationChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  name="nomeFantasia"
                  value={orgData.nomeFantasia}
                  onChange={handleOrganizationChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={orgData.cnpj}
                  onChange={handleOrganizationChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={orgData.email}
                  onChange={handleOrganizationChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={orgData.phone}
                  onChange={handleOrganizationChange}
                />
              </div>
            </div>
            <Button type="submit">Salvar Dados da Empresa</Button>
          </CardContent>
        </Card>
      </form>

      <Separator />

      <form onSubmit={handleSubmitAddress}>
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  name="logradouro"
                  value={addressData.logradouro}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={addressData.numero}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={addressData.complemento}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={addressData.bairro}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={addressData.cidade}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  value={addressData.estado}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  name="cep"
                  value={addressData.cep}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            <Button type="submit">Salvar Endereço</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
