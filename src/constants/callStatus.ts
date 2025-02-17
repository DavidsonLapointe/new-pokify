
import { CheckCircle2, AlertCircle } from "lucide-react";
import { StatusMap } from "@/types/calls";

export const statusMap: StatusMap = {
  success: {
    label: "Processado",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
    tooltip: "Uploads que foram processados com sucesso pelo sistema"
  },
  failed: {
    label: "Erro",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    tooltip: "Uploads que falharam durante o processamento e precisam ser reprocessados"
  }
};
