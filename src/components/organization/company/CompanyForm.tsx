
import { Button } from "@/components/ui/button";
import { Organization } from "@/types/organization-types";
import { CompanyBasicInfo } from "./CompanyBasicInfo";
import { CompanyAddress } from "./CompanyAddress";
import { CompanyLogo } from "./CompanyLogo";

interface CompanyFormProps {
  organization: Organization;
  onLogoUpload: (file: File) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CompanyForm({ organization, onLogoUpload, onInputChange, onSubmit }: CompanyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <CompanyLogo 
          organization={organization}
          onLogoUpload={onLogoUpload}
        />
        <CompanyBasicInfo 
          organization={organization}
          onInputChange={onInputChange}
        />
      </div>

      <CompanyAddress 
        address={organization.address}
        onInputChange={onInputChange}
      />

      <div className="flex justify-end">
        <Button type="submit">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
