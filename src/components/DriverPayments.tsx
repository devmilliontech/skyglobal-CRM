"use client";
import React from "react";
import {
  CreditCard,
  AlertTriangle,
  FileText,
  ExternalLink,
  CheckCircle,
  Calendar,
  DollarSign,
  RefreshCw,
  Plus,
  Ban,
  Mail,
  Edit,
  Download,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";

const DriverPayments = () => {
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* Alert Banner */}
      <div
        style={{
          backgroundColor: "#FEF2F2",
          border: "1px solid #FCA5A5",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          display: "flex",
          gap: "1rem",
          position: "relative",
        }}
      >
        <div style={{ color: "#DC2626", marginTop: "2px" }}>
          <AlertTriangle size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h4
            style={{
              color: "#991B1B",
              fontSize: "0.9rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
            }}
          >
            Payment Overdue - Account Suspended
          </h4>
          <p style={{ color: "#B91C1C", fontSize: "0.85rem", lineHeight: 1.5 }}>
            This driver has an overdue payment of $450.00 due on Dec 15, 2024.
            The account is currently suspended with an active agreement
            (AGR-2024-001234). Payment must be collected or agreement
            terminated.
          </p>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#B91C1C",
            cursor: "pointer",
            position: "absolute",
            right: "1rem",
            top: "1rem",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>&times;</span>
        </button>
      </div>

      {/* Main Payment Info Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Payment Method Card */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Payment Method
            </h3>
            <button
              style={{
                color: COLORS.PRIMARY_MAIN,
                background: "none",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                cursor: "pointer",
              }}
            >
              <Edit size={14} /> Update
            </button>
          </div>

          <div
            style={{
              background: "#F9FAFB",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <div
                  style={{
                    background: "#1F2937",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    color: "white",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                  }}
                >
                  VISA
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                    Visa ending in 4242
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Expires 12/2026
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#059669",
                  background: "#ECFDF5",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: 600,
                }}
              >
                Default
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <LabelValue label="Cardholder:" value="Michael Johnson" />
                <LabelValue label="Added:" value="Jan 15, 2024" />
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Auto-charge:
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#059669",
                    fontWeight: 600,
                  }}
                >
                  Enabled
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <button
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                background: "white",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} /> Retry Charge
            </button>
            <button
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                background: "white",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> Add New
            </button>
          </div>
        </div>

        {/* Active Agreement Card */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Active Agreement
            </h3>
            <button
              style={{
                color: COLORS.PRIMARY_MAIN,
                background: "none",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                cursor: "pointer",
              }}
            >
              <ExternalLink size={14} /> View
            </button>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.7rem",
                color: COLORS.TEXT_SECONDARY,
                textTransform: "uppercase",
                letterSpacing: "0.025em",
                marginBottom: "0.25rem",
              }}
            >
              Agreement ID
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>
              AGR-2024-001234
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.7rem",
                color: COLORS.TEXT_SECONDARY,
                marginBottom: "0.25rem",
              }}
            >
              Title
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Toyota Camry Agreement
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.7rem",
                color: COLORS.TEXT_SECONDARY,
                marginBottom: "0.25rem",
              }}
            >
              Vehicle
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Toyota Camry 2023 (ABC-123)
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "0.25rem",
                }}
              >
                Type
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: COLORS.PRIMARY_MAIN,
                  background: "#EEF2FF",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: 600,
                }}
              >
                Rent-to-Own
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "0.25rem",
                }}
              >
                Status
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#D97706",
                  background: "#FEF3C7",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: 600,
                }}
              >
                Suspended
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "0.25rem",
                }}
              >
                Start Date
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                Jan 15, 2024
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "0.25rem",
                }}
              >
                End Date
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                Jan 15, 2026
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: COLORS.TEXT_SECONDARY,
                marginBottom: "0.25rem",
              }}
            >
              Monthly Payment
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: COLORS.TEXT_MAIN,
              }}
            >
              $450.00
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Quick Actions
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <ActionButton
                label="Record Manual Payment"
                icon={<DollarSign size={16} />}
                color="#059669"
                bgColor="#10B981"
                textColor="white"
              />
              <ActionButton
                label="Retry Automatic Charge"
                icon={<RefreshCw size={16} />}
                bgColor="#2563EB"
                textColor="white"
              />
              <ActionButton
                label="Mark as Paid"
                icon={<CheckCircle size={16} />}
              />
              <ActionButton
                label="Schedule Payment Plan"
                icon={<Calendar size={16} />}
              />
              <ActionButton
                label="Send Payment Reminder"
                icon={<Mail size={16} />}
              />
              <ActionButton
                label="Suspend Agreement"
                icon={<Ban size={16} />}
                textColor="#DC2626"
                borderColor="#FEE2E2"
                style={{ marginTop: "0.5rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Schedule Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Repayment Schedule
            </h3>
            <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
              Monthly payment plan for active agreement
            </p>
          </div>
          <button
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              background: "white",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <Edit size={16} /> Modify Schedule
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <RepaymentStat label="Total Amount" value="$10,800.00" />
          <RepaymentStat
            label="Amount Paid"
            value="$3,600.00"
            color="#059669"
          />
          <RepaymentStat
            label="Remaining Balance"
            value="$7,200.00"
            color="#DC2626"
          />
          <RepaymentStat label="Payments Remaining" value="16 / 24" />
        </div>

        {/* Detailed Schedule Table */}
        <div style={{ marginTop: "2rem", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                <th style={tableHeaderStyle}>Payment #</th>
                <th style={tableHeaderStyle}>Due Date</th>
                <th style={tableHeaderStyle}>Amount</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Paid Date</th>
                <th style={tableHeaderStyle}>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom:
                      idx === scheduleData.length - 1
                        ? "none"
                        : `1px solid ${COLORS.BORDER_MAIN}`,
                  }}
                >
                  <td style={tableCellStyle}>{item.id}</td>
                  <td
                    style={{
                      ...tableCellStyle,
                      color:
                        item.status === "Overdue"
                          ? "#DC2626"
                          : item.status === "Upcoming"
                            ? "#D97706"
                            : COLORS.TEXT_MAIN,
                      fontWeight: 600,
                    }}
                  >
                    {item.dueDate}
                  </td>
                  <td style={tableCellStyle}>{item.amount}</td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        color:
                          item.status === "Overdue"
                            ? "#DC2626"
                            : item.status === "Upcoming"
                              ? "#D97706"
                              : "#059669",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "currentColor",
                        }}
                      />
                      {item.status} {item.days && `(${item.days})`}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{item.paidDate}</td>
                  <td style={tableCellStyle}>{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Payment History
            </h3>
            <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
              All payment transactions and records
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ position: "relative" }}>
              <select
                style={{
                  appearance: "none",
                  padding: "0.6rem 2.5rem 0.6rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.85rem",
                  background: "white",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option>All Status</option>
                <option>Paid</option>
                <option>Failed</option>
                <option>Refunded</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: COLORS.TEXT_SECONDARY,
                }}
              />
            </div>
            <button
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                background: "white",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

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
                  background: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <th style={tableHeaderStyle}>Transaction ID</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Description</th>
                <th style={tableHeaderStyle}>Amount</th>
                <th style={tableHeaderStyle}>Method</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
                >
                  <td style={tableCellStyle}>{item.id}</td>
                  <td style={tableCellStyle}>{item.date}</td>
                  <td style={tableCellStyle}>{item.desc}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 700 }}>
                    {item.amount}
                  </td>
                  <td style={tableCellStyle}>{item.method}</td>
                  <td style={tableCellStyle}>
                    <span
                      className="badge badge-success"
                      style={{
                        fontSize: "0.65rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <CheckCircle size={12} /> {item.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <Eye
                        size={16}
                        style={{
                          color: COLORS.PRIMARY_MAIN,
                          cursor: "pointer",
                        }}
                      />
                      <Download
                        size={16}
                        style={{
                          color: COLORS.TEXT_SECONDARY,
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
            Showing 1 to 10 of 8 entries
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button style={paginationButtonStyle}>&lt;</button>
            <button
              style={{
                ...paginationButtonStyle,
                background: COLORS.PRIMARY_MAIN,
                color: "white",
                border: "none",
              }}
            >
              1
            </button>
            <button style={paginationButtonStyle}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LabelValue = ({ label, value }: { label: string; value: string }) => (
  <div style={{ marginBottom: "0.5rem" }}>
    <div style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>
      {label}
    </div>
    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{value}</div>
  </div>
);

const ActionButton = ({
  label,
  icon,
  bgColor = "white",
  textColor = COLORS.TEXT_MAIN,
  borderColor = "#E5E7EB",
  style = {},
}: any) => (
  <button
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      padding: "0.75rem",
      borderRadius: "8px",
      background: bgColor,
      color: textColor,
      border: bgColor === "white" ? `1px solid ${borderColor}` : "none",
      fontSize: "0.85rem",
      fontWeight: 600,
      width: "100%",
      cursor: "pointer",
      boxShadow: bgColor !== "white" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
      ...style,
    }}
  >
    {icon}
    {label}
  </button>
);

const RepaymentStat = ({
  label,
  value,
  color = COLORS.TEXT_MAIN,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div
    style={{
      padding: "1.25rem",
      background: "#F9FAFB",
      borderRadius: "12px",
      border: `1px solid ${COLORS.BORDER_MAIN}`,
    }}
  >
    <div
      style={{
        fontSize: "0.75rem",
        color: COLORS.TEXT_SECONDARY,
        marginBottom: "0.5rem",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: color }}>
      {value}
    </div>
  </div>
);

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.7rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1.25rem 1rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};

const paginationButtonStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: "white",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const scheduleData = [
  {
    id: "9 of 24",
    dueDate: "Dec 15, 2024",
    amount: "$450.00",
    status: "Overdue",
    days: "30 days",
    paidDate: "-",
    method: "-",
  },
  {
    id: "10 of 24",
    dueDate: "Jan 15, 2025",
    amount: "$450.00",
    status: "Upcoming",
    paidDate: "-",
    method: "-",
  },
  {
    id: "8 of 24",
    dueDate: "Nov 15, 2024",
    amount: "$450.00",
    status: "Paid",
    paidDate: "Nov 14, 2024",
    method: "Visa **** 4242",
  },
];

const historyData = [
  {
    id: "TXN-2024-08934",
    date: "Nov 14, 2024",
    desc: "Monthly Payment - Payment #8",
    amount: "$450.00",
    method: "Visa **** 4242",
    status: "Paid",
  },
  {
    id: "TXN-2024-07821",
    date: "Oct 15, 2024",
    desc: "Monthly Payment - Payment #7",
    amount: "$450.00",
    method: "Visa **** 4242",
    status: "Paid",
  },
];

export default DriverPayments;
