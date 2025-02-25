
import { UseFormReturn } from "react-hook-form";

export interface LLMFormValues {
  llmCreditThreshold: number;
  llmAlertFrequency: number;
  llmUsageCheckInterval: number;
}

export interface EnabledSettings {
  llmCreditThreshold: boolean;
  llmAlertFrequency: boolean;
  llmUsageCheckInterval: boolean;
}

export interface FieldProps {
  form: UseFormReturn<LLMFormValues>;
  isEditing: boolean;
  enabledSettings: EnabledSettings;
  onToggle: (setting: keyof EnabledSettings) => void;
}
