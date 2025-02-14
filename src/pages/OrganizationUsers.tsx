import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Search, Mail, UserCircle, PencilIcon, LockIcon } from "lucide-react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Mock de permissões disponíveis
const availablePermissions = {
  dashboard: {
    label: "Dashboard",
    permissions: {
      view: "Visualizar dashboard",
      export: "Exportar relatórios",
    },
  },
  users: {
    label: "Usuários",
    permissions: {
      view: "Visualizar usuários",
      create: "Criar usuários",
      edit: "Editar usuários",
      delete: "Remover usuários",
    },
  },
  flows: {
    label: "Fluxos",
    permissions: {
      view: "Visualizar fluxos",
      create: "Criar fluxos",
      edit: "Editar fluxos",
      delete: "Remover fluxos",
      execute: "Executar fluxos",
    },
  },
  integrations: {
    label: "Integrações",
    permissions: {
      view: "Visualizar integrações",
      configure: "Configurar integrações",
    },
  },
};

// Mock de usuários para exemplo
const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    lastAccess: "2024-02-20T14:30:00",
    permissions: {
      dashboard: ["view", "export"],
      users: ["view", "create", "edit", "delete"],
      flows: ["view", "create", "edit", "delete", "execute"],
      integrations: ["view", "configure"],
    },
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    phone: "(11) 91234-5678",
    role: "seller",
    status: "active",
    lastAccess: "2024-02-20T16:45:00",
    permissions: {
      dashboard: ["view"],
      users: ["view"],
      flows: ["view", "execute"],
      integrations: ["view"],
    },
  },
];

const OrganizationUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "seller",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    console.log("Novo usuário:", newUser);
    toast.success("Usuário adicionado com sucesso!");
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", phone: "", role: "seller" });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, ...selectedUser } : user
    );
    setUsers(updatedUsers);
    
    toast.success("Usuário atualizado com sucesso!");
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handlePermissionChange = (module: string, permission: string) => {
    if (!selectedUser) return;

    const currentPermissions = selectedUser.permissions[module] || [];
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p: string) => p !== permission)
      : [...currentPermissions, permission];

    setSelectedUser({
      ...selectedUser,
      permissions: {
        ...selectedUser.permissions,
        [module]: updatedPermissions,
      },
    });
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const openPermissionsDialog = (user: any) => {
    setSelectedUser(user);
    setIsPermissionsOpen(true);
  };

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os usuários da sua organização
            </p>
          </div>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo usuário. Um email de convite será
                  enviado para acesso à plataforma.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    placeholder="Nome completo"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="email@empresa.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Função</label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="seller">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddUser}>Adicionar Usuário</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogDescription>
                  Atualize os dados do usuário. Alguns campos não podem ser
                  alterados.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={selectedUser.name}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      type="tel"
                      value={selectedUser.phone}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Função</label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) =>
                        setSelectedUser({ ...selectedUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="seller">Vendedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedUser.status}
                      onValueChange={(value) =>
                        setSelectedUser({ ...selectedUser, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditUserOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleEditUser}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Permissões do Usuário</DialogTitle>
                <DialogDescription>
                  Gerencie as permissões de acesso para {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
                  {Object.entries(availablePermissions).map(([module, { label, permissions }]) => (
                    <div key={module} className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">{label}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(permissions).map(([key, description]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`${module}-${key}`}
                              checked={selectedUser.permissions[module]?.includes(key)}
                              onChange={() => handlePermissionChange(module, key)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`${module}-${key}`}>{description}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditUser}>Salvar Permissões</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {user.role === "admin" ? "Administrador" : "Vendedor"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastAccess).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openPermissionsDialog(user)}
                      >
                        <LockIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
