
import { useState } from "react";
import { Organization } from "@/types";
import { OrganizationSelector } from "@/components/admin/customer-success/OrganizationSelector";
import { OrganizationOverview } from "@/components/admin/customer-success/OrganizationOverview";
import { UsersStatistics } from "@/components/admin/customer-success/UsersStatistics";
import { AIExecutionsChart } from "@/components/admin/customer-success/AIExecutionsChart";
import { UserLogsList } from "@/components/admin/customer-success/UserLogsList";
import { ModulesStatus } from "@/components/admin/customer-success/ModulesStatus";
import { UsersByPermission } from "@/components/admin/customer-success/UsersByPermission";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationsSearch } from "@/components/admin/organizations/OrganizationsSearch";
import { NotesDialog } from "@/components/admin/customer-success/notes/NotesDialog";
import { toast } from "sonner";

interface CustomerNote {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
}

const AdminCustomerSuccess = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  const handleOrganizationChange = (organization: Organization | null) => {
    setLoading(true);
    // Simulate loading time to show skeleton
    setTimeout(() => {
      setSelectedOrganization(organization);
      setLoading(false);
      // Reset search term when an organization is selected
      setSearchTerm("");
    }, 800);
  };

  const handleOpenNotes = () => {
    if (selectedOrganization) {
      setIsNotesDialogOpen(true);
    } else {
      toast.error("Selecione uma empresa primeiro");
    }
  };

  const handleAddNote = (organizationId: string, content: string) => {
    const newNote: CustomerNote = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      userName: "Usuário atual" // Ideally, get this from the auth context
    };
    
    setCustomerNotes(prev => [...prev, newNote]);
    toast.success("Anotação adicionada com sucesso!");
  };

  const handleEditNote = (organizationId: string, noteId: string, newContent: string) => {
    setCustomerNotes(prev => 
      prev.map(note => note.id === noteId ? { ...note, content: newContent } : note)
    );
    toast.success("Anotação atualizada com sucesso!");
  };

  const handleDeleteNote = (organizationId: string, noteId: string) => {
    setCustomerNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success("Anotação excluída com sucesso!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold">Customer Success</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie o sucesso dos clientes Leadly
          </p>
        </div>
      </div>

      <div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-2 text-left">
              Selecione uma empresa para analisar
            </label>
            <div className="w-full max-w-3xl relative">
              <OrganizationsSearch value={searchTerm} onChange={setSearchTerm} />
              <OrganizationSelector 
                onOrganizationChange={handleOrganizationChange}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-48 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
          </div>
          <Skeleton className="w-full h-72 rounded-lg" />
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
      ) : selectedOrganization ? (
        <div className="space-y-6">
          <OrganizationOverview 
            organization={selectedOrganization} 
            onOpenNotes={handleOpenNotes}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ModulesStatus organizationId={selectedOrganization.id} />
            </div>

            <div>
              <UsersStatistics 
                users={selectedOrganization.users || []} 
                organizationName={selectedOrganization.name}
              />
              
              {/* UsersByPermission moved to below UsersStatistics as per request */}
              <div className="mt-6">
                <UsersByPermission
                  users={selectedOrganization.users || []}
                  organizationName={selectedOrganization.name}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="w-full">
              <AIExecutionsChart organizationId={selectedOrganization.id} />
            </div>
          </div>

          <div className="w-full">
            <UserLogsList organizationId={selectedOrganization.id} />
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed rounded-lg">
          <p className="text-lg text-gray-500">
            Selecione uma empresa para visualizar suas informações
          </p>
        </div>
      )}

      {selectedOrganization && (
        <NotesDialog
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          moduleName={selectedOrganization.name}
          moduleId={selectedOrganization.id}
          notes={customerNotes}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
};

export default AdminCustomerSuccess;
