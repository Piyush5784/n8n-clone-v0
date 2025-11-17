"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./Buttons";

export default function Navbar() {
  const { useState } = React;
  const [isOpen, setIsOpen] = useState(false);

  type IconName = "Menu" | "X" | "User" | "LogIn" | "LayoutDashboard";

  const navItems: { name: string; icon: IconName; href: string }[] = [
    { name: "Sign In", icon: "LogIn", href: "/signin" },
    { name: "Sign Up", icon: "User", href: "/signup" },
    { name: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
  ];

  const getIcon = (
    iconName: "Menu" | "X" | "User" | "LogIn" | "LayoutDashboard"
  ) => {
    const { Menu, X, User, LogIn, LayoutDashboard } = require("lucide-react");
    const icons = { Menu, X, User, LogIn, LayoutDashboard };
    return icons[iconName];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="cursor-pointer">
              <span className="text-2xl font-bold bg-stone-900 bg-clip-text text-transparent">
                FlowBoard
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = getIcon(item.icon);
              return (
                <Button key={item.name} asChild variant={"link"}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-4 text-lg py-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    <IconComponent size={18} />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              {isOpen
                ? React.createElement(getIcon("X"), { size: 24 })
                : React.createElement(getIcon("Menu"), { size: 24 })}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-3">
          {navItems.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                <IconComponent size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
