
import { Prompt } from "@/types/prompt";
import { PromptCard } from "@/components/admin/prompts/PromptCard";
import { EmptyPromptState } from "@/components/admin/prompts/EmptyPromptState";
import { Separator } from "@/components/ui/separator";
import { ModuleGroup } from "@/utils/admin/prompts/promptUtils";

interface PromptGroupsProps {
  promptGroups: ModuleGroup[];
  isLoading: boolean;
  onEdit: (prompt: Prompt) => void;
  onView: (prompt: Prompt) => void;
}

export const PromptGroups = ({ promptGroups, isLoading, onEdit, onView }: PromptGroupsProps) => {
  if (!isLoading && promptGroups.length === 0) {
    return <EmptyPromptState />;
  }

  return (
    <div className="space-y-6">
      {promptGroups.map((group) => (
        <div key={group.name} className="space-y-4">
          <div className="flex items-center gap-2 mt-6">
            <group.icon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium">{group.name}</h2>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
