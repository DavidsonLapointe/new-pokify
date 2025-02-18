
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { Prompt } from "@/types/prompt";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onView: (prompt: Prompt) => void;
}

export const PromptCard = ({ prompt, onEdit, onView }: PromptCardProps) => {
  return (
    <Card key={prompt.id} className="p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate pr-4">{prompt.name}</h3>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onView(prompt)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(prompt)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {prompt.description}
        </p>
      </div>
    </Card>
  );
};
