
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, CheckCircle, Upload } from "lucide-react";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { useLeadForm } from "@/hooks/useLeadForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CreateLeadDialogProps {
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  onCreateLead: (data: LeadFormData) => void;
  onUploadClick?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateLeadDialog({
  hasPhoneIntegration,
  hasEmailIntegration,
  onCreateLead,
  onUploadClick,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateLeadDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [leadName, setLeadName] = useState("");

  const isControlled = controlledIsOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  useEffect(() => {
    if (open) {
      setShowSuccessCard(false);
    }
  }, [open]);

  const {
    form,
    personType,
    handlePhoneChange,
    handleDocumentChange,
    onSubmit,
  } = useLeadForm({
    hasPhoneIntegration,
    hasEmailIntegration,
    onCreateLead: (data) => {
      const name = data.personType === "pf" 
        ? `${data.firstName} ${data.lastName || ""}`.trim()
        : data.razaoSocial || "";
      setLeadName(name);
      onCreateLead(data);
      setShowSuccessCard(true);
    },
  });

  const handleClose = () => {
    form.reset();
    setShowSuccessCard(false);
    setOpen(false);
  };

  const handleUploadClick = () => {
    if (onUploadClick) {
      setOpen(false);
      setTimeout(() => {
        onUploadClick();
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogClose asChild>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
        
        {!showSuccessCard ? (
          <>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Lead</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Tipo de Pessoa */}
                  <FormField
                    control={form.control}
                    name="personType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pessoa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de pessoa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pf">Pessoa Física</SelectItem>
                            <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tipo de Lead */}
                  <FormField
                    control={form.control}
                    name="leadType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Lead</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de Lead" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="prospect">Prospect</SelectItem>
                            <SelectItem value="funcionario">Funcionário</SelectItem>
                            <SelectItem value="candidato">Candidato RH</SelectItem>
                            <SelectItem value="fornecedor">Fornecedor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Nome e Sobrenome - sempre visíveis */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input placeholder="Sobrenome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {personType === "pf" && (
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123.456.789-00"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDocumentChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {personType === "pj" && (
                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social</FormLabel>
                        <FormControl>
                          <Input placeholder="Razão Social" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {personType === "pj" && (
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00.000.000/0000-00"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDocumentChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="email@exemplo.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              handlePhoneChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Lead</Button>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 bg-green-50 w-12 h-12 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-xl">Lead cadastrado com sucesso!</CardTitle>
              <CardDescription>
                Que tal começar agora mesmo com o upload do primeiro arquivo do lead {leadName}?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-4">
              <Button
                onClick={handleUploadClick}
                className="w-full max-w-sm bg-[#9b87f5] text-white hover:bg-[#8b76f4]"
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer upload do primeiro arquivo
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
