
import { LoaderCircle } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Carregando...</h2>
      </div>
    </div>
  );
};
