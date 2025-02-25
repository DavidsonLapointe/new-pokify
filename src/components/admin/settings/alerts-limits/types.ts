
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
