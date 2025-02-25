
import { UseFormReturn } from "react-hook-form";

export interface AlertsLimitsFormValues {
  creditAlertThreshold: number;
  maxAlertFrequency: number;
  maxAnalysisRetries: number;
}

export interface EnabledSettings {
  creditAlertThreshold: boolean;
  maxAlertFrequency: boolean;
  maxAnalysisRetries: boolean;
}

export interface FieldProps {
  form: UseFormReturn<AlertsLimitsFormValues>;
  isEditing: boolean;
  enabledSettings: EnabledSettings;
  onToggle: (setting: keyof EnabledSettings) => void;
}
