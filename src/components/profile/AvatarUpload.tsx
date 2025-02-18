
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Camera, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentImage?: string
  name: string
  onImageUpload: (file: File) => void
}

export function AvatarUpload({ currentImage, name, onImageUpload }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    validateAndUploadFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    if (!file) return

    validateAndUploadFile(file)
  }

  const validateAndUploadFile = (file: File) => {
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

  const handleRemoveImage = () => {
    setPreviewUrl(undefined)
    // You might want to call onImageUpload with null or handle this case in your parent component
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
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div 
          className={`relative group ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Avatar className="h-28 w-28 ring-2 ring-gray-100">
            <AvatarImage src={previewUrl} alt={name} />
            <AvatarFallback className="text-xl bg-primary/5">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer p-2" htmlFor="avatar-upload">
              <Camera className="w-6 h-6" />
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="relative" size="sm" asChild>
              <label>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <Upload className="w-4 h-4 mr-2" />
                Escolher arquivo
              </label>
            </Button>
            {previewUrl && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Arraste uma imagem ou clique para fazer upload</p>
            <p>JPG, GIF ou PNG. Máximo 5MB.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
