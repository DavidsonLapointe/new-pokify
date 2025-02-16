
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/leads";
import { useToast } from "@/hooks/use-toast";

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
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Aqui seria implementada a lógica real de busca no backend
    // Por enquanto, simulamos um resultado vazio
    setSearchResults([]);
    setIsSearching(false);

    // Simular que não encontrou o lead
    toast({
      title: "Lead não encontrado",
      description: "Você será redirecionado para criar um novo lead.",
    });

    // Fechar o modal e redirecionar para criação de lead
    onOpenChange(false);
    navigate("/organization/leads", {
      state: { showCreateLead: true, searchQuery }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Localizar Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar por nome, telefone, CPF/CNPJ ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Resultados da busca:</h3>
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
