
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProfileFormData } from "./types";

interface PasswordFormProps {
  formData: ProfileFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordForm = ({ formData, isLoading, onInputChange }: PasswordFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Senha Atual
              <span className="text-xs text-gray-500 font-normal">(necessário para alterar a senha)</span>
            </Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={onInputChange}
              className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
              placeholder="Digite sua senha atual"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nova Senha
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={onInputChange}
                  className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={onInputChange}
                  className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
                  placeholder="Digite a nova senha novamente"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isLoading ? "Salvando..." : "Alterar Senha"}
        </Button>
      </div>
    </div>
  );
};
