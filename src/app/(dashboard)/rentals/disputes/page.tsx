"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  RotateCcw,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import SelectField from "@/components/SelectField";
import {
  DisputeFilters,
  DisputeListCase,
  disputesApi,
} from "@/services/api/disputes";

const tabs = [
  { name: "Rentals Management", path: "/rentals" },
  { name: "Agreements", path: "/rentals/agreements" },
  { name: "Disputes & Refunds", path: "/rentals/disputes" },
  { name: "Admin Notes & Audit", path: "/rentals/audit" },
];

const inputStyle: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  fontSize: "0.85rem",
  width: "100%",
  outline: "none",
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#374151",
  fontWeight: 500,
  marginBottom: "0.35rem",
  display: "block",
};

const money = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const formatAge = (createdAt?: string) => {
  if (!createdAt) return "--";
  const hours = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 36e5),
  );
  return `${hours} hrs`;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Escalated: { bg: COLORS.ERROR_LIGHT, text: COLORS.ERROR_MAIN },
  "Under Review": { bg: COLORS.WARNING_LIGHT, text: COLORS.WARNING_MAIN },
  "Pending Evidence": { bg: COLORS.INFO_LIGHT, text: COLORS.PRIMARY_MAIN },
  New: { bg: "#F3F4F6", text: "#4B5563" },
  Open: { bg: "#F3F4F6", text: "#4B5563" },
  Resolved: { bg: COLORS.SUCCESS_LIGHT, text: COLORS.SUCCESS_DARK },
  Closed: { bg: "#E5E7EB", text: "#374151" },
};

export default function DisputesAndRefunds() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Disputes & Refunds");
  const [subTab, setSubTab] = useState("Disputes");
  const [cases, setCases] = useState<DisputeListCase[]>([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeDisputes: 0,
    refundRequests: 0,
    slaCritical: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<DisputeFilters>({ limit: 20 });
  const [draftFilters, setDraftFilters] = useState<DisputeFilters>({ limit: 20 });

  const effectiveFilters = useMemo(() => {
    const next: DisputeFilters = { ...filters };
    if (subTab === "Disputes") next.type = "Dispute";
    if (subTab === "Refunds") next.type = "Refund";
    if (subTab === "Resolved") {
      delete next.type;
      next.status = "Resolved,Closed";
    }
    return next;
  }, [filters, subTab]);

  const loadDisputes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await disputesApi.getDisputes(effectiveFilters);
      setCases(res.data.cases || []);
      setStats(
        res.data.stats || {
          totalCases: 0,
          activeDisputes: 0,
          refundRequests: 0,
          slaCritical: 0,
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load disputes");
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveFilters]);

  useEffect(() => {
    loadDisputes();
  }, [loadDisputes]);

  const topStats = [
    {
      title: "Total Cases",
      value: stats.totalCases,
      badge: "All disputes & refunds",
      icon: <ClipboardList size={20} color="#6B7280" />,
      valueColor: "#111827",
    },
    {
      title: "Active Disputes",
      value: stats.activeDisputes,
      badge: "Pending resolution",
      icon: <AlertTriangle size={20} color={COLORS.WARNING_MAIN} />,
      valueColor: COLORS.WARNING_MAIN,
    },
    {
      title: "Refund Requests",
      value: stats.refundRequests,
      badge: "Awaiting approval",
      icon: <RotateCcw size={20} color={COLORS.PRIMARY_MAIN} />,
      valueColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "SLA Critical",
      value: stats.slaCritical,
      badge: "Exceeding 48 hours",
      icon: <Clock size={20} color={COLORS.ERROR_MAIN} />,
      valueColor: COLORS.ERROR_MAIN,
    },
  ];

  const updateDraft = (key: keyof DisputeFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => setFilters({ ...draftFilters, limit: 20, page: 1 });

  const resetFilters = () => {
    const next = { limit: 20, page: 1 };
    setDraftFilters(next);
    setFilters(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title="Disputes & Refunds" />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Disputes & Refunds" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {topStats.map((stat) => (
          <div
            key={stat.title}
            style={{
              padding: "1.25rem",
              background: COLORS.BG_CARD,
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#4B5563", fontWeight: 500 }}>
                  {stat.title}
                </p>
                <p
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: stat.valueColor,
                    marginTop: "0.75rem",
                  }}
                >
                  {stat.value}
                </p>
              </div>
              {stat.icon}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.75rem" }}>
              {stat.badge}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          {[
            ["Disputes", stats.activeDisputes],
            ["Refunds", stats.refundRequests],
            ["Resolved", Math.max(0, stats.totalCases - stats.activeDisputes - stats.refundRequests)],
          ].map(([name, count]) => (
            <button
              key={String(name)}
              onClick={() => setSubTab(String(name))}
              style={{
                padding: "0.5rem 0",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: subTab === name ? COLORS.PRIMARY_MAIN : "#6B7280",
                borderBottom:
                  subTab === name
                    ? `2px solid ${COLORS.PRIMARY_MAIN}`
                    : "2px solid transparent",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {name}
              <span
                style={{
                  background: subTab === name ? COLORS.PRIMARY_LIGHT : "#F3F4F6",
                  color: subTab === name ? COLORS.PRIMARY_MAIN : "#6B7280",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div
          style={{
            background: COLORS.BG_CARD,
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(140px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Rental/Agreement ID</label>
              <input
                value={draftFilters.rentalId || draftFilters.agreementId || ""}
                onChange={(event) => {
                  updateDraft("rentalId", event.target.value);
                  updateDraft("agreementId", event.target.value);
                }}
                type="text"
                placeholder="Search ID..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Driver</label>
              <input
                value={draftFilters.driverName || ""}
                onChange={(event) => updateDraft("driverName", event.target.value)}
                type="text"
                placeholder="Driver name..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Owner</label>
              <input
                value={draftFilters.ownerName || ""}
                onChange={(event) => updateDraft("ownerName", event.target.value)}
                type="text"
                placeholder="Owner name..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Vehicle</label>
              <input
                value={draftFilters.vehicleReg || ""}
                onChange={(event) => updateDraft("vehicleReg", event.target.value)}
                type="text"
                placeholder="Reg. number..."
                style={inputStyle}
              />
            </div>
            <SelectField
              label="Status"
              placeholder="All Status"
              value={draftFilters.status || ""}
              onChange={(event) => updateDraft("status", event.target.value)}
              options={[
                { label: "New", value: "New" },
                { label: "Under Review", value: "Under Review" },
                { label: "Pending Evidence", value: "Pending Evidence" },
                { label: "Escalated", value: "Escalated" },
                { label: "Resolved", value: "Resolved" },
                { label: "Closed", value: "Closed" },
              ]}
            />
            <div>
              <label style={labelStyle}>Start Date</label>
              <input
                value={draftFilters.startDate || ""}
                onChange={(event) => updateDraft("startDate", event.target.value)}
                type="date"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={applyFilters}
                style={{
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <Filter size={16} />
                <span>Apply Filters</span>
              </button>
              <button
                onClick={resetFilters}
                style={{
                  background: COLORS.BG_CARD,
                  color: "#6B7280",
                  border: "1px solid #E5E7EB",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                background: COLORS.BG_CARD,
                color: "#4B5563",
                border: "1px solid #E5E7EB",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              <Download size={16} />
              <span>Export Cases</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ color: COLORS.ERROR_MAIN, fontSize: "0.9rem", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div
        style={{
          padding: "0",
          overflow: "hidden",
          background: COLORS.BG_CARD,
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                {[
                  "CASE ID",
                  "TYPE",
                  "RENTAL/AGREEMENT",
                  "DRIVER",
                  "OWNER",
                  "VEHICLE",
                  "AMOUNT",
                  "AGE/SLA",
                  "STATUS",
                  "ACTIONS",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6B7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ padding: "2rem", color: "#6B7280" }}>
                    Loading disputes...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: "2rem", color: "#6B7280" }}>
                    No dispute cases found.
                  </td>
                </tr>
              ) : (
                cases.map((caseItem) => {
                  const colors = statusColors[caseItem.status] || statusColors.New;
                  return (
                    <tr
                      key={caseItem._id}
                      onClick={() => router.push(`/rentals/disputes/${caseItem.caseId}`)}
                      style={{ borderBottom: "1px solid #E5E7EB", cursor: "pointer" }}
                      onMouseOver={(event) => {
                        event.currentTarget.style.backgroundColor = "#F9FAFB";
                      }}
                      onMouseOut={(event) => {
                        event.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: COLORS.PRIMARY_MAIN }}>
                        {caseItem.caseId}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, backgroundColor: "#FEF3C7", color: "#D97706" }}>
                          {caseItem.type}
                        </span>
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: "#111827" }}>
                        {caseItem.rental?.rentalId || caseItem.agreement?.agreementId || "--"}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: "#111827" }}>
                        {caseItem.driver?.name || "--"}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: "#6B7280" }}>
                        {caseItem.owner?.email || "--"}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: "#6B7280" }}>
                        {caseItem.rental?.vehicleRegistration || caseItem.rental?.vehicleName || "--"}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                        {money(caseItem.disputedAmount)}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.85rem", color: caseItem.isSlaCritical ? COLORS.ERROR_MAIN : "#D97706" }}>
                            {formatAge(caseItem.createdAt)}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: caseItem.isSlaCritical ? COLORS.ERROR_MAIN : "#6B7280" }}>
                            {caseItem.isSlaCritical ? "Critical" : "Normal"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, backgroundColor: colors.bg, color: colors.text }}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Eye size={16} color={COLORS.PRIMARY_MAIN} />
                          <FileText size={16} color={COLORS.SUCCESS_MAIN} />
                          <User size={16} color={COLORS.SUCCESS_MAIN} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
