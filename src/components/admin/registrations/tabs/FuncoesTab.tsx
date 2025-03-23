import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPermissionData } from "@/components/admin/customer-success/utils/permission-utils";
import { PermissionCategoryCard } from "@/components/admin/customer-success/components/PermissionCategoryCard";
import { mockLeadlyEmployees } from "@/mocks/userMocks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users } from "lucide-react";
import { UnusedPermissionsModal } from "@/components/admin/customer-success/UnusedPermissionsModal";

export const FuncoesTab = () => {
  const { user } = useUser();
  const [isUnusedPermissionsModalOpen, setIsUnusedPermissionsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add more employees to mockLeadlyEmployees for demo purposes
  const employees = [...mockLeadlyEmployees];
  
  // Add more mock permissions to showcase the feature
  for (let i = 0; i < employees.length; i++) {
    if (!employees[i].permissions) {
      employees[i].permissions = {};
    }
    
    // Assign random permissions for demonstration
    employees[i].permissions = {
      ...employees[i].permissions,
      dashboard: i % 3 === 0,
      "dashboard.analytics": i % 4 === 0,
      "dashboard.organizations": i % 5 === 0,
      "dashboard.financial": i % 6 === 0,
      settings: i % 2 === 0,
      "settings.alerts": i % 7 === 0,
      "settings.analysis": i % 8 === 0,
      "settings.retention": i % 9 === 0,
      "settings.llm": i % 10 === 0,
      "settings.system": i % 11 === 0,
      "settings.permissions": i % 12 === 0,
      "credit-packages": i % 3 === 0,
      "credit-packages.manage": i % 4 === 0,
      "credit-packages.sales": i % 5 === 0,
      financial: i % 2 === 0,
      "financial.invoices": i % 6 === 0,
      "financial.reports": i % 7 === 0,
      organizations: i % 3 === 0,
      "organizations.manage": i % 8 === 0,
      "organizations.support": i % 9 === 0,
      modules: i % 2 === 0,
      "modules.manage": i % 10 === 0,
      "modules.setups": i % 11 === 0,
      profile: true // Everyone has profile access
    };
  }

  // Filter active users
  const activeUsers = employees.filter(user => user.status === 'active');
  
  // Get permission data
  const permissionData = getPermissionData(activeUsers);

  // Get main categories (parent permissions without dots)
  const mainCategories = Object.keys(permissionData)
    .filter(key => !key.includes('.'))
    .sort((a, b) => permissionData[a].label.localeCompare(permissionData[b].label));

  // Count all unused permissions for the warning button
  const unusedPermissionsCount = Object.values(permissionData)
    .filter(data => data.count === 0)
    .length;

    // Create data structure for the modal
    const unusedPermissionsOrgs = [
      {
        id: "leadly1",
        name: "Leadly AI",
        adminName: "Admin Leadly",
        adminEmail: "admin@leadly.ai",
        adminPhone: "+5511999887766",
        unusedPermissions: Object.entries(permissionData)
          .filter(([_, data]) => data.count === 0)
          .map(([key, _]) => key)
      }
    ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-left">Funções sem Usuários</h2>
          <p className="text-muted-foreground text-left">
            Visualize a distribuição das funções e abas do sistema entre os usuários ativos da Leadly.
          </p>
        </div>
        
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : activeUsers.length === 0 ? (
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 text-amber-800 flex flex-col items-center justify-center gap-4">
          <Users className="h-12 w-12 text-amber-500" />
          <div className="text-center">
            <h3 className="font-medium text-lg">Nenhum usuário ativo encontrado</h3>
            <p className="text-sm mt-1">Adicione usuários ou ative os existentes para visualizar a distribuição de funções.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-6">
              {mainCategories.map(category => (
                <PermissionCategoryCard 
                  key={category} 
                  category={category} 
                  permissionData={permissionData} 
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <UnusedPermissionsModal
        isOpen={isUnusedPermissionsModalOpen}
        onOpenChange={setIsUnusedPermissionsModalOpen}
        unusedPermissionsOrgs={unusedPermissionsOrgs}
        isLoading={false}
      />
    </div>
  );
};
