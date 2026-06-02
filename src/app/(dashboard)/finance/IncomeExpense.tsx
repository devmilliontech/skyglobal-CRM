"use client";

import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Plus,
  ArrowDownRight,
  AlertCircle,
  X,
  LayoutGrid,
} from "lucide-react";
import SelectField from "@/components/SelectField";
import { FinanceStatCard } from "./shared";
import TransactionForm from "./TransactionForm";

interface IncomeExpenseKpis {
  totalIncome?: number;
  totalExpense?: number;
  netIncome?: number;
  incomeChange?: number;
  expenseChange?: number;
}

interface IncomeExpenseProps {
  transactions: any[];
  kpis?: IncomeExpenseKpis;
}

type ViewType = "list" | "add" | "edit";

const fmt = (v: number | undefined, fallback: string) =>
  v !== undefined ? `$${v.toLocaleString()}` : fallback;

export default function IncomeExpense({ transactions, kpis }: IncomeExpenseProps) {
  const [showAlert, setShowAlert] = useState(true);
  const [view, setView] = useState<ViewType>("list");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const handleAddClick = () => {
    setSelectedTransaction(null);
    setView("add");
  };

  const handleRowClick = (tx: any) => {
    setSelectedTransaction(tx);
    setView("edit");
  };

  const handleCloseForm = () => {
    setView("list");
    setSelectedTransaction(null);
  };

  if (view !== "list") {
    return (
      <TransactionForm
        onClose={handleCloseForm}
        initialData={selectedTransaction}
      />
    );
  }

  return (
    <>
      {/* Alert Banner */}
      {showAlert && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FEF3C7",
            padding: "1rem",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle
              size={20}
              color="#D97706"
              style={{ marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#92400E",
                }}
              >
                Duplicate Transaction Detected
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#B45309",
                  marginTop: "2px",
                }}
              >
                Transaction "Weekly Rental Payment" for $450.00 appears to be
                duplicated. Please review.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#92400E",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Stats Grid for Income & Expense */}
      <div
        style={{
          display: "flex",
          gap: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <FinanceStatCard
          label="Income"
          value={fmt(kpis?.totalIncome, "$48,750")}
          trend="up"
          trendValue={kpis?.incomeChange !== undefined ? `+${kpis.incomeChange}% vs last month` : "+12.5% vs last month"}
          icon={<TrendingUp size={20} />}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          valueColor="#16A34A"
        />
        <FinanceStatCard
          label="Expenses"
          value={fmt(kpis?.totalExpense, "$32,150")}
          trend="down"
          trendValue={kpis?.expenseChange !== undefined ? `+${kpis.expenseChange}% vs last month` : "+5.2% vs last month"}
          icon={<TrendingDown size={20} />}
          iconBg="#FEF2F2"
          iconColor={COLORS.ERROR_MAIN}
          valueColor={COLORS.ERROR_MAIN}
        />
        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: COLORS.TEXT_SECONDARY,
                fontWeight: 500,
              }}
            >
              Net Income
            </span>
            <span
              style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16A34A" }}
            >
              {fmt(kpis?.netIncome !== undefined ? kpis.netIncome : (kpis?.totalIncome !== undefined && kpis?.totalExpense !== undefined ? kpis.totalIncome - kpis.totalExpense : undefined), "$16,600")}
            </span>
            <span
              style={{ fontSize: "0.8rem", color: "#16A34A", fontWeight: 600 }}
            >
              ↑ Positive month
            </span>
          </div>
          <div
            style={{
              background: "#EBF5FF",
              padding: "10px",
              borderRadius: "10px",
              color: COLORS.PRIMARY_MAIN,
            }}
          >
            <LayoutGrid size={24} />
          </div>
        </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Date Range:
              </span>
              <div style={{ width: "160px" }}>
                <SelectField
                  options={[
                    { label: "Monthly", value: "monthly" },
                    { label: "Weekly", value: "weekly" },
                    { label: "Custom", value: "custom" },
                  ]}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Driver:
              </span>
              <div style={{ width: "160px" }}>
                <SelectField
                  options={[
                    { label: "All Drivers", value: "all" },
                    { label: "John Smith", value: "1" },
                    { label: "Sarah Johnson", value: "2" },
                  ]}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Transaction Date:
              </span>
              <div style={{ position: "relative", width: "180px" }}>
                <input
                  type="date"
                  style={{
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    width: "100%",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleAddClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.6rem 1.25rem",
                background: COLORS.PRIMARY_MAIN,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <Plus size={18} />
              Add Transaction
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
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "1.5rem",
          }}
        >
          Transaction History
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {[
                  "TITLE",
                  "DESCRIPTION",
                  "TRANSACTION DATE",
                  "AMOUNT",
                  "TYPE",
                  "AGREEMENT",
                  "DRIVER",
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
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
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  // onClick={() => handleRowClick(tx)}
                  style={{
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  className="hover-row"
                >
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {tx.title}
                  </td>
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {tx.description}
                  </td>
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {tx.date}
                  </td>
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: tx.amount.startsWith("+")
                        ? "#16A34A"
                        : COLORS.ERROR_MAIN,
                    }}
                  >
                    {tx.amount}
                  </td>
                  <td style={{ padding: "1.2rem 0.5rem" }}>
                    <span
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          tx.type === "Income"
                            ? "#F0FDF4"
                            : tx.type === "Expense"
                              ? "#FEF2F2"
                              : "#FFF7ED",
                        color:
                          tx.type === "Income"
                            ? "#16A34A"
                            : tx.type === "Expense"
                              ? COLORS.ERROR_MAIN
                              : "#F97316",
                      }}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {tx.agreement}
                  </td>
                  <td
                    style={{
                      padding: "1.2rem 0.5rem",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {tx.driver}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
