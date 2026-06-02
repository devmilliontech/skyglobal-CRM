"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState, useEffect, useCallback } from "react";
import { vehiclesApi, Vehicle } from "@/services/api/vehicles";
import {
  complianceApi,
  ComplianceRecord,
} from "@/services/api/compliance";
import {
  Car,
  CheckCircle2,
  Clock,
  Key,
  Wrench,
  FileBadge,
  XCircle,
  Pause,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import SelectField from "@/components/SelectField";
import StatusBadge from "@/components/StatusBadge";
import type { VehicleAlerts, VehicleStats } from "@/services/api/vehicles";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

type VehicleTableRow = Vehicle & {
  complianceRecordId?: string;
};

const parseComplianceVehicle = (vehicle: string) => {
  const parts = vehicle.trim().split(/\s+/).filter(Boolean);
  const possibleYear = parts.at(-1);
  const year =
    possibleYear && /^\d{4}$/.test(possibleYear)
      ? Number(possibleYear)
      : undefined;
  const nameParts = year ? parts.slice(0, -1) : parts;

  return {
    make: nameParts[0],
    model: nameParts.slice(1).join(" ") || undefined,
    year,
  };
};

const mapComplianceRecordToVehicle = (
  record: ComplianceRecord,
): VehicleTableRow => {
  const parsedVehicle = parseComplianceVehicle(record.vehicle || "");

  return {
    _id: record.id,
    complianceRecordId: record.id,
    registration: record.registration,
    make: parsedVehicle.make,
    model: parsedVehicle.model,
    year: parsedVehicle.year,
    ownerName: record.owner,
    insuranceStatus: record.insuranceStatus,
    registrationExpiry: record.registrationExpiry,
    complianceStatus: record.complianceStatus,
  };
};

const vehicleIdentityParts = (vehicle: VehicleTableRow) => {
  const makeModelYear = [vehicle.make, vehicle.model, vehicle.year]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    id: vehicle._id,
    vehicleKey: [vehicle.registration?.toLowerCase(), makeModelYear]
      .filter(Boolean)
      .join("|"),
  };
};

const mergeVehicleRows = (
  vehicleRows: Vehicle[],
  complianceRows: ComplianceRecord[],
): VehicleTableRow[] => {
  const rows = vehicleRows.map((vehicle) => ({ ...vehicle }));
  const seenIds = new Set<string>();
  const seenVehicles = new Set<string>();

  rows.forEach((vehicle) => {
    const { id, vehicleKey } = vehicleIdentityParts(vehicle);
    if (id) seenIds.add(id);
    if (vehicleKey) seenVehicles.add(vehicleKey);
  });

  complianceRows.map(mapComplianceRecordToVehicle).forEach((record) => {
    const { id, vehicleKey } = vehicleIdentityParts(record);
    if ((!id || !seenIds.has(id)) && (!vehicleKey || !seenVehicles.has(vehicleKey))) {
      rows.push(record);
      if (id) seenIds.add(id);
      if (vehicleKey) seenVehicles.add(vehicleKey);
    }
  });

  return rows;
};

const formatVehicleDate = (value?: string) => {
  if (!value || value === "N/A") return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const vehicleTitle = (vehicle: VehicleTableRow) =>
  [vehicle.make, vehicle.model].filter(Boolean).join(" ").trim();

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  textAlign: "left",
  fontSize: "0.68rem",
  fontWeight: 700,
  color: "#64748B",
  textTransform: "uppercase",
  lineHeight: 1.25,
  verticalAlign: "middle",
  whiteSpace: "normal",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.82rem",
  color: "#334155",
  lineHeight: 1.35,
  verticalAlign: "middle",
};

const mutedCellStyle: React.CSSProperties = {
  ...tableCellStyle,
  color: "#64748B",
};

const badgeCellStyle: React.CSSProperties = {
  ...tableCellStyle,
  whiteSpace: "nowrap",
};

const actionButtonBaseStyle: React.CSSProperties = {
  borderRadius: "7px",
  border: "1px solid transparent",
  padding: "0.38rem 0.62rem",
  fontSize: "0.72rem",
  fontWeight: 700,
  lineHeight: 1,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export default function VehiclesManagement() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState<VehicleTableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [registrationFilter, setRegistrationFilter] = useState("");
  const [makeModelFilter, setMakeModelFilter] = useState("");
  const [dashboardStats, setDashboardStats] = useState<VehicleStats | null>(null);
  const [alerts, setAlerts] = useState<VehicleAlerts | null>(null);
  const [updatingVehicleId, setUpdatingVehicleId] = useState<string | null>(null);

  const fetchVehicles = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehiclesApi.getVehicles({
        page: p,
        limit: 25,
        registration: registrationFilter || undefined,
        makeModel: makeModelFilter || search || undefined,
        adminListingStatus: statusFilter,
      });
      const complianceRes = await complianceApi.getDashboard({
        page: p,
        limit: 25,
        search: registrationFilter || search || undefined,
        quickFilter: "All Vehicles",
        make: makeModelFilter || "All Makes",
      });
      const d = res.data;
      const complianceData = complianceRes.data;
      const mergedVehicles = mergeVehicleRows(
        d.vehicles ?? [],
        complianceData?.vehicles ?? [],
      );
      setVehicles(mergedVehicles);
      setTotal(
        Math.max(
          d.total ?? 0,
          complianceData?.pagination?.total ?? 0,
          mergedVehicles.length,
        ),
      );
      setPage(d.page ?? 1);
      setDashboardStats(d.stats ?? null);
      setAlerts(d.alerts ?? null);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load vehicles"));
    } finally {
      setLoading(false);
    }
  }, [search, registrationFilter, makeModelFilter, statusFilter]);

  useEffect(() => { fetchVehicles(1); }, [fetchVehicles]);

  const reviewVehicle = useCallback((vehicle: VehicleTableRow) => {
    router.push(
      vehicle.listingStatus === "Pending"
        ? `/vehicles/pending-approvals/${vehicle._id}`
        : vehicle.complianceRecordId
          ? `/vehicles/compliance/${vehicle.complianceRecordId}`
          : `/vehicles/${vehicle._id}`,
    );
  }, [router]);

  const updateVehicleListingStatus = useCallback(async (
    vehicle: VehicleTableRow,
    newStatus: "Approved" | "Rejected",
  ) => {
    if (updatingVehicleId) return;
    setUpdatingVehicleId(vehicle._id);
    setError(null);

    try {
      await vehiclesApi.updateListingStatus(vehicle._id, newStatus);
      setVehicles((currentVehicles) =>
        currentVehicles.map((item) =>
          item._id === vehicle._id
            ? { ...item, listingStatus: newStatus }
            : item,
        ),
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Failed to ${newStatus.toLowerCase()} vehicle`));
    } finally {
      setUpdatingVehicleId(null);
    }
  }, [updatingVehicleId]);

  const statsPayload = dashboardStats || {};
  const stats = [
    {
      title: "Total Vehicles",
      value: (statsPayload.totalVehicles ?? total).toLocaleString(),
      badge: "Fleet total",
      icon: <Car size={14} />,
      iconBg: "#EEF2FF",
      iconColor: "#4F46E5"
    },
    {
      title: "Active Vehicles",
      value: String(statsPayload.activeVehicles ?? vehicles.filter(v => v.listingStatus == "Approved").length),
      badge: "Active",
      icon: <CheckCircle2 size={14} />,
      iconBg: "#F0FDF4",
      iconColor: COLORS.SUCCESS_MAIN
    },
    {
      title: "Pending Approval",
      value: String(statsPayload.pendingApproval ?? vehicles.filter(v => v.listingStatus == "Pending").length),
      badge: "Requires action",
      badgeBg: "#FEF3C7",
      badgeColor: "#D97706",
      icon: <Clock size={14} />,
      iconBg: "#FFFBEB",
      iconColor: COLORS.WARNING_MAIN
    },
    {
      title: "In Rental",
      value: String(statsPayload.inRental ?? vehicles.filter(v => v.rentalStatus == "Booked").length),
      badge: "In use",
      badgeBg: COLORS.INFO_LIGHT,
      badgeColor: COLORS.PRIMARY_MAIN,
      icon: <Key size={14} />,
      iconBg: COLORS.PRIMARY_LIGHT,
      iconColor: COLORS.PRIMARY_MAIN
    },
    {
      title: "Under Maintenance",
      value: String(statsPayload.underMaintenance ?? vehicles.filter(v => v.status == "Maintenance").length),
      badge: "In maintenance",
      badgeBg: "#F3F4F6",
      badgeColor: "#6B7280",
      icon: <Wrench size={14} />,
      iconBg: "#F9FAFB",
      iconColor: "#6B7280"
    },
    {
      title: "Compliance Expiring",
      value: String(statsPayload.complianceExpiring ?? vehicles.filter(v => v.complianceStatus == "Expiring").length),
      badge: "Next 30 days",
      badgeBg: COLORS.ERROR_LIGHT,
      badgeColor: COLORS.ERROR_MAIN,
      icon: <FileBadge size={14} />,
      iconBg: "#FEF2F2",
      iconColor: COLORS.ERROR_MAIN
    },
    {
      title: "Rejected Listings",
      value: String(statsPayload.rejectedListings ?? vehicles.filter(v => v.listingStatus == "Rejected").length),
      badge: "Awaiting resubmission",
      badgeBg: "#F3F4F6",
      badgeColor: "#6B7280",
      icon: <XCircle size={14} />,
      iconBg: "#F9FAFB",
      iconColor: "#6B7280"
    },
    {
      title: "Inactive Vehicles",
      value: String(statsPayload.inactiveVehicles ?? vehicles.filter(v => v.listingStatus == "Inactive").length),
      badge: "Not listed",
      badgeBg: "#F3F4F6",
      badgeColor: "#6B7280",
      icon: <Pause size={14} />,
      iconBg: "#F9FAFB",
      iconColor: "#6B7280"
    },
  ];

  const inputStyle = {
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
    background: "#F9FAFB",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: "0.4rem",
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Vehicles Management"
        notificationCount={5}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          Dashboard
        </p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Vehicles Management
        </p>
      </div>

      {/* Compliance Alert */}
      <div
        style={{
          background: "#FFFBEB",
          border: "1px solid #FEF3C7",
          padding: "1rem 1.5rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <AlertTriangle size={20} color="#D97706" />
          <div>
            <p
              style={{ fontWeight: 700, fontSize: "0.9rem", color: "#92400E" }}
            >
              Compliance Alerts
            </p>
            <p style={{ fontSize: "0.85rem", color: "#B45309" }}>
              {alerts?.summary || "Compliance alerts will appear here when available."}
            </p>
          </div>
        </div>
        <button
          style={{
            color: "#D97706",
            fontSize: "1.2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
          gap: "0.5rem",
        }}
      >
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            {...stat}
            compact
          />
        ))}
      </div>

      {/* Filters Card */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Filters</h3>
          <button
            style={{
              fontSize: "0.85rem",
              color: COLORS.PRIMARY_MAIN,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              setSearch("");
              setRegistrationFilter("");
              setMakeModelFilter("");
              setStatusFilter("All Status");
              fetchVehicles(1);
            }}
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>Registration</label>
            <input
              type="text"
              placeholder="Search registration..."
              style={inputStyle}
              value={registrationFilter}
              onChange={(e) => setRegistrationFilter(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Make & Model</label>
            <input
              type="text"
              placeholder="Search make/model..."
              style={inputStyle}
              value={makeModelFilter}
              onChange={(e) => setMakeModelFilter(e.target.value)}
            />
          </div>
          <SelectField
            label="Owner"
            options={[
              { label: "All Owners", value: "All Owners" },
              { label: "John Smith", value: "John Smith" },
              { label: "Sarah Johnson", value: "Sarah Johnson" },
            ]}
          />
          <SelectField
            label="Listing Status"
            options={[
              { label: "All Status", value: "All Status" },
              { label: "Approved", value: "Approved" },
              { label: "Pending", value: "Pending" },
              { label: "Rejected", value: "Rejected" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <SelectField
            label="Availability"
            options={[
              { label: "All", value: "All" },
              { label: "Available", value: "Available" },
              { label: "Rented", value: "Rented" },
              { label: "Maintenance", value: "Maintenance" },
            ]}
          />
          <SelectField
            label="Compliance Status"
            options={[
              { label: "All", value: "All" },
              { label: "Valid", value: "Valid" },
              { label: "Expiring Soon", value: "Expiring Soon" },
              { label: "Expired", value: "Expired" },
            ]}
          />
          <SelectField
            label="Rental Status"
            options={[
              { label: "All", value: "All" },
              { label: "Active Rentals", value: "Active Rentals" },
              { label: "No Active Rentals", value: "No Active Rentals" },
            ]}
          />
          <div>
            <label style={labelStyle}>Date Added</label>
            <input type="date" style={inputStyle} />
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card padding="0">
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>All Vehicles <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_MUTED, fontWeight: 400 }}>({total.toLocaleString()} total)</span></h3>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "1380px", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "44px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "175px" }} />
              <col style={{ width: "245px" }} />
              <col style={{ width: "116px" }} />
              <col style={{ width: "116px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "105px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "230px" }} />
            </colgroup>
            <thead>
              <tr
                style={{
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <th style={{ ...tableHeaderStyle, paddingLeft: "1.25rem", paddingRight: "0.5rem" }}>
                  <input type="checkbox" />
                </th>
                {[
                  "REGISTRATION",
                  "MAKE & MODEL",
                  "OWNER",
                  "LISTING STATUS",
                  "AVAILABILITY",
                  "CURRENT DRIVER",
                  "INSURANCE STATUS",
                  "REQ. EXPIRY",
                  "VEHICLE STATUS",
                  "ACTIONS",
                ].map((head) => (
                  <th
                    key={head}
                    style={tableHeaderStyle}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ padding: "2rem", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: "40px", background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px" }} />
                      ))}
                    </div>
                    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
                  </td>
                </tr>
              ) : error ? (
                <tr><td colSpan={11} style={{ padding: "2rem", textAlign: "center", color: "#DC2626" }}>{error} <button onClick={() => fetchVehicles(page)} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}>Retry</button></td></tr>
              ) : vehicles.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>No vehicles found</td></tr>
              ) : vehicles.map((v) => (
                <tr
                  key={v._id}
                  onClick={() => reviewVehicle(v)}
                  style={{ borderBottom: "1px solid #E5E7EB", cursor: "pointer", transition: "background-color 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ ...tableCellStyle, paddingLeft: "1.25rem", paddingRight: "0.5rem" }} onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: "#1F2937", whiteSpace: "nowrap" }}>{v.registration || "--"}</td>
                  <td style={tableCellStyle}>
                    <p style={{ margin: 0, fontWeight: 700, color: "#1F2937" }}>{vehicleTitle(v) || "--"}</p>
                    {v.year ? (
                      <p style={{ margin: "0.18rem 0 0", color: "#94A3B8", fontSize: "0.74rem", fontWeight: 600 }}>{v.year}</p>
                    ) : null}
                  </td>
                  <td style={{ ...mutedCellStyle, overflowWrap: "anywhere" }}>{v.ownerName || "--"}</td>
                  <td style={badgeCellStyle}><StatusBadge status={v.listingStatus || "Unknown"} /></td>
                  <td style={badgeCellStyle}><StatusBadge status={v.availability || "Unknown"} /></td>
                  <td style={mutedCellStyle}>{v.currentDriver || "--"}</td>
                  <td style={badgeCellStyle}><StatusBadge status={v.insuranceStatus || (v.insuranceExpiry ? (new Date(v.insuranceExpiry) < new Date() ? "Expired" : "Active") : "Unknown")} /></td>
                  <td style={mutedCellStyle}>{formatVehicleDate(v.registrationExpiry)}</td>
                  <td style={badgeCellStyle}><StatusBadge status={v.rentalStatus || v.complianceStatus || "Unknown"} /></td>
                  <td style={tableCellStyle} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "nowrap" }}>
                      <button
                        disabled={updatingVehicleId === v._id}
                        onClick={() => updateVehicleListingStatus(v, "Approved")}
                        style={{
                          ...actionButtonBaseStyle,
                          color: "#047857",
                          background: "#ECFDF5",
                          borderColor: "#A7F3D0",
                          opacity: updatingVehicleId === v._id ? 0.65 : 1,
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewVehicle(v)}
                        style={{
                          ...actionButtonBaseStyle,
                          color: COLORS.PRIMARY_MAIN,
                          background: "#EFF6FF",
                          borderColor: "#BFDBFE",
                        }}
                      >
                        Review
                      </button>
                      <button
                        disabled={updatingVehicleId === v._id}
                        onClick={() => updateVehicleListingStatus(v, "Rejected")}
                        style={{
                          ...actionButtonBaseStyle,
                          color: "#B91C1C",
                          background: "#FEF2F2",
                          borderColor: "#FECACA",
                          opacity: updatingVehicleId === v._id ? 0.65 : 1,
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
