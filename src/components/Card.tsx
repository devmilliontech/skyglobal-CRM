import { COLORS } from "@/constants/Constant";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, padding = "1.5rem", className, style, onClick }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: COLORS.BG_CARD,
        padding: padding,
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
