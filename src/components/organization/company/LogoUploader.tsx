
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Organization } from "@/types/organization-types";

interface LogoUploaderProps {
  organization: Organization;
  onLogoUpload: (file: File) => void;
}

export function LogoUploader({ organization, onLogoUpload }: LogoUploaderProps) {
  return (
    <AvatarUpload
      currentImage={organization.logo}
      name={organization.name}
      onImageUpload={onLogoUpload}
      isLogo={true}
    />
  );
}
