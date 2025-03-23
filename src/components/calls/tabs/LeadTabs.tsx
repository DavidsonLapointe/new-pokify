
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientLeadsTable } from "./ClientLeadsTable";
import { EmployeeLeadsTable } from "./EmployeeLeadsTable";
import { CandidateLeadsTable } from "./CandidateLeadsTable";
import { SupplierLeadsTable } from "./SupplierLeadsTable";
import { ProspectLeadsTable } from "./ProspectLeadsTable";
import { LeadCalls } from "../types";
import { CallsFilters } from "@/components/calls/CallsFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface LeadTabsProps {
  leads: LeadCalls[];
  formatDate: (date: string) => string;
  onEditLead: (lead: LeadCalls) => void;
  onAddLead: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

// Number of leads per page
const ITEMS_PER_PAGE = 10;

export const LeadTabs = ({ leads, formatDate, onEditLead, onAddLead, searchQuery, onSearchChange }: LeadTabsProps) => {
  const [activeTab, setActiveTab] = useState("client");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLeads, setFilteredLeads] = useState<LeadCalls[]>([]);

  // Filter leads by type
  const clientLeads = leads.filter(lead => lead.leadType === "client");
  const employeeLeads = leads.filter(lead => lead.leadType === "employee");
  const candidateLeads = leads.filter(lead => lead.leadType === "candidate");
  const supplierLeads = leads.filter(lead => lead.leadType === "supplier" || lead.leadType === "partner");
  const prospectLeads = leads.filter(lead => lead.leadType === "prospect");

  // Apply search filter to the leads of the current active tab
  useEffect(() => {
    const currentTabLeads = getCurrentTabLeads();
    
    if (!searchQuery.trim()) {
      setFilteredLeads(currentTabLeads);
      return;
    }
    
    const searchLower = searchQuery.toLowerCase();
    const filtered = currentTabLeads.filter(lead => {
      const name = lead.personType === "pj" 
        ? (lead.razaoSocial || "")
        : `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
      
      return (
        name.toLowerCase().includes(searchLower) ||
        (lead.email || "").toLowerCase().includes(searchLower) ||
        (lead.phone || "").toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredLeads(filtered);
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [activeTab, searchQuery, leads]);

  // Get current leads for the active tab
  const getCurrentTabLeads = () => {
    switch (activeTab) {
      case "client":
        return clientLeads;
      case "employee":
        return employeeLeads;
      case "candidate":
        return candidateLeads;
      case "supplier":
        return supplierLeads;
      case "prospect":
        return prospectLeads;
      default:
        return [];
    }
  };

  // Calculate current page leads
  const getPaginatedLeads = (allLeads: LeadCalls[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Reset page when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // Calculate total pages for the current tab
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust for edge cases
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
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div>
      <Tabs defaultValue="client" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-5 p-0">
          <TabsTrigger value="client" className="rounded-md">Clientes</TabsTrigger>
          <TabsTrigger value="prospect" className="rounded-md">Prospects</TabsTrigger>
          <TabsTrigger value="employee" className="rounded-md">Funcionários</TabsTrigger>
          <TabsTrigger value="candidate" className="rounded-md">Candidatos RH</TabsTrigger>
          <TabsTrigger value="supplier" className="rounded-md">Fornecedores</TabsTrigger>
        </TabsList>
        
        {/* Search and filter section - now below tabs */}
        <div className="mb-4">
          <CallsFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
        
        <TabsContent value="client">
          <ClientLeadsTable 
            leads={getPaginatedLeads(filteredLeads)} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="prospect">
          <ProspectLeadsTable 
            leads={getPaginatedLeads(filteredLeads)} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="employee">
          <EmployeeLeadsTable 
            leads={getPaginatedLeads(filteredLeads)} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="candidate">
          <CandidateLeadsTable 
            leads={getPaginatedLeads(filteredLeads)} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="supplier">
          <SupplierLeadsTable 
            leads={getPaginatedLeads(filteredLeads)} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <span className="flex h-8 w-8 items-center justify-center">...</span>
                  ) : (
                    <PaginationLink
                      isActive={currentPage === Number(page)}
                      onClick={() => setCurrentPage(Number(page))}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
