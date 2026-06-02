"use client";
import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect, useCallback } from "react";
import {
  Key, CheckCircle2, Clock, Flag, XCircle,
  AlertTriangle, RotateCcw, Hammer,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";
import SelectField from "@/components/SelectField";
import { rentalsApi, Rental, RentalStats } from "@/services/api/rentals";

const DEFAULT_STATS: RentalStats = {
  total: 0, active: 0, upcoming: 0, completed: 0,
  cancelled: 0, overdueReturns: 0, refundCases: 0, disputed: 0,
};

function Shimmer({ h = "48px" }: { h?: string }) {
  return (
    <>
      <div style={{ height: h, background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "6px" }} />
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </>
  );
}

const StatCard = ({ stat, loading }: any) => (
  <div className="card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ background: stat.iconBg, color: stat.iconColor, padding: "10px", borderRadius: "10px" }}>{stat.icon}</div>
      <div style={{ background: stat.badgeBg, color: stat.badgeColor, padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 700 }}>{stat.badge}</div>
    </div>
    <div>
      {loading ? <Shimmer h="24px" /> : <p style={{ fontSize: "1.2rem", fontWeight: 800 }}>{stat.value}</p>}
      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{stat.title}</p>
    </div>
  </div>
);

export default function RentalsManagement() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("Rentals Management");
  const [search, setSearch] = useState("");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [stats, setStats] = useState<RentalStats>(DEFAULT_STATS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    rentalId: "", driverName: "", vehicleRegistration: "", ownerName: "",
    rentalStatus: "All Status", agreementType: "All Types",
    paymentStatus: "All Payments", returnStatus: "All Returns",
    startDate: "", endDate: "",
  });

  const tabs = [
    { name: "Rentals Management", path: "/rentals" },
    { name: "Agreements", path: "/rentals/agreements" },
    { name: "Disputes & Refunds", path: "/rentals/disputes" },
    { name: "Admin Notes & Audit", path: "/rentals/audit" },
  ];

  useEffect(() => {
    const current = tabs.find((t) => t.path === pathname);
    if (current) setActiveTab(current.name);
  }, [pathname]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await rentalsApi.getRentalStats();
      if (res.data) setStats(res.data);
    } catch { /* non-critical */ } finally { setStatsLoading(false); }
  }, []);

  const fetchRentals = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await rentalsApi.getRentals({
        page: p, limit: 25,
        search: search || undefined,
        ...filters,
      });
      const d = res.data as any;
      setRentals(d.rentals ?? d.data ?? []);
      setTotal(d.total ?? 0);
      setPage(d.page ?? 1);
      setPages(d.pages ?? 1);
    } catch (err: any) {
      setError(err.message || "Failed to load rentals");
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchRentals(1); }, [fetchRentals]);

  const statCards = [
    { title: "Total Rentals", value: stats.total, badge: "+12%", badgeColor: COLORS.SUCCESS_MAIN, badgeBg: COLORS.SUCCESS_LIGHT, icon: <Key size={20} />, iconBg: "#EEF2FF", iconColor: "#4F46E5" },
    { title: "Active Rentals", value: stats.active, badge: "Active", badgeColor: COLORS.SUCCESS_MAIN, badgeBg: COLORS.SUCCESS_LIGHT, icon: <CheckCircle2 size={20} />, iconBg: "#F0FDF4", iconColor: COLORS.SUCCESS_MAIN },
    { title: "Upcoming Rentals", value: stats.upcoming, badge: "Scheduled", badgeColor: COLORS.PRIMARY_MAIN, badgeBg: COLORS.INFO_LIGHT, icon: <Clock size={20} />, iconBg: COLORS.PRIMARY_LIGHT, iconColor: COLORS.PRIMARY_MAIN },
    { title: "Completed Rentals", value: stats.completed, badge: "Last 30d", badgeColor: "#6B7280", badgeBg: "#F3F4F6", icon: <Flag size={20} />, iconBg: "#F9FAFB", iconColor: "#6B7280" },
    { title: "Cancelled Rentals", value: stats.cancelled, badge: "-8%", badgeColor: COLORS.ERROR_MAIN, badgeBg: COLORS.ERROR_LIGHT, icon: <XCircle size={20} />, iconBg: "#FEF2F2", iconColor: COLORS.ERROR_MAIN },
    { title: "Overdue Returns", value: stats.overdueReturns, badge: "Urgent", badgeColor: COLORS.WARNING_MAIN, badgeBg: "#FEF3C7", icon: <AlertTriangle size={20} />, iconBg: "#FFFBEB", iconColor: COLORS.WARNING_MAIN },
    { title: "Refund Cases", value: stats.refundCases, badge: "Review", badgeColor: "#8B5CF6", badgeBg: "#EDE9FE", icon: <RotateCcw size={20} />, iconBg: "#F5F3FF", iconColor: "#8B5CF6" },
    { title: "Disputed Rentals", value: stats.disputed, badge: "Action", badgeColor: COLORS.WARNING_MAIN, badgeBg: "#FEF3C7", icon: <Hammer size={20} />, iconBg: "#FFFBEB", iconColor: COLORS.WARNING_MAIN },
  ];

  const inputStyle: React.CSSProperties = { padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", background: "#F9FAFB", width: "100%", fontSize: "0.85rem" };
  const labelStyle: React.CSSProperties = { fontSize: "0.85rem", color: "#6B7280" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <PageHeader title="Rentals Management" searchValue={search} onSearchChange={setSearch} notificationCount={3} />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Rentals" }]} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.6rem", marginBottom: "1.5rem" }}>
          {statCards.map((s, i) => <StatCard key={i} stat={s} loading={statsLoading} />)}
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "1rem", color: "#DC2626", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error} <button onClick={() => fetchRentals(page)} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}>Retry</button>
          </div>
        )}

        {/* Filters */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3>Filters</h3>
            <button style={{ color: COLORS.PRIMARY_MAIN, background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setFilters({ rentalId: "", driverName: "", vehicleRegistration: "", ownerName: "", rentalStatus: "All Status", agreementType: "All Types", paymentStatus: "All Payments", returnStatus: "All Returns", startDate: "", endDate: "" })}>
              Clear
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem", marginTop: "1rem" }}>
            {[
              { label: "Rental ID", key: "rentalId" },
              { label: "Driver Name", key: "driverName" },
              { label: "Vehicle Registration", key: "vehicleRegistration" },
              { label: "Owner Name", key: "ownerName" },
            ].map(({ label, key }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={labelStyle}>{label}</label>
                <input placeholder={label} style={inputStyle} value={(filters as any)[key]} onChange={(e) => setFilters(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <SelectField label="Rental Status" options={["All Status","Active","Upcoming","Completed","Cancelled","Disputed"].map(v=>({label:v,value:v}))} value={filters.rentalStatus} onChange={(e)=>setFilters(f=>({...f,rentalStatus:e.target.value}))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.75rem", marginTop: "1rem", alignItems: "center" }}>
            <SelectField label="Agreement Type" options={["All Types","Short Term","Rent to own"].map(v=>({label:v,value:v}))} value={filters.agreementType} onChange={(e)=>setFilters(f=>({...f,agreementType:e.target.value}))} />
            <SelectField label="Payment Status" options={["All Payments","Paid","Pending","Overdue","Failed"].map(v=>({label:v,value:v}))} value={filters.paymentStatus} onChange={(e)=>setFilters(f=>({...f,paymentStatus:e.target.value}))} />
            <SelectField label="Return Status" options={["All Returns","Returned","Not Returned","Overdue"].map(v=>({label:v,value:v}))} value={filters.returnStatus} onChange={(e)=>setFilters(f=>({...f,returnStatus:e.target.value}))} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={labelStyle}>Start Date</label>
              <input type="date" style={inputStyle} value={filters.startDate} onChange={(e)=>setFilters(f=>({...f,startDate:e.target.value}))} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={labelStyle}>End Date</label>
              <input type="date" style={inputStyle} value={filters.endDate} onChange={(e)=>setFilters(f=>({...f,endDate:e.target.value}))} />
            </div>
            <button
              onClick={() => fetchRentals(1)}
              style={{ background: COLORS.PRIMARY_MAIN, color: "#fff", padding: "0.6rem 1rem", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer", marginTop: "1.25rem" }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Table */}
        <Card padding="0" style={{ marginTop: "1.5rem" }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
            <h3>All Rentals <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_MUTED, fontWeight: 400 }}>({total.toLocaleString()} total)</span></h3>
          </div>
          {loading ? (
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1,2,3,4,5].map(i=><Shimmer key={i} />)}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280" }}>
                  {["RENTAL ID","VEHICLE","REGISTRATION","DRIVER","OWNER","AGREEMENT TYPE","START DATE","END DATE","RENTAL STATUS","PAYMENT STATUS"].map(h=>(
                    <th key={h} style={{ padding: "1rem 1.5rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>No rentals found</td></tr>
                ) : rentals.map((r) => (
                  <tr key={r._id} style={{ borderBottom: "1px solid #E5E7EB", cursor: "pointer" }} onClick={() => router.push(`/rentals/${r._id}`)}>
                    <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: COLORS.PRIMARY_MAIN }}>{r.rentalId || r._id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem" }}>{r.vehicleName || "--"}</td>
                    <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem" }}>{r.vehicleRegistration || "--"}</td>
                    <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem" }}>{r.driverName || "--"}</td>
                    <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem" }}>{r.ownerName || "--"}</td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><StatusBadge status={r.agreementType || "--"} /></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>{r.startDate ? new Date(r.startDate).toLocaleDateString() : "--"}</td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>{r.endDate ? new Date(r.endDate).toLocaleDateString() : "--"}</td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><StatusBadge status={r.rentalStatus || "--"} /></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><StatusBadge status={r.paymentStatus || "--"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Pagination */}
          <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Showing {Math.min((page-1)*25+1,total)}–{Math.min(page*25,total)} of {total.toLocaleString()} entries
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button disabled={page<=1} onClick={()=>fetchRentals(page-1)} style={{ padding:"8px 12px",borderRadius:"6px",border:`1px solid ${COLORS.BORDER_MAIN}`,background:COLORS.BG_CARD,fontSize:"0.85rem",fontWeight:600,cursor:page<=1?"not-allowed":"pointer",opacity:page<=1?0.5:1 }}>Previous</button>
              {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>fetchRentals(p)} style={{ padding:"8px 12px",borderRadius:"6px",border:`1px solid ${COLORS.BORDER_MAIN}`,background:p===page?COLORS.PRIMARY_MAIN:COLORS.BG_CARD,color:p===page?COLORS.BG_CARD:COLORS.TEXT_SECONDARY,fontSize:"0.85rem",fontWeight:600,cursor:"pointer" }}>{p}</button>
              ))}
              <button disabled={page>=pages} onClick={()=>fetchRentals(page+1)} style={{ padding:"8px 12px",borderRadius:"6px",border:`1px solid ${COLORS.BORDER_MAIN}`,background:COLORS.BG_CARD,fontSize:"0.85rem",fontWeight:600,cursor:page>=pages?"not-allowed":"pointer",opacity:page>=pages?0.5:1 }}>Next</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
