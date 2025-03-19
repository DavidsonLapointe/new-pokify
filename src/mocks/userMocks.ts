
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { mockOrganizations } from "./organizationMocks";

export const mockAuthenticatedUser: User = {
  id: uuidv4(),
  name: "Admin",
  email: "admin@empresa.com",
  phone: "(11) 98765-4321",
  avatar: null,
  role: "admin",
  createdAt: "2023-05-15T14:30:00Z",
  updatedAt: "2023-05-15T14:30:00Z",
  lastAccess: "2023-06-01T08:45:00Z",
  organization: mockOrganizations[0],
  permissions: {
    routes: [
      "dashboard",
      "leads",
      "calls",
      "ai-tools",
      "users",
      "integrations",
      "settings",
      "profile"
    ]
  }
};

export const mockUsers: User[] = [
  mockAuthenticatedUser,
  {
    id: uuidv4(),
    name: "Vendedor 1",
    email: "vendedor1@empresa.com",
    phone: "(11) 91234-5678",
    avatar: null,
    role: "seller",
    createdAt: "2023-05-16T09:20:00Z",
    updatedAt: "2023-05-16T09:20:00Z",
    lastAccess: "2023-05-31T16:30:00Z",
    organization: mockOrganizations[0],
    permissions: {
      routes: [
        "dashboard",
        "leads",
        "calls"
      ]
    }
  },
  {
    id: uuidv4(),
    name: "Gestor",
    email: "gestor@empresa.com",
    phone: "(11) 99876-5432",
    avatar: null,
    role: "admin", // Changed from 'manager' to 'admin' as manager is not a valid UserRole
    createdAt: "2023-05-16T10:15:00Z",
    updatedAt: "2023-05-16T10:15:00Z",
    lastAccess: "2023-06-01T11:20:00Z",
    organization: mockOrganizations[0],
    permissions: {
      routes: [
        "dashboard",
        "leads",
        "calls",
        "users",
        "settings"
      ]
    }
  }
];

export const mockAdminUsers = [
  {
    id: uuidv4(),
    name: "Admin Leadly",
    email: "admin@leadly.com",
    phone: "(11) 98888-7777",
    avatar: null,
    role: "leadly_employee",
    createdAt: "2023-04-01T08:00:00Z",
    updatedAt: "2023-04-01T08:00:00Z",
    lastAccess: "2023-06-01T09:30:00Z",
    permissions: {
      routes: ["*"]
    }
  },
  {
    id: uuidv4(),
    name: "Suporte Leadly",
    email: "suporte@leadly.com",
    phone: "(11) 97777-8888",
    avatar: null,
    role: "leadly_employee",
    createdAt: "2023-04-02T08:00:00Z",
    updatedAt: "2023-04-02T08:00:00Z",
    lastAccess: "2023-06-01T10:15:00Z",
    permissions: {
      routes: [
        "organizations",
        "users",
        "prompt"
      ]
    }
  }
];
