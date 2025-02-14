
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Users, Phone, Database, ArrowUpRight } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats] = useState({
    organizations: 24,
    activeCalls: 8,
    leadsProcessed: 156,
  });

  const StatCard = ({
    title,
    value,
    icon: Icon,
  }: {
    title: string;
    value: number;
    icon: any;
  }) => (
    <Card className="p-6 glass-card hover-shadow subtle-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
    </Card>
  );

  const QuickAction = ({
    title,
    description,
    onClick,
  }: {
    title: string;
    description: string;
    onClick: () => void;
  }) => (
    <Card className="p-6 glass-card hover-shadow subtle-border group cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your platform's performance and key metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Organizations"
            value={stats.organizations}
            icon={Users}
          />
          <StatCard
            title="Active Calls"
            value={stats.activeCalls}
            icon={Phone}
          />
          <StatCard
            title="Leads Processed"
            value={stats.leadsProcessed}
            icon={Database}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Add Organization"
              description="Register a new organization to the platform"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "This feature will be available soon.",
                });
              }}
            />
            <QuickAction
              title="Configure Integration"
              description="Set up CRM and call service integrations"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "This feature will be available soon.",
                });
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
