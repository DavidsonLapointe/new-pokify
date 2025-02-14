
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { StatusMap } from "@/types/calls";

export const statusMap: StatusMap = {
  processed: {
    label: "Processada",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  failed: {
    label: "Erro",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};
