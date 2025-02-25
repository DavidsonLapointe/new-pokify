
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertsLimitsFormValues } from "./types";

const formSchema = z.object({
  creditAlertThreshold: z.coerce.number().min(1).max(100).int(),
  maxAlertFrequency: z.coerce.number().min(1).int(),
  maxAnalysisRetries: z.coerce.number().min(1).max(10).int(),
}) as z.ZodType<AlertsLimitsFormValues>;

export function useAlertsLimitsForm() {
  return useForm<AlertsLimitsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditAlertThreshold: 20,
      maxAlertFrequency: 24,
      maxAnalysisRetries: 3,
    },
  });
}
