
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { toolsData } from "@/components/organization/ai-tools/data/toolsData";
import { Card, CardContent } from "@/components/ui/card";

// Extract unique tool names for the filter tags
const extractToolNames = () => {
  const allToolNames = toolsData.map(tool => tool.title);
  // Get unique tool names
  return ["Todas", ...new Set(allToolNames)];
};

// Define business areas with their names and IDs
const businessAreas = [
  { id: "5", name: "Vendas" },
  { id: "4", name: "Marketing" },
  { id: "7", name: "Marketing Digital" },
  { id: "8", name: "Atendimento ao Cliente" },
  { id: "2", name: "RH" },
  { id: "1", name: "Financeiro" },
  { id: "3", name: "Jurídico" },
  { id: "6", name: "Controladoria" },
  { id: "9", name: "P&D" },
  { id: "10", name: "Diretoria" },
].sort((a, b) => a.name.localeCompare(b.name));

// Map tool images to their IDs
const toolImages = {
  "video": "/lovable-uploads/a6f95a9f-b22e-4925-94e8-c48a07388c46.png",
  "inbound": "https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "call": "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "nutrition": "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "assistant": "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

export function AIToolsSection() {
  // Get tool names for filter tags
  const allTags = extractToolNames();
  
  const [selectedTag, setSelectedTag] = useState<string>("Todas");
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  
  // Filter tools based on selected tag
  const filteredTools = selectedTag === "Todas" 
    ? toolsData 
    : toolsData.filter(tool => tool.title === selectedTag);

  // Get the currently active tool
  const activeTool = filteredTools[activeToolIndex] || toolsData[0];

  // Handle tool navigation
  const handlePrevTool = () => {
    setActiveToolIndex(prev => 
      prev === 0 ? filteredTools.length - 1 : prev - 1
    );
  };

  const handleNextTool = () => {
    setActiveToolIndex(prev => 
      prev === filteredTools.length - 1 ? 0 : prev + 1
    );
  };

  // Handle tag selection
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setActiveToolIndex(0); // Reset to first tool when changing tag
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Nossas Ferramentas de IA
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Descubra como nossa plataforma pode transformar cada departamento da sua empresa com soluções de IA especializadas
        </p>

        {/* Tool tags carousel - now showing tool names */}
        <div className="mb-12">
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {allTags.map((tag) => (
                <CarouselItem key={tag} className="basis-auto">
                  <Button
                    variant={selectedTag === tag ? "default" : "outline"}
                    onClick={() => handleTagChange(tag)}
                    className="mx-1 flex items-center gap-1"
                  >
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {tag}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 h-9 w-9 bg-white" />
            <CarouselNext className="hidden md:flex -right-12 h-9 w-9 bg-white" />
          </Carousel>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Tool image - now without overlay text */}
            <div className="order-2 md:order-1">
              <div className="relative rounded-xl overflow-hidden shadow-xl h-[350px] md:h-[450px]">
                <img
                  src={toolImages[activeTool.id as keyof typeof toolImages] || "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={activeTool.title}
                  className="w-full h-full object-cover"
                />
                {/* Removed the text overlay from the image */}
                
                {/* Navigation buttons */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 flex justify-between w-full px-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    onClick={handlePrevTool}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    onClick={handleNextTool}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tool details */}
            <div className="order-1 md:order-2">
              <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center">
                    {activeTool.icon && <activeTool.icon className="h-7 w-7 text-primary" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{activeTool.title}</h3>
                    <p className="text-gray-600">{activeTool.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-3">Descrição Detalhada</h4>
                  <p className="text-gray-700 mb-4">{activeTool.detailedDescription}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-3">Principais Benefícios</h4>
                  <ul className="space-y-2">
                    {activeTool.benefits?.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    {filteredTools.map((_, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full cursor-pointer transition-all",
                          index === activeToolIndex ? "bg-primary scale-125" : "bg-primary/30"
                        )}
                        onClick={() => setActiveToolIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Nenhuma ferramenta encontrada com esta tag.</p>
          </div>
        )}
        
        {/* Tools by departments in grid layout - now without buttons */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">
            Ferramentas por Departamento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessAreas.slice(0, 6).map((area) => {
              const areaTools = toolsData.filter(tool => tool.areas?.includes(area.id));
              
              return (
                <Card key={area.id} className="h-full">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">{area.name}</h4>
                    <div className="space-y-3">
                      {areaTools.length > 0 ? (
                        areaTools.slice(0, 4).map((tool) => (
                          <div key={tool.id} className="flex items-center gap-3">
                            {tool.icon && <tool.icon className="h-5 w-5 text-primary shrink-0" />}
                            <span className="text-gray-700 text-sm">{tool.title}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Em breve novas ferramentas</p>
                      )}
                      {areaTools.length > 4 && (
                        <p className="text-sm text-primary font-medium">+ {areaTools.length - 4} outras</p>
                      )}
                    </div>
                    {/* Removed the "Ver ferramentas" button */}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
