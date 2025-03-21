
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  iconColor?: string;
}

export const SidebarMenuItem = ({
  icon: Icon,
  label,
  path,
  active,
  iconColor
}: SidebarMenuItemProps) => {
  return (
    <Link
      to={path}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${active ? "bg-primary text-white" : "hover:bg-[#F1F0FB] text-gray-700"}
      `}
    >
      <Icon 
        className={`h-4 w-4 mr-3 ${active ? "text-white" : ""}`} 
        color={!active && iconColor ? iconColor : undefined}
      />
      {label}
    </Link>
  );
};
