"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  AlertTriangle,
  Edit,
  UserCheck,
  Ban,
  Key,
  Mail,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  FileText,
  MessageSquare,
  ExternalLink,
  CircleCheck,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import KYCVerificationQueue from "@/components/KYCVerificationQueue";
import DriverPayments from "@/components/DriverPayments";
import DriverAuditActivity from "@/components/DriverAuditActivity";
import DriverAgreements from "@/components/DriverAgreements";

export default function DriverProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "Profile Details"
    | "KYC Verification Queue"
    | "Payments"
    | "Agreements"
    | "Audit & Activity"
    | "Notes"
  >("Profile Details");

  const tabs = [
    "Profile Details",
    "KYC Verification Queue",
    "Payments",
    "Agreements",
    "Audit & Activity",
  ];

  //TODO: Data should be coming from previous page and API

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      <PageHeader
        title="Driver Profile"
        description="Manage driver information and compliance status"
        showBack
      />
      {/* Breadcrumbs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.75rem",
        }}
      >
        <Link
          href="/drivers"
          style={{ color: COLORS.TEXT_SECONDARY, textDecoration: "none" }}
        >
          Drivers Management
        </Link>
        <ChevronRight size={12} style={{ color: COLORS.TEXT_MUTED }} />
        <span style={{ color: COLORS.TEXT_MAIN, fontWeight: 500 }}>
          Driver Profile
        </span>
      </div>

      {/* Expiry Warning */}
      <div
        style={{
          background: "#FFF7ED",
          border: "1px solid #FFEDD5",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-start",
        }}
      >
        <AlertTriangle
          size={18}
          style={{ color: "#F97316", marginTop: "2px" }}
        />
        <div>
          <h4
            style={{ fontSize: "0.85rem", fontWeight: 700, color: "#9A3412" }}
          >
            Driver licence expires in 15 days
          </h4>
          <p style={{ fontSize: "0.8rem", color: "#C2410C" }}>
            Licence expires on 2024-02-10. Please notify driver to renew before
            expiry.
          </p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}
          >
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                alt="Profile"
                style={{
                  width: "95px",
                  height: "95px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                Michael Johnson
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  color: COLORS.TEXT_SECONDARY,
                  fontSize: "0.85rem",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Mail size={14} /> michael.johnson@email.com
                </span>
                <span>Driver ID: DRV-2024-001234</span>
              </div>
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}
              >
                <span
                  className="badge badge-success"
                  style={{
                    fontSize: "0.65rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "currentColor",
                    }}
                  />{" "}
                  Active
                </span>
                <span
                  className="badge badge-success"
                  style={{
                    fontSize: "0.65rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <ShieldCheck size={12} /> KYC Verified
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href={`/drivers/1/edit`} style={{ textDecoration: "none" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  padding: "13px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <Edit size={14} /> Edit Driver
              </button>
            </Link>
            <button
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                padding: "13px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <UserCheck size={14} /> Approve Verification
            </button>
            <button
              style={{
                border: "1px solid #FECACA",
                color: "#DC2626",
                padding: "13px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Ban size={14} /> Suspend
            </button>
            <button
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                padding: "13px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Key size={14} /> Reset Password
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
          padding: "0 0.5rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(
                tab as
                  | "Profile Details"
                  | "KYC Verification Queue"
                  | "Payments"
                  | "Agreements"
                  | "Audit & Activity"
                  | "Notes",
              );
            }}
            style={{
              padding: "0.75rem 0.25rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color:
                activeTab === tab ? COLORS.PRIMARY_MAIN : COLORS.TEXT_SECONDARY,
              borderBottom:
                activeTab === tab
                  ? `2px solid ${COLORS.PRIMARY_MAIN}`
                  : "2px solid transparent",
              transition: "all 0.2s",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ marginTop: "-1rem" }}>
        {activeTab === "Profile Details" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            {/* Left Side: Information Cards */}
            <div
              className="animate-fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Personal Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Personal Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <LabelValue label="First Name" value="Michael" />
                    <LabelValue label="Last Name" value="Johnson" />
                    <LabelValue
                      label="Email"
                      value="michael.johnson@email.com"
                    />
                  </div>
                  <div>
                    <LabelValue label="Middle Name" value="David" />
                    <LabelValue label="Date of Birth" value="1985-03-15" />
                    <LabelValue label="Phone Number" value="+61 412 345 678" />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Address Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <LabelValue
                      label="Address Line 1"
                      value="123 Harmony Street"
                    />
                    <LabelValue label="City" value="Sydney" />
                    <LabelValue label="Postal Code" value="2000" />
                  </div>
                  <div>
                    <LabelValue label="Address Line 2" value="Apt 4B" />
                    <LabelValue label="State" value="New South Wales" />
                    <LabelValue label="Country" value="Australia" />
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Document Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <LabelValue
                      label="Driver's Licence Number"
                      value="VIC123456789"
                    />
                    <LabelValue label="Passport Number" value="A1234567" />
                    <LabelValue label="ABN" value="12 345 678 901" />
                  </div>
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MUTED,
                          marginBottom: "0.2rem",
                        }}
                      >
                        Licence Expiry Date
                      </p>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "#DC2626",
                        }}
                      >
                        2024-02-10
                      </p>
                    </div>
                    <LabelValue
                      label="Visa Expiry Date"
                      value="Not Required (Local Driver)"
                    />
                  </div>
                </div>
              </div>

              {/* Active Agreements */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                  }}
                >
                  Active Agreements
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: COLORS.BG_PAGE,
                          borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                        }}
                      >
                        <th style={tableHeaderStyle}>Agreement Title</th>
                        <th style={tableHeaderStyle}>Vehicle</th>
                        <th style={tableHeaderStyle}>Type</th>
                        <th style={tableHeaderStyle}>Start Date</th>
                        <th style={tableHeaderStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "none" }}>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          Toyota Camry Agreement
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          Toyota Camry 2023
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          Rent-to-Own
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          2024-01-15
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            className="badge badge-success"
                            style={{ fontSize: "0.6rem" }}
                          >
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Side: System Information, Compliance, Quick Actions, Notes */}
            <div
              className="animate-fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* System Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  System Information
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Driver ID
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      DRV-2024-001234
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      KYC Status
                    </span>
                    <span
                      className="badge badge-success"
                      style={{ fontSize: "0.65rem" }}
                    >
                      Verified
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Account Status
                    </span>
                    <span
                      className="badge badge-success"
                      style={{ fontSize: "0.65rem" }}
                    >
                      Active
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Calendar size={14} /> Date Joined
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      2024-01-15
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Clock size={14} /> Last Login
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      2024-01-26 14:30
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <CreditCard size={14} /> Linked Payment
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      **** 4532 (Visa)
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Compliance Status
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Driver's Licence
                    </span>
                    <div
                      style={{
                        backgroundColor: "#ffedd5",
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "#B45309",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                        }}
                      >
                        <AlertTriangle size={12} /> Expiring Soon
                      </div>
                    </div>
                  </div>
                  {[
                    { label: "Identity Verification", status: "Verified" },
                    { label: "Address Verification", status: "Verified" },
                    { label: "Payment Setup", status: "Complete" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="badge badge-success"
                        style={{
                          fontSize: "0.65rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "4px 12px",
                        }}
                      >
                        <CircleCheck size={14} />
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {[
                    {
                      label: "View Agreements",
                      icon: <ExternalLink size={14} />,
                    },
                    { label: "View Payments", icon: <CreditCard size={14} /> },
                    { label: "View Documents", icon: <FileText size={14} /> },
                    { label: "View Notes", icon: <MessageSquare size={14} /> },
                  ].map((action, i) => (
                    <button
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 0",
                        color: COLORS.TEXT_SECONDARY,
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = COLORS.PRIMARY_MAIN)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = COLORS.TEXT_SECONDARY)
                      }
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.6rem 0",
                      color: "#DC2626",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Ban size={14} /> Suspend Account
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  Internal Notes
                </h3>
                <textarea
                  placeholder="Add internal comments about this driver..."
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "0.8rem",
                    fontFamily: "inherit",
                    resize: "none",
                    outline: "none",
                    background: "#F9FAFB",
                  }}
                />
                <button
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    background: COLORS.PRIMARY_MAIN,
                    color: COLORS.BG_CARD,
                  }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "KYC Verification Queue" && (
          <div className="animate-fade-in">
            <KYCVerificationQueue />
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="animate-fade-in">
            <DriverPayments />
          </div>
        )}

        {activeTab === "Agreements" && (
          <div className="animate-fade-in">
            <DriverAgreements />
          </div>
        )}

        {activeTab === "Audit & Activity" && (
          <div className="animate-fade-in">
            <DriverAuditActivity
              onBack={() => setActiveTab("Profile Details")}
            />
          </div>
        )}

        {activeTab !== "Profile Details" &&
          activeTab !== "KYC Verification Queue" &&
          activeTab !== "Payments" &&
          activeTab !== "Agreements" &&
          activeTab !== "Audit & Activity" && (
            <div
              className="card"
              style={{
                padding: "3rem",
                textAlign: "center",
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              <h3>{activeTab} content is coming soon...</h3>
            </div>
          )}
      </div>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: COLORS.TEXT_MUTED,
  textAlign: "left",
  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
  textTransform: "uppercase",
};

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: COLORS.TEXT_MUTED,
          marginBottom: "0.2rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {value}
      </p>
    </div>
  );
}
