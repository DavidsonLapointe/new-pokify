
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, PenLine, Plus } from "lucide-react";
import { CustomField } from "./types";

interface CustomFieldsSectionProps {
  customFields: CustomField[];
  handleOpenNewField: () => void;
  handleOpenEditField: (field: CustomField) => void;
}

export const CustomFieldsSection = ({
  customFields,
  handleOpenNewField,
  handleOpenEditField,
}: CustomFieldsSectionProps) => {
  return (
    <Card>
      <CardHeader className="border-b py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Campos Personalizados
            </CardTitle>
            <CardDescription>
              Defina os campos que serão extraídos pelo modelo LLM
            </CardDescription>
          </div>
          <Button
            variant="default"
            onClick={handleOpenNewField}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Campo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {customFields.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customFields.map((field) => (
              <div key={field.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{field.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {field.description}
                    </p>
                    {field.isRequired && (
                      <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEditField(field)}
                    className="hover:bg-muted"
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ListChecks className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum campo personalizado configurado</p>
            <p className="text-sm">Clique em Novo Campo para adicionar campos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
