
import { CheckCircle2, AlertCircle } from "lucide-react";
import { StatusMap } from "@/types/calls";

export const statusMap: StatusMap = {
  success: {
    label: "Processada",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
    tooltip: "Chamadas que foram processadas com sucesso pelo sistema"
  },
  failed: {
    label: "Erro",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    tooltip: "Chamadas que falharam durante o processamento e precisam ser reprocessadas"
  }
};
