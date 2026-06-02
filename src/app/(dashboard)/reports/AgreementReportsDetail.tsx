"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Download,
  Calendar,
  Bookmark,
  Eye,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  Edit2,
  ExternalLink,
  Car,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import { reportsApi } from "@/services/api/reports";

const STATS = [
  {
    title: "Total Agreements",
    value: "1,247",
    trend: "+8.3% vs last month",
    icon: FileText,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    title: "Active Agreements",
    value: "1,089",
    trend: "+5.2% vs last month",
    icon: CheckCircle,
    iconColor: "#10B981",
    iconBg: "#DCFCE7",
  },
  {
    title: "Overdue Agreements",
    value: "67",
    trend: "+12.4% vs last month",
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
  },
  {
    title: "Avg. Agreement Value",
    value: "£18,450",
    trend: "+2.1% vs last month",
    icon: Bookmark, // Closest to pound sign in user context or use text
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
  },
];

const TABLE_DATA = [
  {
    id: "AGR-2024-001",
    vehicle: "BMW X5 M Sport",
    reg: "ABC123",
    driver: "James Wilson",
    email: "james.w@email.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    type: "Rent-to-Own",
    typeColor: "#3B82F6",
    typeBg: "#EFF6FF",
    value: "£24,000",
    outstanding: "£2,850",
    status: "Overdue",
    statusColor: "#EF4444",
    statusBg: "#FEE2E2",
  },
  {
    id: "AGR-2024-002",
    vehicle: "Mercedes C-Class",
    reg: "XYZ789",
    driver: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    type: "Standard Rental",
    typeColor: "#F59E0B",
    typeBg: "#FFFBEB",
    value: "£12,000",
    outstanding: "£1,200",
    status: "Overdue",
    statusColor: "#F59E0B",
    statusBg: "#FFFBEB",
  },
  {
    id: "AGR-2024-003",
    vehicle: "Audi A4",
    reg: "DEF456",
    driver: "Michael Brown",
    email: "michael.b@email.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    type: "Long-term Rental",
    typeColor: "#10B981",
    typeBg: "#DCFCE7",
    value: "£18,000",
    outstanding: "£500",
    status: "Active",
    statusColor: "#10B981",
    statusBg: "#DCFCE7",
  },
];

export default function AgreementReportsDetail({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await reportsApi.getAgreementReports();
        if (response?.data) setReportData(response.data);
      } catch (err) { /* keep fallback */ }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!hideHeader && (
        <PageHeader
          title="Agreement Reports"
          description="Detailed agreement-level performance and status analytics"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Filters Card */}
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
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.25rem",
              }}
            >
              Agreement Report Filters
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Filter and configure agreement-level reports
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="primary"
              size="md"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
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
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Bookmark size={16} /> Save Preset
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) 140px",
            gap: "1.25rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Agreement Type"
            options={[
              { label: "All Types", value: "all" },
              { label: "Rent-to-Own", value: "rent_to_own" },
              { label: "Rental", value: "rental" },
              { label: "Lease", value: "lease" },
            ]}
            placeholder="All Types"
          />
          <SelectField
            label="Owner"
            options={[
              { label: "All Owners", value: "all" },
              { label: "Internal", value: "internal" },
              { label: "Partner", value: "partner" },
            ]}
            placeholder="All Owners"
          />
          <SelectField
            label="Status"
            options={[
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Overdue", value: "overdue" },
              { label: "Expired", value: "expired" },
            ]}
            placeholder="All Status"
          />
          <SelectField
            label="Date Range"
            options={[
              { label: "Last 30 days", value: "last_30" },
              { label: "Last 7 days", value: "last_7" },
              { label: "Last 90 days", value: "last_90" },
            ]}
            placeholder="Last 30 days"
          />
          <Button variant="primary" size="lg">
            Apply Filters
          </Button>
        </div>

        {/* Filter Chips */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1.25rem",
            alignItems: "center",
          }}
        >
          {[
            "Agreement Type: All Types",
            "Status: Active",
            "Date: Last 30 days",
          ].map((chip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "#EFF6FF",
                color: "#3B82F6",
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {chip}
              <X size={14} style={{ cursor: "pointer" }} />
            </div>
          ))}
          <button
            style={{
              fontSize: "0.8rem",
              color: COLORS.TEXT_SECONDARY,
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "0.5rem",
            }}
          >
            Clear all
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
        {STATS.map((stat, i) => (
          <Card key={i} padding="1.25rem">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.title}
                </p>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.value}
                </h3>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: stat.iconColor,
                    fontWeight: 600,
                  }}
                >
                  {stat.trend}
                </span>
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: stat.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.iconColor,
                }}
              >
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
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
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.25rem",
              }}
            >
              Agreement Details Report
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              1,247 agreements found • Click any row for detailed view
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: "#10B981",
                color: "#fff",
                borderColor: "#10B981",
              }}
            >
              CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                borderColor: "#EF4444",
              }}
            >
              PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: "#10B981",
                color: "#fff",
                borderColor: "#10B981",
              }}
            >
              Excel
            </Button>
          </div>
        </div>

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
              <th style={headerCellStyle}>Agreement ID</th>
              <th style={headerCellStyle}>Vehicle</th>
              <th style={headerCellStyle}>Driver</th>
              <th style={headerCellStyle}>Type</th>
              <th style={headerCellStyle}>Total Value</th>
              <th style={headerCellStyle}>Outstanding</th>
              <th style={headerCellStyle}>Status</th>
              <th style={{ ...headerCellStyle, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA.map((row, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
              >
                <td
                  style={{
                    ...bodyCellStyle,
                    fontWeight: 600,
                    color: COLORS.PRIMARY_MAIN,
                  }}
                >
                  {row.id}
                </td>
                <td style={bodyCellStyle}>
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
                        backgroundColor: "#EFF6FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3B82F6",
                      }}
                    >
                      <Car size={18} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                          fontSize: "0.85rem",
                          margin: 0,
                        }}
                      >
                        {row.vehicle}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                          margin: 0,
                        }}
                      >
                        {row.reg}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={bodyCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img
                      src={row.avatar}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                          margin: 0,
                        }}
                      >
                        {row.driver}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                          margin: 0,
                        }}
                      >
                        {row.email}
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
                      backgroundColor: row.typeBg,
                      color: row.typeColor,
                      fontWeight: 600,
                    }}
                  >
                    {row.type}
                  </span>
                </td>
                <td style={{ ...bodyCellStyle, fontWeight: 600 }}>
                  {row.value}
                </td>
                <td
                  style={{
                    ...bodyCellStyle,
                    fontWeight: 600,
                    color:
                      row.status === "Overdue" ? "#EF4444" : COLORS.TEXT_MAIN,
                  }}
                >
                  {row.outstanding}
                </td>
                <td style={bodyCellStyle}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: row.statusBg,
                      color: row.statusColor,
                      fontWeight: 600,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ ...bodyCellStyle, textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: COLORS.PRIMARY_MAIN,
                      }}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#F59E0B",
                      }}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#3B82F6",
                      }}
                    >
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const headerCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
};

const bodyCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};
