
import { SetupStatus } from "@/components/organization/modules/types";

// Functions for handling status-related operations

// Get the color style for a status badge
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case 'in_progress':
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case 'completed':
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Get the display text for a status
export const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return "Pendente";
    case 'in_progress':
      return "Em Andamento";
    case 'completed':
      return "Concluído";
    default:
      return status;
  }
};
