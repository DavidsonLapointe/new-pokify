import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrganizationStatus } from "@/types/organization-types";

interface StatusBadgeProps {
  status: OrganizationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: OrganizationStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-200 text-green-800 border border-green-400";
      case "Pending":
        return "bg-yellow-200 text-yellow-800 border border-yellow-400";
      case "Inactive":
        return "bg-red-200 text-red-800 border border-red-400";
      case "Suspended":
        return "bg-orange-200 text-orange-800 border border-orange-400";
      case "canceled":
        return "bg-gray-200 text-gray-800 border border-gray-400";
      default:
        return "bg-gray-200 text-gray-800 border border-gray-400";
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
      case "suspended":
        return "Suspenso";
      case "canceled":
        return "Cancelado";
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
