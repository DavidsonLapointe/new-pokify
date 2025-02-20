
export const availablePermissions = {
  dashboard: {
    label: "Dashboard",
    permissions: {
      view: "Visualizar dashboard",
      export: "Exportar relatórios",
    },
  },
  calls: {
    label: "Chamadas",
    permissions: {
      view: "Visualizar chamadas",
      upload: "Upload de chamadas",
      delete: "Deletar chamadas",
    },
  },
  leads: {
    label: "Leads",
    permissions: {
      view: "Visualizar leads",
      edit: "Editar leads",
      delete: "Deletar leads",
    },
  },
} as const;
