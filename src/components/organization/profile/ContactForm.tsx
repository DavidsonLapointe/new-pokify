
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import { ProfileFormData } from "./types"
import { useUser } from "@/contexts/UserContext"
import { useEffect, useRef } from "react"

interface ContactFormProps {
  formData: ProfileFormData
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageUpload: (file: File) => void
}

export function ContactForm({ formData, isLoading, onInputChange, onImageUpload }: ContactFormProps) {
  const { user } = useUser();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (user && isFirstRender.current) {
      isFirstRender.current = false;
      
      // Simula o evento de mudança para atualizar os campos
      onInputChange({
        target: { name: 'email', value: user.email }
      } as React.ChangeEvent<HTMLInputElement>);
      
      onInputChange({
        target: { name: 'phone', value: user.phone || '' }
      } as React.ChangeEvent<HTMLInputElement>);

      onInputChange({
        target: { name: 'name', value: user.name }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [user, onInputChange]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove formatação atual para trabalhar apenas com números
    value = value.replace(/\D/g, '');
    
    // Se houver números, aplica a formatação
    if (value.length > 0) {
      if (value.length <= 11) {
        let formattedValue = '';
        
        if (value.length > 2) {
          formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
          formattedValue = value;
        }
        
        if (value.length > 7) {
          formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
        
        value = formattedValue;
      }
    }
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name: 'phone',
        value
      }
    };
    
    onInputChange(event);
  };

  return (
    <div className="grid gap-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
        <div className="text-left">
          <AvatarUpload 
            currentImage={formData.avatar}
            name={formData.name || ""}
            onImageUpload={onImageUpload}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Email
            <span className="text-xs text-gray-500 font-normal">(principal)</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            required
            className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
            placeholder="seu@email.com"
          />
          <p className="text-xs text-gray-500 text-left pl-3">
            Este é o email utilizado para acessar o sistema
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
              Telefone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              maxLength={15}
              className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
