import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant:
    | "default"
    | "alternative"
    | "dark"
    | "light"
    | "green"
    | "red"
    | "yellow"
    | "purple";
};
const variantClasses: Record<ButtonProps["variant"], string> = {
  default:
    "text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
  alternative:
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700",
  dark: "text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
  light:
    "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
  green:
    "text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
  red: "text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
  yellow:
    "text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
  purple:
    "text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2",
};

export const Button = ({
  children,
  variant = "default",
  onClick,
  className,
}: ButtonProps) => (
  <button
    type="button"
    className={`${className} ${variantClasses[variant]}`}
    onClick={onClick}
  >
    {children}
  </button>
);
