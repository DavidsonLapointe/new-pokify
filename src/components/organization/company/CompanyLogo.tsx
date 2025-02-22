
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Organization } from "@/types/organization-types";

interface CompanyLogoProps {
  organization: Organization;
  onLogoUpload: (file: File) => void;
}

export function CompanyLogo({ organization, onLogoUpload }: CompanyLogoProps) {
  return (
    <div className="mb-6">
      <AvatarUpload
        currentImage={organization.logo}
        name={organization.name}
        onImageUpload={onLogoUpload}
        isLogo={true}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Esta imagem será exibida no cabeçalho do sistema
      </p>
    </div>
  );
}
