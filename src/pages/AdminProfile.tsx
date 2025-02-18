
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

// Mock de dados do usuário admin (depois será substituído pela autenticação real)
const mockAdminUser = {
  name: "Admin Silva",
  email: "admin.silva@leadly.com",
  phone: "(11) 99999-9999",
  avatar: "",
};

const AdminProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: mockAdminUser.email,
    phone: mockAdminUser.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: mockAdminUser.avatar,
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // Mock da chamada de API para upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em produção, aqui seria feito o upload real do arquivo
      // e retornaria a URL da imagem do servidor
      const mockImageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        avatar: mockImageUrl
      }));
      
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar foto de perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          toast.error("A nova senha deve ter pelo menos 6 caracteres");
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("As senhas não coincidem");
          return;
        }
        if (!formData.currentPassword) {
          toast.error("Digite sua senha atual");
          return;
        }
      }

      toast.success("Perfil atualizado com sucesso!");
      
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error("Erro ao atualizar o perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-gray-900">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais
            </p>
          </div>

          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact">Informações de Contato</TabsTrigger>
              <TabsTrigger value="password">Alterar Senha</TabsTrigger>
            </TabsList>

            <form onSubmit={handleUpdateProfile}>
              <TabsContent value="contact" className="space-y-6 mt-6">
                <div className="grid gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                    <AvatarUpload 
                      currentImage={formData.avatar}
                      name={mockAdminUser.name}
                      onImageUpload={handleImageUpload}
                    />

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
                        onChange={handleInputChange}
                        required
                        className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
                        placeholder="seu@email.com"
                      />
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
                          onChange={handleInputChange}
                          required
                          className="w-full transition-all duration-200 ease-in-out focus:ring-offset-0"
                          placeholder="(00) 00000-0000"
                        />
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
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="password" className="space-y-6 mt-6">
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
                        onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
