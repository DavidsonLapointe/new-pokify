
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ObjectionsTabContent } from "@/components/dashboard/ObjectionsTabContent";
import { SuggestionsTabContent } from "@/components/dashboard/SuggestionsTabContent";
import { User } from "@/types";

const OrganizationKnowledgeBase = () => {
  const {
    objectionsData,
    objectionTrendsData,
    objectionExamples,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller,
    suggestionsData,
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
    updateSuggestionStatus,
    sellers
  } = useDashboardData();

  // Create a proper User array from the simplified sellers data
  const formattedSellers: User[] = sellers.map(seller => ({
    id: seller.id,
    name: seller.name,
    email: `${seller.id}@example.com`, // Placeholder email
    role: "seller",
    status: "active",
    createdAt: new Date().toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
      </div>
      <p className="text-muted-foreground">
        Acesse informações importantes sobre objeções de vendas e sugestões de clientes
      </p>

      <Tabs defaultValue="objections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="objections">Objeções</TabsTrigger>
          <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="objections" className="space-y-6">
          <ObjectionsTabContent
            objectionsData={objectionsData}
            objectionTrendsData={objectionTrendsData}
            objectionExamples={objectionExamples as any}
            monthlyObjectionsDate={monthlyObjectionsDate}
            setMonthlyObjectionsDate={setMonthlyObjectionsDate}
            monthlyObjectionsSeller={monthlyObjectionsSeller}
            setMonthlyObjectionsSeller={setMonthlyObjectionsSeller}
            objectionTrendsSeller={objectionTrendsSeller}
            setObjectionTrendsSeller={setObjectionTrendsSeller}
            sellers={formattedSellers}
          />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <SuggestionsTabContent
            suggestions={suggestionsData as any}
            monthlySuggestionsDate={monthlySuggestionsDate}
            setMonthlySuggestionsDate={setMonthlySuggestionsDate}
            monthlySuggestionsSeller={monthlySuggestionsSeller}
            setMonthlySuggestionsSeller={setMonthlySuggestionsSeller}
            sellers={formattedSellers}
            onUpdateStatus={updateSuggestionStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationKnowledgeBase;
