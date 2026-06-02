"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Bell, Send, Mail, AlertTriangle, Clock, User, Zap,
  Plus, Download, Search, Eye, RefreshCw, ChevronRight,
  Phone, MessageSquare, Mail as MailIcon, ChevronLeft,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { useRouter } from "next/navigation";
import { notificationsApi, NotificationRecord, NotificationStats } from "@/services/api/notifications";

const DEFAULT_STATS: NotificationStats = { totalSent: 0, unread: 0, failed: 0, scheduled: 0, manual: 0, highPriority: 0 };

function Shimmer() {
  return (
    <>
      {[1,2,3].map(i=>(
        <tr key={i}>
          {[1,2,3,4,5,6,7].map(j=>(
            <td key={j} style={{padding:"1.25rem 1.5rem"}}>
              <div style={{height:"16px",background:"linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",borderRadius:"4px"}} />
            </td>
          ))}
        </tr>
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [stats, setStats] = useState<NotificationStats>(DEFAULT_STATS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchNotifications = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationsApi.getAdminNotificationLog({
        page: p, limit: 10,
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        channel: channelFilter !== "all" ? channelFilter : undefined,
        recipient: recipientFilter !== "all" ? recipientFilter : undefined,
      });
      const d = res.data as any;
      setNotifications(d.notifications ?? d.data ?? []);
      setTotal(d.total ?? 0);
      setPage(d.page ?? p);
      setPages(Math.ceil((d.total ?? 0) / 10));
      // Compute stats from data if server doesn't return aggregated stats
      if (d.stats) {
        setStats(d.stats);
      } else {
        const all = d.notifications ?? d.data ?? [];
        setStats({
          totalSent: d.total ?? all.length,
          unread: all.filter((n: any) => n.status === "Unread").length,
          failed: all.filter((n: any) => n.status === "Failed" || n.status === "Bounced").length,
          scheduled: all.filter((n: any) => n.status === "Scheduled").length,
          manual: all.filter((n: any) => n.trigger === "manual_broadcast").length,
          highPriority: all.filter((n: any) => n.priority === "high").length,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, channelFilter, recipientFilter]);

  useEffect(() => { fetchNotifications(1); }, [fetchNotifications]);

  const STATS_CONFIG = [
    { title: "TOTAL SENT", value: stats.totalSent.toLocaleString(), icon: Send, iconColor: "#3B82F6", iconBg: "#EFF6FF" },
    { title: "UNREAD", value: stats.unread.toLocaleString(), icon: Mail, iconColor: "#3B82F6", iconBg: "#EFF6FF" },
    { title: "FAILED", value: stats.failed.toLocaleString(), icon: AlertTriangle, iconColor: "#EF4444", iconBg: "#FEE2E2" },
    { title: "SCHEDULED", value: stats.scheduled.toLocaleString(), icon: Clock, iconColor: "#F59E0B", iconBg: "#FFFBEB" },
    { title: "MANUAL", value: stats.manual.toLocaleString(), icon: User, iconColor: "#6B7280", iconBg: "#F3F4F6" },
    { title: "HIGH PRIORITY", value: stats.highPriority.toLocaleString(), icon: Zap, iconColor: "#EF4444", iconBg: "#FEE2E2", highlight: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Notification Management"
        searchPlaceholder="Search drivers, vehicles, agreements, rentals, users..."
        onCreateClick={() => {}}
        createLabel="Create Notification"
        notificationCount={5}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "-1rem" }}>
        <p style={{ fontSize: "0.75rem", color: "#6B7280", cursor: "pointer" }} onClick={() => router.push("/")}>Dashboard</p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 700 }}>Notifications</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
        {STATS_CONFIG.map((stat, idx) => (
          <Card key={idx} padding="1.25rem" style={{ border: stat.highlight ? "1px solid #EF4444" : "1px solid #E5E7EB", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.iconColor }}>
                <stat.icon size={18} />
              </div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: stat.highlight ? "#EF4444" : "#6B7280", letterSpacing: "0.025em" }}>{stat.title}</p>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: stat.highlight ? "#EF4444" : "#111827" }}>{stat.value}</h3>
          </Card>
        ))}
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "1rem", color: "#DC2626", fontSize: "0.85rem" }}>
          {error} <button onClick={() => fetchNotifications(page)} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}>Retry</button>
        </div>
      )}

      <Card padding="0">
        {/* Filters */}
        <div style={{ padding: "1.5rem", borderBottom: `1px solid ${COLORS.BORDER_MAIN}`, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "500px" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                placeholder="Search by title, content or recipient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: `1px solid ${COLORS.BORDER_MAIN}`, fontSize: "0.9rem", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <SelectField placeholder="Recipient: All" options={[{label:"All",value:"all"},{label:"Driver",value:"driver"},{label:"Owner",value:"owner"}]} wrapperStyle={{ marginBottom: 0, width: "140px" }} value={recipientFilter} onChange={(e)=>setRecipientFilter(e.target.value)} />
              <SelectField placeholder="Channel: All" options={[{label:"All",value:"all"},{label:"Email",value:"email"},{label:"SMS",value:"sms"},{label:"Push",value:"push"}]} wrapperStyle={{ marginBottom: 0, width: "130px" }} value={channelFilter} onChange={(e)=>setChannelFilter(e.target.value)} />
              <SelectField placeholder="Status: All" options={[{label:"All",value:"all"},{label:"Delivered",value:"Delivered"},{label:"Failed",value:"Failed"},{label:"Scheduled",value:"Scheduled"}]} wrapperStyle={{ marginBottom: 0, width: "120px" }} value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} />
              <Button variant="outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "38px" }}>
                <Download size={16} /> Export Log
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB", borderBottom: `1px solid ${COLORS.BORDER_MAIN}`, textAlign: "left" }}>
                {["TITLE / MESSAGE","RECIPIENT","CHANNEL","TRIGGER / EVENT","STATUS","SENT AT","ACTIONS"].map(h=>(
                  <th key={h} style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", fontWeight: 700, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: h==="ACTIONS"?"right":undefined }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <Shimmer /> : notifications.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED, fontSize: "0.85rem" }}>No notifications found</td></tr>
              ) : notifications.map((row) => (
                <tr key={row._id} style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                  <td style={{ padding: "1.25rem 1.5rem", verticalAlign: "top" }}>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444", marginTop: "6px", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.TEXT_MAIN, marginBottom: "2px" }}>{row.title}</p>
                        <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, lineHeight: 1.4 }}>{row.message}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", verticalAlign: "top" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.TEXT_MAIN, marginBottom: "2px" }}>{row.recipientName || "--"}</p>
                    <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#F3F4F6", color: "#6B7280", fontWeight: 600 }}>{row.recipientRole || "--"}</span>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", verticalAlign: "top" }}>
                    <div style={{ display: "flex", gap: "0.5rem", color: "#6B7280" }}>
                      {(row.channels || []).map((ch, idx) => {
                        if (ch === "sms") return <MessageSquare key={idx} size={16} />;
                        if (ch === "phone") return <Phone key={idx} size={16} />;
                        if (ch === "email") return <MailIcon key={idx} size={16} />;
                        if (ch === "bell") return <Bell key={idx} size={16} />;
                        return null;
                      })}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", verticalAlign: "top" }}>
                    <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY, fontFamily: "monospace" }}>{row.trigger || "--"}</span>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", verticalAlign: "top" }}>
                    <span style={{
                      fontSize: "0.75rem", fontWeight: 600, padding: "4px 10px", borderRadius: "9999px",
                      backgroundColor: row.status === "Delivered" ? "#DCFCE7" : row.status === "Failed" || row.status === "Bounced" ? "#FEE2E2" : "#FFFBEB",
                      color: row.status === "Delivered" ? "#10B981" : row.status === "Failed" || row.status === "Bounced" ? "#EF4444" : "#F59E0B",
                      display: "inline-flex", alignItems: "center", gap: "6px",
                    }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "currentcolor" }} />
                      {row.status || "--"}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", verticalAlign: "top" }}>
                    <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_MAIN }}>
                      {row.sentAt ? new Date(row.sentAt).toLocaleString() : row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "--"}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", textAlign: "right", verticalAlign: "top" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "4px", borderRadius: "4px" }}><Eye size={16} /></button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "4px", borderRadius: "4px" }}><RefreshCw size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Showing {Math.min((page-1)*10+1,total)}–{Math.min(page*10,total)} of {total.toLocaleString()} entries
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button disabled={page<=1} onClick={()=>fetchNotifications(page-1)} style={{ width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"6px",border:"1px solid #E5E7EB",backgroundColor:"#fff",cursor:page<=1?"not-allowed":"pointer",opacity:page<=1?0.5:1 }}><ChevronLeft size={16} /></button>
            {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>fetchNotifications(p)} style={{ width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"6px",border:"1px solid #E5E7EB",backgroundColor:p===page?COLORS.PRIMARY_MAIN:"#fff",color:p===page?"#fff":COLORS.TEXT_MAIN,fontSize:"0.85rem",fontWeight:600,cursor:"pointer" }}>{p}</button>
            ))}
            <button disabled={page>=pages} onClick={()=>fetchNotifications(page+1)} style={{ width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"6px",border:"1px solid #E5E7EB",backgroundColor:"#fff",cursor:page>=pages?"not-allowed":"pointer",opacity:page>=pages?0.5:1 }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}
