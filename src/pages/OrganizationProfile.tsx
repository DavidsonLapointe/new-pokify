
import OrganizationLayout from "@/components/OrganizationLayout";

const OrganizationProfile = () => {
  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Perfil da Organização</h1>
          <p className="text-muted-foreground">
            Gerencie as informações da sua organização
          </p>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationProfile;
