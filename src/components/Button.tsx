import { COLORS } from "@/constants/Constant";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  style,
  className,
  type = "button",
  disabled = false,
}: ButtonProps) {
  // Base styles
  let bgColor = COLORS.PRIMARY_MAIN;
  let color = COLORS.BG_CARD;
  let border = "none";
  let padding = "0.5rem 1rem";
  let fontSize = "0.85rem";

  // Handle sizes
  if (size === "sm") {
    padding = "0.25rem 0.75rem";
    fontSize = "0.75rem";
  } else if (size === "lg") {
    padding = "0.75rem 1.5rem";
    fontSize = "1rem";
  } else if (size === "md") {
    padding = "0.5rem 1rem";
    fontSize = "0.85rem";
  }

  // Handle variants
  if (variant === "secondary") {
    bgColor = "#F3F4F6";
    color = "#374151";
  } else if (variant === "danger") {
    bgColor = COLORS.ERROR_MAIN;
    color = COLORS.BG_CARD;
  } else if (variant === "success") {
    bgColor = COLORS.SUCCESS_MAIN;
    color = COLORS.BG_CARD;
  } else if (variant === "warning") {
    bgColor = COLORS.WARNING_MAIN;
    color = COLORS.BG_CARD;
  } else if (variant === "outline") {
    bgColor = "transparent";
    color = "#374151";
    border = "1px solid #D1D5DB";
  } else if (variant === "ghost") {
    bgColor = "transparent";
    color = "#6B7280";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        background: disabled ? "#9CA3AF" : bgColor,
        color: color,
        padding: padding,
        borderRadius: "8px",
        border: border,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontWeight: 600,
        fontSize: fontSize,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
