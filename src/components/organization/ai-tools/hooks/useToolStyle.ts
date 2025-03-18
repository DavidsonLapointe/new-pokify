
import { ToolStatus } from "@/components/organization/modules/types";

export const useToolStyle = () => {
  // Function to return the appropriate icon for status
  const getStatusIcon = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "Lock";
      case "contracted": 
        return "AlertTriangle";
      case "configured": 
        return "CheckCircle2";
      case "coming_soon":
        return "Clock";
      case "setup":
        return "RotateCw";
    }
  };

  // Return the background color class for badges based on status
  const getBadgeClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-700";
      case "contracted": 
        return "bg-yellow-100 text-yellow-700";
      case "configured": 
        return "bg-green-100 text-green-700";
      case "coming_soon":
        return "bg-gray-100 text-gray-700";
      case "setup":
        return "bg-blue-100 text-blue-700";
    }
  };

  // Return the button color class based on status
  const getButtonClass = (status: ToolStatus) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-600 hover:bg-red-700 text-white";
      case "contracted": 
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "configured": 
        return "bg-green-600 hover:bg-green-700 text-white";
      case "coming_soon":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "setup":
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  return {
    getStatusIcon,
    getBadgeClass,
    getButtonClass
  };
};
