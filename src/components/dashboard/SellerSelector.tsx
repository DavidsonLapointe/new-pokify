
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/organization";
import { Check, CircleDot } from "lucide-react";

interface SellerSelectorProps {
  selectedSeller: string;
  onSellerChange: (value: string) => void;
  sellers?: User[];
}

export const SellerSelector = ({ selectedSeller, onSellerChange, sellers = [] }: SellerSelectorProps) => {
  return (
    <Select value={selectedSeller} onValueChange={onSellerChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Todos os vendedores" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />
            <span>Todos os vendedores</span>
          </div>
        </SelectItem>
        {sellers.map((seller) => (
          <SelectItem key={seller.id} value={seller.id.toString()}>
            <div className="flex items-center gap-2">
              {seller.status === "active" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <CircleDot className="h-4 w-4 text-gray-400" />
              )}
              <span className={seller.status === "active" ? "text-black" : "text-gray-500"}>
                {seller.name}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
