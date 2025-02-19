
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "./organization/OrganizationSidebar";
import { OrganizationNavbar } from "./organization/OrganizationNavbar";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <OrganizationSidebar />
        <div className="flex-1">
          <OrganizationNavbar />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
