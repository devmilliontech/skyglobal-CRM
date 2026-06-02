"use client";
import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Search,
  RotateCcw,
  ChevronDown,
  ArrowUpRight,
  Filter,
  Download,
  Eye,
  Check,
  X,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import SelectField from "./SelectField";

const queueData = [
  {
    id: 1,
    driver: {
      name: "Michael Johnson",
      id: "DRV-2024-001234",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    },
    documentType: {
      name: "Driver's Licence",
      detail: "Front & Back",
    },
    submitted: {
      relative: "2 hours ago",
      full: "26 Jan 2024, 12:30",
    },
    priority: "High",
    status: "Pending",
    expiryDate: {
      date: "10 Feb 2024",
      note: "Expires in 15 days",
      urgent: true,
    },
  },
  {
    id: 2,
    driver: {
      name: "Sarah Williams",
      id: "DRV-2024-001235",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    },
    documentType: {
      name: "Passport",
      detail: "Full Document",
    },
    submitted: {
      relative: "5 hours ago",
      full: "26 Jan 2024, 09:15",
    },
    priority: "Medium",
    status: "Pending",
    expiryDate: {
      date: "15 Mar 2026",
      note: "Valid",
      urgent: false,
    },
  },
  {
    id: 3,
    driver: {
      name: "James Anderson",
      id: "DRV-2024-001236",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    },
    documentType: {
      name: "Visa Document",
      detail: "Work Visa",
    },
    submitted: {
      relative: "1 day ago",
      full: "25 Jan 2024, 16:45",
    },
    priority: "High",
    status: "Pending",
    expiryDate: {
      date: "05 Feb 2024",
      note: "Expires in 10 days",
      urgent: true,
    },
  },
  {
    id: 4,
    driver: {
      name: "Emma Davis",
      id: "DRV-2024-001237",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    },
    documentType: {
      name: "Proof of Address",
      detail: "Utility Bill",
    },
    submitted: {
      relative: "3 days ago",
      full: "23 Jan 2024, 10:20",
    },
    priority: "Low",
    status: "Pending",
    expiryDate: {
      date: "N/A",
      note: "No expiry",
      urgent: false,
    },
  },
];

export default function KYCVerificationQueue() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Table Section */}
      <div className="card" style={{ padding: "0" }}>
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Verification Queue
            </h3>
            <span
              style={{
                backgroundColor: "#FFF7ED",
                color: "#C2410C",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              24 Pending
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button style={actionButtonStyle}>
              <Filter size={14} /> Sort
            </button>
            <button style={actionButtonStyle}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <th style={tableHeaderStyle}>
                  <input type="checkbox" />
                </th>
                <th style={tableHeaderStyle}>DRIVER</th>
                <th style={tableHeaderStyle}>DOCUMENT TYPE</th>
                <th style={tableHeaderStyle}>SUBMITTED</th>
                <th style={tableHeaderStyle}>PRIORITY</th>
                <th style={tableHeaderStyle}>STATUS</th>
                <th style={tableHeaderStyle}>EXPIRY DATE</th>
                <th style={tableHeaderStyle}>QUICK ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {queueData.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
                >
                  <td style={tableCellStyle}>
                    <input type="checkbox" />
                  </td>
                  <td style={tableCellStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <img
                        src={item.driver.avatar}
                        alt=""
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                          {item.driver.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: COLORS.TEXT_MUTED,
                          }}
                        >
                          {item.driver.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                        {item.documentType.name}
                      </span>
                      <span
                        style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}
                      >
                        {item.documentType.detail}
                      </span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                        {item.submitted.relative}
                      </span>
                      <span
                        style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}
                      >
                        {item.submitted.full}
                      </span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <PriorityBadge level={item.priority} />
                  </td>
                  <td style={tableCellStyle}>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: item.expiryDate.urgent ? "#EF4444" : "inherit",
                        }}
                      >
                        {item.expiryDate.date}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: item.expiryDate.urgent
                            ? "#EF4444"
                            : COLORS.TEXT_MUTED,
                        }}
                      >
                        {item.expiryDate.note}
                      </span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        style={{
                          ...rowButtonStyle,
                          backgroundColor: "#10B981",
                          color: "white",
                          border: "none",
                        }}
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        style={{
                          ...rowButtonStyle,
                          backgroundColor: "#EF4444",
                          color: "white",
                          border: "none",
                        }}
                      >
                        <X size={14} /> Reject
                      </button>
                      <button
                        style={{
                          ...rowButtonStyle,
                          backgroundColor: COLORS.PRIMARY_MAIN,
                          color: "white",
                          border: "none",
                        }}
                      >
                        <Eye size={14} /> Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniStatCard({ title, value, subtitle, icon, iconColor }: any) {
  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          {title}
        </p>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: COLORS.TEXT_MAIN,
          }}
        >
          {value}
        </h2>
        <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
          {subtitle}
        </p>
      </div>
      <div
        style={{
          color: iconColor,
          backgroundColor: `${iconColor}10`,
          padding: "0.5rem",
          borderRadius: "8px",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

function PriorityBadge({ level }: { level: string }) {
  let color = "#6B7280";
  if (level === "High") color = "#EF4444";
  if (level === "Medium") color = "#F59E0B";
  if (level === "Low") color = "#10B981";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <span
        style={{ fontSize: "0.8rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}
      >
        {level}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        color: "#F59E0B",
        backgroundColor: "#FEF3C7",
        padding: "2px 10px",
        borderRadius: "12px",
        width: "fit-content",
      }}
    >
      <Clock size={12} />
      <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{status}</span>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.7rem",
  fontWeight: 700,
  color: COLORS.TEXT_SECONDARY,
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  verticalAlign: "middle",
};

const actionButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 0.85rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: "white",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  color: COLORS.TEXT_MAIN,
};

const rowButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.4rem 0.75rem",
  borderRadius: "6px",
  fontSize: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
};
