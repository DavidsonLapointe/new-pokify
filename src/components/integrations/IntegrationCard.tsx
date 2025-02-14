
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Integration } from "@/types/integration";

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (integration: Integration) => void;
}

export const IntegrationCard = ({ integration, onToggle }: IntegrationCardProps) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="font-medium">{integration.name}</h3>
        <p className="text-sm text-muted-foreground">
          {integration.description}
        </p>
        {integration.isConnected && integration.lastSync && (
          <p className="text-xs text-muted-foreground">
            Última sincronização: {new Date(integration.lastSync).toLocaleString('pt-BR')}
          </p>
        )}
      </div>
      <Button
        variant={integration.isConnected ? "destructive" : "default"}
        onClick={() => onToggle(integration)}
      >
        {integration.isConnected ? "Desconectar" : "Conectar"}
      </Button>
    </div>
  </Card>
);
