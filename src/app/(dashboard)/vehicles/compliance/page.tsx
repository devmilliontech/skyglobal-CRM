"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  Clock,
  Download,
  Eye,
  File,
  FileWarning,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import SelectField from "@/components/SelectField";
import {
  complianceApi,
  ComplianceDashboard,
  ComplianceRecord,
} from "@/services/api/compliance";

const filterTabs = [
  "All Vehicles",
  "Expiring 7 Days",
  "Expiring 30 Days",
  "Expiring 60 Days",
  "Overdue",
  "Missing Documents",
];

const defaultDashboard: ComplianceDashboard = {
  stats: { compliant: 0, expiringSoon: 0, overdue: 0, missingDocs: 0 },
  banners: [],
  vehicles: [],
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
};

export default function ComplianceCenterPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Vehicles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [makeFilter, setMakeFilter] = useState("All Makes");
  const [regSearch, setRegSearch] = useState("");
  const [dashboard, setDashboard] =
    useState<ComplianceDashboard>(defaultDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompliance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await complianceApi.getDashboard({
        page: 1,
        limit: 25,
        search: regSearch || search || undefined,
        quickFilter: activeFilter,
        status: statusFilter,
        make: makeFilter,
      });
      setDashboard(response.data ?? defaultDashboard);
    } catch (err: any) {
      setError(err.message || "Failed to load compliance records");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, makeFilter, regSearch, search, statusFilter]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  const overviewStats = useMemo(
    () => [
      {
        label: "Compliant Vehicles",
        value: dashboard.stats.compliant,
        color: COLORS.SUCCESS_MAIN,
      },
      {
        label: "Expiring Soon",
        value: dashboard.stats.expiringSoon,
        color: COLORS.WARNING_MAIN,
      },
      { label: "Overdue", value: dashboard.stats.overdue, color: COLORS.ERROR_MAIN },
      {
        label: "Missing Docs",
        value: dashboard.stats.missingDocs,
        color: COLORS.GRAY_400,
      },
    ],
    [dashboard.stats],
  );

  const handleExport = async () => {
    try {
      const blob = await complianceApi.exportCsv({
        search: regSearch || search || undefined,
        quickFilter: activeFilter,
        status: statusFilter,
        make: makeFilter,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vehicle-compliance-records.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to export compliance records");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setActiveFilter("All Vehicles");
    setStatusFilter("All Status");
    setMakeFilter("All Makes");
    setRegSearch("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Compliance Center"
        notificationCount={3}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search drivers, vehicles, agreements, rentals, users..."
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.75rem", color: COLORS.SECONDARY_MAIN, cursor: "pointer" }} onClick={() => router.push("/")}>
          Dashboard
        </p>
        <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
        <p style={{ fontSize: "0.75rem", color: COLORS.SECONDARY_MAIN, cursor: "pointer" }} onClick={() => router.push("/vehicles")}>
          Vehicles
        </p>
        <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
        <p style={{ fontSize: "0.75rem", color: COLORS.SECONDARY_MAIN, fontWeight: 700 }}>
          Compliance
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
        {(dashboard.banners.length ? dashboard.banners : [
          { title: "Documents Expiring Soon", message: "Insurance and registration documents require renewal within 30 days", type: "warning" },
          { title: "Missing Documents", message: "Vehicles with incomplete compliance documentation", type: "critical" },
        ]).slice(0, 2).map((banner, index) => (
          <ActionCard
            key={`${banner.title}-${index}`}
            icon={banner.type === "critical" ? <FileWarning size={22} /> : <Clock size={16} />}
            title={banner.title}
            subtitle={banner.message}
            bg={banner.type === "critical" ? COLORS.WARNING_LIGHT : COLORS.ERROR_LIGHT}
            color={banner.type === "critical" ? COLORS.WARNING_MAIN : COLORS.ERROR_MAIN}
            border={banner.type === "critical" ? COLORS.WARNING_MAIN : COLORS.ERROR_MAIN}
          />
        ))}
      </div>

      <Card>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
          Compliance Overview
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {overviewStats.map((stat) => (
            <div key={stat.label}>
              <p style={{ fontSize: "2rem", fontWeight: 800, color: stat.color, lineHeight: 1.2 }}>
                {stat.value.toLocaleString()}
              </p>
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY, fontWeight: 500, marginTop: "0.25rem" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Filters</h3>
          <button onClick={resetFilters} style={{ fontSize: "0.85rem", color: COLORS.PRIMARY_MAIN, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            Clear All
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                border: activeFilter === tab ? "none" : `1px solid ${COLORS.BORDER_MAIN}`,
                background: activeFilter === tab ? COLORS.PRIMARY_MAIN : COLORS.BG_CARD,
                color: activeFilter === tab ? COLORS.BG_CARD : COLORS.TEXT_MAIN,
                transition: "all 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <SelectField
            label="Status"
            options={[
              { label: "All Status", value: "All Status" },
              { label: "Compliant", value: "Compliant" },
              { label: "Expiring Soon", value: "Expiring Soon" },
              { label: "Overdue", value: "Overdue" },
              { label: "Missing Docs", value: "Missing Documents" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <SelectField
            label="Make"
            options={[
              { label: "All Makes", value: "All Makes" },
              { label: "Toyota", value: "Toyota" },
              { label: "Honda", value: "Honda" },
              { label: "Ford", value: "Ford" },
              { label: "Nissan", value: "Nissan" },
              { label: "BMW", value: "BMW" },
              { label: "Hyundai", value: "Hyundai" },
              { label: "Kia", value: "Kia" },
            ]}
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
          />
          <div>
            <label style={{ fontSize: "0.85rem", color: "#374151", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
              Registration
            </label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: COLORS.TEXT_MUTED }} />
              <input
                type="text"
                placeholder="Search registration..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                style={{ padding: "0.6rem 0.75rem 0.6rem 2.25rem", borderRadius: "8px", border: `1px solid ${COLORS.BORDER_MAIN}`, fontSize: "0.85rem", width: "100%", outline: "none", background: "#F9FAFB" }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card padding="0">
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
            Vehicle Compliance Records
          </h3>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={16} />
              Export
            </Button>
            <Button variant="primary" size="sm">
              <Bell size={16} />
              Set Reminders
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {["REGISTRATION", "VEHICLE", "OWNER", "INSURANCE STATUS", "REGISTRATION EXPIRY", "COMPLIANCE STATUS", "ACTIONS"].map((head) => (
                  <th key={head} style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: COLORS.TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.025em" }}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_SECONDARY }}>
                    Loading compliance records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: COLORS.ERROR_MAIN }}>
                    {error}
                    <button onClick={fetchCompliance} style={{ marginLeft: "0.75rem", color: COLORS.ERROR_MAIN, background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>
                      Retry
                    </button>
                  </td>
                </tr>
              ) : dashboard.vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
                    No compliance records found
                  </td>
                </tr>
              ) : (
                dashboard.vehicles.map((record) => (
                  <ComplianceRow
                    key={record.id}
                    record={record}
                    onOpen={() => router.push(`/vehicles/compliance/${record.id}`)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderTop: `1px solid ${COLORS.BORDER_MAIN}` }}>
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Showing {dashboard.vehicles.length ? 1 : 0} to {dashboard.vehicles.length} of {dashboard.pagination.total} results
          </p>
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Page {dashboard.pagination.page} of {dashboard.pagination.pages || 1}
          </p>
        </div>
      </Card>
    </div>
  );
}

function ComplianceRow({ record, onOpen }: { record: ComplianceRecord; onOpen: () => void }) {
  return (
    <tr
      style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}`, cursor: "pointer", transition: "background-color 0.2s" }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      onClick={onOpen}
    >
      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", fontWeight: 700, color: COLORS.TEXT_MAIN }}>
        {record.registration}
      </td>
      <td style={{ padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>{record.vehicle}</p>
        <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>{record.color || "--"}</p>
      </td>
      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
        {record.owner}
      </td>
      <td style={{ padding: "1.25rem 1.5rem" }}>
        <StatusBadge status={record.insuranceStatus} />
      </td>
      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
        {record.registrationExpiry}
      </td>
      <td style={{ padding: "1.25rem 1.5rem" }}>
        <StatusBadge status={record.complianceStatus} />
      </td>
      <td style={{ padding: "1.25rem 1.5rem" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Eye size={16} color={COLORS.PRIMARY_MAIN} style={{ cursor: "pointer" }} onClick={onOpen} />
          <File size={16} color={COLORS.SUCCESS_MAIN} />
          <Bell size={16} color={COLORS.WARNING_MAIN} />
        </div>
      </td>
    </tr>
  );
}

function ActionCard({ icon, title, subtitle, bg, color, border }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0.75rem", borderRadius: "12px", background: bg, gap: "0.75rem", border: `1px solid ${border}` }}>
      <div style={{ color, background: "rgba(255,255,255,0.6)", padding: "8px", borderRadius: "8px" }}>
        {icon}
      </div>
      <div style={{ flexGrow: 1 }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>{title}</p>
        <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{subtitle}</p>
      </div>
    </div>
  );
}
