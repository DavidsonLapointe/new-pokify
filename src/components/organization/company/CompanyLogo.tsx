
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
      <div className="space-y-1 mt-2">
        <p className="text-sm text-muted-foreground">
          Esta imagem será exibida no cabeçalho do sistema
        </p>
        <p className="text-sm text-muted-foreground">
          Tamanho recomendado: 180x90 pixels
        </p>
        <p className="text-sm text-muted-foreground">
          Para melhor visualização, utilize uma imagem com fundo transparente (PNG)
        </p>
      </div>
    </div>
  );
}
