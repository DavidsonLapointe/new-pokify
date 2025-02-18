
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentImage?: string
  name: string
  onImageUpload: (file: File) => void
}

export function AvatarUpload({ currentImage, name, onImageUpload }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    onImageUpload(file)
  }

  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Foto de Perfil</Label>
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl} alt={name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button variant="outline" className="relative w-full" size="sm">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
            />
            <Upload className="w-4 h-4 mr-2" />
            Alterar foto
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, GIF ou PNG. Máximo 5MB.
          </p>
        </div>
      </div>
    </div>
  )
}
