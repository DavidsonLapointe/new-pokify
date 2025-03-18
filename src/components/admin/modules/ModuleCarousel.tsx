
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { ModuleCard } from "@/components/admin/modules/ModuleCard";

interface ModuleCarouselProps {
  moduleGroups: Plan[][];
  selectedModule: Plan | null;
  onEditModule: (module: Plan) => void;
  onSelectModule: (module: Plan) => void;
}

export const ModuleCarousel: React.FC<ModuleCarouselProps> = ({
  moduleGroups,
  selectedModule,
  onEditModule,
  onSelectModule
}) => {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {moduleGroups.map((group, groupIndex) => (
            <CarouselItem key={groupIndex}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
                {group.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={() => onSelectModule(module)}
                    isActive={selectedModule?.id === module.id}
                    onEditModule={onEditModule}
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};
