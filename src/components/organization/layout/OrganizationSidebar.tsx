
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface OrganizationSidebarProps {
  menuItems: any[];
  isActive: (path: string) => boolean;
  handleLogout: () => void;
}

export const OrganizationSidebar = ({ menuItems, isActive, handleLogout }: OrganizationSidebarProps) => {
  return (
    <aside className="w-64 bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30 border-r border-gray-200">
      <nav className="flex flex-col h-full py-6 px-3">
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={isActive(item.path)}
            />
          ))}
        </div>

        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-[#6E59A5] mt-auto"
        >
          <LogOut className="w-4 h-4 mr-3 text-[#6E59A5]" />
          Sair
        </Link>
      </nav>
    </aside>
  );
};
