
import { SearchX } from "lucide-react";

export const EmptyTitlesState = () => {
  return (
    <div className="rounded-md border border-dashed p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <SearchX className="h-12 w-12 text-gray-400 mb-3" />
        <h3 className="font-semibold text-lg mb-1">Nenhum título encontrado</h3>
        <p className="text-sm text-gray-500">
          Não foram encontrados títulos com os critérios de busca selecionados.
        </p>
      </div>
    </div>
  );
};
