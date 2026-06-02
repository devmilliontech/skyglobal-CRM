"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Search,
  Plus,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  DollarSign,
  Activity,
  Car,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const SCHEDULES = [
  {
    id: 1,
    name: "Monthly Revenue Report",
    category: "Financial Reports",
    status: "Active",
    statusColor: "#10B981",
    statusBg: "#DCFCE7",
    frequency: "Monthly",
    recipients: 4,
    nextRun: "Dec 1, 2024",
    nextRunTime: "09:00 AM UTC",
    lastRun: "Nov 1, 2024",
    lastRunStatus: "Success",
    format: ["CSV", "PDF"],
    icon: DollarSign,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    id: 2,
    name: "Overdue Payments Report",
    category: "Overdue Reports",
    status: "Active",
    statusColor: "#10B981",
    statusBg: "#DCFCE7",
    frequency: "Weekly",
    recipients: 2,
    nextRun: "Nov 18, 2024",
    nextRunTime: "08:00 AM UTC",
    lastRun: "Nov 11, 2024",
    lastRunStatus: "Success",
    format: ["Excel"],
    icon: AlertCircle,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
  },
  {
    id: 3,
    name: "Driver Activity Report",
    category: "Driver Activity Reports",
    status: "Failed",
    statusColor: "#EF4444",
    statusBg: "#FEE2E2",
    frequency: "Daily",
    recipients: 1,
    nextRun: "Nov 18, 2024",
    nextRunTime: "Failed",
    lastRun: "Nov 17, 2024",
    lastRunStatus: "Email error",
    format: ["PDF"],
    icon: Users,
    iconColor: "#10B981",
    iconBg: "#DCFCE7",
    isError: true,
  },
  {
    id: 4,
    name: "Vehicle Utilisation Report",
    category: "Vehicle Utilisation Reports",
    status: "Paused",
    statusColor: "#6B7280",
    statusBg: "#F3F4F6",
    frequency: "Quarterly",
    recipients: 3,
    nextRun: "Jan 1, 2025",
    nextRunTime: "10:00 AM UTC",
    lastRun: "Oct 1, 2024",
    lastRunStatus: "Success",
    format: ["CSV"],
    icon: Car,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
];

export default function ScheduledReports({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState("Active");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!hideHeader && (
        <PageHeader
          title="Scheduled Reports"
          description="Manage automated report email deliveries"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Top Filter Bar */}
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
                placeholder="Search schedules..."
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
                label="Active"
                active={activeFilter === "Active"}
                onClick={() => setActiveFilter("Active")}
                count="24"
                icon={<CheckCircle2 size={14} />}
              />
              <FilterTab
                label="Paused"
                active={activeFilter === "Paused"}
                onClick={() => setActiveFilter("Paused")}
                icon={<Pause size={14} />}
              />
              <FilterTab
                label="Failed"
                active={activeFilter === "Failed"}
                onClick={() => setActiveFilter("Failed")}
                icon={<AlertCircle size={14} />}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <SelectField
              options={[
                { label: "All Frequencies", value: "all" },
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
              ]}
              placeholder="All Frequencies"
              wrapperStyle={{ width: "180px", marginBottom: 0 }}
            />
            <Button
              variant="primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus size={18} /> Create Schedule
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
        }}
      >
        <StatCard
          title="Active Schedules"
          value="24"
          badge="+12%"
          icon={<Calendar size={20} />}
          iconBg="#DCFCE7"
          iconColor="#10B981"
        />
        <StatCard
          title="Due Today"
          value="8"
          badge="Today"
          icon={<Clock size={20} />}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
        />
        <StatCard
          title="Reports Sent"
          value="342"
          badge="This month"
          icon={<Activity size={20} />}
          iconBg="#F3F4F6"
          iconColor="#4B5563"
        />
        <StatCard
          title="Failed Deliveries"
          value="3"
          badge="Attention"
          badgeColor="#EF4444"
          badgeBg="#FEE2E2"
          icon={<AlertCircle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#EF4444"
        />
      </div>

      {/* Report Schedules Table */}
      <Card padding="0">
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
            }}
          >
            Report Schedules
          </h3>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Filter size={14} /> Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Download size={14} /> Export
            </Button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                textAlign: "left",
                backgroundColor: "#F9FAFB",
              }}
            >
              <th style={tableHeaderStyle}>REPORT NAME</th>
              <th style={tableHeaderStyle}>STATUS</th>
              <th style={tableHeaderStyle}>FREQUENCY</th>
              <th style={tableHeaderStyle}>RECIPIENTS</th>
              <th style={tableHeaderStyle}>NEXT RUN</th>
              <th style={tableHeaderStyle}>LAST RUN</th>
              <th style={tableHeaderStyle}>FORMAT</th>
              <th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULES.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                  backgroundColor: row.isError ? "#FFF1F2" : "transparent",
                }}
              >
                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: row.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: row.iconColor,
                      }}
                    >
                      <row.icon size={16} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                        }}
                      >
                        {row.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        {row.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: row.statusBg,
                      color: row.statusColor,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: COLORS.TEXT_MAIN,
                      fontSize: "0.85rem",
                    }}
                  >
                    <Calendar size={14} color={COLORS.TEXT_MUTED} />
                    {row.frequency}
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", marginRight: "4px" }}>
                      {Array.from({ length: Math.min(row.recipients, 2) }).map(
                        (_, i) => (
                          <div
                            key={i}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              border: "2px solid #fff",
                              backgroundColor: "#E5E7EB",
                              marginLeft: i > 0 ? "-8px" : 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <User size={12} color="#9CA3AF" />
                          </div>
                        ),
                      )}
                    </div>
                    {row.recipients > 2 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                          fontWeight: 600,
                        }}
                      >
                        +{row.recipients - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {row.nextRun}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: row.isError ? "#EF4444" : COLORS.TEXT_MUTED,
                    }}
                  >
                    {row.nextRunTime}
                  </p>
                </td>
                <td style={tableCellStyle}>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {row.lastRun}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: row.isError ? "#EF4444" : "#10B981",
                    }}
                  >
                    {row.lastRunStatus}
                  </p>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {row.format.map((f) => (
                      <span
                        key={f}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <button style={actionButtonStyle}>
                      <Edit2 size={14} />
                    </button>
                    <button style={actionButtonStyle}>
                      <Plus size={14} style={{ transform: "rotate(45deg)" }} />
                    </button>
                    <button style={{ ...actionButtonStyle, color: "#EF4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: COLORS.TEXT_MUTED }}>
            Showing 4 of 24 schedules
          </span>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <button style={pageButtonStyle}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              style={{
                ...pageButtonStyle,
                backgroundColor: COLORS.PRIMARY_MAIN,
                color: "#fff",
                borderColor: COLORS.PRIMARY_MAIN,
              }}
            >
              1
            </button>
            <button style={pageButtonStyle}>2</button>
            <button style={pageButtonStyle}>3</button>
            <button style={pageButtonStyle}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FilterTab({
  label,
  active,
  onClick,
  icon,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  count?: string;
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
      {count && (
        <span style={{ marginLeft: "4px", fontSize: "0.75rem", opacity: 0.7 }}>
          {count}
        </span>
      )}
    </button>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.025em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  verticalAlign: "middle",
};

const actionButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: COLORS.TEXT_SECONDARY,
  padding: "4px",
};

const pageButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  backgroundColor: "#fff",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
  cursor: "pointer",
};
