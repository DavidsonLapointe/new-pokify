
import { useEffect, useState } from "react";
import { PromptFormData } from "@/hooks/admin/prompts/usePromptForm";

interface UsePromptFormDialogProps {
  prompt: PromptFormData;
  onPromptChange: (prompt: PromptFormData) => void;
  open: boolean;
}

export const usePromptFormDialog = ({ prompt, onPromptChange, open }: UsePromptFormDialogProps) => {
  // Update prompt type and handle company_id accordingly
  const handleTypeChange = (value: string) => {
    onPromptChange({ 
      ...prompt, 
      type: value, 
      company_id: value === "custom" ? prompt.company_id : undefined 
    });
  };

  // Update company selection
  const handleCompanyChange = (value: string) => {
    onPromptChange({ ...prompt, company_id: value });
  };

  // Update module selection
  const handleModuleChange = (value: string) => {
    onPromptChange({ ...prompt, module: value });
  };

  // Update form fields
  const handleNameChange = (value: string) => {
    onPromptChange({ ...prompt, name: value });
  };

  const handleDescriptionChange = (value: string) => {
    onPromptChange({ ...prompt, description: value });
  };

  const handleContentChange = (value: string) => {
    onPromptChange({ ...prompt, content: value });
  };

  return {
    handleTypeChange,
    handleCompanyChange,
    handleModuleChange,
    handleNameChange,
    handleDescriptionChange,
    handleContentChange
  };
};
