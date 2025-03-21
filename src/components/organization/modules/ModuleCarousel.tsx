
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ModuleCard } from "./ModuleCard";
import { Tool } from "./types";

interface ModuleCarouselProps {
  tools: Tool[];
  selectedTool: Tool | null;
  onSelectTool: (tool: Tool) => void;
  onCancelModule: (id: string) => void;
}

export const ModuleCarousel: React.FC<ModuleCarouselProps> = ({
  tools,
  selectedTool,
  onSelectTool,
  onCancelModule
}) => {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: false
        }}
        className="w-full" 
      >
        <CarouselContent className="-ml-1">
          {tools.map((tool) => (
            <CarouselItem key={tool.id} className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ModuleCard
                tool={tool}
                isSelected={selectedTool?.id === tool.id}
                onShowDetails={onSelectTool}
                onCancelModule={onCancelModule}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8" />
        <CarouselNext className="-right-8" />
      </Carousel>
    </div>
  );
};

