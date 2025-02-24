
import React from 'react';
import { List, CreditCard, Building2 } from "lucide-react";
import { organizationRoutes } from "./constants";

export const getRouteIcon = (route: string): JSX.Element => {
  // Para rotas do ambiente administrativo
  if (route.includes('analysis-packages')) return <List className="h-4 w-4" />;
  if (route.includes('financial')) return <CreditCard className="h-4 w-4" />;
  if (route.includes('organizations')) return <Building2 className="h-4 w-4" />;
  
  // Para rotas da organização
  const routeConfig = organizationRoutes.find(r => r.id === route);
  if (routeConfig) {
    const Icon = routeConfig.icon;
    return <Icon className="h-4 w-4" />;
  }
  
  return <List className="h-4 w-4" />;
};
