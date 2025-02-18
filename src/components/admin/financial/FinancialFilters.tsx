
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TitleStatus, TitleType } from "@/types/financial";

export const FinancialFilters = () => {
  const [status, setStatus] = useState<TitleStatus | "all">("all");
  const [type, setType] = useState<TitleType | "all">("all");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={status} onValueChange={(value: TitleStatus | "all") => setStatus(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="paid">Pago</SelectItem>
          <SelectItem value="overdue">Vencido</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(value: TitleType | "all") => setType(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pro_rata">Pro Rata</SelectItem>
          <SelectItem value="mensalidade">Mensalidade</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2 flex-1">
        <Input
          placeholder="Buscar por empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="default" onClick={() => {
          setStatus("all");
          setType("all");
          setSearch("");
        }}>
          Buscar
        </Button>
      </div>
    </div>
  );
}
