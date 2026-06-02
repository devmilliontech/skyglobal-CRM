"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowDownRight,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import StatusBadge from "@/components/StatusBadge";
import InvoiceDetail from "./InvoiceDetail";
import { financeApi } from "@/services/api/finance";

const INVOICE_DATA = [
  {
    id: "INV-2024-001",
    customer: "Sarah Johnson",
    email: "sarah@email.com",
    amount: 2450.0,
    issueDate: "2024-04-01",
    dueDate: "2024-04-15",
    status: "Overdue",
    agreement: "AGR-2024-001",
  },
  {
    id: "INV-2024-002",
    customer: "Michael Chen",
    email: "michael@email.com",
    amount: 1890.0,
    issueDate: "2024-04-03",
    dueDate: "2024-04-17",
    status: "Paid",
    agreement: "AGR-2024-002",
  },
  {
    id: "INV-2024-003",
    customer: "Emma Wilson",
    email: "emma@email.com",
    amount: 3200.0,
    issueDate: "2024-04-05",
    dueDate: "2024-04-19",
    status: "Pending",
    agreement: "AGR-2024-003",
  },
  {
    id: "INV-2024-004",
    customer: "James Rodriguez",
    email: "james@email.com",
    amount: 1650.0,
    issueDate: "2024-04-06",
    dueDate: "2024-04-20",
    status: "Unpaid",
    agreement: "AGR-2024-004",
  },
  {
    id: "INV-2024-005",
    customer: "Lisa Thompson",
    email: "lisa@email.com",
    amount: 4100.0,
    issueDate: "2024-04-02",
    dueDate: "2024-04-16",
    status: "Overdue",
    agreement: "AGR-2024-005",
  },
  {
    id: "INV-2024-006",
    customer: "David Martinez",
    email: "david@email.com",
    amount: 2780.0,
    issueDate: "2024-04-07",
    dueDate: "2024-04-21",
    status: "Paid",
    agreement: "AGR-2024-006",
  },
];

export default function InvoiceManagement() {
  const [activeFilter, setActiveFilter] = useState("Monthly");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<any[]>(INVOICE_DATA);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await financeApi.getInvoiceDashboard();
        if (response?.data) {
          if (response.data.invoices?.length) {
            setInvoiceData(response.data.invoices.map((inv: any) => ({
              id: inv.invoiceId || inv._id,
              customer: inv.customerName || inv.driverName || "—",
              email: inv.email || "",
              amount: inv.amount || 0,
              issueDate: inv.issueDate || inv.createdAt || "—",
              dueDate: inv.dueDate || "—",
              status: inv.status || "Pending",
              agreement: inv.agreementId || "—",
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
    fetchInvoices();
  }, []);

  if (selectedInvoice) {
    return (
      <InvoiceDetail
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
      />
    );
  }

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
          title="Outstanding Payments"
          value={kpis?.outstandingPayments || "$45,230.00"}
          badge={kpis?.overdueCount ? `${kpis.overdueCount} overdue invoices` : "12 overdue invoices"}
          badgeColor="#DC2626"
          badgeBg="#FEE2E2"
          icon={<AlertTriangle size={24} />}
          iconBg="#FEF2F2"
          iconColor="#EF4444"
        />
        <StatCard
          title="Platform Earnings"
          value={kpis?.platformEarnings || "$128,450.00"}
          badge="This month"
          badgeColor="#16A34A"
          badgeBg="#DCFCE7"
          icon={<TrendingUp size={24} />}
          iconBg="#F0FDF4"
          iconColor="#22C55E"
        />
        <StatCard
          title="Paid Invoices"
          value="347"
          badge="This period"
          badgeColor="#3B82F6"
          badgeBg="#EFF6FF"
          icon={<CheckCircle2 size={24} />}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
        />
        <StatCard
          title="Pending Invoices"
          value="23"
          badge="Awaiting payment"
          badgeColor="#EAB308"
          badgeBg="#FEFCE8"
          icon={<Clock size={24} />}
          iconBg="#FEFCE8"
          iconColor="#EAB308"
        />
      </div>

      {/* Filters Row */}
      <div className="card" style={{ padding: "1.25rem" }}>
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
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  whiteSpace: "nowrap",
                }}
              >
                Date Range:
              </span>
              <div style={{ width: "140px" }}>
                <SelectField
                  options={[
                    { label: "Monthly", value: "monthly" },
                    { label: "Weekly", value: "weekly" },
                    { label: "Quarterly", value: "quarterly" },
                    { label: "Financial Year", value: "financial_year" },
                    { label: "Custom", value: "custom" },
                  ]}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  whiteSpace: "nowrap",
                }}
              >
                Status:
              </span>
              <div style={{ width: "140px" }}>
                <SelectField
                  options={[
                    { label: "All Statuses", value: "all" },
                    { label: "Paid", value: "paid" },
                    { label: "Unpaid", value: "unpaid" },
                    { label: "Overdue", value: "overdue" },
                    { label: "Pending", value: "pending" },
                  ]}
                />
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: COLORS.TEXT_MUTED,
                }}
              />
              <input
                type="text"
                placeholder="Search invoices..."
                style={{
                  padding: "0.55rem 1rem 0.55rem 2.5rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.85rem",
                  width: "220px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                fontSize: "0.85rem",
              }}
            >
              <Download size={16} />
              <span>Export List</span>
            </Button>
            <Button
              variant="primary"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                fontSize: "0.85rem",
              }}
            >
              <Plus size={16} />
              <span>Create Invoice</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice List Table */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "1.5rem",
          }}
        >
          Invoice List
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {[
                  "INVOICE ID",
                  "DRIVER/CUSTOMER",
                  "AMOUNT",
                  "ISSUE DATE",
                  "DUE DATE",
                  "STATUS",
                  "AGREEMENT",
                  "ACTIONS",
                ].map((head) => (
                  <th key={head} style={tableHeaderStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {head}
                      <ArrowDownRight size={12} style={{ opacity: 0.5 }} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  style={{
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  className="hover-row"
                >
                  <td style={tableCellStyle}>
                    <span
                      style={{ color: COLORS.PRIMARY_MAIN, fontWeight: 600 }}
                    >
                      {invoice.id}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div>
                      <p style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                        {invoice.customer}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        {invoice.email}
                      </p>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontWeight: 700 }}>
                      $
                      {invoice.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{invoice.issueDate}</td>
                  <td style={tableCellStyle}>{invoice.dueDate}</td>
                  <td style={tableCellStyle}>
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ color: COLORS.PRIMARY_MAIN }}>
                      {invoice.agreement}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div
                      style={{ display: "flex", gap: "0.5rem" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        style={actionButtonStyle}
                        title="View"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <Eye size={16} />
                      </button>
                      <button style={actionButtonStyle} title="Download">
                        <Download size={16} />
                      </button>
                      <button style={actionButtonStyle} title="Edit">
                        <Edit size={16} />
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

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "1rem 0.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1.2rem 0.5rem",
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
