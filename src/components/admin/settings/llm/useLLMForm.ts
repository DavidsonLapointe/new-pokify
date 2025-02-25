
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LLMFormValues } from "./types";

const formSchema = z.object({
  llmCreditThreshold: z.coerce.number().min(1).max(100),
  llmAlertFrequency: z.coerce.number().min(1),
  llmUsageCheckInterval: z.coerce.number().min(5),
}) as z.ZodType<LLMFormValues>;

export function useLLMForm() {
  return useForm<LLMFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      llmCreditThreshold: 15,
      llmAlertFrequency: 12,
      llmUsageCheckInterval: 30,
    },
  });
}
