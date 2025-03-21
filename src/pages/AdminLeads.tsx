import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { NotesDialog } from "@/components/admin/leads/NotesDialog";
import { LeadsFilter } from "@/components/admin/leads/LeadsFilter";
import { LeadsStats } from "@/components/admin/leads/LeadsStats";
import { mockLeadlyLeads } from "@/mocks/adminLeadsMocks";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 10;

const AdminLeads = () => {
  const [leads, setLeads] = useState<LeadlyLead[]>(mockLeadlyLeads);
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to show maxPagesToShow - 2 pages (excluding first and last)
      if (endPage - startPage < maxPagesToShow - 3) {
        if (currentPage < totalPages / 2) {
          endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
        } else {
          startPage = Math.max(2, endPage - (maxPagesToShow - 3));
        }
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Leads da Landing Page</h1>
        <p className="text-gray-500">
          Gerencie e acompanhe todos os leads capturados através da landing page do seu produto
        </p>
      </div>

      {/* Lead Stats Cards */}
      <LeadsStats counts={leadCounts} />

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <LeadsFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
          />
          <LeadsTable 
            leads={paginatedLeads} 
            onOpenNotes={handleOpenNotes}
            onUpdateLead={handleUpdateLead}
          />
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <span className="flex h-8 w-8 items-center justify-center">...</span>
                      ) : (
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(Number(page))}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
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
