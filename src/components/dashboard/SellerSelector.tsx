
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { CircleDot } from "lucide-react";

interface SellerSelectorProps {
  selectedSeller: string;
  onSellerChange: (value: string) => void;
  sellers?: User[];
}

export const SellerSelector = ({ selectedSeller, onSellerChange, sellers = [] }: SellerSelectorProps) => {
  return (
    <Select value={selectedSeller} onValueChange={onSellerChange}>
      <SelectTrigger className="w-full min-w-[180px]">
        <SelectValue placeholder="Todos vendedores" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />
            <span>Todos vendedores</span>
          </div>
        </SelectItem>
        {sellers.map((seller) => (
          <SelectItem key={seller.id} value={seller.id.toString()}>
            <div className="flex items-center gap-2">
              <span>{seller.name}</span>
              <Badge 
                variant={seller.status === "active" ? "default" : "secondary"}
                className={`
                  text-xs py-0.5 px-2
                  ${seller.status === "active" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : seller.status === "inactive"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                `}
              >
                {seller.status === "active" 
                  ? "Ativo" 
                  : seller.status === "inactive" 
                    ? "Inativo" 
                    : "Pendente"}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
