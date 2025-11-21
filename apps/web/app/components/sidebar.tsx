import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { KeyRound, Workflow } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Workflows", href: "/dashboard", icon: <Workflow /> },
    { name: "Credentials", href: "/credentails", icon: <KeyRound /> },
    // { name: "Executions", href: "/executions", icon: <Activity /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      {/* Dashboard Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 border border-transparent"
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="px-4 py-4 border-t border-gray-100">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
