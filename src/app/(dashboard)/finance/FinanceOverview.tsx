"use client";

import React from "react";
import { COLORS } from "@/constants/Constant";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Filter,
  Download,
  Plus,
  Activity,
  AlertCircle,
  Car,
  Wallet,
  PlusCircle,
  Minus,
  CarFront,
  FileWarning,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SelectField from "@/components/SelectField";
import Card from "@/components/Card";
import { FinanceStatCard, CustomTooltip } from "./shared";

interface FinanceOverviewKpis {
  totalIncome?: number;
  totalExpense?: number;
  netProfit?: number;
  outstanding?: number;
  incomeChange?: number;
  expenseChange?: number;
  totalFinancedAmount?: number;
  activeLoans?: number;
  monthlyRepaymentsDue?: number;
  nextDueDate?: string;
  vehiclePurchaseValue?: number;
  vehiclesPurchased?: number;
  platformEarnings?: number;
}

interface FinanceOverviewProps {
  incomeExpenseData: any[];
  outstandingPaymentsData: any[];
  recentActivity: any[];
  kpis?: FinanceOverviewKpis;
}

const fmt = (v: number | undefined, fallback: string) =>
  v !== undefined ? `$${v.toLocaleString()}` : fallback;

export default function FinanceOverview({
  incomeExpenseData,
  outstandingPaymentsData,
  recentActivity,
  kpis,
}: FinanceOverviewProps) {
  return (
    <>
      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Time Period:
            </span>
            <div style={{ width: "160px" }}>
              <SelectField
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Yearly", value: "yearly" },
                ]}
                placeholder="Select Period"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.6rem 1rem",
                background: COLORS.BG_CARD,
                color: COLORS.TEXT_MAIN,
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <Download size={16} />
              Export
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.6rem 1rem",
                background: COLORS.BG_CARD,
                color: COLORS.TEXT_MAIN,
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <FinanceStatCard
            label="Total Income"
            value={fmt(kpis?.totalIncome, "$48,750")}
            trend="up"
            trendValue={kpis?.incomeChange !== undefined ? `${kpis.incomeChange}%` : "12.5%"}
            subLabel="from last month"
            icon={<TrendingUp size={20} />}
            iconBg="#F0FDF4"
            iconColor="#16A34A"
          />
          <FinanceStatCard
            label="Total Expenses"
            value={fmt(kpis?.totalExpense, "$32,150")}
            trend="up"
            trendValue={kpis?.expenseChange !== undefined ? `${kpis.expenseChange}%` : "5.2%"}
            subLabel="from last month"
            icon={<TrendingDown size={20} />}
            iconBg="#FEF2F2"
            iconColor={COLORS.ERROR_MAIN}
          />
          <FinanceStatCard
            label="Net Income"
            value={fmt(kpis?.netProfit, "$16,600")}
            trend="up"
            trendValue={kpis?.netProfit !== undefined && kpis?.totalIncome ? `${((kpis.netProfit / kpis.totalIncome) * 100).toFixed(1)}%` : "8.3%"}
            subLabel="from last month"
            icon={<Activity size={20} />}
            iconBg="#EBF5FF"
            iconColor={COLORS.PRIMARY_MAIN}
          />
          <FinanceStatCard
            label="Outstanding Payments"
            value={fmt(kpis?.outstanding, "$8,420")}
            subLabel="Overdue payments"
            icon={<AlertCircle size={20} />}
            iconBg="#FFF7ED"
            iconColor="#F97316"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
        >
          <FinanceStatCard
            label="Total Financed Amount"
            value={fmt(kpis?.totalFinancedAmount, "$285,000")}
            subLabel={kpis?.activeLoans !== undefined ? `${kpis.activeLoans} active loans` : "12 active loans"}
            icon={<CreditCard size={20} />}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
          />
          <FinanceStatCard
            label="Monthly Repayments Due"
            value={fmt(kpis?.monthlyRepaymentsDue, "$12,750")}
            subLabel={kpis?.nextDueDate ? `Next due: ${kpis.nextDueDate}` : "Next due: Jan 15"}
            icon={<Calendar size={20} />}
            iconBg="#FEFCE8"
            iconColor="#EAB308"
          />
          <FinanceStatCard
            label="Vehicle Purchase Value"
            value={fmt(kpis?.vehiclePurchaseValue, "$425,000")}
            subLabel={kpis?.vehiclesPurchased !== undefined ? `${kpis.vehiclesPurchased} vehicles purchased` : "18 vehicles purchased"}
            icon={<Car size={20} />}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
          />
          <FinanceStatCard
            label="Platform Earnings"
            value={fmt(kpis?.platformEarnings, "$15,250")}
            subLabel="Commission & fees"
            icon={<Wallet size={20} />}
            iconBg="#F0FDF4"
            iconColor="#16A34A"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginBottom: "2rem",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div className="card" style={{ padding: "1.5rem", width: "100%" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: COLORS.TEXT_MAIN,
            }}
          >
            Income vs Expense Trend
          </h3>
          <div style={{ height: "350px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpenseData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={COLORS.BORDER_MAIN}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.TEXT_SECONDARY }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.TEXT_SECONDARY }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} shared={false} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#16A34A",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke={COLORS.ERROR_MAIN}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: COLORS.ERROR_MAIN,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem", width: "100%" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: COLORS.TEXT_MAIN,
            }}
          >
            Outstanding Payments Over Time
          </h3>
          <div style={{ height: "350px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={outstandingPaymentsData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={COLORS.BORDER_MAIN}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.TEXT_SECONDARY }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.TEXT_SECONDARY }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  name="Outstanding"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Card style={{ width: "100%", padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "1rem",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
            }}
          >
            Recent Financial Activity
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              color: COLORS.PRIMARY_MAIN,
            }}
          >
            View All
          </p>
        </div>
        <div
          style={{
            backgroundColor: COLORS.BORDER_MAIN,
            height: "1px",
            width: "100%",
            margin: "1rem 0",
          }}
        />
        {recentActivity.map((item, index) => {
          return (
            <div key={index} style={{ padding: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {item.icon === "PlusCircle" && (
                    <PlusCircle size={18} color={COLORS.SUCCESS_MAIN} />
                  )}
                  {item.icon === "Minus" && (
                    <Minus size={18} color={COLORS.ERROR_MAIN} />
                  )}
                  {item.icon === "CarFront" && (
                    <CarFront size={18} color={COLORS.WARNING_MAIN} />
                  )}
                  {item.icon === "FileWarning" && (
                    <FileWarning size={18} color={COLORS.WARNING_MAIN} />
                  )}
                  <div
                    style={{
                      gap: "1rem",
                    }}
                  >
                    <p style={{ fontWeight: 600 }}>{item.title}</p>
                    <p style={{ color: COLORS.TEXT_SECONDARY }}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    gap: "0.5rem",
                    display: "flex",
                    alignItems: "end",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      color:
                        item.icon === "PlusCircle"
                          ? COLORS.SUCCESS_MAIN
                          : item.icon === "Minus"
                            ? COLORS.ERROR_MAIN
                            : item.icon === "CarFront"
                              ? COLORS.WARNING_MAIN
                              : item.icon === "FileWarning"
                                ? COLORS.WARNING_MAIN
                                : COLORS.TEXT_MAIN,
                    }}
                  >
                    {item.amount}
                  </p>
                  <p style={{ color: COLORS.TEXT_SECONDARY }}>{item.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}
