"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  Link as LinkIcon,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Unlink,
  TrendingDown,
  FileText,
  FileSpreadsheet,
  ArrowDownRight,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import StatusBadge from "@/components/StatusBadge";
import { financeApi } from "@/services/api/finance";

const REFUND_DATA = [
  {
    id: "REF-2024-001",
    originalTx: "TXN-2024-145",
    invoice: "INV-2024-001",
    driver: "Sarah Johnson",
    email: "sarah@email.com",
    amount: -2450.0,
    date: "2024-04-08",
    status: "Chargeback",
    type: "Dispute",
    isUnlinked: false,
  },
  {
    id: "REF-2024-002",
    originalTx: "TXN-2024-142",
    invoice: "INV-2024-003",
    driver: "Michael Chen",
    email: "michael@email.com",
    amount: -890.0,
    date: "2024-04-07",
    status: "Processed",
    type: "Partial",
    isUnlinked: false,
  },
  {
    id: "REF-2024-003",
    originalTx: "Unlinked",
    invoice: "Missing transaction link",
    driver: "Emma Wilson",
    email: "emma@email.com",
    amount: -1200.0,
    date: "2024-04-06",
    status: "Pending",
    type: "Dispute",
    isUnlinked: true,
  },
  {
    id: "REF-2024-004",
    originalTx: "TXN-2024-138",
    invoice: "INV-2024-007",
    driver: "James Rodriguez",
    email: "james@email.com",
    amount: -3200.0,
    date: "2024-04-05",
    status: "Failed",
    type: "Full",
    isUnlinked: false,
  },
];

export default function RefundManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [refundData, setRefundData] = useState<any[]>(REFUND_DATA);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setIsLoading(true);
        const response = await financeApi.getRefundDashboard();
        if (response?.data) {
          if (response.data.refunds?.length) {
            setRefundData(response.data.refunds.map((r: any) => ({
              id: r.refundId || r._id,
              originalTx: r.originalTransactionId || "—",
              invoice: r.invoiceId || "—",
              driver: r.driverName || "—",
              email: r.email || "",
              amount: -(r.amount || 0),
              date: r.createdAt || "—",
              status: r.status || "Pending",
              type: r.type || "Full",
              isUnlinked: !r.originalTransactionId,
            })));
          }
          if (response.data.kpis) setKpis(response.data.kpis);
        }
      } catch (err) {
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
      >
        <StatCard
          title="Total Refunds"
          value={kpis?.totalRefunds || "$23,450.00"}
          badge="This period"
          badgeColor={COLORS.ERROR_MAIN}
          badgeBg="#FEF2F2"
          icon={<RotateCcw size={24} />}
          iconBg="#FEF2F2"
          iconColor={COLORS.ERROR_MAIN}
        />
        <StatCard
          title="Chargeback Alerts"
          value="7"
          badge="Require attention"
          badgeColor="#854D0E"
          badgeBg="#FEF9C3"
          icon={<CreditCard size={24} />}
          iconBg="#FEFCE8"
          iconColor="#EAB308"
        />
        <StatCard
          title="Unlinked Refunds"
          value="4"
          badge="Missing transaction link"
          badgeColor="#B91C1C"
          badgeBg="#FEE2E2"
          icon={<Unlink size={24} />}
          iconBg="#FEF2F2"
          iconColor="#EF4444"
        />
        <StatCard
          title="Net Impact"
          value="-$18,230.00"
          badge="After refunds"
          badgeColor="#991B1B"
          badgeBg="#FEE2E2"
          icon={<TrendingDown size={24} />}
          iconBg="#FEF2F2"
          iconColor="#B91C1C"
        />
      </div>

      {/* Filters Row */}
      <div
        className="card"
        style={{
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={filterLabelStyle}>Date Range:</span>
              <div style={{ width: "130px" }}>
                <SelectField
                  options={[
                    { label: "Monthly", value: "monthly" },
                    { label: "Weekly", value: "weekly" },
                  ]}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={filterLabelStyle}>Driver:</span>
              <div style={{ width: "130px" }}>
                <SelectField
                  options={[
                    { label: "All Drivers", value: "all" },
                    { label: "Driver 1", value: "driver1" },
                    { label: "Driver 2", value: "driver2" },
                  ]}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={filterLabelStyle}>Status:</span>
              <div style={{ width: "130px" }}>
                <SelectField
                  options={[
                    { label: "All Statuses", value: "all" },
                    { label: "Processed", value: "processed" },
                    { label: "Pending", value: "pending" },
                    { label: "Failed", value: "failed" },
                  ]}
                />
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Search size={16} style={searchIconStyle} />
              <input
                type="text"
                placeholder="Search refunds..."
                style={searchInputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button variant="outline" size="lg">
              <Download size={14} /> Export CSV
            </Button>
            <Button variant="outline" size="lg">
              <FileText size={14} /> Export PDF
            </Button>
            <Button variant="outline" size="lg">
              <FileSpreadsheet size={14} /> Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Refund Transactions Table */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "1.5rem",
          }}
        >
          Refund Transactions
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {[
                  "REFUND ID",
                  "ORIGINAL TRANSACTION",
                  "DRIVER",
                  "AMOUNT",
                  "DATE",
                  "STATUS",
                  "TYPE",
                  "ACTIONS",
                ].map((h) => (
                  <th key={h} style={tableHeaderStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {h} <ArrowDownRight size={12} style={{ opacity: 0.5 }} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {refundData.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
                >
                  <td style={tableCellStyle}>
                    <span
                      style={{ color: COLORS.PRIMARY_MAIN, fontWeight: 600 }}
                    >
                      {row.id}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    {row.isUnlinked ? (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: COLORS.TEXT_MUTED,
                          }}
                        >
                          <Unlink size={12} />{" "}
                          <span style={{ fontSize: "0.8rem" }}>Unlinked</span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: COLORS.ERROR_MAIN,
                          }}
                        >
                          {row.invoice}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            color: COLORS.TEXT_SECONDARY,
                            fontSize: "0.8rem",
                          }}
                        >
                          {row.originalTx}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: COLORS.TEXT_MUTED,
                          }}
                        >
                          {row.invoice}
                        </p>
                      </div>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <div>
                      <p style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                        {row.driver}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        {row.email}
                      </p>
                    </div>
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                      fontWeight: 700,
                      color: COLORS.ERROR_MAIN,
                    }}
                  >
                    $
                    {row.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={tableCellStyle}>{row.date}</td>
                  <td style={tableCellStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <StatusBadge status={row.status} />
                      {row.status === "Chargeback" && (
                        <AlertTriangle size={14} color="#EAB308" />
                      )}
                      {row.isUnlinked && (
                        <AlertTriangle size={14} color={COLORS.ERROR_MAIN} />
                      )}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          row.type === "Dispute" ? "#FEF2F2" : "#EFF6FF",
                        color:
                          row.type === "Dispute"
                            ? COLORS.ERROR_MAIN
                            : COLORS.PRIMARY_MAIN,
                      }}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={actionButtonStyle}>
                        <Eye size={16} />
                      </button>
                      <button style={actionButtonStyle}>
                        <LinkIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const filterLabelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
  whiteSpace: "nowrap",
};

const searchIconStyle: React.CSSProperties = {
  position: "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: COLORS.TEXT_MUTED,
};

const searchInputStyle: React.CSSProperties = {
  padding: "0.5rem 1rem 0.5rem 2.2rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  fontSize: "0.85rem",
  width: "200px",
  outline: "none",
};



const exportButtonStyle: React.CSSProperties = {
  display: "flex",
  gap: "6px",
  alignItems: "center",
  fontSize: "0.8rem",
  padding: "0.5rem 0.75rem",
};

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "1rem 0.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem 0.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};

const actionButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: COLORS.TEXT_SECONDARY,
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  transition: "all 0.2s",
};
