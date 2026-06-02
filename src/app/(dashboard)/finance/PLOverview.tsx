"use client";

import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle2,
  FileText,
  Table as TableIcon,
  FileSpreadsheet,
  Link as LinkIcon,
  Upload,
  Eye,
  Filter,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SelectField from "@/components/SelectField";
import Card from "@/components/Card";
import { FinanceStatCard, CustomTooltip } from "./shared";
import { financeApi } from "@/services/api/finance";

const trendData = [
  { name: "Week 1", income: 32000, expenses: 17000 },
  { name: "Week 2", income: 42000, expenses: 20000 },
  { name: "Week 3", income: 38000, expenses: 18500 },
  { name: "Week 4", income: 45000, expenses: 19500 },
];

const expenseBreakdown = [
  { name: "Vehicle Finance", value: 47.3, color: COLORS.ERROR_MAIN },
  { name: "Insurance", value: 20.9, color: COLORS.WARNING_MAIN },
  { name: "Maintenance", value: 17.7, color: COLORS.INFO_MAIN },
  { name: "Operational", value: 14.1, color: "#8B5CF6" },
];

const incomeBreakdownData = [
  {
    category: "Rental Income",
    amount: "112,450.00",
    status: "On Track",
    trend: "+12.5%",
  },
  {
    category: "Late Fees",
    amount: "12,380.00",
    status: "Review Required",
    trend: "+5.2%",
  },
  {
    category: "Damage Recoveries",
    amount: "20,400.00",
    status: "On Track",
    trend: "+8.3%",
  },
];

const expenseBreakdownListData = [
  {
    category: "Vehicle Finance",
    amount: "42,300.00",
    status: "On Track",
    trend: "-2.1%",
  },
  {
    category: "Insurance",
    amount: "18,680.00",
    status: "Over Budget",
    trend: "+14.5%",
  },
  {
    category: "Maintenance",
    amount: "15,820.00",
    status: "On Track",
    trend: "-5.2%",
  },
];

const reconciliationItems = [
  {
    id: "REC-2024-001",
    description: "Unmatched payment from driver Sarah Johnson",
    date: "2024-04-15",
    category: "Income",
    amount: "$1,240.00",
    status: "Pending",
    actionLabel: "Link",
    actionIcon: "LinkIcon",
  },
  {
    id: "REC-2024-002",
    description: "Missing expense invoice for vehicle maintenance",
    date: "2024-04-12",
    category: "Expense",
    amount: "$850.00",
    status: "Pending",
    actionLabel: "Upload",
    actionIcon: "Upload",
  },
  {
    id: "REC-2024-003",
    description: "Duplicate transaction flagged for review",
    date: "2024-04-18",
    category: "Income",
    amount: "$2,100.00",
    status: "Pending",
    actionLabel: "Resolve",
    actionIcon: "CheckCircle2",
  },
];

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = payload[0].color || payload[0].fill;
    return (
      <div
        style={{
          position: "relative",
          backgroundColor: color,
          padding: "8px 12px",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 600,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          minWidth: "100px",
          transform: "translateX(-110%) translateY(-50%)",
          border: `1px solid ${COLORS.BORDER_MAIN}`,
        }}
      >
        <span style={{ opacity: 0.9 }}>
          {data.name || data.month || "Item"}
        </span>
        <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
          {typeof data.value === "number"
            ? data.value.toLocaleString()
            : data.income || data.expenses || data.amount}
        </span>
        {data.value && <span style={{ opacity: 0.9 }}>{data.value}%</span>}
        {/* Triangle pointer */}
        <div
          style={{
            position: "absolute",
            right: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: `6px solid ${COLORS.BORDER_MAIN}`,
          }}
        />
      </div>
    );
  }
  return null;
};

export default function PLOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [plData, setPlData] = useState<any>(null);
  const [chartTrendData, setChartTrendData] = useState(trendData);
  const [expenseChartData, setExpenseChartData] = useState(expenseBreakdown);

  useEffect(() => {
    const fetchPlData = async () => {
      try {
        setIsLoading(true);
        const response = await financeApi.getPlOverview();
        if (response?.data) {
          setPlData(response.data);
          if (response.data.trendData) setChartTrendData(response.data.trendData);
          if (response.data.expenseBreakdown) setExpenseChartData(response.data.expenseBreakdown);
        }
      } catch (err) {
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Filters & Actions */}
      <Card
        padding="1rem 1.25rem"
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
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
                whiteSpace: "nowrap",
              }}
            >
              Period:
            </span>
            <div style={{ width: "140px" }}>
              <SelectField
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Quarterly", value: "quarterly" },
                ]}
              />
            </div>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              From:
            </span>
            <input
              type="date"
              defaultValue="2024-04-01"
              style={{
                padding: "0.55rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.85rem",
                outline: "none",
                background: "#F9FAFB",
              }}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              To:
            </span>
            <input
              type="date"
              defaultValue="2024-04-30"
              style={{
                padding: "0.55rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.85rem",
                outline: "none",
                background: "#F9FAFB",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.55rem 1rem",
              background: "#fff",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <TableIcon size={14} /> Export CSV
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.55rem 1rem",
              background: "#fff",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <FileText size={14} /> Export PDF
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.55rem 1rem",
              background: "#fff",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <FileSpreadsheet size={14} /> Export Excel
          </button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <FinanceStatCard
          label="Total Income"
          value="$145,230.00"
          trend="up"
          trendValue=" "
          subLabel="April 2024"
          icon={<TrendingUp size={20} />}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          valueColor="#16A34A"
        />
        <FinanceStatCard
          label="Total Expenses"
          value="$89,420.00"
          trend="down"
          trendValue=" "
          subLabel="April 2024"
          icon={<TrendingDown size={20} />}
          iconBg="#FEF2F2"
          iconColor="#EF4444"
          valueColor="#EF4444"
        />
        <FinanceStatCard
          label="Net Profit"
          value="$55,810.00"
          trend="up"
          trendValue="+38.4% margin"
          subLabel="Profit margin"
          icon={<Activity size={20} />}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          valueColor="#16A34A"
        />
        <FinanceStatCard
          label="Reconciliation Status"
          value="98.5%"
          subLabel="3 items pending"
          icon={<CheckCircle2 size={20} />}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
          valueColor="#3B82F6"
        />
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        <Card padding="1.5rem">
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: COLORS.TEXT_MAIN,
            }}
          >
            Income vs Expenses Trend
          </h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={COLORS.BORDER_MAIN}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.TEXT_SECONDARY }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.TEXT_SECONDARY }}
                  tickFormatter={(value) => `${value / 1000}k`}
                  domain={[20000, 50000]}
                  ticks={[25000, 30000, 35000, 40000, 45000]}
                />
                <Line
                  type="linear"
                  dataKey="income"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={{
                    r: 0,
                  }}
                  activeDot={{ r: 6 }}
                  name="Income"
                />
                <Line
                  type="linear"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{
                    r: 0,
                  }}
                  activeDot={{ r: 6 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="1.5rem">
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: COLORS.TEXT_MAIN,
            }}
          >
            Expense Breakdown by Category
          </h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="square"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Breakdown Lists */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <Card padding="1.5rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Income Breakdown
              </h3>
              <Filter
                size={16}
                color={COLORS.PRIMARY_MAIN}
                fill={COLORS.PRIMARY_MAIN}
                style={{ cursor: "pointer" }}
              />
            </div>
            <button
              style={{
                fontSize: "0.8rem",
                color: COLORS.PRIMARY_MAIN,
                background: "none",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View Details <ChevronRight size={14} />
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {incomeBreakdownData.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                  transition: "all 0.2s",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {item.category}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: item.status === "On Track" ? "#16A34A" : "#F59E0B",
                      fontWeight: 500,
                    }}
                  >
                    {item.status}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {item.amount}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#16A34A",
                      fontWeight: 600,
                    }}
                  >
                    {item.trend}
                  </p>
                </div>
              </div>
            ))}
            <div
              style={{
                height: "1px",
                background: COLORS.BORDER_MAIN,
                width: "100%",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Total Income
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                {incomeBreakdownData.reduce((acc, item) => {
                  return acc + Number(item.amount);
                }, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="1.5rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Expense Breakdown
              </h3>
              <Filter
                size={16}
                color={COLORS.PRIMARY_MAIN}
                fill={COLORS.PRIMARY_MAIN}
                style={{ cursor: "pointer" }}
              />
            </div>
            <button
              style={{
                fontSize: "0.8rem",
                color: COLORS.PRIMARY_MAIN,
                background: "none",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View Details <ChevronRight size={14} />
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {expenseBreakdownListData.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                  transition: "all 0.2s",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {item.category}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: item.status === "On Track" ? "#16A34A" : "#EF4444",
                      fontWeight: 500,
                    }}
                  >
                    {item.status}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {item.amount}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: item.trend.startsWith("+") ? "#EF4444" : "#16A34A",
                      fontWeight: 600,
                    }}
                  >
                    {item.trend}
                  </p>
                </div>
              </div>
            ))}
            <div
              style={{
                backgroundColor: COLORS.BORDER_MAIN,
                width: "100%",
                height: "1px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Total Expenses
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                {expenseBreakdownListData.reduce((acc, item) => {
                  return acc + Number(item.amount);
                }, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reconciliation Items Table */}
      <Card padding="1.5rem">
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "1.5rem",
          }}
        >
          Reconciliation Items
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {[
                  "ITEM ID",
                  "DESCRIPTION",
                  "CATEGORY",
                  "AMOUNT",
                  "STATUS",
                  "ACTIONS",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: "left",
                      padding: "1rem 0.5rem",
                      fontSize: "0.75rem",
                      color: COLORS.TEXT_MUTED,
                      fontWeight: 700,
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reconciliationItems.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                    transition: "background 0.2s",
                  }}
                >
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: COLORS.PRIMARY_MAIN,
                    }}
                  >
                    {item.id}
                  </td>
                  <td style={{ padding: "1.2rem 0.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: COLORS.TEXT_MAIN,
                        }}
                      >
                        {item.description}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        Transaction date: {item.date}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "1.2rem 0.5rem" }}>
                    <span
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          item.category === "Income" ? "#F0FDF4" : "#FEF2F2",
                        color:
                          item.category === "Income"
                            ? "#16A34A"
                            : COLORS.ERROR_MAIN,
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color:
                        item.category === "Income"
                          ? "#16A34A"
                          : COLORS.TEXT_MAIN,
                    }}
                  >
                    {item.amount}
                  </td>
                  <td style={{ padding: "1.2rem 0.5rem" }}>
                    <span
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "#FEF3C7",
                        color: "#D97706",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 0.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "none",
                          border: "none",
                          color: COLORS.PRIMARY_MAIN,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {item.actionIcon === "LinkIcon" && (
                          <LinkIcon size={14} />
                        )}
                        {item.actionIcon === "Upload" && <Upload size={14} />}
                        {item.actionIcon === "CheckCircle2" && (
                          <CheckCircle2 size={14} />
                        )}
                        {item.actionLabel}
                      </button>
                      <Eye
                        size={16}
                        style={{ color: COLORS.TEXT_MUTED, cursor: "pointer" }}
                      />
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
