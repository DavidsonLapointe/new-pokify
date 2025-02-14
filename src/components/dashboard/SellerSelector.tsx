
import { UserCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Seller {
  id: string;
  name: string;
}

interface SellerSelectorProps {
  selectedSeller: string;
  onSellerChange: (value: string) => void;
  sellers: Seller[];
}

export const SellerSelector = ({
  selectedSeller,
  onSellerChange,
  sellers,
}: SellerSelectorProps) => (
  <div className="flex items-center gap-2">
    <UserCircle className="w-4 h-4 text-muted-foreground" />
    <Select value={selectedSeller} onValueChange={onSellerChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Todos os vendedores" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os vendedores</SelectItem>
        {sellers.map((seller) => (
          <SelectItem key={seller.id} value={seller.id}>
            {seller.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
