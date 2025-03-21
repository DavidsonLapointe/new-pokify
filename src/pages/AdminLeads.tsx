
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { NotesDialog } from "@/components/admin/leads/NotesDialog";
import { mockLeadlyLeads } from "@/mocks/adminLeadsMocks";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export type LeadNote = {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
};

export interface LeadlyLead {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  status: string;
  notes: LeadNote[];
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<LeadlyLead[]>(mockLeadlyLeads);
  const [selectedLead, setSelectedLead] = useState<LeadlyLead | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  const handleOpenNotes = (lead: LeadlyLead) => {
    setSelectedLead(lead);
    setIsNotesDialogOpen(true);
  };

  const handleAddNote = (leadId: string, content: string) => {
    const newNote: LeadNote = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      userName: "Admin User" // In a real app, this would be the current user's name
    };

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          notes: [...lead.notes, newNote]
        };
      }
      return lead;
    }));

    // Update the selected lead as well if it's currently open
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        notes: [...selectedLead.notes, newNote]
      });
    }

    toast.success("Anotação adicionada com sucesso!");
  };

  const handleEditNote = (leadId: string, noteId: string, newContent: string) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          notes: lead.notes.map(note => 
            note.id === noteId ? { ...note, content: newContent } : note
          )
        };
      }
      return lead;
    }));

    // Update the selected lead as well if it's currently open
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        notes: selectedLead.notes.map(note => 
          note.id === noteId ? { ...note, content: newContent } : note
        )
      });
    }

    toast.success("Anotação atualizada com sucesso!");
  };

  const handleDeleteNote = (leadId: string, noteId: string) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          notes: lead.notes.filter(note => note.id !== noteId)
        };
      }
      return lead;
    }));

    // Update the selected lead as well if it's currently open
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        notes: selectedLead.notes.filter(note => note.id !== noteId)
      });
    }

    toast.success("Anotação excluída com sucesso!");
  };

  // Status legend data in the requested order
  const statusLegend = [
    { status: "contactar", label: "Contactar", color: "bg-gray-100 text-gray-800", description: "Empresa que ainda não foi contactada" },
    { status: "qualificacao", label: "Qualificação", color: "bg-purple-100 text-purple-800", description: "Empresa já contactada mas nada resolvido" },
    { status: "email_onboarding", label: "Email Onboarding", color: "bg-yellow-100 text-yellow-800", description: "Recebeu email mas não finalizou cadastro" },
    { status: "ganho", label: "Ganho", color: "bg-green-100 text-green-800", description: "Lead que recebeu email de onboarding e concluiu o cadastro" },
    { status: "perda", label: "Perda", color: "bg-red-100 text-red-800", description: "Lead que descartou o uso do SaaS" },
    { status: "nutricao_mkt", label: "Nutrição Mkt", color: "bg-blue-100 text-blue-800", description: "Em processo de nutrição de marketing" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads da Landing Page</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-[#7E69AB]" />
            <CardTitle>Status dos Leads</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {statusLegend.map((item) => (
              <div key={item.status} className="flex items-center rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
                <Badge className={`${item.color} mr-2`}>{item.label}</Badge>
                <span className="text-sm text-gray-600">{item.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leads Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsTable 
            leads={leads} 
            onOpenNotes={handleOpenNotes} 
          />
        </CardContent>
      </Card>

      {selectedLead && (
        <NotesDialog
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          leadName={selectedLead.name}
          leadId={selectedLead.id}
          notes={selectedLead.notes}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
};

export default AdminLeads;
