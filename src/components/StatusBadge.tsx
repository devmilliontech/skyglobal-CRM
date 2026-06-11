import { COLORS } from "@/constants/Constant";
import React from "react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let color = "#6B7280";
  let bg = "#F3F4F6";

  const lowerStatus = String(status || "").toLowerCase();

  // Map out common status colors based on keywords
  if (
    lowerStatus.includes("cancelled") ||
    lowerStatus.includes("canceled") ||
    lowerStatus.includes("late") ||
    lowerStatus.includes("rejected") ||
    lowerStatus.includes("unpaid") ||
    lowerStatus.includes("failed") ||
    lowerStatus.includes("escalated") ||
    lowerStatus.includes("not returned") ||
    lowerStatus.includes("needs repair") ||
    lowerStatus.includes("expired") ||
    lowerStatus.includes("overdue") ||
    lowerStatus.includes("blocked") ||
    lowerStatus.includes("inactive")
  ) {
    color = "#fff"; // Red
    bg = "#f42f2fff";
  } else if (
    lowerStatus.includes("paid") ||
    lowerStatus.includes("on time") ||
    lowerStatus.includes("active") ||
    lowerStatus.includes("resolved") ||
    lowerStatus.includes("verified") ||
    lowerStatus.includes("approved") ||
    lowerStatus.includes("available") ||
    lowerStatus.includes("excellent") ||
    lowerStatus.includes("valid") ||
    lowerStatus.includes("completed")
  ) {
    color = COLORS.SUCCESS_MAIN; // Emerald/Green
    bg = COLORS.SUCCESS_LIGHT;
  } else if (
    lowerStatus.includes("pending") ||
    lowerStatus.includes("open") ||
    lowerStatus.includes("partial") ||
    lowerStatus.includes("maintenance") ||
    lowerStatus.includes("under review") ||
    lowerStatus.includes("missing") ||
    lowerStatus.includes("expiring") ||
    lowerStatus.includes("incomplete") ||
    lowerStatus.includes("used up")
  ) {
    color = "#fff"; // Amber/Yellow
    bg = "#f59e0b";
  } else if (
    lowerStatus.includes("currently rented")
  ) {
    color = "#fff";
    bg = "#f42f2fff";
  } else if (
    lowerStatus.includes("upcoming") ||
    lowerStatus.includes("scheduled") ||
    lowerStatus.includes("refunded") ||
    lowerStatus.includes("review") ||
    lowerStatus.includes("in rental") ||
    lowerStatus.includes("good") ||
    lowerStatus.includes("short term") ||
    lowerStatus.includes("short-term")
  ) {
    color = COLORS.PRIMARY_MAIN; // Blue
    bg = COLORS.INFO_LIGHT;
  } else if (lowerStatus.includes("rent-to-own")) {
    color = COLORS.INFO_MAIN; // Blue
    bg = COLORS.INFO_LIGHT;
  }

  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: color,
        backgroundColor: bg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status}
    </span>
  );
}
