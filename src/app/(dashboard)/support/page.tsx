"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ticket,
  BookOpen,
  Bug,
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Eye,
  MessageCircle,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useRouter } from "next/navigation";
import { supportApi } from "@/services/api/support";

const QUICK_ACTIONS = [
  {
    title: "Create Ticket",
    description: "Report an issue or request assistance from dev team.",
    icon: Ticket,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    title: "Knowledge Base",
    description: "Browse operational guides and SOPs.",
    icon: BookOpen,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    title: "Report Bug",
    description: "Log a system defect with reproduction steps.",
    icon: Bug,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
  },
  {
    title: "Critical Escalation",
    description: "Trigger emergency protocol for severe outages.",
    icon: AlertTriangle,
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
  },
];

const TICKETS = [
  {
    id: "TK-8942",
    title: "Payment Sync Failure",
    created: "2h ago",
    priority: "High",
    priorityColor: "#EF4444",
    priorityBg: "#FEE2E2",
    status: "In Progress",
    statusColor: "#F59E0B",
    statusBg: "#FFFBEB",
    assignedTo: "Sarah J.",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+J&background=3B82F6&color=fff",
  },
  {
    id: "TK-8941",
    title: "KYC Approval Stuck",
    created: "5h ago",
    priority: "Medium",
    priorityColor: "#F59E0B",
    priorityBg: "#FFFBEB",
    status: "Open",
    statusColor: "#6B7280",
    statusBg: "#F3F4F6",
    assignedTo: "Unassigned",
    avatar: null,
  },
  {
    id: "TK-8938",
    title: "Export Report Error (500)",
    created: "1d ago",
    priority: "Low",
    priorityColor: "#3B82F6",
    priorityBg: "#EFF6FF",
    status: "Resolved",
    statusColor: "#10B981",
    statusBg: "#DCFCE7",
    assignedTo: "Mike R.",
    avatar:
      "https://ui-avatars.com/api/?name=Mike+R&background=10B981&color=fff",
  },
];

const CHART_DATA = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 20 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 5 },
];

export default function SupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>(TICKETS);
  const [chartData, setChartData] = useState<any[]>(CHART_DATA);
  const [ticketStats, setTicketStats] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        setIsLoading(true);
        const [ticketsRes, statsRes, statusRes] = await Promise.allSettled([
          supportApi.getTickets({ search }),
          supportApi.getTicketStats(),
          supportApi.getSystemStatus(),
        ]);

        if (ticketsRes.status === "fulfilled" && ticketsRes.value?.data?.tickets) {
          const apiTickets = ticketsRes.value.data.tickets.map((t: any) => ({
            id: t._id,
            title: t.subject,
            created: t.lastResponse || "Recently",
            priority: t.priority,
            priorityColor: t.priority === "High" ? "#EF4444" : t.priority === "Medium" ? "#F59E0B" : "#3B82F6",
            priorityBg: t.priority === "High" ? "#FEE2E2" : t.priority === "Medium" ? "#FFFBEB" : "#EFF6FF",
            status: t.status,
            statusColor: t.status === "Open" ? "#6B7280" : t.status === "In Progress" ? "#F59E0B" : "#10B981",
            statusBg: t.status === "Open" ? "#F3F4F6" : t.status === "In Progress" ? "#FFFBEB" : "#DCFCE7",
            assignedTo: t.assignedTo || "Unassigned",
            avatar: t.assignedTo && t.assignedTo !== "Unassigned" ? `https://ui-avatars.com/api/?name=${encodeURIComponent(t.assignedTo)}&background=3B82F6&color=fff` : null,
          }));
          setTickets(apiTickets);
        }

        if (statsRes.status === "fulfilled" && statsRes.value?.data) {
          setTicketStats(statsRes.value.data);
          if (statsRes.value.data.chartData) {
            setChartData(statsRes.value.data.chartData.map((d: any) => ({ name: d.day, value: d.tickets })));
          }
        }

        if (statusRes.status === "fulfilled" && statusRes.value?.data) {
          setSystemStatus(statusRes.value.data);
        }
      } catch (err) {
        // Keep fallback data on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupportData();
  }, [search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Help & Support"
        description="Dashboard > Help & Support"
        onCreateClick={() => {}}
        createLabel="Create"
      />

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {/* Left Column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Hero Search Section */}
          <Card
            padding="2rem"
            style={{
              background: "linear-gradient(90deg ,#fff 0%,#eef5fe 100%",
              padding: "2rem 2rem 2rem 2rem",
              borderRadius: "12px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                How can we help you today?
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "2rem",
                }}
              >
                Search our knowledge base, guides, and troubleshooting articles.
              </p>

              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                />
                <input
                  placeholder="e.g. How to reset driver password, Dispute resolution..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 6rem 0.8rem 3rem",
                    borderRadius: "12px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "0.95rem",
                    outline: "none",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                />
                <button
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "6px",
                    bottom: "6px",
                    padding: "0 1.25rem",
                    borderRadius: "8px",
                    backgroundColor: "#111827",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  Search
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Popular:
                </span>
                {["Payment Gateway", "Driver KYC", "Exporting Reports"].map(
                  (tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.8rem",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: "#F3F4F6",
                        color: COLORS.TEXT_MAIN,
                        cursor: "pointer",
                      }}
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.25rem",
            }}
          >
            {QUICK_ACTIONS.map((action, idx) => (
              <Card key={idx} padding="1.5rem">
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: action.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: action.iconColor,
                      flexShrink: 0,
                    }}
                  >
                    <action.icon size={22} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: COLORS.TEXT_MAIN,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {action.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                        lineHeight: 1.5,
                      }}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Support Tickets */}
          <Card padding="0">
            <div
              style={{
                padding: "1.5rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Active Support Tickets
                </h3>
                <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                  Manage and track ongoing system and user issues.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <AlertCircle size={14} /> All Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <MoreVertical size={14} /> Sort
                </Button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                      textAlign: "left",
                    }}
                  >
                    <th style={{ ...headerCellStyle, width: "40px" }}>
                      <input type="checkbox" />
                    </th>
                    <th style={headerCellStyle}>TICKET ID & TITLE</th>
                    <th style={headerCellStyle}>PRIORITY</th>
                    <th style={headerCellStyle}>STATUS</th>
                    <th style={headerCellStyle}>ASSIGNED TO</th>
                    <th style={{ ...headerCellStyle, textAlign: "right" }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      style={{
                        borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                      }}
                    >
                      <td style={bodyCellStyle}>
                        <input type="checkbox" />
                      </td>
                      <td style={bodyCellStyle}>
                        <div>
                          <p
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: COLORS.TEXT_MAIN,
                              marginBottom: "2px",
                            }}
                          >
                            {ticket.title}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          >
                            {ticket.id} • Created {ticket.created}
                          </p>
                        </div>
                      </td>
                      <td style={bodyCellStyle}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            backgroundColor: ticket.priorityBg,
                            color: ticket.priorityColor,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {ticket.priority === "High"
                            ? "↑"
                            : ticket.priority === "Medium"
                              ? "-"
                              : "↓"}{" "}
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={bodyCellStyle}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: "6px",
                            backgroundColor: ticket.statusBg,
                            color: ticket.statusColor,
                          }}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td style={bodyCellStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          {ticket.avatar ? (
                            <img
                              src={ticket.avatar}
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "#F3F4F6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <UserIcon size={14} color="#9CA3AF" />
                            </div>
                          )}
                          <span
                            style={{
                              fontSize: "0.85rem",
                              color: COLORS.TEXT_MAIN,
                            }}
                          >
                            {ticket.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td style={{ ...bodyCellStyle, textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.5rem",
                          }}
                        >
                          <button style={actionBtnStyle}>
                            <Eye size={16} />
                          </button>
                          <button style={actionBtnStyle}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                padding: "1rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
                Showing 1 to {tickets.length} of {ticketStats?.totalTickets ?? 24} entries
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <button style={pageBtnStyle}>
                  <ChevronLeft size={16} />
                </button>
                <button
                  style={{
                    ...pageBtnStyle,
                    backgroundColor: COLORS.PRIMARY_MAIN,
                    color: "#fff",
                    borderColor: COLORS.PRIMARY_MAIN,
                  }}
                >
                  1
                </button>
                <button style={pageBtnStyle}>2</button>
                <button style={pageBtnStyle}>3</button>
                <button style={pageBtnStyle}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div
          style={{
            width: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* System Status Card */}
          <Card padding="1.5rem">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                System Status
              </h3>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "4px 8px",
                  borderRadius: "9999px",
                  backgroundColor: "#DCFCE7",
                  color: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#16A34A",
                  }}
                />
                {systemStatus?.overall || "All Systems Operational"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <StatusRow label="Core API" status="99.9%" isOperational />
              <StatusRow
                label="Payment Gateway"
                status="Operational"
                isOperational
              />
              <StatusRow
                label="Email Services"
                status="Operational"
                isOperational
              />
            </div>

            <button
              style={{
                width: "100%",
                marginTop: "1rem",
                padding: "0",
                background: "none",
                border: "none",
                color: COLORS.PRIMARY_MAIN,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              View Status History
            </button>
          </Card>

          {/* Ticket Volume Chart Card */}
          <Card padding="1.5rem">
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.5rem",
              }}
            >
              Ticket Volume (7 Days)
            </h3>
            <div style={{ height: "180px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Direct Help Card */}
          <Card padding="1.5rem" style={{ backgroundColor: COLORS.BG_CARD }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1rem",
              }}
            >
              Need Direct Help?
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: COLORS.SECONDARY_LIGHT,
                padding: "1rem",
                borderRadius: "12px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3B82F6",
                }}
              >
                <MessageCircle size={22} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Live Chat Support
                </p>
                <p
                  style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Avg. response: 2 mins
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  status,
  isOperational,
}: {
  label: string;
  status: string;
  isOperational: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <MoreVertical size={16} style={{ color: "#D1D5DB" }} />
        <span style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <CheckCircle2
          size={14}
          style={{ color: isOperational ? "#10B981" : "#EF4444" }}
        />
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: isOperational ? "#10B981" : "#EF4444",
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function UserIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const headerCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const bodyCellStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  verticalAlign: "middle",
};

const actionBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#9CA3AF",
  padding: "4px",
  borderRadius: "4px",
  transition: "all 0.2s",
};

const pageBtnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  border: "1px solid #E5E7EB",
  backgroundColor: "#fff",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
  cursor: "pointer",
};
