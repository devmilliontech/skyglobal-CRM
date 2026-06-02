"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Plus,
  Bell,
  ChevronRight,
  Edit,
  Pause,
  X,
  Check,
  CheckCircle2,
  Clock,
  AtSign,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Receipt,
  BellElectric,
  Eye,
  Notebook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";

export default function AgreementDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Agreements");

  const tabs = [
    { name: "Rentals Management", path: "/rentals" },
    { name: "Agreements", path: "/rentals/agreements" },
    { name: "Disputes & Refunds", path: "/rentals/disputes" },
    { name: "Admin Notes & Audit", path: "/rentals/audit" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title="Agreement Details" />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Agreements", path: "/rentals/agreements" },
          { label: "AGR-2024-001" },
        ]}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0",
          gap: "1.5rem",
        }}
      >
        {/* Main Title Card */}
        <div
          style={{
            background: COLORS.BG_CARD,
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Toyota Corolla - John Doe - 4 Weeks
              </h3>
              <span
                style={{
                  background: "#dcfce7",
                  color: COLORS.SUCCESS_DARK,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Active
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Edit size={16} /> Edit Agreement
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  background: COLORS.WARNING_MAIN,
                  color: COLORS.BG_CARD,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Pause size={16} /> Suspend
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  background: COLORS.ERROR_MAIN,
                  color: COLORS.BG_CARD,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "2rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  marginBottom: "0.25rem",
                  textTransform: "uppercase",
                }}
              >
                Agreement ID
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#111827",
                }}
              >
                AGR-2024-001
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  marginBottom: "0.25rem",
                  textTransform: "uppercase",
                }}
              >
                Agreement Type
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#111827",
                }}
              >
                Rent-to-Own
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  marginBottom: "0.25rem",
                  textTransform: "uppercase",
                }}
              >
                Duration
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#111827",
                }}
              >
                12 Weeks
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  marginBottom: "0.25rem",
                  textTransform: "uppercase",
                }}
              >
                Progress
              </p>
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  background: "#E5E7EB",
                  borderRadius: "3px",
                  overflow: "hidden",
                  marginBottom: "0.25rem",
                }}
              >
                <div
                  style={{
                    width: "33%",
                    height: "100%",
                    background: COLORS.SUCCESS_MAIN,
                  }}
                ></div>
              </div>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#6B7280",
                  textAlign: "right",
                }}
              >
                Week 4 of 12
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Left Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Status Timeline */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertTriangle
                  style={{ transform: "rotate(180deg)" }}
                  size={18}
                  color={COLORS.PRIMARY_MAIN}
                />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Status Timeline
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div
                    style={{
                      background: "#22c55e",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.BG_CARD,
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Agreement Activated
                      </p>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        Jan 15, 2024 - 9:00 AM
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Agreement successfully activated and vehicle handed over
                      to driver
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div
                    style={{
                      background: "#22c55e",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.BG_CARD,
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle
                      style={{
                        transform:
                          "scaleY(-1)" /* makeshift something else if needed, looks like a tiny document or card */,
                      }}
                      size={12}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Payment Received - Week 1
                      </p>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        Jan 22, 2024 - 2:15 PM
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      $700.00 payment received successfully
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div
                    style={{
                      background: "#f59e0b",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.BG_CARD,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        background: COLORS.BG_CARD,
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Overdue Payment Alert
                      </p>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        Feb 05, 2024 - 12:00 PM
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Week 3 payment is 2 days overdue - $750.00 including late
                      fee
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval History */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertTriangle
                  style={{ transform: "rotate(90deg)" }}
                  size={18}
                  color={COLORS.PRIMARY_MAIN}
                />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Approval History
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div
                    style={{
                      background: "#2563eb",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.BG_CARD,
                      flexShrink: 0,
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    SA
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Agreement Created
                      </p>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        Jan 14, 2024 - 2:30 PM
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Initial agreement created by Super Admin
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div
                    style={{
                      background: "#22c55e",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.BG_CARD,
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Agreement Approved
                      </p>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        Jan 15, 2024 - 8:45 AM
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Approved by Manager - All validation checks passed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Rental Records */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AtSign size={18} color={COLORS.PRIMARY_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Linked Rental Records
                </h3>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #F3F4F6",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                  }}
                >
                  Rental ID
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                  }}
                >
                  Period
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.PRIMARY_MAIN,
                  }}
                >
                  RNT-2024-001
                </div>
                <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                  Jan 15 - Feb 12, 2024
                </div>
                <div>
                  <span
                    style={{
                      background: "#dcfce7",
                      color: COLORS.SUCCESS_DARK,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    Active
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.PRIMARY_MAIN,
                    cursor: "pointer",
                  }}
                >
                  View Details
                </div>
              </div>
            </div>

            {/* Repayment Tracking */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Calendar size={18} color={COLORS.PRIMARY_MAIN} />
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    Repayment Tracking
                  </h3>
                </div>
                <div style={{ fontSize: "0.85rem" }}>
                  <span style={{ color: "#6B7280" }}>
                    Outstanding Balance:{" "}
                  </span>
                  <span style={{ color: "#dc2626", fontWeight: 600 }}>
                    $750.00
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.8fr 1.5fr 1fr 1.5fr 1fr",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #F3F4F6",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Week
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Due Date
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Amount
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Paid Date
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.8fr 1.5fr 1fr 1.5fr 1fr",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #F3F4F6",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Week 1
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Jan 22, 2024
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    $700.00
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Jan 22, 2024
                  </div>
                  <div>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: COLORS.SUCCESS_DARK,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Paid
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.8fr 1.5fr 1fr 1.5fr 1fr",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #F3F4F6",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Week 2
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Jan 29, 2024
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    $700.00
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Jan 30, 2024
                  </div>
                  <div>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: COLORS.SUCCESS_DARK,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Paid
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.8fr 1.5fr 1fr 1.5fr 1fr",
                    padding: "0.75rem 0.5rem",
                    alignItems: "center",
                    background: "#fee2e2",
                    margin: "0 -0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Week 3
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Feb 05, 2024
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#dc2626",
                    }}
                  >
                    $750.00
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>-</div>
                  <div>
                    <span
                      style={{
                        background: "#dc2626",
                        color: COLORS.BG_CARD,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Overdue
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Edge Cases & Alerts */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertTriangle size={18} color={COLORS.WARNING_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Edge Cases & Alerts
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <AlertTriangle size={16} color="#dc2626" />
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#dc2626",
                      }}
                    >
                      Overdue Repayment
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#dc2626",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Week 3 payment overdue by 2 days. Late fee applied: $50.00
                  </p>
                  <button
                    style={{
                      background: "#dc2626",
                      color: COLORS.BG_CARD,
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Send Reminder
                  </button>
                </div>
                <div
                  style={{
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <AlertTriangle size={16} color="#d97706" />
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#d97706",
                      }}
                    >
                      Insurance Expiring Soon
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#d97706",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Vehicle insurance expires in 15 days (Dec 20, 2024)
                  </p>
                  <button
                    style={{
                      background: "#d97706",
                      color: COLORS.BG_CARD,
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Renew Insurance
                  </button>
                </div>
              </div>
            </div>

            {/* Compliance & KYC Snapshot */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <RefreshCw size={18} color={COLORS.PRIMARY_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Compliance & KYC Snapshot
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "6px",
                    top: "10px",
                    bottom: "10px",
                    width: "2px",
                  }}
                />
                <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "6px",
                      top: "0",
                      bottom: "0",
                      width: "2px",
                      background: "#22c55e",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.1rem",
                    }}
                  >
                    Driver KYC
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Verified - Valid until Dec 2025
                  </p>
                </div>
                <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "6px",
                      top: "0",
                      bottom: "0",
                      width: "2px",
                      background: "#22c55e",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.1rem",
                    }}
                  >
                    Vehicle Registration
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Valid - Expires Mar 2025
                  </p>
                </div>
                <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "6px",
                      top: "0",
                      bottom: "0",
                      width: "2px",
                      background: "#22c55e",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.1rem",
                    }}
                  >
                    Owner Compliance
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Active - All documents valid
                  </p>
                </div>
                <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "6px",
                      top: "0",
                      bottom: "0",
                      width: "2px",
                      background: "#f59e0b",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.1rem",
                    }}
                  >
                    Insurance Cover
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#d97706" }}>
                    Expiring soon - Dec 20, 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Mileage Tracking */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <CheckCircle2 size={18} color={COLORS.PRIMARY_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Mileage Tracking
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Start Mileage
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    45,230 miles
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Current Mileage
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    46,150 miles
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Mileage Used
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    920 miles
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Weekly Average
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    230 miles/week
                  </p>
                </div>
              </div>
            </div>

            {/* Linked Invoices & Transactions */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Receipt size={18} color={COLORS.PRIMARY_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Linked Invoices & Transactions
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      INV-2024-001
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Week 1 Payment
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: COLORS.SUCCESS_DARK,
                        background: "#dcfce7",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Paid
                    </span>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      $700.00
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      INV-2024-002
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Week 2 Payment
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: COLORS.SUCCESS_DARK,
                        background: "#dcfce7",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Paid
                    </span>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      $700.00
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      INV-2024-003
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Week 3 Payment + Late Fee
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#dc2626",
                        background: "#fee2e2",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Overdue
                    </span>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#dc2626",
                      }}
                    >
                      $750.00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Summary */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Receipt size={18} color={COLORS.PRIMARY_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Agreement Summary
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "#8f949f", fontSize: "0.85rem" }}>
                    Agrement Account
                  </p>
                  <p
                    style={{
                      color: "#535863",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    $8,400.00
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "#8f949f", fontSize: "0.85rem" }}>
                    Weekly Repayment
                  </p>
                  <p
                    style={{
                      color: "#535863",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    $700.00
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "#8f949f", fontSize: "0.85rem" }}>
                    Deposit
                  </p>
                  <p
                    style={{
                      color: "#535863",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    $1,000.00
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "#8f949f", fontSize: "0.85rem" }}>
                    Fixed Fee
                  </p>
                  <p
                    style={{
                      color: "#535863",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    $200
                  </p>
                </div>
                <div style={{ backgroundColor: "#E5E7EB", height: "1px" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                    }}
                  >
                    Total Paid
                  </p>
                  <p
                    style={{
                      color: "#16a34a",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    $9,800.00
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                    }}
                  >
                    Remaining
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    $7,000.00
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <BellElectric size={18} color={COLORS.PRIMARY_MAIN} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Quick Actions
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <button
                  style={{
                    background: COLORS.PRIMARY_MAIN,
                    color: COLORS.BG_CARD,
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <Eye size={18} color={COLORS.BG_CARD} />
                  <p>View Full Agreement</p>
                </button>

                <button
                  style={{
                    background: "#16a34a",
                    color: COLORS.BG_CARD,
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <Check size={18} color={COLORS.BG_CARD} />
                  <p>Mark Payment Received</p>
                </button>

                <button
                  style={{
                    background: "#f59e0b",
                    color: COLORS.BG_CARD,
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <Bell size={18} color={COLORS.BG_CARD} />
                  <p>Send Payment Reminder</p>
                </button>

                <button
                  style={{
                    background: "#0ea5e9",
                    color: COLORS.BG_CARD,
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <Notebook size={18} color={COLORS.BG_CARD} />
                  <p>Add Admin Note</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
