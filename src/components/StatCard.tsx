import { COLORS } from "@/constants/Constant";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  compact?: boolean;
}

export default function StatCard({
  title,
  value,
  badge,
  badgeColor = COLORS.SUCCESS_MAIN,
  badgeBg = COLORS.SUCCESS_LIGHT,
  icon,
  iconBg,
  iconColor,
  onClick,
  style,
  compact = false,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.BG_CARD,
        padding: compact ? "0.65rem 0.7rem" : "1.5rem",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: compact ? "0.35rem" : "0.75rem",
        minWidth: 0,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? "1.15rem" : "0.25rem",
        minWidth: 0
      }}>
        <p style={{ color: "#6B7280", fontSize: compact ? "0.68rem" : "0.85rem", marginBottom: compact ? "0" : "0.25rem", lineHeight: 1.2 }}>
          {title}
        </p>
        <h3 style={{ fontSize: compact ? "1.15rem" : "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>
          {value}
        </h3>
      </div>
      <div
        style={{
          background: iconBg,
          color: iconColor,
          padding: compact ? "0.42rem" : "0.75rem",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  );
}
