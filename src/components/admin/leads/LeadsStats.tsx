
import { 
  Phone, 
  HelpCircle, 
  Mail, 
  BookOpen, 
  Check, 
  X,
  LucideIcon 
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

type StatusCount = {
  [key: string]: {
    count: number;
    icon: LucideIcon;
    color: string;
    title: string;
    tooltip: string;
  };
};

interface LeadsStatsProps {
  counts: {
    contactar: number;
    qualificacao: number;
    nutricao_mkt: number;
    email_onboarding: number;
    ganho: number;
    perda: number;
    total: number;
  };
}

export const LeadsStats = ({ counts }: LeadsStatsProps) => {
  const statusConfig: StatusCount = {
    contactar: {
      count: counts.contactar,
      icon: Phone,
      color: "text-blue-500",
      title: "Contactar",
      tooltip: "Leads que ainda precisam ser contactados pela equipe de vendas"
    },
    qualificacao: {
      count: counts.qualificacao,
      icon: HelpCircle,
      color: "text-yellow-500",
      title: "Qualificação",
      tooltip: "Leads em processo de qualificação para determinar o nível de interesse"
    },
    nutricao_mkt: {
      count: counts.nutricao_mkt,
      icon: BookOpen,
      color: "text-purple-500",
      title: "Nutrição Mkt",
      tooltip: "Leads recebendo conteúdo educacional para amadurecer o interesse no produto"
    },
    email_onboarding: {
      count: counts.email_onboarding,
      icon: Mail,
      color: "text-indigo-500",
      title: "Email Onboarding",
      tooltip: "Leads em processo de onboarding via email com informações sobre o produto"
    },
    ganho: {
      count: counts.ganho,
      icon: Check,
      color: "text-green-500",
      title: "Ganho",
      tooltip: "Leads convertidos em clientes"
    },
    perda: {
      count: counts.perda,
      icon: X,
      color: "text-red-500",
      title: "Perda",
      tooltip: "Leads que não avançaram no funil de vendas"
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {Object.entries(statusConfig).map(([status, config]) => (
        <StatCard
          key={status}
          title={config.title}
          value={config.count}
          icon={config.icon}
          color={config.color}
          tooltip={config.tooltip}
        />
      ))}
    </div>
  );
};
