"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Download,
  Calendar,
  Filter,
  Settings,
  Eye,
  Star,
  Car,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import { reportsApi } from "@/services/api/reports";

export default function OperationalReportsDetail({
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
        const response = await reportsApi.getOperationalReports();
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
          title="Operational Reports"
          description="Generate comprehensive operational insights and analytics"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Report Configuration */}
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
              Report Configuration
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Select report type and configure parameters
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
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.5fr 1fr",
            gap: "1.25rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Report Type"
            options={[
              {
                label: "Vehicle Utilization Report",
                value: "vehicle_utilization",
              },
              { label: "Maintenance Report", value: "maintenance" },
            ]}
            placeholder="Vehicle Utilization Report"
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
            label="Filter by Location"
            options={[
              { label: "All Locations", value: "all" },
              { label: "London", value: "london" },
              { label: "Manchester", value: "manchester" },
            ]}
            placeholder="All Locations"
          />
          <Button variant="primary" size="md" style={{ height: "30px" }}>
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Advanced Filters */}
      <Card padding="1.5rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
            }}
          >
            Advanced Filters
          </h3>
          <button
            style={{
              fontSize: "0.85rem",
              color: COLORS.PRIMARY_MAIN,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Clear all filters
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr) auto",
            gap: "1rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Vehicle Type"
            options={[
              { label: "All Types", value: "all" },
              { label: "Sedan", value: "sedan" },
              { label: "SUV", value: "suv" },
            ]}
          />
          <SelectField
            label="Fleet Owner"
            options={[
              { label: "All Owners", value: "all" },
              { label: "Internal", value: "internal" },
              { label: "Partner", value: "partner" },
            ]}
          />
          <SelectField
            label="Status"
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Maintenance", value: "maintenance" },
            ]}
          />
          <SelectField
            label="Agreement Type"
            options={[
              { label: "All Types", value: "all" },
              { label: "Rent", value: "rent" },
              { label: "Lease", value: "lease" },
            ]}
          />
          <SelectField
            label="Driver Rating"
            options={[
              { label: "All Ratings", value: "all" },
              { label: "4.5+", value: "4.5" },
              { label: "4.0+", value: "4.0" },
            ]}
          />
          <Button variant="primary" size="md">
            <Filter size={18} style={{ marginRight: "0.5rem" }} /> Apply
          </Button>
        </div>
      </Card>

      {/* Report Table */}
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
              Vehicle Utilization Report
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Last 30 days • 156 vehicles analyzed
            </p>
          </div>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <span style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Show columns:
            </span>
            <Button
              variant="secondary"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Settings size={14} /> Configure
            </Button>
            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "#E5E7EB",
                margin: "0 0.25rem",
              }}
            />
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
              <th style={headerCellStyle}>Vehicle</th>
              <th style={headerCellStyle}>Utilization %</th>
              <th style={headerCellStyle}>Revenue</th>
              <th style={headerCellStyle}>Total Bookings</th>
              <th style={headerCellStyle}>Avg Rating</th>
              <th style={headerCellStyle}>Status</th>
              <th style={{ ...headerCellStyle, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "BMW X5 M Sport",
                reg: "ABC123",
                year: "2022",
                util: 87,
                revenue: "£4,280",
                bookings: 24,
                rating: 4.8,
                status: "Active",
                statusColor: "#10B981",
                statusBg: "#DCFCE7",
                progressColor: "#10B981",
              },
              {
                name: "Mercedes C-Class",
                reg: "XYZ789",
                year: "2023",
                util: 65,
                revenue: "£3,150",
                bookings: 18,
                rating: 4.6,
                status: "Active",
                statusColor: "#10B981",
                statusBg: "#DCFCE7",
                progressColor: "#F59E0B",
              },
              {
                name: "Audi A4 Quattro",
                reg: "DEF456",
                year: "2022",
                util: 42,
                revenue: "£2,080",
                bookings: 12,
                rating: 4.3,
                status: "Maintenance",
                statusColor: "#F59E0B",
                statusBg: "#FFFBEB",
                progressColor: "#EF4444",
              },
            ].map((row, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
              >
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
                          fontSize: "0.9rem",
                          margin: 0,
                        }}
                      >
                        {row.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                          margin: 0,
                        }}
                      >
                        {row.reg} • {row.year}
                      </p>
                    </div>
                  </div>
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
                        flex: 1,
                        height: "6px",
                        backgroundColor: "#E5E7EB",
                        borderRadius: "3px",
                        minWidth: "100px",
                      }}
                    >
                      <div
                        style={{
                          width: `${row.util}%`,
                          height: "100%",
                          backgroundColor: row.progressColor,
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      {row.util}%
                    </span>
                  </div>
                </td>
                <td style={{ ...bodyCellStyle, fontWeight: 600 }}>
                  {row.revenue}
                </td>
                <td style={bodyCellStyle}>{row.bookings}</td>
                <td style={bodyCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{row.rating}</span>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  </div>
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
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
};

const bodyCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};
