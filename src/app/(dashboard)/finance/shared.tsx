"use client";

import React from "react";
import { COLORS } from "@/constants/Constant";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const FinanceStatCard = ({
  label,
  value,
  trend,
  trendValue,
  icon,
  iconBg,
  iconColor,
  subLabel,
  valueColor,
}: any) => {
  const isPositive = trend === "up";
  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flex: 1
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: COLORS.TEXT_SECONDARY,
              fontWeight: 500,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: valueColor || COLORS.TEXT_MAIN,
            }}
          >
            {value}
          </span>
        </div>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
          }}
        >
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {trendValue && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.1rem",
              color: isPositive ? "#16A34A" : COLORS.ERROR_MAIN,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trendValue}
          </div>
        )}
        <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_MUTED }}>
          {subLabel}
        </span>
      </div>
    </div>
  );
};

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const valueFormatted =
      entry.value >= 1000
        ? (entry.value / 1000).toFixed(entry.value % 1000 === 0 ? 0 : 1) + "k"
        : entry.value;

    return (
      <div
        style={{
          backgroundColor: entry.color || entry.stroke || entry.fill,
          padding: "4px 10px",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          whiteSpace: "nowrap",
        }}
      >
        <span>
          ({label}, {valueFormatted})
        </span>
        {entry.name &&
          entry.name !== "amount" &&
          entry.name !== "Outstanding" && <span>{entry.name}</span>}
      </div>
    );
  }
  return null;
};
