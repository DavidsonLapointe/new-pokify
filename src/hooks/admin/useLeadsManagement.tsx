
import { useState, useMemo } from "react";
import { LeadlyLead, LeadNote } from "@/pages/AdminLeads";
import { toast } from "sonner";

export const useLeadsManagement = (initialLeads: LeadlyLead[]) => {
  const [leads, setLeads] = useState<LeadlyLead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<LeadlyLead | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate counts for each status
  const leadCounts = useMemo(() => {
    const counts = {
      contactar: 0,
      qualificacao: 0,
      nutricao_mkt: 0,
      email_onboarding: 0,
      ganho: 0,
      perda: 0,
      total: leads.length
    };
    
    leads.forEach(lead => {
      if (counts.hasOwnProperty(lead.status)) {
        counts[lead.status as keyof typeof counts] += 1;
      }
    });
    
    return counts;
  }, [leads]);
  
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
    setCurrentPage(1); // Reset to first page when clearing filters
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

  return {
    leads,
    selectedLead,
    isNotesDialogOpen,
    searchQuery,
    statusFilter,
    currentPage,
    setCurrentPage,
    leadCounts,
    filteredLeads,
    handleOpenNotes,
    handleUpdateLead,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleClearFilters,
    setIsNotesDialogOpen,
    setSearchQuery,
    setStatusFilter
  };
};
