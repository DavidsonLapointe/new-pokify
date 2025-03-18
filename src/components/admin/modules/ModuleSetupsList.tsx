
import React, { useState } from "react";
import { toast } from "sonner";
import { ModuleSetup, SetupStatus } from "@/components/organization/modules/types";
import { ModuleSetupsFilters } from "./ModuleSetupsFilters";
import { ModuleSetupsTable } from "./ModuleSetupsTable";

interface ModuleSetupsListProps {
  onStatusChange?: (setupId: string, moduleId: string, organizationId: string, newStatus: SetupStatus) => void;
}

export const ModuleSetupsList: React.FC<ModuleSetupsListProps> = ({ onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [moduleSetups, setModuleSetups] = useState<ModuleSetup[]>([
    {
      id: "1",
      organizationId: "org1",
      moduleId: "video",
      contactName: "João Silva",
      contactPhone: "(11) 99999-8888",
      contractedAt: new Date(2023, 5, 15),
      status: "pending"
    },
    {
      id: "2",
      organizationId: "org2",
      moduleId: "inbound",
      contactName: "Maria Oliveira",
      contactPhone: "(21) 98888-7777",
      contractedAt: new Date(2023, 6, 10),
      status: "in_progress"
    },
    {
      id: "3",
      organizationId: "org3",
      moduleId: "call",
      contactName: "Pedro Santos",
      contactPhone: "(31) 97777-6666",
      contractedAt: new Date(),
      status: "pending"
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
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
  };
  
  // Handle status filter changes
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? null : value);
  };
  
  // Filter setups based on search term and status filter
  const filteredSetups = moduleSetups.filter(setup => {
    const matchesSearch = 
      setup.organizationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.moduleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.contactPhone.includes(searchTerm);
      
    const matchesStatus = !statusFilter || setup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-4">
      <ModuleSetupsFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={handleStatusFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      <ModuleSetupsTable
        setups={filteredSetups}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
