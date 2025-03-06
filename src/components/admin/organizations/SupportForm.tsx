
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SupportFormProps {
  onClose: () => void;
}

export function SupportForm({ onClose }: SupportFormProps) {
  const { toast } = useToast();
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Dados do suporte:", supportForm);
      
      toast({
        title: "Mensagem enviada!",
        description: "Retornaremos em breve.",
      });

      onClose();
      setSupportForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-0.5">
          Seu Nome <span>*</span>
        </Label>
        <Input
          id="name"
          value={supportForm.name}
          onChange={(e) => setSupportForm(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-0.5">
          Seu Email <span>*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={supportForm.email}
          onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center gap-0.5">
          Mensagem <span>*</span>
        </Label>
        <Textarea
          id="message"
          value={supportForm.message}
          onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
          required
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
}
