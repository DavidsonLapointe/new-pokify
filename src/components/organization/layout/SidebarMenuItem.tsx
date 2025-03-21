
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
}

export const SidebarMenuItem = ({ icon: Icon, label, path, active }: SidebarMenuItemProps) => {
  return (
    <Link
      to={path}
      className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] ${
        active
          ? "bg-[#F1F0FB] text-[#9b87f5]"
          : "text-gray-600"
      }`}
    >
      <Icon className={`w-4 h-4 mr-3 ${active ? "text-[#9b87f5]" : "text-[#9b87f5]"}`} />
      {label}
    </Link>
  );
};
