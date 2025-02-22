
import { Organization } from "@/types/organization-types";
import { LogoUploader } from "./LogoUploader";
import { LogoInformation } from "./LogoInformation";

interface CompanyLogoProps {
  organization: Organization;
  onLogoUpload: (file: File) => void;
}

export function CompanyLogo({ organization, onLogoUpload }: CompanyLogoProps) {
  return (
    <div className="mb-6">
      <LogoUploader 
        organization={organization}
        onLogoUpload={onLogoUpload}
      />
      <LogoInformation />
    </div>
  );
}
