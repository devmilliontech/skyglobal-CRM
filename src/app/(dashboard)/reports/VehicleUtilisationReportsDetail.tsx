"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Download,
  Calendar,
  Filter,
  Eye,
  Car,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Save,
  FileSpreadsheet,
  FileText,
  FileJson,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { reportsApi } from "@/services/api/reports";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

const DISTRIBUTION_DATA = [
  { range: "0-20%", value: 12, color: "#EF4444" },
  { range: "21-40%", value: 28, color: "#F59E0B" },
  { range: "41-60%", value: 45, color: "#3B82F6" },
  { range: "61-80%", value: 52, color: "#10B981" },
  { range: "81-100%", value: 19, color: "#059669" },
];

const TREND_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  utilisation: 60 + Math.random() * 20,
}));

export default function VehicleUtilisationReportsDetail({
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
        const response = await reportsApi.getVehicleUtilisationReports();
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
          title="Vehicle Utilisation Reports"
          description="Track vehicle usage patterns, identify low/high utilisation outliers"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Filters Card */}
      <Card padding="1.5rem">
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.25rem",
            }}
          >
            Vehicle Utilisation Filters
          </h3>
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Filter vehicles by utilisation thresholds, date range, and vehicle
            type
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
            gap: "1rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Vehicle"
            options={[
              { label: "All Vehicles", value: "all" },
              { label: "Vehicle 1", value: "vehicle1" },
              { label: "Vehicle 2", value: "vehicle2" },
              { label: "Vehicle 3", value: "vehicle3" },
            ]}
            placeholder="All Vehicles"
          />
          <SelectField
            label="Date Range"
            options={[
              { label: "Last 30 days", value: "30" },
              { label: "Last 7 days", value: "7" },
              { label: "Last 14 days", value: "14" },
              { label: "Last 21 days", value: "21" },
            ]}
            placeholder="Last 30 days"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Min Utilisation %
            </label>
            <input
              type="number"
              defaultValue="0"
              min={0}
              style={{
                height: "30px",
                padding: "0.5rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Max Utilisation %
            </label>
            <input
              type="number"
              defaultValue="100"
              min={0}
              style={{
                height: "30px",
                padding: "0.5rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.9rem",
              }}
            />
          </div>
          <SelectField
            label="Vehicle Type"
            options={[
              { label: "All Types", value: "all" },
              { label: "Sedan", value: "sedan" },
              { label: "SUV", value: "suv" },
              { label: "Truck", value: "truck" },
            ]}
            placeholder="All Types"
          />
          <Button
            variant="primary"
            style={{ height: "30px", padding: "0 1.5rem" }}
          >
            Apply
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <FilterPill label="All Vehicles" />
            <FilterPill label="Last 30 days" />
            <FilterPill label="0% - 100%" />
            <button
              style={{
                background: "none",
                border: "none",
                color: COLORS.TEXT_MUTED,
                fontSize: "0.85rem",
                cursor: "pointer",
                marginLeft: "0.5rem",
              }}
            >
              ✕ Clear all
            </button>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={16} /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#FFF7ED",
                color: "#C2410C",
                borderColor: "#FED7AA",
              }}
            >
              <Calendar size={16} /> Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Save size={16} /> Save Preset
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
          title="Fleet Utilisation"
          value="74.2%"
          badge="+5.3% vs last month"
          icon={<TrendingUp size={20} />}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
        />
        <StatCard
          title="Low Utilisation (<30%)"
          value="12"
          badge="Need attention"
          badgeColor="#EF4444"
          badgeBg="#FEE2E2"
          icon={<AlertTriangle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#EF4444"
        />
        <StatCard
          title="High Utilisation (>90%)"
          value="8"
          badge="Excellent performance"
          badgeColor="#10B981"
          badgeBg="#DCFCE7"
          icon={<CheckCircle2 size={20} />}
          iconBg="#DCFCE7"
          iconColor="#10B981"
        />
        <StatCard
          title="Avg. Days Active"
          value="22.3"
          badge="out of 30 days"
          icon={<Clock size={20} />}
          iconBg="#FEF3C7"
          iconColor="#D97706"
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <Card padding="1.5rem">
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            Utilisation Distribution
          </h3>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRIBUTION_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="range"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="1.5rem">
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            30-Day Utilisation Trend
          </h3>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  interval={4}
                  tickFormatter={(val) => `Day ${val}`}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="utilisation"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="rgba(59, 130, 246, 0.1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Details Table Card */}
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
              Vehicle Utilisation Details
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              156 vehicles • Click vehicle to view details
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: "#10B981",
                color: "#fff",
                borderColor: "#10B981",
                gap: "4px",
              }}
            >
              <FileSpreadsheet size={14} /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                borderColor: "#EF4444",
                gap: "4px",
              }}
            >
              <FileText size={14} /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: "#10B981",
                color: "#fff",
                borderColor: "#10B981",
                gap: "4px",
              }}
            >
              <FileJson size={14} /> Excel
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
              <th style={tableHeaderStyle}>Vehicle</th>
              <th style={tableHeaderStyle}>Utilisation %</th>
              <th style={tableHeaderStyle}>Days Active</th>
              <th style={tableHeaderStyle}>Total Hours</th>
              <th style={tableHeaderStyle}>Revenue</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "BMW X5",
                reg: "ABC123",
                type: "SUV",
                util: 92.3,
                days: "28 / 30",
                hours: "542h",
                revenue: "£4,850",
                status: "High Utilisation",
                statusColor: "#10B981",
              },
              {
                name: "Tesla Model 3",
                reg: "XYZ789",
                type: "Sedan",
                util: 85.1,
                days: "26 / 30",
                hours: "480h",
                revenue: "£3,920",
                status: "Active",
                statusColor: "#3B82F6",
              },
              {
                name: "Toyota Prius",
                reg: "DEF456",
                type: "Hatchback",
                util: 24.5,
                days: "8 / 30",
                hours: "120h",
                revenue: "£950",
                status: "Low Utilisation",
                statusColor: "#EF4444",
              },
              {
                name: "Mercedes Sprinter",
                reg: "VAN101",
                type: "Van",
                util: 71.8,
                days: "22 / 30",
                hours: "390h",
                revenue: "£2,100",
                status: "Active",
                statusColor: "#3B82F6",
              },
            ].map((v, i) => (
              <tr
                key={i}
                style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
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
                        backgroundColor: "#EFF6FF",
                        display: "flex",
                        alignItems: "center",
                        color: "#3B82F6",
                      }}
                    >
                      <Car size={16} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                        }}
                      >
                        {v.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        {v.reg} • {v.type}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color:
                          v.util > 80
                            ? "#10B981"
                            : v.util < 30
                              ? "#EF4444"
                              : COLORS.TEXT_MAIN,
                        minWidth: "45px",
                      }}
                    >
                      {v.util}%
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "6px",
                        backgroundColor: "#E5E7EB",
                        borderRadius: "3px",
                        width: "80px",
                      }}
                    >
                      <div
                        style={{
                          width: `${v.util}%`,
                          height: "100%",
                          backgroundColor:
                            v.util > 80
                              ? "#10B981"
                              : v.util < 30
                                ? "#EF4444"
                                : "#3B82F6",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td style={tableCellStyle}>{v.days}</td>
                <td style={tableCellStyle}>{v.hours}</td>
                <td style={{ ...tableCellStyle, fontWeight: 600 }}>
                  {v.revenue}
                </td>
                <td style={tableCellStyle}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: v.statusColor,
                    }}
                  >
                    {v.status}
                  </span>
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
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

function FilterPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.35rem 0.75rem",
        borderRadius: "9999px",
        backgroundColor: "#EFF6FF",
        color: COLORS.PRIMARY_MAIN,
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      {label}
      <span style={{ cursor: "pointer", fontSize: "1rem" }}>×</span>
    </span>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};
