"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Download,
  Calendar,
  Filter,
  Save,
  Search,
  Eye,
  FileText,
  FileSpreadsheet,
  FileBox,
  Activity,
  Users,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { reportsApi } from "@/services/api/reports";

interface DriverActivityReportsDetailProps {
  hideHeader?: boolean;
}

export default function DriverActivityReportsDetail({
  hideHeader = false,
}: DriverActivityReportsDetailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await reportsApi.getDriverActivityReports();
        if (response?.data) setReportData(response.data);
      } catch (err) { /* keep fallback */ }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const tableData = [
    {
      driver: {
        name: "James Wilson",
        id: "DRV-001",
        avatar: "https://i.pravatar.cc/150?u=james",
      },
      activityType: "Vehicle Access",
      activityColor: "#3B82F6",
      activityBg: "#EFF6FF",
      description: "Unlocked vehicle BMW X5 (ABC123) via mobile app",
      dateTime: "Jan 15, 2024, 09:24 AM",
      device: "Mobile App",
      location: "London, UK",
      status: "Success",
      statusColor: "#10B981",
      statusBg: "#DCFCE7",
    },
    {
      driver: {
        name: "Sarah Johnson",
        id: "DRV-002",
        avatar: "https://i.pravatar.cc/150?u=sarah",
      },
      activityType: "Payment Activity",
      activityColor: "#F59E0B",
      activityBg: "#FFFBEB",
      description: "Monthly rental payment processed Amount: £850.00",
      dateTime: "Jan 15, 2024, 08:45 AM",
      device: "Web Portal",
      location: "Manchester, UK",
      status: "Success",
      statusColor: "#10B981",
      statusBg: "#DCFCE7",
    },
    {
      driver: {
        name: "Unknown Driver",
        id: "DRV-999",
        avatar: "https://i.pravatar.cc/150?u=unknown",
      },
      activityType: "Login Failed",
      activityColor: "#EF4444",
      activityBg: "#FEE2E2",
      description: "Failed login attempt Invalid credentials",
      dateTime: "Jan 15, 2024, 07:12 AM",
      device: "Mobile App",
      location: "Unknown Location",
      status: "Failed",
      statusColor: "#EF4444",
      statusBg: "#FEE2E2",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!hideHeader && (
        <PageHeader
          title="Driver Activity Reports"
          description="Track driver performance, , and behavioral analytics"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Filters Section */}
      <Card padding="1.5rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.25rem",
              }}
            >
              Driver Activity Report Filters
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Filter driver activities by driver, date range, and activity type
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="secondary"
              size="md"
              style={{
                backgroundColor: "#3B82F6",
                color: "#fff",
                borderColor: "#3B82F6",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Download size={16} /> Export
            </Button>
            <Button
              variant="secondary"
              size="md"
              style={{
                backgroundColor: "#F59E0B",
                color: "#fff",
                borderColor: "#F59E0B",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Calendar size={16} /> Schedule
            </Button>
            <Button
              variant="secondary"
              size="md"
              style={{
                backgroundColor: "#F3F4F6",
                color: COLORS.TEXT_MAIN,
                borderColor: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Save size={16} /> Save Preset
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
            gap: "1.25rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Driver"
            options={[
              { label: "All Drivers", value: "all" },
              { label: "James Wilson", value: "james" },
              { label: "Sarah Johnson", value: "sarah" },
            ]}
            placeholder="All Drivers"
          />
          <SelectField
            label="Activity Type"
            options={[
              { label: "All Activities", value: "all" },
              { label: "Vehicle Access", value: "vehicle_access" },
              { label: "Payment Activity", value: "payment_activity" },
              { label: "Login", value: "login" },
            ]}
            placeholder="All Activities"
          />
          <SelectField
            label="Date Range"
            options={[
              { label: "Last 7 days", value: "last_7" },
              { label: "Last 30 days", value: "last_30" },
              { label: "Last 90 days", value: "last_90" },
            ]}
            placeholder="Last 7 days"
          />
          <SelectField
            label="Status Filter"
            options={[
              { label: "All Status", value: "all" },
              { label: "Success", value: "success" },
              { label: "Failed", value: "failed" },
            ]}
            placeholder="All Status"
          />
          <Button
            variant="primary"
            size="md"
            style={{
              height: "42px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0 1.5rem",
            }}
          >
            <Filter size={18} /> Apply Filters
          </Button>
        </div>

        {/* Active Filters */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1.25rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={activeFilterStyle}>
            <span style={{ color: "#3B82F6" }}>Driver:</span> All Drivers
          </div>
          <div style={activeFilterStyle}>
            <span style={{ color: "#3B82F6" }}>Activity:</span> All Activities
          </div>
          <div style={activeFilterStyle}>
            <span style={{ color: "#3B82F6" }}>Date:</span> Last 7 days
          </div>
          <button
            style={{
              border: "none",
              background: "none",
              color: "#6B7280",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <X size={14} /> Clear all
          </button>
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
          title="Total Activities"
          value="8,542"
          badge="+15.3% vs last period"
          icon={<Activity size={20} />}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
        />
        <StatCard
          title="Active Drivers"
          value="156"
          badge="+8.7% vs last period"
          icon={<Users size={20} />}
          iconBg="#DCFCE7"
          iconColor="#10B981"
        />
        <StatCard
          title="Failed Activities"
          value="23"
          badge="+5.2% vs last period"
          badgeColor="#EF4444"
          badgeBg="#FEE2E2"
          icon={<AlertTriangle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#EF4444"
        />
        <StatCard
          title="Avg. Session Duration"
          value="42m"
          badge="+3.1% vs last period"
          icon={<Clock size={20} />}
          iconBg="#FFFBEB"
          iconColor="#F59E0B"
        />
      </div>

      {/* Table Section */}
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
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.25rem",
              }}
            >
              Driver Activity Log
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              8,542 activities found • Click driver name to view profile
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: "#10B981",
                color: "#fff",
                borderColor: "#10B981",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FileSpreadsheet size={16} /> CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                borderColor: "#EF4444",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FileText size={16} /> PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: "#10B981",
                color: "#fff",
                borderColor: "#10B981",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FileBox size={16} /> Excel
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <th style={headerCellStyle}>Driver</th>
                <th style={headerCellStyle}>Activity Type</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Date & Time</th>
                <th style={headerCellStyle}>Device/Location</th>
                <th style={headerCellStyle}>Status</th>
                <th style={{ ...headerCellStyle, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                    transition: "background 0.2s",
                  }}
                >
                  <td style={bodyCellStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <img
                        src={row.driver.avatar}
                        alt={row.driver.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            color: COLORS.TEXT_MAIN,
                            fontSize: "0.9rem",
                            margin: 0,
                          }}
                        >
                          {row.driver.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: COLORS.TEXT_MUTED,
                            margin: 0,
                          }}
                        >
                          {row.driver.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={bodyCellStyle}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        backgroundColor: row.activityBg,
                        color: row.activityColor,
                        fontWeight: 600,
                      }}
                    >
                      {row.activityType}
                    </span>
                  </td>
                  <td style={{ ...bodyCellStyle, maxWidth: "250px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      {row.description.split("Amount:")[0]}
                    </p>
                    {row.description.includes("Amount:") && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        Amount: {row.description.split("Amount:")[1]}
                      </p>
                    )}
                  </td>
                  <td style={bodyCellStyle}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      {row.dateTime.split(",")[0]}, {row.dateTime.split(",")[1]}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: COLORS.TEXT_MUTED,
                      }}
                    >
                      {row.dateTime.split(",")[2]}
                    </p>
                  </td>
                  <td style={bodyCellStyle}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      {row.device}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: COLORS.TEXT_MUTED,
                      }}
                    >
                      {row.location}
                    </p>
                  </td>
                  <td style={bodyCellStyle}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "4px 12px",
                        borderRadius: "9999px",
                        backgroundColor: row.statusBg,
                        color: row.statusColor,
                        fontWeight: 600,
                        border: `1px solid ${row.statusColor}20`,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ ...bodyCellStyle, textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#3B82F6",
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const activeFilterStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  padding: "4px 12px",
  borderRadius: "6px",
  backgroundColor: "#EFF6FF",
  color: COLORS.TEXT_MAIN,
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const headerCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#6B7280",
};

const bodyCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};
