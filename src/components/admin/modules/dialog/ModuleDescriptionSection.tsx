import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ModuleFormValues } from "../module-form-schema";

interface ModuleDescriptionSectionProps {
  form: UseFormReturn<ModuleFormValues>;
}

export const ModuleDescriptionSection: React.FC<ModuleDescriptionSectionProps> = ({ form }) => {
  const [benefitInput, setBenefitInput] = useState("");
  const [howItWorksInput, setHowItWorksInput] = useState("");

  // Convert benefits textarea value to array
  const getBenefitsArray = (): string[] => {
    const benefits = form.getValues("benefits");
    return benefits ? benefits.split("\n").filter(b => b.trim()) : [];
  };

  // Convert how it works textarea value to array
  const getHowItWorksArray = (): string[] => {
    const howItWorks = form.getValues("howItWorks");
    return howItWorks ? howItWorks.split("\n").filter(hw => hw.trim()) : [];
  };

  // Add a new benefit
  const handleAddBenefit = () => {
    if (!benefitInput.trim()) return;
    
    const currentBenefits = getBenefitsArray();
    const newBenefits = [...currentBenefits, benefitInput.trim()].join("\n");
    form.setValue("benefits", newBenefits, { shouldValidate: true });
    setBenefitInput("");
  };

  // Remove a benefit
  const handleRemoveBenefit = (index: number) => {
    const currentBenefits = getBenefitsArray();
    currentBenefits.splice(index, 1);
    form.setValue("benefits", currentBenefits.join("\n"), { shouldValidate: true });
  };

  // Add a new how it works step
  const handleAddHowItWorks = () => {
    if (!howItWorksInput.trim()) return;
    
    const currentHowItWorks = getHowItWorksArray();
    const newHowItWorks = [...currentHowItWorks, howItWorksInput.trim()].join("\n");
    form.setValue("howItWorks", newHowItWorks, { shouldValidate: true });
    setHowItWorksInput("");
  };

  // Remove a how it works step
  const handleRemoveHowItWorks = (index: number) => {
    const currentHowItWorks = getHowItWorksArray();
    currentHowItWorks.splice(index, 1);
    form.setValue("howItWorks", currentHowItWorks.join("\n"), { shouldValidate: true });
  };

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição curta</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: Atendimento inteligente com IA para seus clientes"
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição completa</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: O Chat AI Assistente é um módulo que utiliza inteligência artificial para automatizar e aprimorar o atendimento ao cliente."
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefícios</FormLabel>
            <div className="space-y-2">
              {/* List of current benefits */}
              <div className="space-y-2">
                {getBenefitsArray().map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <div className="flex-1">{benefit}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBenefit(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Input to add new benefit */}
              <div className="flex gap-2">
                <Input
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Digite um novo benefício"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddBenefit}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              
              {/* Hidden textarea for form value */}
              <Textarea 
                {...field} 
                className="hidden" 
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="howItWorks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Como Funciona</FormLabel>
            <div className="space-y-2">
              {/* List of current steps */}
              <div className="space-y-2">
                {getHowItWorksArray().map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <div className="flex-1">{step}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveHowItWorks(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Input to add new step */}
              <div className="flex gap-2">
                <Input
                  value={howItWorksInput}
                  onChange={(e) => setHowItWorksInput(e.target.value)}
                  placeholder="Digite um novo passo de como funciona"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHowItWorks();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddHowItWorks}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              
              {/* Hidden textarea for form value */}
              <Textarea 
                {...field} 
                className="hidden" 
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
