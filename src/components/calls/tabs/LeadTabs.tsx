
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientLeadsTable } from "./ClientLeadsTable";
import { EmployeeLeadsTable } from "./EmployeeLeadsTable";
import { CandidateLeadsTable } from "./CandidateLeadsTable";
import { SupplierLeadsTable } from "./SupplierLeadsTable";
import { ProspectLeadsTable } from "./ProspectLeadsTable";
import { LeadCalls } from "../types";

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
  const candidateLeads = leads.filter(lead => lead.leadType === "candidate");
  const supplierLeads = leads.filter(lead => lead.leadType === "supplier" || lead.leadType === "partner");
  const prospectLeads = leads.filter(lead => lead.leadType === "prospect");

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Leads</h2>
      </div>
      
      <Tabs defaultValue="client" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full flex justify-start">
          <TabsTrigger value="client" className="flex-1 max-w-[150px]">Clientes</TabsTrigger>
          <TabsTrigger value="prospect" className="flex-1 max-w-[150px]">Prospects</TabsTrigger>
          <TabsTrigger value="employee" className="flex-1 max-w-[150px]">Funcionários</TabsTrigger>
          <TabsTrigger value="candidate" className="flex-1 max-w-[150px]">Candidatos RH</TabsTrigger>
          <TabsTrigger value="supplier" className="flex-1 max-w-[150px]">Fornecedores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="client">
          <ClientLeadsTable 
            leads={clientLeads} 
            formatDate={formatDate} 
            onEditLead={onEditLead} 
          />
        </TabsContent>
        
        <TabsContent value="prospect">
          <ProspectLeadsTable 
            leads={prospectLeads} 
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
