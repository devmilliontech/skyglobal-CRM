import React from "react";
import { COLORS } from "@/constants/Constant";
import { ChevronRight, LucideIcon } from "lucide-react";
import Card from "@/components/Card";

interface ReportCategoryCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  reports: string[];
  availableCountText: string;
  onClick?: () => void;
}

export default function ReportCategoryCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  reports,
  availableCountText,
  onClick,
}: ReportCategoryCardProps) {
  return (
    <Card padding="1.5rem" style={{ cursor: "pointer" }} onClick={onClick}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
          }}
        >
          <Icon size={24} />
        </div>
        <div>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.25rem",
            }}
          >
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            {subtitle}
          </p>
        </div>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {reports.map((report, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.85rem",
              color: COLORS.TEXT_MAIN,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#D1D5DB",
              }}
            />
            {report}
          </li>
        ))}
      </ul>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          paddingTop: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          {availableCountText}
        </span>
        <ChevronRight size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
      </div>
    </Card>
  );
}
