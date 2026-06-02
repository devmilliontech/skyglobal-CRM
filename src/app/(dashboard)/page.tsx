"use client";
import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  UserCheck,
  MoreVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";
import { dashboardApi, DashboardData } from "@/services/api/dashboard";

const TIMEFRAME_OPTIONS = ["Today", "7d", "30d", "YTD"];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("30d");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getDashboardData(
        timeframe === "Today" ? "today" : timeframe.toLowerCase(),
        year,
      );
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [timeframe, year]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpis = data?.kpis;
  const revenueData = data?.revenueOverview ?? [];
  const recentRentals = data?.recentRentals ?? [];
  const recentAgreements = data?.recentAgreements ?? [];
  const activities = data?.activityStream ?? [];
  const actionRequired = data?.actionRequired;

  const statCards = [
    {
      title: "Total Revenue",
      value: kpis?.totalRevenue?.value != null
        ? `$${(kpis.totalRevenue.value / 1000).toFixed(1)}K`
        : "--",
      change: kpis?.totalRevenue?.trendPercent != null
        ? `${kpis.totalRevenue.isPositive ? "+" : ""}${kpis.totalRevenue.trendPercent.toFixed(1)}%`
        : "--",
      isNegative: !kpis?.totalRevenue?.isPositive,
      color: COLORS.WARNING_MAIN,
      data: revenueData.slice(0, 7).map((d, i) => ({ x: i, value: d.revenue })),
    },
    {
      title: "Active Rentals",
      value: kpis?.activeRentals?.value != null ? String(kpis.activeRentals.value) : "--",
      change: kpis?.activeRentals?.trendPercent != null
        ? `${kpis.activeRentals.isPositive ? "+" : ""}${kpis.activeRentals.trendPercent.toFixed(1)}%`
        : "--",
      isNegative: !kpis?.activeRentals?.isPositive,
      color: COLORS.SUCCESS_MAIN,
      data: revenueData.slice(0, 7).map((d, i) => ({ x: i, value: d.rentals })),
    },
    {
      title: "Outstanding Payments",
      value: kpis?.outstandingPayments?.value != null
        ? `$${(kpis.outstandingPayments.value / 1000).toFixed(1)}K`
        : "--",
      change: kpis?.outstandingPayments?.trendPercent != null
        ? `${kpis.outstandingPayments.isPositive ? "+" : "-"}${kpis.outstandingPayments.trendPercent.toFixed(1)}%`
        : "--",
      isNegative: true,
      color: COLORS.ERROR_MAIN,
      data: revenueData.slice(0, 7).map((_, i) => ({ x: i, value: 0 })),
    },
    {
      title: "Open Disputes",
      value: kpis?.openDisputes?.value != null ? String(kpis.openDisputes.value) : "--",
      change: kpis?.openDisputes?.trendPercent != null
        ? `${kpis.openDisputes.isPositive ? "+" : ""}${kpis.openDisputes.trendPercent.toFixed(1)}%`
        : "--",
      isNegative: !kpis?.openDisputes?.isPositive,
      color: COLORS.WARNING_MAIN,
      data: revenueData.slice(0, 7).map((_, i) => ({ x: i, value: 0 })),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <style>{`
        @media (max-width: 1200px) {
          .dashboard-main-grid { grid-template-columns: 1fr !important; }
          .dashboard-sidebar { margin-top: 0 !important; }
        }
        @media (max-width: 1024px) {
          .dashboard-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-tables-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dashboard-stat-grid { grid-template-columns: 1fr !important; }
          .dashboard-time-filters { display: none !important; }
        }
      `}</style>

      <PageHeader
        variant="dark"
        notificationCount={3}
        onSearchChange={(val) => console.log("Search:", val)}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
          marginTop: "-1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <h2>Dashboard</h2>
            <p>Overview of platform operations and financial health</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div
              className="dashboard-time-filters"
              style={{
                background: COLORS.GRAY_200,
                padding: "4px",
                borderRadius: "8px",
                display: "flex",
              }}
            >
              {TIMEFRAME_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                    background: timeframe === t ? "white" : "transparent",
                    color: timeframe === t ? "var(--text-main)" : COLORS.TEXT_SECONDARY,
                    boxShadow: timeframe === t ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: COLORS.BG_CARD,
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "8px",
            padding: "1rem",
            color: "#DC2626",
            fontSize: "0.85rem",
          }}
        >
          {error} —{" "}
          <button onClick={loadDashboard} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}>
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div
        className="dashboard-stat-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}
      >
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} loading={loading} />
        ))}
      </div>

      <div
        className="dashboard-main-grid"
        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "1.5rem" }}
      >
        {/* Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Revenue Chart */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ width: "100%" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Revenue Overview</h3>
                <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                  Monthly performance across all agreement types
                </p>
              </div>
              <div style={{ width: "50%" }}>
                <SelectField
                  label="Year"
                  options={[
                    { label: "2025", value: "2025" },
                    { label: "2024", value: "2024" },
                    { label: "2023", value: "2023" },
                  ]}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.WARNING_MAIN} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={COLORS.WARNING_MAIN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.GRAY_100} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: COLORS.GRAY_400 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: COLORS.GRAY_400 }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.WARNING_MAIN}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables Row */}
          <div
            className="dashboard-tables-grid"
            style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}
          >
            {/* Recent Rentals */}
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Recent Rentals</h3>
                <button style={{ fontSize: "0.8rem", fontWeight: 600, color: COLORS.PRIMARY_MAIN, background: "none", border: "none", cursor: "pointer" }}>
                  View All
                </button>
              </div>
              {loading ? (
                <LoadingSkeleton rows={3} />
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                      {["Vehicle", "Status", "Amount"].map((h) => (
                        <th key={h} style={{ padding: "0.75rem 0", fontSize: "0.7rem", textTransform: "uppercase", color: COLORS.TEXT_MUTED }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentRentals.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: "1rem 0", fontSize: "0.8rem", color: COLORS.TEXT_MUTED }}>No recent rentals</td></tr>
                    ) : recentRentals.map((r, i) => (
                      <tr key={i} style={{ borderBottom: i === recentRentals.length - 1 ? "none" : `1px solid ${COLORS.BORDER_MAIN}` }}>
                        <td style={{ padding: "1rem 0" }}>
                          <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{r.vehicle}</p>
                        </td>
                        <td style={{ padding: "1rem 0" }}>
                          <span className={`badge ${r.status === "Active" ? "badge-success" : r.status === "Pending" ? "badge-warning" : "badge-danger"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 0", fontSize: "0.85rem", fontWeight: 600, textAlign: "right" }}>
                          {r.amount > 0 ? `$${r.amount}/wk` : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Agreements */}
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Recent Agreements</h3>
                <button style={{ fontSize: "0.8rem", fontWeight: 600, color: COLORS.PRIMARY_MAIN, background: "none", border: "none", cursor: "pointer" }}>
                  View All
                </button>
              </div>
              {loading ? (
                <LoadingSkeleton rows={3} />
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                      {["Driver", "Type", "Date"].map((h) => (
                        <th key={h} style={{ padding: "0.75rem 0", fontSize: "0.7rem", textTransform: "uppercase", color: COLORS.TEXT_MUTED }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentAgreements.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: "1rem 0", fontSize: "0.8rem", color: COLORS.TEXT_MUTED }}>No recent agreements</td></tr>
                    ) : recentAgreements.map((a, i) => (
                      <tr key={i} style={{ borderBottom: i === recentAgreements.length - 1 ? "none" : `1px solid ${COLORS.BORDER_MAIN}` }}>
                        <td style={{ padding: "0.75rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: COLORS.GRAY_100, overflow: "hidden" }}>
                            <img
                              src={`https://ui-avatars.com/api/?name=Driver&background=random`}
                              alt="Avatar"
                              style={{ width: "100%", height: "100%" }}
                            />
                          </div>
                          <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{a.driverType}</p>
                        </td>
                        <td style={{ padding: "0.75rem 0", fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>{a.driverType}</td>
                        <td style={{ padding: "0.75rem 0", fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY, textAlign: "right" }}>
                          {a.date ? new Date(a.date).toLocaleDateString() : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="dashboard-sidebar" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Actions Required */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Action Required
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <ActionCard
                icon={<Clock size={16} />}
                title="Pending Approvals"
                subtitle="Vehicles awaiting check"
                count={actionRequired?.pendingApprovals ?? 0}
                bg="#FFFBEB"
                color="#D97706"
                loading={loading}
              />
              <ActionCard
                icon={<AlertCircle size={16} />}
                title="Failed Payments"
                subtitle="Requires follow-up"
                count={actionRequired?.failedPayments ?? 0}
                bg="#FEF2F2"
                color={COLORS.ERROR_MAIN}
                loading={loading}
              />
              <ActionCard
                icon={<UserCheck size={16} />}
                title="KYC Reviews"
                subtitle="New driver applications"
                count={actionRequired?.kycReviews ?? 0}
                bg={COLORS.GRAY_100}
                color={COLORS.GRAY_600}
                loading={loading}
              />
            </div>
          </div>

          {/* Activity Stream */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Activity Stream</h3>
              <MoreVertical size={16} style={{ color: COLORS.TEXT_MUTED }} />
            </div>
            {loading ? (
              <LoadingSkeleton rows={3} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
                {activities.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_MUTED }}>No recent activity</p>
                ) : activities.map((act, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: COLORS.PRIMARY_MAIN,
                        marginTop: "5px",
                        border: "2px solid white",
                        boxShadow: `0 0 0 2px ${COLORS.BG_CARD}`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>{act.title}</p>
                        <span style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}>
                          {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, lineHeight: "1.4" }}>
                        {act.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "20px",
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            borderRadius: "4px",
            animation: "shimmer 1.5s infinite",
            opacity: 1 - i * 0.15,
          }}
        />
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

function StatCard({ title, value, change, color, isNegative, data, loading }: any) {
  const isUp = !isNegative;
  return (
    <div className="card" style={{ padding: "1.25rem", minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>{title}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: isUp ? COLORS.SUCCESS_MAIN : COLORS.ERROR_MAIN,
          }}
        >
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </div>
      </div>
      {loading ? (
        <LoadingSkeleton rows={1} />
      ) : (
        <p style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>{value}</p>
      )}
      <div style={{ height: "40px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data ?? []}>
            <defs>
              <linearGradient id={`sg-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#sg-${title})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, subtitle, count, bg, color, loading }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: bg, borderRadius: "8px" }}>
      <div style={{ color, background: "white", padding: "6px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{title}</p>
        <p style={{ fontSize: "0.7rem", color: COLORS.TEXT_SECONDARY }}>{subtitle}</p>
      </div>
      {loading ? (
        <div style={{ width: "28px", height: "20px", background: "#e0e0e0", borderRadius: "4px" }} />
      ) : (
        <span style={{ fontSize: "1rem", fontWeight: 800, color }}>{count}</span>
      )}
    </div>
  );
}
