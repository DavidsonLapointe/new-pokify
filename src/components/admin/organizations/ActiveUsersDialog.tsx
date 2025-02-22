
import React from "react";
import { Organization } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActiveUsersDialogProps {
  organization: Organization | null;
  onClose: () => void;
}

export const ActiveUsersDialog: React.FC<ActiveUsersDialogProps> = ({
  organization,
  onClose,
}) => {
  if (!organization) return null;

  return (
    <Dialog open={!!organization} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usuários Ativos - {organization.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {organization.users
            .filter(user => user.status === "active")
            .map(user => (
              <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg border">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
