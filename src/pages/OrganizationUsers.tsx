
import { OrganizationLayout } from "@/components/OrganizationLayout";

const OrganizationUsers = () => {
  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários da sua organização
          </p>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
