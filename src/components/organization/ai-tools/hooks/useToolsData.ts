
import { useState, useEffect } from "react";
import { Tool, ToolStatus } from "@/components/organization/modules/types";
import { toolsData } from "../data/toolsData";

// Simulate module setup data
const mockSetups = [
  {
    id: "setup1",
    organizationId: "currentOrg",
    moduleId: "video",
    contactName: "João Silva",
    contactPhone: "(11) 99999-8888",
    contractedAt: new Date(2023, 5, 15),
    status: "pending" as const,
    notes: []
  },
  {
    id: "setup2",
    organizationId: "currentOrg",
    moduleId: "inbound",
    contactName: "Maria Oliveira",
    contactPhone: "(21) 98888-7777",
    contractedAt: new Date(2023, 6, 10),
    status: "in_progress" as const,
    notes: []
  }
];

export const useToolsData = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  // Initialize tools data with setup status
  useEffect(() => {
    let updatedTools = [...toolsData];
    
    mockSetups.forEach(setup => {
      if (setup.organizationId === "currentOrg") {
        updatedTools = updatedTools.map(tool => {
          if (tool.id === setup.moduleId) {
            if (setup.status === "pending" || setup.status === "in_progress") {
              return {
                ...tool,
                status: "setup" as ToolStatus,
                badgeLabel: "Em Setup"
              };
            } else if (setup.status === "completed") {
              return {
                ...tool,
                status: "contracted" as ToolStatus,
                badgeLabel: "Contratada"
              };
            }
          }
          return tool;
        });
      }
    });
    
    setTools(updatedTools);
  }, []);

  // Get tools with "configured" status
  const configuredTools = tools.filter(tool => tool.status === "configured");

  // Helper function to get a tool by ID
  const getToolById = (id: string) => {
    return tools.find(tool => tool.id === id) || tools[0];
  };

  // Function to update setup status
  const updateSetupStatus = (moduleId: string, newStatus: "pending" | "in_progress" | "completed") => {
    const updatedSetups = mockSetups.map(setup => {
      if (setup.moduleId === moduleId) {
        return { ...setup, status: newStatus };
      }
      return setup;
    });
    
    let updatedTools = [...tools];
    updatedSetups.forEach(setup => {
      if (setup.organizationId === "currentOrg") {
        updatedTools = updatedTools.map(tool => {
          if (tool.id === setup.moduleId) {
            if (setup.status === "pending" || setup.status === "in_progress") {
              return {
                ...tool,
                status: "setup" as ToolStatus,
                badgeLabel: "Em Setup"
              };
            } else if (setup.status === "completed") {
              return {
                ...tool,
                status: "contracted" as ToolStatus,
                badgeLabel: "Contratada"
              };
            }
          }
          return tool;
        });
      }
    });
    
    setTools(updatedTools);
  };

  return {
    tools,
    configuredTools,
    getToolById,
    updateSetupStatus
  };
};
