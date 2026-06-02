"use client";

import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import FinanceOverview from "./FinanceOverview";
import IncomeExpense from "./IncomeExpense";
import VehicleFinance, { FinanceRecord } from "./VehicleFinance";
import VehiclePurchase, { PurchaseRecord } from "./VehiclePurchase";
import InvoiceManagement from "./InvoiceManagement";
import RefundManagement from "./RefundManagement";
import PLOverview from "./PLOverview";
import { financeApi } from "@/services/api/finance";

const TABS = [
  "Finance Module Overview",
  "Income & Expense",
  "Vehicle Finance",
  "Vehicle Purchase",
  "Invoices",
  "Refunds",
  "P&L Overview",
];

function Shimmer() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: "48px", background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "6px" }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState(TABS[6]);
  const [selectedRecord, setSelectedRecord] = useState<FinanceRecord | null>(null);
  const [selectedPurchaseRecord, setSelectedPurchaseRecord] = useState<PurchaseRecord | null>(null);
  const router = useRouter();

  // Finance Overview data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Transactions data
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await financeApi.getOverview("monthly");
      setOverviewData(res.data);
    } catch { /* fallback to empty */ }
    finally { setOverviewLoading(false); }
  }, []);

  const loadTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const res = await financeApi.getTransactions({ page: 1, limit: 10 });
      const d = res.data as any;
      setTransactions(d.transactions ?? d.data ?? []);
    } catch { /* fallback to empty */ }
    finally { setTxLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "Finance Module Overview") loadOverview();
    if (activeTab === "Income & Expense") loadTransactions();
  }, [activeTab, loadOverview, loadTransactions]);

  // Build chart data from API or fallback to empty arrays
  const incomeExpenseChartData = overviewData?.monthlyData ?? [];
  const outstandingPaymentsData = overviewData?.outstandingData ?? [];
  const recentActivity = overviewData?.recentActivity ?? [];

  // Map transactions to the shape IncomeExpense expects
  const mappedTransactions = transactions.map((tx: any) => ({
    id: tx._id,
    title: tx.transactionTitle || tx.title || "--",
    description: tx.description || "--",
    date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "--",
    amount: tx.amount > 0 ? `+$${Math.abs(tx.amount).toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`,
    type: tx.transactionType || tx.type || "--",
    agreement: tx.agreementId || "Not Linked",
    driver: tx.driverName || "-",
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title={activeTab === "P&L Overview" ? "Profit & Loss Statement" : activeTab}
        description={
          activeTab === "P&L Overview"
            ? "Comprehensive financial reporting and analysis"
            : "Financial control hub and reporting"
        }
        notificationCount={5}
      />

      {/* Toolbar / Breadcrumb */}
      {!selectedRecord && !selectedPurchaseRecord && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", cursor: "pointer" }} onClick={() => router.push("/finance")}>Finance</p>
              <ChevronRight size={14} style={{ color: "#6B7280" }} />
              <p style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 700 }}>{activeTab}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.BORDER_MAIN}`, gap: "2rem", padding: "0 0.5rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "1rem 0",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: activeTab === tab ? COLORS.PRIMARY_MAIN : COLORS.TEXT_SECONDARY,
              borderBottom: activeTab === tab ? `2px solid ${COLORS.PRIMARY_MAIN}` : "2px solid transparent",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Finance Module Overview" && (
        overviewLoading ? <Shimmer /> : (
          <FinanceOverview
            incomeExpenseData={incomeExpenseChartData}
            outstandingPaymentsData={outstandingPaymentsData}
            recentActivity={recentActivity}
            kpis={overviewData ? {
              totalIncome: overviewData.totalIncome,
              totalExpense: overviewData.totalExpense,
              netProfit: overviewData.netProfit,
              outstanding: overviewData.outstanding,
              incomeChange: overviewData.incomeChange,
              expenseChange: overviewData.expenseChange,
            } : undefined}
          />
        )
      )}

      {activeTab === "Income & Expense" && (
        txLoading ? <Shimmer /> : (
          <IncomeExpense
            transactions={mappedTransactions}
            kpis={overviewData ? {
              totalIncome: overviewData.totalIncome,
              totalExpense: overviewData.totalExpense,
              incomeChange: overviewData.incomeChange,
              expenseChange: overviewData.expenseChange,
            } : undefined}
          />
        )
      )}

      {activeTab === "Vehicle Finance" && (
        <VehicleFinance selectedRecord={selectedRecord} setSelectedRecord={setSelectedRecord} />
      )}

      {activeTab === "Vehicle Purchase" && (
        <VehiclePurchase selectedRecord={selectedPurchaseRecord} setSelectedRecord={setSelectedPurchaseRecord} />
      )}

      {activeTab === "Invoices" && <InvoiceManagement />}
      {activeTab === "Refunds" && <RefundManagement />}
      {activeTab === "P&L Overview" && <PLOverview />}
    </div>
  );
}
