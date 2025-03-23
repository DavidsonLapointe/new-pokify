
import { Prompt } from "@/types/prompt";
import { EmptyPromptState } from "@/components/admin/prompts/EmptyPromptState";
import { ModuleGroup } from "@/utils/admin/prompts/promptUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PromptsTable } from "@/components/admin/prompts/PromptsTable";

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
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-4">
        {promptGroups.map((group) => (
          <AccordionItem key={group.name} value={group.name} className="border rounded-md bg-card overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <group.icon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">{group.name}</h2>
                <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {group.prompts.length} {group.prompts.length === 1 ? 'prompt' : 'prompts'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0">
              <PromptsTable prompts={group.prompts} onEdit={onEdit} onView={onView} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
