
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import { ProfileFormData } from "./types"

interface ContactFormProps {
  formData: ProfileFormData
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageUpload: (file: File) => void
}

export function ContactForm({ formData, isLoading, onInputChange, onImageUpload }: ContactFormProps) {
  return (
    <div className="grid gap-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
        <AvatarUpload 
          currentImage={formData.avatar}
          name={formData.name || ""}
          onImageUpload={onImageUpload}
        />
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            required
            className="w-full"
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onInputChange}
            required
            className="w-full"
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
