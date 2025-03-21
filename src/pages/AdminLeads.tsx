
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { NotesDialog } from "@/components/admin/leads/NotesDialog";
import { LeadsFilter } from "@/components/admin/leads/LeadsFilter";
import { mockLeadlyLeads } from "@/mocks/adminLeadsMocks";
import { toast } from "sonner";

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
  personType?: "pf" | "pj";
  email?: string;
  companyName?: string;
  employeeCount?: string;
  sector?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  lossReason?: string;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<LeadlyLead[]>(mockLeadlyLeads);
  const [selectedLead, setSelectedLead] = useState<LeadlyLead | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const handleOpenNotes = (lead: LeadlyLead) => {
    setSelectedLead(lead);
    setIsNotesDialogOpen(true);
  };

  const handleUpdateLead = (updatedLead: LeadlyLead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    
    // If this is the currently selected lead, update it as well
    if (selectedLead && selectedLead.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
    
    toast.success("Lead atualizado com sucesso!");
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

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("todos");
  };

  // Filter leads based on search query and status filter
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filter by search query (name or company name)
      const matchesSearch = searchQuery === "" || 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status
      const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads da Landing Page</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
          />
          <LeadsTable 
            leads={filteredLeads} 
            onOpenNotes={handleOpenNotes}
            onUpdateLead={handleUpdateLead}
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
