import { Button } from "./Buttons";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Workflows", href: "/dashboard", icon: "⚡" },
    { name: "Credentials", href: "/credentials", icon: "🔑" },
    { name: "Executions", href: "/executions", icon: "📝" },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 border-t border-gray-200">
        <Button variant="red" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
