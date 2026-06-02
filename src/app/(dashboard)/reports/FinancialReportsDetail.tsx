"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Download,
  Calendar,
  Bookmark,
  Eye,
  Bell,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart2,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import { reportsApi } from "@/services/api/reports";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// recharts ValueType: matches their internal Formatter<ValueType, NameType> constraint
type RechartsValue = string | number | readonly (string | number)[] | undefined;

const REVENUE_DATA = [
  { name: "Week 1", revenue: 65000 },
  { name: "Week 2", revenue: 72000 },
  { name: "Week 3", revenue: 68000 },
  { name: "Week 4", revenue: 82000 },
];

const BALANCE_AGE_DATA = [
  { label: "0-7 days", value: 8500, color: "#10B981" },
  { label: "8-14 days", value: 12500, color: "#F59E0B" },
  { label: "15-30 days", value: 15000, color: "#F59E0B" },
  { label: "30+ days", value: 10800, color: "#EF4444" },
];

function RevenueTrendChart() {
  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={REVENUE_DATA}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F3F4F6"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            formatter={(value: RechartsValue) => [
              `£${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BalanceAgeChart() {
  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={BALANCE_AGE_DATA}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F3F4F6"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: "#F9FAFB" }}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            formatter={(value: RechartsValue) => [
              `£${Number(value).toLocaleString()}`,
              "Balance",
            ]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {BALANCE_AGE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main component
────────────────────────────────────────────── */

const REPORT_TABLE_DATA = [
  {
    vehicle: "BMW X5 M Sport",
    reg: "ABC123",
    agreementType: "Rent-to-Own",
    installments: "3 of 24",
    outstanding: "£2,850",
    driver: "James Wilson",
    email: "james.w@email.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    daysOverdue: 45,
    daysOverdueBg: "#FEE2E2",
    daysOverdueColor: "#EF4444",
    status: "Overdue",
    statusBg: "#FEE2E2",
    statusColor: "#EF4444",
  },
  {
    vehicle: "Mercedes C-Class",
    reg: "XYZ789",
    agreementType: "Rental",
    installments: "2 of 12",
    outstanding: "£1,200",
    driver: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    daysOverdue: 10,
    daysOverdueBg: "#FFFBEB",
    daysOverdueColor: "#F59E0B",
    status: "Overdue",
    statusBg: "#FFFBEB",
    statusColor: "#F59E0B",
  },
];

export default function FinancialReportsDetail({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await reportsApi.getFinancialReports();
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
          title="Financial Reports"
          description="Revenue performance and outstanding balance analytics"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* ── Report Configuration ── */}
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
              Financial Report Configuration
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Based on revenue performance and outstanding balance reports.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="primary"
              size="md"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={15} /> Export
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
              <Calendar size={15} /> Schedule
            </Button>
            <Button
              variant="secondary"
              size="md"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Bookmark size={15} /> Save Preset
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1.2fr 1fr",
            gap: "1.25rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Report Type"
            options={[
              { label: "Revenue Performance", value: "revenue" },
              { label: "Outstanding Balance", value: "outstanding" },
              { label: "Collection Rate", value: "collection" },
            ]}
            placeholder="Revenue Performance"
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
          <SelectField
            label="Segmentation"
            options={[
              { label: "All Segments", value: "all" },
              { label: "Rent", value: "rent" },
              { label: "Rent-to-Own", value: "rent_to_own" },
            ]}
            placeholder="All Segments"
          />
          <Button
            variant="primary"
            size="md"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <BarChart2 size={16} /> Generate Report
          </Button>
        </div>
      </Card>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
        }}
      >
        {/* Total Revenue */}
        <Card padding="1.25rem">
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
                Total Revenue
              </p>
              <h3
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                £284,750
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#10B981",
                  fontWeight: 600,
                }}
              >
                +12.5% vs last month
              </span>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981",
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>
        </Card>

        {/* Outstanding Balance */}
        <Card padding="1.25rem">
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
                Outstanding Balance
              </p>
              <h3
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                £47,320
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#EF4444",
                  fontWeight: 600,
                }}
              >
                +3.2% vs last month
              </span>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#EF4444",
              }}
            >
              <AlertTriangle size={18} />
            </div>
          </div>
        </Card>

        {/* Collection Rate */}
        <Card padding="1.25rem">
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
                Collection Rate
              </p>
              <h3
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                94.2%
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#10B981",
                  fontWeight: 600,
                }}
              >
                +1.8% vs last month
              </span>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3B82F6",
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
        </Card>

        {/* Overdue Accounts */}
        <Card padding="1.25rem">
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
                Overdue Accounts
              </p>
              <h3
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                23
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#F59E0B",
                  fontWeight: 600,
                }}
              >
                2 vs last month
              </span>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#FFFBEB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F59E0B",
              }}
            >
              <Bell size={18} />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Charts Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "1.25rem",
        }}
      >
        {/* Revenue Trend */}
        <Card padding="1.5rem">
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "1.25rem",
            }}
          >
            Revenue Trend
          </h3>
          <div style={{ flex: 1 }}>
            <RevenueTrendChart />
          </div>
        </Card>

        {/* Outstanding Balance by Age */}
        <Card padding="1.5rem">
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "1.25rem",
            }}
          >
            Outstanding Balance by Age
          </h3>
          <div style={{ flex: 1 }}>
            <BalanceAgeChart />
          </div>
        </Card>
      </div>

      {/* ── Revenue Performance Report Table ── */}
      <Card padding="0">
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.2rem",
              }}
            >
              Revenue Performance Report
            </h3>
            <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
              Last 30 days • 56 agreements analysed
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                color: COLORS.TEXT_SECONDARY,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={showValidation}
                onChange={(e) => setShowValidation(e.target.checked)}
              />
              Show validation errors
            </label>
            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "#E5E7EB",
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
              <th style={headerCellStyle}>Outstanding Installments</th>
              <th style={headerCellStyle}>Total Outstanding</th>
              <th style={headerCellStyle}>Driver</th>
              <th style={headerCellStyle}>Days Overdue</th>
              <th style={headerCellStyle}>Status</th>
              <th style={{ ...headerCellStyle, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {REPORT_TABLE_DATA.map((row, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
              >
                <td style={bodyCellStyle}>
                  <p
                    style={{
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                      fontSize: "0.9rem",
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
                    {row.reg} • {row.agreementType}
                  </p>
                </td>
                <td style={bodyCellStyle}>{row.installments}</td>
                <td
                  style={{
                    ...bodyCellStyle,
                    fontWeight: 700,
                    color: "#EF4444",
                  }}
                >
                  {row.outstanding}
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
                        width: "26px",
                        height: "26px",
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
                      backgroundColor: row.daysOverdueBg,
                      color: row.daysOverdueColor,
                      fontWeight: 600,
                    }}
                  >
                    {row.daysOverdue} days
                  </span>
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
                      <Bell size={18} />
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
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
};

const bodyCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};
