import { COLORS } from "@/constants/Constant";
import React from "react";
import { useRouter } from "next/navigation";

export interface TabItem {
  name: string;
  path?: string;
}

interface TabsNavProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  margin?: string;
}

export default function TabsNav({
  tabs,
  activeTab,
  setActiveTab,
  margin = "-2rem -2rem 0 -2rem",
}: TabsNavProps) {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid #E5E7EB",
        margin: margin,
        padding: "1rem",
        background: COLORS.BG_CARD,
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        border: `1px solid ${COLORS.BORDER_MAIN}`,
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.name ||
          (activeTab === "Rentals Management" &&
            tab.name === "Rentals Management");

        return (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              if (tab.path) {
                router.push(tab.path);
              }
            }}
            style={{
              padding: "1rem 1.5rem",
              fontSize: "0.85rem",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#2563EB" : "#6B7280",
              borderBottom: isActive
                ? "2px solid #2563EB"
                : "2px solid transparent",
              background: "transparent",
              marginBottom: "-1px",
              cursor: "pointer",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}
