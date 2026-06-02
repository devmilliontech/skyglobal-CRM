"use client";
import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Download, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";
import { driversApi, Driver, DriverStats } from "@/services/api/drivers";

const DEFAULT_STATS: DriverStats = {
  total: 0, active: 0, suspended: 0, pendingVerification: 0,
  overduePayments: 0, expiringLicence: 0, expiringVisa: 0,
};

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            height: "48px",
            background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: "4px",
          }}
        />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

export default function DriversPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DriverStats>(DEFAULT_STATS);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [kycFilter, setKycFilter] = useState("All KYC");
  const [agreementFilter, setAgreementFilter] = useState("All Agreements");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");

  const fetchStats = useCallback(async () => {
    try {
      const res = await driversApi.getDriverStats();
      if (res.data) setStats(res.data);
    } catch { /* stats failure is non-critical */ }
  }, []);

  const fetchDrivers = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await driversApi.getDrivers({
        page: currentPage,
        limit: 25,
        search: search || nameFilter || emailFilter || phoneFilter || undefined,
        status: statusFilter,
        kycStatus: kycFilter,
        agreementStatus: agreementFilter,
        paymentStatus: paymentFilter,
      });
      const d = res.data as any;
      setDrivers(d.drivers ?? d.data ?? []);
      setTotal(d.total ?? 0);
      setPage(d.page ?? 1);
      setPages(d.pages ?? 1);
    } catch (err: any) {
      setError(err.message || "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }, [search, nameFilter, emailFilter, phoneFilter, statusFilter, kycFilter, agreementFilter, paymentFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchDrivers(1);
  }, [fetchDrivers]);

  const statCards = [
    { title: "Total Drivers", value: stats.total, color: COLORS.TEXT_MAIN },
    { title: "Active Drivers", value: stats.active, color: COLORS.SUCCESS_MAIN },
    { title: "Suspended", value: stats.suspended, color: COLORS.ERROR_MAIN },
    { title: "Pending Verification", value: stats.pendingVerification, color: COLORS.WARNING_MAIN },
    { title: "Overdue Payments", value: stats.overduePayments, color: COLORS.ERROR_MAIN },
    { title: "Expiring Licence", value: stats.expiringLicence, color: COLORS.WARNING_MAIN },
    { title: "Expiring Visa", value: stats.expiringVisa, color: COLORS.ERROR_MAIN },
  ];

  const handleApplyFilters = () => fetchDrivers(1);

  const handlePageChange = (p: number) => fetchDrivers(p);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <PageHeader
        title="Drivers"
        description="Manage driver accounts and verification"
        searchPlaceholder="Search by name, ID or licence..."
        searchValue={search}
        onSearchChange={setSearch}
        notificationCount={3}
        createLabel="Add Driver"
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <p
            style={{ fontSize: "0.75rem", color: "#6B7280", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Dashboard
          </p>
          <ChevronRight size={14} style={{ color: "#6B7280" }} />
          <p style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 700 }}>Drivers</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            href="/drivers/add"
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: COLORS.PRIMARY_MAIN, color: COLORS.BG_CARD,
              padding: "10px 18px", borderRadius: "8px",
              fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
            }}
          >
            <Plus size={18} /> Add Driver
          </Link>
          <Link
            href="/drivers/export"
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: COLORS.BG_CARD, border: `1px solid ${COLORS.BORDER_MAIN}`,
              padding: "10px 18px", borderRadius: "8px",
              fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", color: "inherit",
            }}
          >
            <Download size={18} /> Export
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.75rem" }}>
        {statCards.map((stat, i) => (
          <div key={i} className="card" style={{ padding: "1rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <p style={{ fontSize: "1.25rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: "0.7rem", color: COLORS.TEXT_SECONDARY, fontWeight: 500, whiteSpace: "nowrap" }}>{stat.title}</p>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "1rem", color: "#DC2626", fontSize: "0.85rem" }}>
          {error}{" "}
          <button onClick={() => fetchDrivers(page)} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}>Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "0.75rem" }}>
          {[
            { label: "Search by Name", placeholder: "Enter name", value: nameFilter, onChange: setNameFilter },
            { label: "Search by Email", placeholder: "Enter email", value: emailFilter, onChange: setEmailFilter },
            { label: "Search by Phone", placeholder: "Enter phone", value: phoneFilter, onChange: setPhoneFilter },
          ].map(({ label, placeholder, value, onChange }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ padding: "8px 10px", borderRadius: "8px", border: `1px solid ${COLORS.BORDER_MAIN}`, fontSize: "0.8rem" }}
              />
            </div>
          ))}
          <SelectField
            label="Status"
            options={[
              { label: "All Status", value: "All Status" },
              { label: "Active", value: "Active" },
              { label: "Suspended", value: "Suspended" },
              { label: "Pending", value: "Pending" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "flex-end" }}>
          <SelectField
            label="KYC Status"
            options={[
              { label: "All KYC", value: "All KYC" },
              { label: "Verified", value: "Verified" },
              { label: "Pending", value: "Pending" },
              { label: "Rejected", value: "Rejected" },
            ]}
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
          />
          <SelectField
            label="Agreement Status"
            options={[
              { label: "All Agreements", value: "All Agreements" },
              { label: "Active", value: "Active" },
              { label: "Completed", value: "Completed" },
              { label: "None", value: "None" },
            ]}
            value={agreementFilter}
            onChange={(e) => setAgreementFilter(e.target.value)}
          />
          <SelectField
            label="Payment Status"
            options={[
              { label: "All Payments", value: "All Payments" },
              { label: "Current", value: "Current" },
              { label: "Overdue", value: "Overdue" },
              { label: "Paid", value: "Paid" },
            ]}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.7rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>Date Joined</label>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                readOnly
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: `1px solid ${COLORS.BORDER_MAIN}`, background: COLORS.BG_CARD, fontSize: "0.8rem" }}
              />
              <Calendar size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.TEXT_MUTED }} />
            </div>
          </div>
          <button
            onClick={handleApplyFilters}
            style={{ background: COLORS.PRIMARY_MAIN, color: COLORS.BG_CARD, padding: "8px 20px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, height: "38px", border: "none", cursor: "pointer" }}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "1.5rem" }}><Skeleton /></div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: COLORS.BG_PAGE, borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                  {["Driver Name", "Email", "Phone", "Driver ID", "KYC Status", "Account Status", "Active Agreement", "Payment Status", "Licence Expiry", "Visa Expiry"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", fontSize: "0.7rem", fontWeight: 700, color: COLORS.TEXT_MUTED, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED, fontSize: "0.85rem" }}>
                      No drivers found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : drivers.map((driver, i) => (
                  <tr
                    key={driver._id}
                    style={{ borderBottom: i === drivers.length - 1 ? "none" : `1px solid ${COLORS.BORDER_MAIN}`, cursor: "pointer" }}
                    onClick={() => router.push(`/drivers/${driver._id}`)}
                  >
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <img
                          src={driver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random`}
                          alt={driver.name}
                          style={{ width: "28px", height: "28px", borderRadius: "50%" }}
                        />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>{driver.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{driver.email}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, whiteSpace: "nowrap" }}>{driver.phone || "--"}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, whiteSpace: "nowrap" }}>{driver.driverId || driver._id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`badge ${driver.kycStatus === "Verified" ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.65rem" }}>
                        {driver.kycStatus || "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`badge ${driver.accountStatus === "Active" ? "badge-success" : "badge-danger"}`} style={{ fontSize: "0.65rem" }}>
                        {driver.accountStatus || "--"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{driver.activeAgreement || "None"}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`badge ${driver.paymentStatus === "Current" ? "badge-success" : driver.paymentStatus === "Overdue" ? "badge-danger" : "badge-warning"}`} style={{ fontSize: "0.65rem" }}>
                        {driver.paymentStatus || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, whiteSpace: "nowrap" }}>
                      {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : "--"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, whiteSpace: "nowrap" }}>
                      {driver.visaExpiry ? new Date(driver.visaExpiry).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderTop: `1px solid ${COLORS.BORDER_MAIN}` }}>
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Showing {Math.min((page - 1) * 25 + 1, total)}–{Math.min(page * 25, total)} of {total.toLocaleString()} results
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${COLORS.BORDER_MAIN}`, background: COLORS.BG_CARD, color: COLORS.TEXT_SECONDARY, fontSize: "0.85rem", fontWeight: 600, cursor: page <= 1 ? "not-allowed" : "pointer", opacity: page <= 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${COLORS.BORDER_MAIN}`, background: p === page ? COLORS.PRIMARY_MAIN : COLORS.BG_CARD, color: p === page ? COLORS.BG_CARD : COLORS.TEXT_SECONDARY, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page >= pages}
              onClick={() => handlePageChange(page + 1)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${COLORS.BORDER_MAIN}`, background: COLORS.BG_CARD, color: COLORS.TEXT_SECONDARY, fontSize: "0.85rem", fontWeight: 600, cursor: page >= pages ? "not-allowed" : "pointer", opacity: page >= pages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
