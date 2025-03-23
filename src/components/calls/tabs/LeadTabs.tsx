
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientLeadsTable } from "./ClientLeadsTable";
import { EmployeeLeadsTable } from "./EmployeeLeadsTable";
import { CandidateLeadsTable } from "./CandidateLeadsTable";
import { SupplierLeadsTable } from "./SupplierLeadsTable";
import { LeadCalls } from "../types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LeadTabsProps {
  leads: LeadCalls[];
  formatDate: (date: string) => string;
  onEditLead: (lead: LeadCalls) => void;
  onAddLead: () => void;
}

export const LeadTabs = ({ leads, formatDate, onEditLead, onAddLead }: LeadTabsProps) => {
  const [activeTab, setActiveTab] = useState("client");

  // Filter leads by type
  const clientLeads = leads.filter(lead => lead.leadType === "client");
  const employeeLeads = leads.filter(lead => lead.leadType === "employee");
  const candidateLeads = leads.filter(lead => lead.leadType === "candidate" || lead.leadType === "prospect");
  const supplierLeads = leads.filter(lead => lead.leadType === "supplier" || lead.leadType === "partner");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leads</h2>
        <Button className="bg-primary" onClick={onAddLead}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>
      
      <Tabs defaultValue="client" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full flex justify-start">
          <TabsTrigger value="client" className="flex-1 max-w-[180px]">Clientes</TabsTrigger>
          <TabsTrigger value="employee" className="flex-1 max-w-[180px]">Funcionários</TabsTrigger>
          <TabsTrigger value="candidate" className="flex-1 max-w-[180px]">Candidatos RH</TabsTrigger>
          <TabsTrigger value="supplier" className="flex-1 max-w-[180px]">Fornecedores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="client">
          <ClientLeadsTable 
            leads={clientLeads} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="employee">
          <EmployeeLeadsTable 
            leads={employeeLeads} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="candidate">
          <CandidateLeadsTable 
            leads={candidateLeads} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="supplier">
          <SupplierLeadsTable 
            leads={supplierLeads} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
