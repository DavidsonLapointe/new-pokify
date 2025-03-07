
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrganizationStatus } from "@/types/organization-types";

interface StatusBadgeProps {
  status: OrganizationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: OrganizationStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: OrganizationStatus) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
};
