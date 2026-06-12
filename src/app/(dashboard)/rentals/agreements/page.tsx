"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Filter,
  Home,
  MoreVertical,
  Plus,
  RefreshCw,
  Shield,
} from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import { COLORS } from "@/constants/Constant";
import { Agreement, rentalsApi } from "@/services/api/rentals";

const tabs = [
  { name: "Rentals Management", path: "/rentals" },
  { name: "Agreements", path: "/rentals/agreements" },
  { name: "Disputes & Refunds", path: "/rentals/disputes" },
  { name: "Admin Notes & Audit", path: "/rentals/audit" },
];

const statusOptions = [
  "All Status",
  "Draft",
  "Pending",
  "Active",
  "Suspended",
  "Overdue",
  "Completed",
  "Cancelled",
];

const typeOptions = ["Agreement Type", "Short-Term", "Rent-to-Own", "Lease"];

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  fontSize: "0.68rem",
  fontWeight: 800,
  color: "#64748B",
  textAlign: "center",
  textTransform: "uppercase",
  background: "#F8FAFC",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.8rem",
  color: "#1E293B",
  // verticalAlign: "middle",
  textAlign: "center",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: "38px",
  padding: "0 0.75rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: COLORS.BG_CARD,
  fontSize: "0.8rem",
  color: COLORS.TEXT_MAIN,
  outline: "none",
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
};

const formatMoney = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const agreementKey = (agreement: Agreement) =>
  agreement.agreementId || agreement.id || agreement._id;

const getVehicleLabel = (agreement: Agreement) =>
  agreement.vehicle || agreement.vehicleName || "N/A";

const getAgreementType = (agreement: Agreement) =>
  agreement.type || agreement.agreementType || "Short-Term";

const getAlertLabel = (agreement: Agreement) => {
  if (agreement.status === "Overdue") return "Payment overdue";
  if (agreement.status === "Suspended") return "Suspended";
  if (!agreement.endDate) return "";

  const end = new Date(agreement.endDate);
  const days = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(days) || days < 0) return "Expired";
  if (days <= 30) return "Renewal due";
  return "";
};

const statusColor = (status?: string) => {
  if (status === "Active" || status === "Completed") return COLORS.SUCCESS_MAIN;
  if (status === "Pending" || status === "Draft") return COLORS.WARNING_MAIN;
  if (status === "Suspended" || status === "Cancelled" || status === "Overdue") return COLORS.ERROR_MAIN;
  return COLORS.TEXT_SECONDARY;
};

function StatTile({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${COLORS.BORDER_MAIN}`,
        borderRadius: "8px",
        background: COLORS.BG_CARD,
        padding: "0.9rem",
        minHeight: "74px",
        display: "flex",
        justifyContent: "space-between",
        gap: "0.75rem",
      }}
    >
      <div>
        <p style={{ fontSize: "0.72rem", color: COLORS.TEXT_SECONDARY, marginBottom: "0.3rem" }}>
          {title}
        </p>
        <p style={{ fontSize: "1.35rem", lineHeight: 1, fontWeight: 800, color: COLORS.TEXT_MAIN }}>
          {value}
        </p>
      </div>
      <div style={{ color, display: "flex", alignItems: "flex-start" }}>{icon}</div>
    </div>
  );
}

export default function AgreementsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Agreements");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("Agreement Type");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [ownerFilter, setOwnerFilter] = useState("All Owners");
  const [driverFilter, setDriverFilter] = useState("All Drivers");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "All Status",
    type: "Agreement Type",
    vehicle: "All Vehicles",
  });
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreements = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await rentalsApi.getAgreements({
          page: nextPage,
          limit: 25,
          search: search || undefined,
          status:
            appliedFilters.status === "All Status"
              ? undefined
              : appliedFilters.status,
          agreementType:
            appliedFilters.type === "Agreement Type"
              ? undefined
              : appliedFilters.type,
          searchVehicle: appliedFilters.vehicle === "All Vehicles" ? undefined : appliedFilters.vehicle,
        });

        setAgreements(res.data.agreements || []);
        setStats(res.data.stats || {});
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setPages(res.data.pages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load agreements");
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters, search],
  );

  useEffect(() => {
    fetchAgreements(1);
  }, [fetchAgreements]);

  const ownerOptions = useMemo(
    () => ["All Owners", ...Array.from(new Set(agreements.map((item) => item.ownerEmail).filter(Boolean) as string[]))],
    [agreements],
  );
  const driverOptions = useMemo(
    () => ["All Drivers", ...Array.from(new Set(agreements.map((item) => item.driverName).filter(Boolean) as string[]))],
    [agreements],
  );
  const vehicleOptions = useMemo(
    () => ["All Vehicles", ...Array.from(new Set(agreements.map(getVehicleLabel).filter((item) => item !== "N/A")))],
    [agreements],
  );

  const visibleAgreements = agreements.filter((agreement) => {
    const ownerMatches = ownerFilter === "All Owners" || agreement.ownerEmail === ownerFilter;
    const driverMatches = driverFilter === "All Drivers" || agreement.driverName === driverFilter;
    return ownerMatches && driverMatches;
  });

  const statCards = [
    { title: "Total Agreements", value: stats.totalAgreements ?? total, icon: <FileText size={22} />, color: COLORS.PRIMARY_MAIN },
    { title: "Active", value: stats.activeAgreements ?? 0, icon: <CheckCircle size={22} />, color: COLORS.SUCCESS_MAIN },
    { title: "Expiring Soon", value: stats.expiringSoon ?? 0, icon: <Calendar size={22} />, color: COLORS.WARNING_MAIN },
    { title: "Suspended", value: stats.suspendedAgreements ?? 0, icon: <AlertTriangle size={22} />, color: COLORS.ERROR_MAIN },
    { title: "Pending Approval", value: stats.pendingApproval ?? 0, icon: <RefreshCw size={22} />, color: COLORS.PRIMARY_MAIN },
    { title: "Rent-to-Own", value: stats.rentToOwn ?? 0, icon: <Home size={22} />, color: COLORS.SUCCESS_MAIN },
    { title: "Rental Only", value: stats.rentalOnly ?? 0, icon: <Calendar size={22} />, color: COLORS.PRIMARY_MAIN },
    { title: "Compliance Issues", value: stats.complianceIssues ?? 0, icon: <Shield size={22} />, color: COLORS.WARNING_MAIN },
  ];

  const applyFilters = () => {
    setAppliedFilters({
      status: statusFilter,
      type: typeFilter,
      vehicle: vehicleFilter,
    });
  };

  const resetFilters = () => {
    setStatusFilter("All Status");
    setTypeFilter("Agreement Type");
    setVehicleFilter("All Vehicles");
    setOwnerFilter("All Owners");
    setDriverFilter("All Drivers");
    setAppliedFilters({ status: "All Status", type: "Agreement Type", vehicle: "All Vehicles" });
  };

  const openAgreement = (agreement: Agreement) => {
    router.push(`/rentals/agreements/${encodeURIComponent(agreementKey(agreement))}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <PageHeader
        title="Agreement Management"
        searchValue={search}
        onSearchChange={setSearch}
        customActions={
          <Button onClick={() => router.push("/rentals/agreements/create")} size="sm">
            <Plus size={16} /> Create
          </Button>
        }
        notificationCount={3}
      />

      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Agreements" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "0.75rem" }}>
        {statCards.map((stat) => (
          <StatTile key={stat.title} {...stat} />
        ))}
      </div>

      <Card padding="1rem" style={{ borderRadius: "8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr)) auto auto", gap: "0.75rem", alignItems: "center" }}>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={selectStyle}>
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} style={selectStyle}>
            {typeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)} style={selectStyle}>
            {vehicleOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} style={selectStyle}>
            {ownerOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={driverFilter} onChange={(event) => setDriverFilter(event.target.value)} style={selectStyle}>
            {driverOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <Button onClick={applyFilters} size="sm" style={{ height: "38px", padding: "0 1.25rem" }}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters} size="sm" style={{ height: "38px", padding: "0 1rem" }}>
            Reset
          </Button>
        </div>
      </Card>

      {error && (
        <div style={{ padding: "0.9rem 1rem", borderRadius: "8px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", fontSize: "0.85rem" }}>
          {error}{" "}
          <button onClick={() => fetchAgreements(page)} style={{ border: "none", background: "transparent", color: "#B91C1C", textDecoration: "underline", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      <Card padding="0" style={{ borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${COLORS.BORDER_MAIN}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: COLORS.TEXT_MAIN }}>All Agreements</h3>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <Button onClick={() => router.push("/rentals/agreements/create")} size="sm">
              <Plus size={15} /> Create Agreement
            </Button>
            <Button variant="outline" size="sm">
              <Download size={15} /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter size={15} /> Advanced Filter
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "1160px", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: "120px" }}>Agreement</th>
                <th style={{ ...tableHeaderStyle, width: "105px" }}>Type</th>
                <th style={{ ...tableHeaderStyle, width: "160px" }}>Driver</th>
                <th style={{ ...tableHeaderStyle, width: "170px" }}>Owner</th>
                <th style={{ ...tableHeaderStyle, width: "150px" }}>Vehicle</th>
                <th style={{ ...tableHeaderStyle, width: "95px" }}>Start Date</th>
                <th style={{ ...tableHeaderStyle, width: "95px" }}>End Date</th>
                <th style={{ ...tableHeaderStyle, width: "100px" }}>Amount</th>
                <th style={{ ...tableHeaderStyle, width: "95px" }}>Status</th>
                <th style={{ ...tableHeaderStyle, width: "120px" }}>Alerts</th>
                <th style={{ ...tableHeaderStyle, width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_SECONDARY }}>
                    Loading agreements...
                  </td>
                </tr>
              ) : visibleAgreements.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_SECONDARY }}>
                    No agreements found. Create one or wait for driver bookings to appear here.
                  </td>
                </tr>
              ) : visibleAgreements.map((agreement) => {
                const alert = getAlertLabel(agreement);
                const type = getAgreementType(agreement);
                const key = agreementKey(agreement);

                return (
                  <tr
                    key={key}
                    onClick={() => openAgreement(agreement)}
                    style={{ borderTop: `1px solid ${COLORS.BORDER_MAIN}`, cursor: "pointer",textAlign: "center" }}
                  >
                    <td style={tableCellStyle}>
                      <p style={{ fontWeight: 800, color: "#0F172A", marginBottom: "0.18rem" }}>{key}</p>
                      <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.72rem" }}>
                        {agreement.bookingNumber || agreement.source || "Admin"}
                      </p>
                    </td>
                    <td style={{ ...tableCellStyle, color: type === "Rent-to-Own" ? COLORS.PRIMARY_MAIN : "#0EA5E9", fontWeight: 700 }}>
                      {type}
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ alignItems: "center" }}>
                        <div style={{ minWidth: "1.5rem", alignItems: "center" }}>
                          <p style={{ color: COLORS.PRIMARY_MAIN, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                            {agreement.driverName || "Not Assigned"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td 
                    style={{ ...tableCellStyle, color: COLORS.PRIMARY_MAIN, fontWeight: 700, overflowWrap: "anywhere",textAlign: "center" }}>
                      {agreement.ownerEmail || "--"}
                    </td>
                    <td style={tableCellStyle}>
                      <p style={{ fontWeight: 700 }}>{getVehicleLabel(agreement)}</p>
                      <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.72rem" }}>{agreement.vehicleRegistration || ""}</p>
                    </td>
                    <td style={tableCellStyle}>{formatDate(agreement.startDate)}</td>
                    <td style={{ ...tableCellStyle, color: alert === "Expired" ? COLORS.ERROR_MAIN : COLORS.TEXT_MAIN }}>
                      {formatDate(agreement.endDate)}
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: 800 }}>{formatMoney(agreement.amount)}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 800, color: statusColor(agreement.status) }}>
                      {agreement.status || "--"}
                    </td>
                    <td style={{ ...tableCellStyle, color: alert ? COLORS.WARNING_MAIN : COLORS.TEXT_SECONDARY, fontWeight: alert ? 800 : 500 }}>
                      {alert || "--"}
                    </td>
                    <td style={tableCellStyle} onClick={(event) => event.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: COLORS.PRIMARY_MAIN }}>
                        <button title="View agreement" onClick={() => openAgreement(agreement)} style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", padding: 0 }}>
                          <Eye size={18} />
                        </button>
                        <button title="Refresh" onClick={() => fetchAgreements(page)} style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", padding: 0 }}>
                          <RefreshCw size={18} />
                        </button>
                        <MoreVertical size={18} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "0.9rem 1.25rem", borderTop: `1px solid ${COLORS.BORDER_MAIN}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "0.78rem", color: COLORS.TEXT_SECONDARY }}>
            Showing {visibleAgreements.length ? (page - 1) * 25 + 1 : 0} to {Math.min(page * 25, total)} of {total.toLocaleString()} agreements
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchAgreements(page - 1)}>Previous</Button>
            <Button size="sm" style={{ minWidth: "38px" }}>{page}</Button>
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => fetchAgreements(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
