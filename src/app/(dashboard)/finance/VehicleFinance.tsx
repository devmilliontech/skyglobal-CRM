"use client";

import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import { financeApi } from "@/services/api/finance";
import {
  Download,
  Plus,
  Search,
  Eye,
  Pencil,
  Paperclip,
  AlertTriangle,
  X,
  CreditCard,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import { FinanceStatCard } from "./shared";
import VehicleFinanceDetail from "./VehicleFinanceDetail";
import SelectField from "@/components/SelectField";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface FinanceRecord {
  id: number;
  registration: string;
  registrationStatus: string;
  financeProvider: string;
  loanAmount: number;
  totalInterest: number;
  monthlyInterest: number;
  totalPayable: number;
  periodMonths: number;
  monthlyRepayment: number;
  creditFees: number;
  purchaseDate: string;
  status: string;
}

// No more hardcoded mock data — fetched from API in the component

// ─────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────

const OverdueAlert = ({ onDismiss }: { onDismiss: () => void }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "0.75rem",
      padding: "0.875rem 1.25rem",
      background: "#FFF7ED",
      border: "1px solid #FED7AA",
      borderRadius: "10px",
      marginBottom: "1.5rem",
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
      <AlertTriangle
        size={18}
        color="#F97316"
        style={{ flexShrink: 0, marginTop: "2px" }}
      />
      <div>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#7C2D12" }}>
          Overdue Repayments Alert
        </p>
        <p style={{ fontSize: "0.8rem", color: "#9A3412", marginTop: "2px" }}>
          3 vehicles have repayments overdue by more than 7 days. Total
          outstanding: $4,250.00
        </p>
      </div>
    </div>
    <button
      onClick={onDismiss}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#9A3412",
        flexShrink: 0,
      }}
    >
      <X size={16} />
    </button>
  </div>
);

/* Filter/toolbar row for period, date range, and action buttons */
const FilterToolbar = () => {
  const inputStyle: React.CSSProperties = {
    padding: "0.35rem 0.6rem",
    border: `1px solid ${COLORS.BORDER_MAIN}`,
    borderRadius: "7px",
    fontSize: "0.78rem",
    color: COLORS.TEXT_MAIN,
    background: COLORS.BG_CARD,
    outline: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}
    >
      {/* Left: Period + Date Range */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <label
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            Period:
          </label>
          <SelectField
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Weekly", value: "weekly" },
              { label: "Yearly", value: "yearly" },
            ]}
          />
        </div>
        <input type="date" style={inputStyle} />
        <span style={{ fontSize: "0.78rem", color: COLORS.TEXT_MUTED }}>
          to
        </span>
        <input type="date" style={inputStyle} />
      </div>

      {/* Right: Buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button variant="primary" size="md">
          <Plus size={14} />
          Add Finance Record
        </Button>
        <Button variant="outline" size="md">
          <Download size={14} />
          Export
        </Button>
      </div>
    </div>
  );
};

/** Column header label with light-gray text */
const ColHeader = ({ label }: { label: string }) => (
  <th
    style={{
      padding: "0.5rem 0.6rem",
      fontSize: "0.65rem",
      fontWeight: 700,
      color: COLORS.TEXT_MUTED,
      textTransform: "uppercase",
      letterSpacing: "0.03em",
      textAlign: "left",
      whiteSpace: "nowrap",
      borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
    }}
  >
    {label}
  </th>
);

/** A single row's registration cell with optional inline badge */
const RegistrationCell = ({
  reg,
  regStatus,
}: {
  reg: string;
  regStatus: string;
}) => {
  const isOverdue = regStatus.toLowerCase() === "overdue";
  const isInactive = regStatus.toLowerCase() === "inactive";

  const badgeBg = isOverdue ? COLORS.ERROR_MAIN : COLORS.GRAY_400;
  const badgeColor = "#fff";

  return (
    <td
      style={{
        padding: "0.45rem 0.6rem",
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {reg}
        {(isOverdue || isInactive) && (
          <span
            style={{
              background: badgeBg,
              color: badgeColor,
              padding: "1px 5px",
              borderRadius: "4px",
              fontSize: "0.6rem",
              fontWeight: 700,
            }}
          >
            {regStatus}
          </span>
        )}
      </div>
    </td>
  );
};

/** Renders row action icons: View, Edit, Attach */
const ActionButtons = ({ onView }: { onView: () => void }) => (
  <td style={{ padding: "0.45rem 0.6rem" }}>
    <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
      <button
        title="View"
        onClick={onView}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: COLORS.PRIMARY_MAIN,
          padding: "2px",
        }}
      >
        <Eye size={13} />
      </button>
      <button
        title="Edit"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: COLORS.TEXT_SECONDARY,
          padding: "2px",
        }}
      >
        <Pencil size={13} />
      </button>
      <button
        title="Attach"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: COLORS.TEXT_MUTED,
          padding: "2px",
        }}
      >
        <Paperclip size={13} />
      </button>
    </div>
  </td>
);

/** Finance Records table */
const FinanceRecordsTable = ({
  records,
  searchQuery,
  onSearch,
  onViewRecord,
}: {
  records: FinanceRecord[];
  searchQuery: string;
  onSearch: (v: string) => void;
  onViewRecord: (record: FinanceRecord) => void;
}) => {
  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });

  const filtered = records.filter(
    (r) =>
      r.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.financeProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      {/* Table header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
          }}
        >
          Vehicle Finance Records
        </h3>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: `1px solid ${COLORS.BORDER_MAIN}`,
            borderRadius: "8px",
            padding: "0.45rem 0.75rem",
            background: COLORS.BG_CARD,
          }}
        >
          <Search size={14} color={COLORS.TEXT_MUTED} />
          <input
            placeholder="Search by registration, provider..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "0.8rem",
              color: COLORS.TEXT_MAIN,
              background: "transparent",
              width: "160px",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{
            width: "100%",
            minWidth: "960px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <ColHeader label="Registration" />
              <ColHeader label="Finance Provider" />
              <ColHeader label="Loan Amount" />
              <ColHeader label="Total Interest" />
              <ColHeader label="Monthly Interest" />
              <ColHeader label="Total Payable" />
              <ColHeader label="Period (Months)" />
              <ColHeader label="Monthly Repayment" />
              <ColHeader label="Credit Fees" />
              <ColHeader label="Purchase Date" />
              <ColHeader label="Status" />
              <ColHeader label="Actions" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec, idx) => (
              <tr
                key={rec.id}
                style={{
                  background: idx % 2 === 0 ? COLORS.BG_CARD : COLORS.BG_PAGE,
                  transition: "background 0.15s",
                }}
              >
                <RegistrationCell
                  reg={rec.registration}
                  regStatus={rec.registrationStatus}
                />
                <td
                  style={{
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {rec.financeProvider}
                </td>
                <td
                  style={{
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {fmt(rec.loanAmount)}
                </td>
                <td style={{ padding: "0.45rem 0.6rem", fontSize: "0.75rem" }}>
                  {fmt(rec.totalInterest)}
                </td>
                <td style={{ padding: "0.45rem 0.6rem", fontSize: "0.75rem" }}>
                  {fmt(rec.monthlyInterest)}
                </td>
                <td
                  style={{
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {fmt(rec.totalPayable)}
                </td>
                <td
                  style={{
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  {rec.periodMonths}
                </td>
                <td
                  style={{
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {fmt(rec.monthlyRepayment)}
                </td>
                <td style={{ padding: "0.45rem 0.6rem", fontSize: "0.75rem" }}>
                  {fmt(rec.creditFees)}
                </td>
                <td
                  style={{
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  {rec.purchaseDate}
                </td>
                <td style={{ padding: "0.45rem 0.6rem" }}>
                  <StatusBadge status={rec.status} />
                </td>
                <ActionButtons onView={() => onViewRecord(rec)} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: result count + pagination */}
      <TableFooter totalCount={filtered.length} />
    </div>
  );
};

/** Pagination footer */
const TableFooter = ({ totalCount }: { totalCount: number }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "1rem",
      padding: "0.5rem 0",
      borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
    }}
  >
    <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
      Showing 1 to {totalCount} of 47 results
    </span>
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
      {["Previous", "1", "2", "3", "Next"].map((label) => (
        <button
          key={label}
          style={{
            padding: "0.3rem 0.65rem",
            border: `1px solid ${COLORS.BORDER_MAIN}`,
            borderRadius: "6px",
            background: label === "1" ? COLORS.PRIMARY_MAIN : COLORS.BG_CARD,
            color: label === "1" ? "#fff" : COLORS.TEXT_SECONDARY,
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Stat card data
// ─────────────────────────────────────────────
const STAT_CARDS = [
  {
    label: "Total Financed Amount",
    value: "$485,250",
    trend: "up" as const,
    trendValue: "+5.2%",
    subLabel: "from last month",
    icon: <CreditCard size={20} />,
    iconBg: "#EBF5FF",
    iconColor: COLORS.PRIMARY_MAIN,
  },
  {
    label: "Total Monthly Repayment",
    value: "$18,450",
    subLabel: "On track this month",
    icon: <Calendar size={20} />,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    valueColor: "#16A34A",
  },
  {
    label: "Total Interest Charges",
    value: "$89,340",
    subLabel: "18.4% avg rate",
    icon: <TrendingUp size={20} />,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
  },
  {
    label: "Monthly Interest Payment",
    value: "$3,420",
    trend: "down" as const,
    trendValue: "-2.1%",
    subLabel: "from last month",
    icon: <TrendingUp size={20} />,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
  },
  {
    label: "Amount Paid",
    value: "$142,680",
    subLabel: "29.4% of total",
    icon: <CheckCircle size={20} />,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
  },
  {
    label: "Outstanding Amount",
    value: "$342,570",
    subLabel: "3 overdue payments",
    icon: <AlertCircle size={20} />,
    iconBg: "#FEF2F2",
    iconColor: COLORS.ERROR_MAIN,
    valueColor: COLORS.ERROR_MAIN,
  },
];

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────
interface VehicleFinanceProps {
  selectedRecord: FinanceRecord | null;
  setSelectedRecord: (record: FinanceRecord | null) => void;
}

export default function VehicleFinance({
  selectedRecord,
  setSelectedRecord,
}: VehicleFinanceProps) {
  const [alertVisible, setAlertVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await financeApi.getVehicleFinanceDashboard({ limit: 50 });
      const d = res.data as any;
      const loans: any[] = d.loans ?? d.data ?? [];
      setRecords(
        loans.map((l: any, i: number) => ({
          id: i + 1,
          registration: l.registration ?? l.vehicleName ?? `LOAN-${(l._id ?? "").slice(-6).toUpperCase()}`,
          registrationStatus: l.status ?? "Unknown",
          financeProvider: l.lenderName ?? l.financeProvider ?? "--",
          loanAmount: l.loanAmount ?? 0,
          totalInterest: l.totalInterest ?? 0,
          monthlyInterest: l.monthlyInterest ?? 0,
          totalPayable: l.totalPayable ?? (l.loanAmount ?? 0) + (l.totalInterest ?? 0),
          periodMonths: l.periodMonths ?? l.termMonths ?? 0,
          monthlyRepayment: l.monthlyRepayment ?? 0,
          creditFees: l.creditFees ?? 0,
          purchaseDate: l.startDate ? new Date(l.startDate).toLocaleDateString() : "--",
          status: l.status ?? "Unknown",
        }))
      );
    } catch (err: any) {
      setApiError(err.message ?? "Failed to load vehicle finance records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  if (selectedRecord) {
    return (
      <VehicleFinanceDetail
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Overdue alert */}
      {alertVisible && (
        <OverdueAlert onDismiss={() => setAlertVisible(false)} />
      )}

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {STAT_CARDS.map((card) => (
          <FinanceStatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Filter bar + table section */}
      <div
        className="card"
        style={{
          padding: "1.25rem",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <FilterToolbar />
        {/* Divider */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
            margin: "0 0 1rem 0",
          }}
        />
        {apiError && (
          <div style={{ color: "#DC2626", fontSize: "0.85rem", padding: "0.5rem 0" }}>
            {apiError}{" "}
            <button onClick={fetchLoans} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}>Retry</button>
          </div>
        )}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: "36px", background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px" }} />
            ))}
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
          </div>
        ) : (
          <FinanceRecordsTable
            records={records}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onViewRecord={setSelectedRecord}
          />
        )}
      </div>
    </div>
  );
}
