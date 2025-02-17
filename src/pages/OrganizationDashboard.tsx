
import OrganizationLayout from "@/components/OrganizationLayout";

const OrganizationDashboard = () => {
  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua organização
          </p>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
