
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { FolderTree } from "lucide-react";
import { PermissionCategoryCard } from "./components/PermissionCategoryCard";
import { getPermissionData } from "./utils/permission-utils";

interface PermissionsDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  organizationName?: string;
}

export const PermissionsDistributionModal = ({
  isOpen,
  onClose,
  users,
  organizationName,
}: PermissionsDistributionModalProps) => {
  // Filter only active users
  const activeUsers = users.filter(user => user.status === 'active');

  // Get permission data
  const permissionData = getPermissionData(activeUsers);

  // Get main categories (parent permissions without dots)
  const mainCategories = Object.keys(permissionData)
    .filter(key => !key.includes('.'))
    .sort((a, b) => permissionData[a].label.localeCompare(permissionData[b].label));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-primary/80" />
            Distribuição de Permissões
          </DialogTitle>
          <DialogDescription>
            {organizationName || "Empresa"} - Visualização de permissões por função
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 h-[calc(80vh-8rem)]">
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
      </DialogContent>
    </Dialog>
  );
};
