
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ObjectionDetailProps {
  objection: string;
  count: number;
  previousCount: number;
  examples: string[] | undefined;
}

export const ObjectionDetails = ({ objection, count, previousCount, examples = [] }: ObjectionDetailProps) => {
  const percentageChange = previousCount > 0 
    ? Math.round(((count - previousCount) / previousCount) * 100) 
    : 0;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-lg">{objection}</h4>
          <p className="text-muted-foreground">
            {count} ocorrências este mês
          </p>
        </div>
        <Badge variant={percentageChange > 0 ? "destructive" : "default"} className="ml-2">
          {percentageChange > 0 ? "+" : ""}{percentageChange}% vs mês anterior
        </Badge>
      </div>
      <div>
        <h5 className="font-medium mb-2">Exemplos detectados:</h5>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {examples && examples.map((example, index) => (
            <li key={index} className="bg-muted p-2 rounded-md">
              "{example}"
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
