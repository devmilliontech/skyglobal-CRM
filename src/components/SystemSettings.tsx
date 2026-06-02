"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Download,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Activity,
  Zap,
  AlertCircle,
  MoreVertical,
  Plus,
  Copy,
  Edit2,
  Trash2,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "./SelectField";

const AUDIT_LOGS = [
  {
    user: "John Admin",
    avatar: "https://i.pravatar.cc/150?u=john",
    action: "Update",
    module: "Settings",
    timestamp: "2024-01-15 14:32:15",
    ip: "192.168.1.100",
    details: "Modified payment gateway settings",
  },
  {
    user: "Sarah Manager",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    action: "Create",
    module: "Users",
    timestamp: "2024-01-15 13:45:22",
    ip: "10.0.0.45",
    details: "Created new user account",
  },
  {
    user: "Mike Support",
    avatar: "https://i.pravatar.cc/150?u=mike",
    action: "Login",
    module: "System",
    timestamp: "2024-01-15 12:15:08",
    ip: "172.16.0.22",
    details: "Successful login",
  },
  {
    user: "John Admin",
    avatar: "https://i.pravatar.cc/150?u=john",
    action: "Delete",
    module: "Vehicles",
    timestamp: "2024-01-15 11:20:45",
    ip: "192.168.1.100",
    details: "Removed vehicle VIN: 1HGCM82633A123456",
  },
];

const STATS = [
  {
    label: "Active Users",
    value: "142",
    icon: Users,
    color: "#3B82F6",
    bg: "#EFF6FF",
    trend: "+12%",
  },
  {
    label: "System Uptime",
    value: "99.98%",
    icon: Activity,
    color: "#10B981",
    bg: "#DCFCE7",
    trend: "Stable",
  },
  {
    label: "API Calls/Hour",
    value: "12.5k",
    icon: Zap,
    color: "#F59E0B",
    bg: "#FEF3C7",
    trend: "+5%",
  },
  {
    label: "Error Rate",
    value: "0.02%",
    icon: AlertCircle,
    color: "#EF4444",
    bg: "#FEE2E2",
    trend: "-0.01%",
  },
];

export default function SystemSettings() {
  const [activePage, setActivePage] = useState(1);

  const getActionColor = (action: string) => {
    switch (action) {
      case "Update":
        return { bg: "#EFF6FF", text: "#3B82F6" };
      case "Create":
        return { bg: "#DCFCE7", text: "#10B981" };
      case "Login":
        return { bg: "#F3F4F6", text: "#6B7280" };
      case "Delete":
        return { bg: "#FEE2E2", text: "#EF4444" };
      case "Active":
        return { bg: "#DCFCE7", text: "#10B981" };
      case "Inactive":
        return { bg: "#FEE2E2", text: "#EF4444" };
      case "Logout":
        return { bg: "#FEE2E2", text: "#EF4444" };
      case "Login":
        return { bg: "#F3F4F6", text: "#6B7280" };
      case "Update":
        return { bg: "#EFF6FF", text: "#3B82F6" };
      case "Delete":
        return { bg: "#FEE2E2", text: "#EF4444" };
      case "Create":
        return { bg: "#DCFCE7", text: "#10B981" };
      case "Update":
        return { bg: "#EFF6FF", text: "#3B82F6" };
      case "Delete":
        return { bg: "#FEE2E2", text: "#EF4444" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Audit Logs Section */}
      <Card padding="0">
        <div
          style={{
            padding: "1rem 2rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.25rem",
              }}
            >
              Audit Logs
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Track all system activities and administrative actions
            </p>
          </div>
          <Button variant="primary" size="md">
            <Download size={16} />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <div
          style={{
            padding: "1.25rem 2rem",
            backgroundColor: "#F9FAFB",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "160px" }}>
            <SelectField
              options={[
                { label: "All Users", value: "all" },
                { label: "Admins", value: "admins" },
                { label: "Managers", value: "managers" },
              ]}
              onChange={() => {}}
            />
          </div>
          <div style={{ width: "160px" }}>
            <SelectField
              options={[
                { label: "All Actions", value: "all" },
                { label: "Update", value: "update" },
                { label: "Create", value: "create" },
                { label: "Delete", value: "delete" },
              ]}
              onChange={() => {}}
            />
          </div>
          <div style={{ width: "160px" }}>
            <SelectField
              options={[
                { label: "All Modules", value: "all" },
                { label: "Settings", value: "settings" },
                { label: "Users", value: "users" },
                { label: "Vehicles", value: "vehicles" },
              ]}
              onChange={() => {}}
            />
          </div>
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "200px",
            }}
          >
            <input
              type="text"
              placeholder="Search by IP..."
              style={{
                width: "100%",
                padding: "0.6rem 1rem 0.6rem 2.5rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.TEXT_SECONDARY,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "0.9rem",
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            <Calendar size={16} />
            mm/dd/yyyy
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                {[
                  "USER",
                  "ACTION",
                  "MODULE",
                  "TIMESTAMP",
                  "IP ADDRESS",
                  "DETAILS",
                  "",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "1rem 2rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_SECONDARY,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log, idx) => {
                const colors = getActionColor(log.action);
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ padding: "1rem 2rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <img
                          src={log.avatar}
                          alt={log.user}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: COLORS.TEXT_MAIN,
                          }}
                        >
                          {log.user}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 2rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem 2rem",
                        fontSize: "0.9rem",
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      {log.module}
                    </td>
                    <td
                      style={{
                        padding: "1rem 2rem",
                        fontSize: "0.9rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      {log.timestamp}
                    </td>
                    <td
                      style={{
                        padding: "1rem 2rem",
                        fontSize: "0.9rem",
                        color: COLORS.TEXT_SECONDARY,
                        fontFamily: "monospace",
                      }}
                    >
                      {log.ip}
                    </td>
                    <td
                      style={{
                        padding: "1rem 2rem",
                        fontSize: "0.9rem",
                        color: COLORS.TEXT_SECONDARY,
                        maxWidth: "300px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {log.details}
                    </td>
                    <td style={{ padding: "1rem 2rem", textAlign: "right" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: COLORS.TEXT_SECONDARY,
                          cursor: "pointer",
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            padding: "1.25rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Showing 1-4 of 247 results
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                backgroundColor: "#fff",
                color: COLORS.TEXT_SECONDARY,
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border:
                    activePage === page
                      ? `1px solid ${COLORS.PRIMARY_MAIN}`
                      : `1px solid ${COLORS.BORDER_MAIN}`,
                  backgroundColor:
                    activePage === page ? COLORS.PRIMARY_MAIN : "#fff",
                  color: activePage === page ? "#fff" : COLORS.TEXT_SECONDARY,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
            <span style={{ color: COLORS.TEXT_MUTED }}>...</span>
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                backgroundColor: "#fff",
                color: COLORS.TEXT_SECONDARY,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Activity Monitoring Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.4rem",
            }}
          >
            Activity Monitoring
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Real-time system performance and user activity overview
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} padding="1.25rem">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: stat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: stat.trend.startsWith("+")
                        ? "#10B981"
                        : stat.trend.startsWith("-")
                          ? "#EF4444"
                          : "#6B7280",
                    }}
                  >
                    {stat.trend}
                  </span>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {stat.label}
                  </p>
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                      marginTop: "0.25rem",
                    }}
                  >
                    {stat.value}
                  </h3>
                </div>
                {/* Micro sparkline faking */}
                <div
                  style={{
                    height: "32px",
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "2px",
                  }}
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${Math.random() * 100}%`,
                        backgroundColor: stat.color,
                        opacity: 0.2 + (i / 20) * 0.8,
                        borderRadius: "1px",
                      }}
                    />
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent System Events */}
        <div
          style={{
            border: `1px solid ${COLORS.BORDER_MAIN}`,
            borderRadius: "12px",
            padding: "1.25rem",
            marginTop: "1rem",
            backgroundColor: "#fff",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: COLORS.TEXT_MAIN,
              marginBottom: "1.25rem",
            }}
          >
            Recent System Events
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                  }}
                />
                <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                  Database backup completed successfully
                </span>
              </div>
              <span
                style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
              >
                2 min ago
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#3B82F6",
                  }}
                />
                <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                  New API key generated for Stripe integration
                </span>
              </div>
              <span
                style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
              >
                15 min ago
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                  }}
                />
                <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                  High memory usage detected on server-02
                </span>
              </div>
              <span
                style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
              >
                32 min ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* API & Webhooks Section */}
      <Card padding="1.5rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.4rem",
              }}
            >
              API & Webhooks
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Manage API keys and webhook endpoints for integrations
            </p>
          </div>
          <Button variant="primary" size="md">
            <Plus size={16} />
            Generate API Key
          </Button>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* API Keys */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1.25rem",
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  API Keys
                </h3>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Production API Key
                    </h4>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                        fontFamily: "monospace",
                        marginBottom: "0.25rem",
                      }}
                    >
                      irent_live_sk_**************
                    </p>
                    <p
                      style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}
                    >
                      Last used: 2 hours ago
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#3B82F6",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#EFF6FF",
                      }}
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#F59E0B",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#FEF3C7",
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#EF4444",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#FEE2E2",
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Development API Key
                    </h4>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                        fontFamily: "monospace",
                        marginBottom: "0.25rem",
                      }}
                    >
                      irent_test_sk_**************
                    </p>
                    <p
                      style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}
                    >
                      Last used: 1 day ago
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#3B82F6",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#EFF6FF",
                      }}
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#F59E0B",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#FEF3C7",
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#EF4444",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#FEE2E2",
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Endpoints */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1.25rem",
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Webhook Endpoints
                </h3>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Payment Success
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        marginBottom: "0.25rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "300px",
                      }}
                    >
                      https://api.irent.com/webhooks/payment
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#10B981",
                        fontWeight: 500,
                      }}
                    >
                      Active
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#3B82F6",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#EFF6FF",
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#EF4444",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#FEE2E2",
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Rental Updates
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        marginBottom: "0.25rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "300px",
                      }}
                    >
                      https://api.irent.com/webhooks/rental
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#10B981",
                        fontWeight: 500,
                      }}
                    >
                      Active
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#3B82F6",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#EFF6FF",
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#EF4444",
                        padding: "0.4rem",
                        borderRadius: "6px",
                        backgroundColor: "#FEE2E2",
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
