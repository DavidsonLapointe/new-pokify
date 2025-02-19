
import React from "react";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};
