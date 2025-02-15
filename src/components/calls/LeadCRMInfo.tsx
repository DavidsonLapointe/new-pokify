
import { GitFork } from "lucide-react";
import { LeadCalls } from "./types";

interface LeadCRMInfoProps {
  successfulCalls: number;
  crmInfo?: LeadCalls['crmInfo'];
}

export const LeadCRMInfo = ({ successfulCalls, crmInfo }: LeadCRMInfoProps) => {
  if (successfulCalls > 0 && crmInfo) {
    return (
      <div className="flex items-center gap-1">
        <GitFork className="w-3 h-3 text-muted-foreground" />
        <span>
          {crmInfo.funnel}
          <span className="text-muted-foreground mx-1">→</span>
          {crmInfo.stage}
        </span>
      </div>
    );
  }

  return <span className="text-muted-foreground">-</span>;
};
