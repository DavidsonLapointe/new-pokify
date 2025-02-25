
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { AdminProfileFormData } from "./useAdminProfileForm";
import { useUser } from "@/contexts/UserContext";

interface AdminContactFormProps {
  formData: AdminProfileFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (file: File) => void;
}

export function AdminContactForm({ 
  formData, 
  isLoading, 
  onInputChange, 
  onImageUpload 
}: AdminContactFormProps) {
  const { user } = useUser();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (value.length <= 11) {
      // Formata o número conforme vai digitando
      if (value.length > 2) {
        value = `(${value.slice(0, 2)})${value.slice(2)}`;
      }
      if (value.length > 7) {
        value = `${value.slice(0, 8)}-${value.slice(8)}`;
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
    }
  };

  return (
    <div className="grid gap-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
        <div className="text-left">
          <AvatarUpload 
            currentImage={formData.avatar}
            name={user?.name || ""}
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
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              maxLength={14}
              className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
              placeholder="(00) 0000-0000"
            />
          </div>
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
