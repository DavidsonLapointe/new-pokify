
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Testimonial } from "./types";
import { useTestimonials } from "./useTestimonials";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
  company: z.string().min(2, "Empresa deve ter pelo menos 2 caracteres"),
  image: z.string().url("Deve ser uma URL válida"),
  text: z.string().min(10, "Depoimento deve ter pelo menos 10 caracteres").max(500, "Depoimento não pode ter mais de 500 caracteres"),
});

interface EditTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
}

export function EditTestimonialDialog({ 
  open, 
  onOpenChange, 
  testimonial 
}: EditTestimonialDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { addTestimonial, updateTestimonial } = useTestimonials();
  const isEditing = !!testimonial;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial?.name || "",
      role: testimonial?.role || "",
      company: testimonial?.company || "",
      image: testimonial?.image || "",
      text: testimonial?.text || "",
    },
  });

  // Reset form when testimonial changes
  useState(() => {
    if (open) {
      form.reset({
        name: testimonial?.name || "",
        role: testimonial?.role || "",
        company: testimonial?.company || "",
        image: testimonial?.image || "",
        text: testimonial?.text || "",
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      if (isEditing && testimonial) {
        await updateTestimonial({
          ...testimonial,
          ...values,
        });
        toast.success("Depoimento atualizado com sucesso");
      } else {
        await addTestimonial(values);
        toast.success("Depoimento adicionado com sucesso");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(isEditing 
        ? "Erro ao atualizar depoimento" 
        : "Erro ao adicionar depoimento"
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Depoimento" : "Novo Depoimento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da pessoa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Cargo/Função" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depoimento</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite o depoimento..." 
                      className="resize-none min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
