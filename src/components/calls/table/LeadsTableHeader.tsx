
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const LeadsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px] text-xs whitespace-nowrap">Nome do Lead</TableHead>
        <TableHead className="w-[120px] text-xs whitespace-nowrap">Data de Cadastro</TableHead>
        <TableHead className="w-[120px] text-xs whitespace-nowrap">Status do Lead</TableHead>
        <TableHead className="w-[120px] text-xs whitespace-nowrap">Temperatura do Lead</TableHead>
        <TableHead className="w-[160px] text-xs whitespace-nowrap">Funil (CRM)</TableHead>
        <TableHead className="w-[160px] text-xs whitespace-nowrap">Interações IA</TableHead>
        <TableHead className="w-[80px] text-xs whitespace-nowrap text-center">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
