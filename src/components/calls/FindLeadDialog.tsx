
import { useState, useEffect } from "react";
import { FilterX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/leads";

interface FindLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadFound: (lead: Lead) => void;
}

export function FindLeadDialog({
  isOpen,
  onOpenChange,
  onLeadFound,
}: FindLeadDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Lead[]>([]);

  // Simular busca em tempo real
  useEffect(() => {
    const searchLeads = () => {
      // Aqui seria implementada a lógica real de busca no backend
      // Por enquanto, vamos simular alguns resultados quando o usuário digita
      if (searchQuery.trim().length >= 3) {
        const mockResults: Lead[] = [
          {
            id: "1",
            firstName: "João",
            lastName: "Silva",
            contactType: "phone" as const,
            contactValue: "(11) 98765-4321",
            status: "active" as const, // Updated from "pending" to "active"
            createdAt: new Date().toISOString(),
            callCount: 2
          },
          {
            id: "2",
            firstName: "Maria",
            lastName: "Santos",
            contactType: "email" as const,
            contactValue: "maria@email.com",
            status: "active" as const, // Updated from "contacted" to "active"
            createdAt: new Date().toISOString(),
            callCount: 1
          }
        ].filter(lead => 
          `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.contactValue.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(mockResults);
      } else {
        setSearchResults([]);
      }
    };

    // Debounce da busca para não sobrecarregar
    const timeoutId = setTimeout(searchLeads, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Localizar Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por nome, telefone, CPF/CNPJ ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
            >
              <FilterX className="h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>

          {searchQuery.trim().length > 0 && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum lead encontrado com os critérios informados
            </p>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="divide-y">
                {searchResults.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      onLeadFound(lead);
                      onOpenChange(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="font-medium">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lead.contactType === "phone" ? "Tel: " : "Email: "}
                      {lead.contactValue}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
