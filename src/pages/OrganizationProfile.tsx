
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationLayout from "@/components/OrganizationLayout";
import { ContactForm } from "@/components/organization/profile/ContactForm";
import { PasswordForm } from "@/components/organization/profile/PasswordForm";
import { useProfileForm } from "@/components/organization/profile/useProfileForm";

const OrganizationProfile = () => {
  const [mounted, setMounted] = useState(false);
  const { formData, isLoading, handleInputChange, handleUpdateProfile } = useProfileForm();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <OrganizationLayout>
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
              <TabsContent value="contact" className="mt-6">
                <ContactForm
                  formData={formData}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                />
              </TabsContent>

              <TabsContent value="password" className="mt-6">
                <PasswordForm
                  formData={formData}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                />
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationProfile;
