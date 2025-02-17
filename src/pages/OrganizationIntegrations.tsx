
import { OrganizationLayout } from "@/components/OrganizationLayout";

const OrganizationIntegrations = () => {
  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Configure as integrações com outras ferramentas
          </p>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationIntegrations;
