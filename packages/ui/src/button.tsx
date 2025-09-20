"use client";

import { ReactNode, CSSProperties } from "react";

interface ButtonProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  variant?:
    | "default"
    | "alternative"
    | "dark"
    | "light"
    | "green"
    | "red"
    | "yellow"
    | "purple";
}

const commonStyles: CSSProperties = {
  fontWeight: "500",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  padding: "0.625rem 1.25rem",
  marginRight: "0.5rem",
  marginBottom: "0.5rem",
  outline: "none",
};

const buttonVariants: Record<string, CSSProperties> = {
  default: {
    color: "white",
    backgroundColor: "#1D4ED8",
    border: "none",
  },
  alternative: {
    color: "#1F2937",
    backgroundColor: "white",
    border: "1px solid #E5E7EB",
  },
  dark: {
    color: "white",
    backgroundColor: "#1F2937",
    border: "none",
  },
  light: {
    color: "#1F2937",
    backgroundColor: "white",
    border: "1px solid #D1D5DB",
  },
  green: {
    color: "white",
    backgroundColor: "#15803D",
    border: "none",
  },
  red: {
    color: "white",
    backgroundColor: "#B91C1C",
    border: "none",
  },
  yellow: {
    color: "white",
    backgroundColor: "#FACC15",
    border: "none",
  },
  purple: {
    color: "white",
    backgroundColor: "#6D28D9",
    border: "none",
  },
};

export const Button = ({
  children,
  style,
  onClick,
  variant = "default",
}: ButtonProps) => {
  const variantStyle = buttonVariants[variant] || buttonVariants.default;

  return (
    <button
      style={{ ...commonStyles, ...variantStyle, ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
