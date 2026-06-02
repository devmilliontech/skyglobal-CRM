"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Search,
  Plus,
  Play,
  Edit2,
  Copy,
  Trash2,
  FileText,
  AlertCircle,
  Users,
  Car,
  Activity,
  DollarSign,
  User,
  Share2,
  Star,
  ChevronDown,
  Save,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";

const PRESETS = [
  {
    id: 1,
    title: "Monthly Revenue Report",
    category: "Financial",
    icon: DollarSign,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    period: "Last 30 days",
    filters: "Active agreements",
    format: "CSV, PDF",
    tags: ["revenue", "vehicles", "monthly"],
    statusColors: ["#10B981", "#3B82F6"],
  },
  {
    id: 2,
    title: "Overdue Payments",
    category: "Overdue",
    icon: AlertCircle,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
    period: "All time",
    filters: "Overdue > 7 days",
    format: "Excel",
    tags: ["overdue", "payments", "critical"],
    statusColors: ["#F59E0B", "#EF4444"],
  },
  {
    id: 3,
    title: "Driver Performance",
    category: "Driver Activity",
    icon: Users,
    iconBg: "#DCFCE7",
    iconColor: "#10B981",
    period: "Last quarter",
    filters: "Active drivers",
    format: "PDF",
    tags: ["drivers", "performance", "quarterly"],
    statusColors: ["#10B981", "#3B82F6"],
  },
  {
    id: 4,
    title: "Fleet Utilisation",
    category: "Vehicle Utilisation",
    icon: Car,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    period: "This month",
    filters: "All vehicles",
    format: "CSV",
    tags: ["fleet", "utilisation", "efficiency"],
    statusColors: ["#F59E0B", "#3B82F6"],
  },
  {
    id: 5,
    title: "Weekly Operations",
    category: "Operational",
    icon: Activity,
    iconBg: "#F3F4F6",
    iconColor: "#4B5563",
    period: "Last 7 days",
    filters: "All operations",
    format: "Excel, PDF",
    tags: ["operations", "weekly", "summary"],
    statusColors: ["#10B981", "#F59E0B"],
  },
  {
    id: 6,
    title: "Outstanding Balance",
    category: "Financial",
    icon: DollarSign,
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
    period: "Current",
    filters: "All agreements",
    format: "CSV, Excel",
    tags: ["balance", "outstanding", "finance"],
    statusColors: ["#3B82F6", "#EF4444"],
  },
];

export default function SavedPresets({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState("My Presets");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!hideHeader && (
        <PageHeader
          title="Saved Presets"
          description="Manage and organize your saved report configurations"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Filter Bar */}
      <Card padding="1rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flex: 1,
            }}
          >
            <div style={{ position: "relative", width: "240px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: COLORS.TEXT_MUTED,
                }}
              />
              <input
                placeholder="Search presets..."
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px 0 36px",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.9rem",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                backgroundColor: "#F3F4F6",
                padding: "4px",
                borderRadius: "8px",
              }}
            >
              <FilterTab
                label="My Presets"
                active={activeFilter === "My Presets"}
                onClick={() => setActiveFilter("My Presets")}
                icon={<Save size={14} />}
              />
              <FilterTab
                label="Shared"
                active={activeFilter === "Shared"}
                onClick={() => setActiveFilter("Shared")}
                icon={<Share2 size={14} />}
              />
              <FilterTab
                label="Default"
                active={activeFilter === "Default"}
                onClick={() => setActiveFilter("Default")}
                icon={<Star size={14} />}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <SelectField
              options={[
                { label: "All Categories", value: "all" },
                { label: "Financial", value: "financial" },
                { label: "Operational", value: "operational" },
                { label: "Driver Activity", value: "driver_activity" },
                { label: "Vehicle Utilisation", value: "vehicle_utilization" },
              ]}
              placeholder="All Categories"
              wrapperStyle={{ width: "180px", marginBottom: 0 }}
            />
            <Button
              variant="primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus size={18} /> Create Preset
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid of Presets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {PRESETS.map((preset) => (
          <Card key={preset.id} padding="1.5rem">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: preset.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: preset.iconColor,
                  }}
                >
                  <preset.icon size={22} />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "2px",
                    }}
                  >
                    {preset.title}
                  </h4>
                  <p
                    style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
                  >
                    {preset.category}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {preset.statusColors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <DetailRow label="Period:" value={preset.period} />
              <DetailRow label="Filters:" value={preset.filters} />
              <DetailRow label="Format:" value={preset.format} />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {preset.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    backgroundColor: "#EFF6FF",
                    color: COLORS.PRIMARY_MAIN,
                    fontWeight: 600,
                    textTransform: "lowercase",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button
                variant="primary"
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Play size={16} fill="white" /> Run
              </Button>
              <IconButton icon={<Edit2 size={16} />} />
              <IconButton icon={<Copy size={16} />} />
              <IconButton icon={<Trash2 size={16} />} color="#EF4444" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FilterTab({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        transition: "all 0.2s",
        backgroundColor: active ? "#fff" : "transparent",
        color: active ? COLORS.PRIMARY_MAIN : COLORS.TEXT_SECONDARY,
        boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.85rem",
      }}
    >
      <span style={{ color: COLORS.TEXT_SECONDARY }}>{label}</span>
      <span style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>{value}</span>
    </div>
  );
}

function IconButton({
  icon,
  color = COLORS.TEXT_SECONDARY,
}: {
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        border: `1px solid ${COLORS.BORDER_MAIN}`,
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: color,
        transition: "all 0.2s",
      }}
    >
      {icon}
    </button>
  );
}
