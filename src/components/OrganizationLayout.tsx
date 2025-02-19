
import React from "react";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default OrganizationLayout;
