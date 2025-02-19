
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const EmptyPromptState = () => {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-[#F1F0FB] flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-[#9b87f5]" />
        </div>
        <p className="text-muted-foreground">Nenhum prompt cadastrado ainda.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Clique no botão "Novo Prompt" para começar.
        </p>
      </div>
    </Card>
  );
};
