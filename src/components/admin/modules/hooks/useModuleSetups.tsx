
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ModuleSetup, SetupNote, SetupStatus } from "@/components/organization/modules/types";
import { useUser } from "@/contexts/UserContext";

export const useModuleSetups = (
  onStatusChange?: (setupId: string, moduleId: string, organizationId: string, newStatus: SetupStatus) => void,
  initialPage: number = 1,
  itemsPerPage: number = 5
) => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedSetupId, setSelectedSetupId] = useState<string | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const [moduleSetups, setModuleSetups] = useState<ModuleSetup[]>([
    {
      id: "1",
      organizationId: "org1",
      organizationName: "Empresa ABC",
      moduleId: "video",
      moduleName: "Vídeo",
      contactName: "João Silva",
      contactPhone: "(11) 99999-8888",
      contractedAt: new Date(2023, 5, 15),
      status: "pending",
      notes: []
    },
    {
      id: "2",
      organizationId: "org2",
      organizationName: "Empresa XYZ",
      moduleId: "inbound",
      moduleName: "Inbound",
      contactName: "Maria Oliveira",
      contactPhone: "(21) 98888-7777",
      contractedAt: new Date(2023, 6, 10),
      status: "in_progress",
      notes: []
    },
    {
      id: "3",
      organizationId: "org3",
      organizationName: "Empresa 123",
      moduleId: "call",
      moduleName: "Ligações",
      contactName: "Pedro Santos",
      contactPhone: "(31) 97777-6666",
      contractedAt: new Date(),
      status: "pending",
      notes: []
    },
    {
      id: "4",
      organizationId: "org4",
      organizationName: "Empresa DEF",
      moduleId: "chat",
      moduleName: "Chat",
      contactName: "Ana Souza",
      contactPhone: "(41) 96666-5555",
      contractedAt: new Date(2023, 7, 5),
      status: "in_progress",
      notes: []
    },
    {
      id: "5",
      organizationId: "org5",
      organizationName: "Empresa GHI",
      moduleId: "email",
      moduleName: "Email",
      contactName: "Carlos Ferreira",
      contactPhone: "(51) 95555-4444",
      contractedAt: new Date(2023, 7, 10),
      status: "completed",
      notes: []
    },
    {
      id: "6",
      organizationId: "org6",
      organizationName: "Empresa JKL",
      moduleId: "whatsapp",
      moduleName: "WhatsApp",
      contactName: "Fernanda Lima",
      contactPhone: "(61) 94444-3333",
      contractedAt: new Date(2023, 7, 15),
      status: "pending",
      notes: []
    }
  ]);
  
  // Handle status updates
  const handleStatusChange = (id: string, newStatus: SetupStatus) => {
    const setup = moduleSetups.find(setup => setup.id === id);
    if (!setup) return;
    
    setModuleSetups(prevSetups => 
      prevSetups.map(setup => 
        setup.id === id ? { ...setup, status: newStatus } : setup
      )
    );
    
    // Call the callback function to notify about the change
    if (onStatusChange) {
      onStatusChange(id, setup.moduleId, setup.organizationId, newStatus);
    }
    
    toast.success(`Status atualizado com sucesso para ${newStatus === "pending" ? "Pendente" : newStatus === "in_progress" ? "Em Andamento" : "Concluído"}`);
  };
  
  // Handle notes management
  const handleOpenNotes = (setupId: string) => {
    setSelectedSetupId(setupId);
    setShowNotesDialog(true);
  };
  
  const handleAddNote = (setupId: string, content: string) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    const newNote: SetupNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar
    };
    
    setModuleSetups(prevSetups => 
      prevSetups.map(setup => 
        setup.id === setupId 
          ? { 
              ...setup, 
              notes: setup.notes ? [...setup.notes, newNote] : [newNote] 
            } 
          : setup
      )
    );
  };
  
  const handleEditNote = (setupId: string, noteId: string, newContent: string) => {
    setModuleSetups(prevSetups => 
      prevSetups.map(setup => 
        setup.id === setupId 
          ? { 
              ...setup, 
              notes: setup.notes?.map(note => 
                (note.id === noteId) 
                  ? { ...note, content: newContent } 
                  : note
              ) 
            } 
          : setup
      )
    );
  };
  
  const handleDeleteNote = (setupId: string, noteId: string) => {
    setModuleSetups(prevSetups => 
      prevSetups.map(setup => 
        setup.id === setupId 
          ? { 
              ...setup, 
              notes: setup.notes?.filter(note => note.id !== noteId) 
            } 
          : setup
      )
    );
  };
  
  // Get selected setup
  const getSelectedSetup = () => {
    return moduleSetups.find(setup => setup.id === selectedSetupId);
  };
  
  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter(null);
    setCurrentPage(1); // Reset to first page when filters are cleared
  }, []);
  
  // Handle status filter changes
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value === "all" ? null : value);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Reset to the provided initial page when it changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);
  
  // Filter setups based on search term and status filter
  const allFilteredSetups = moduleSetups.filter(setup => {
    const matchesSearch = 
      setup.organizationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.moduleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.moduleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.contactPhone.includes(searchTerm);
      
    const matchesStatus = !statusFilter || setup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate total pages
  const totalItems = allFilteredSetups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get paginated setups
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredSetups = allFilteredSetups.slice(startIndex, endIndex);
  
  return {
    searchTerm,
    statusFilter,
    filteredSetups,
    showNotesDialog,
    selectedSetup: getSelectedSetup(),
    currentPage,
    totalPages,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    handleStatusChange,
    handleOpenNotes,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleClearFilters,
    handleStatusFilterChange,
    setShowNotesDialog
  };
};
