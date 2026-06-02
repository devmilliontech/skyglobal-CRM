"use client";
import { COLORS } from "@/constants/Constant";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  ChevronDown,
  Download,
  ArrowLeft,
  Eye,
  Plus,
  Search,
  Bell,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const history = [
  {
    date: "2024-01-15 14:30",
    user: "Admin User",
    records: "1,203",
    format: "XLSX",
    reason: "Monthly compliance report for finance team",
  },
  {
    date: "2024-01-12 09:15",
    user: "Sarah Johnson",
    records: "856",
    format: "CSV",
    reason: "KYC verification audit",
  },
  {
    date: "2024-01-08 16:45",
    user: "Mike Chen",
    records: "2,145",
    format: "XLSX",
    reason: "Quarterly driver performance analysis",
  },
];

export default function ExportDriversPage() {
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      {/* Manual Navbar (Light Variant) */}
      <PageHeader title="Export Drivers" variant="light" />
      {/* Breadcrumbs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
        }}
      >
        <Link
          href="/drivers"
          style={{ color: COLORS.TEXT_SECONDARY, textDecoration: "none" }}
        >
          Drivers
        </Link>
        <ChevronRight size={12} style={{ color: COLORS.TEXT_MUTED }} />
        <span style={{ color: COLORS.TEXT_MAIN, fontWeight: 500 }}>
          Export Drivers
        </span>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Export Filters */}
          <div className="card" style={{ padding: "1rem" }}>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Export Filters
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {[
                {
                  label: "Status",
                  options: ["All Statuses", "Active", "Suspended", "Pending"],
                },
                {
                  label: "KYC Status",
                  options: [
                    "All KYC Statuses",
                    "Verified",
                    "Pending",
                    "Rejected",
                  ],
                },
                {
                  label: "Agreement Status",
                  options: [
                    "All Agreement Statuses",
                    "Active Agreement",
                    "Completed",
                    "No Agreement",
                  ],
                },
                {
                  label: "Payment Status",
                  options: [
                    "All Payment Statuses",
                    "Current",
                    "Overdue",
                    "No Payment",
                  ],
                },
              ].map((filter, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {filter.label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      style={{
                        width: "100%",
                        padding: "10px 10px",
                        borderRadius: "6px",
                        border: `1px solid ${COLORS.BORDER_MAIN}`,
                        appearance: "none",
                        background: COLORS.BG_CARD,
                        fontSize: "0.8rem",
                      }}
                    >
                      {filter.options.map((opt, j) => (
                        <option key={j}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: COLORS.TEXT_MUTED,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  Date Joined From
                </label>
                <div style={{ position: "relative" }}>
                  <input type="date" style={inputStyle} />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  Date Joined To
                </label>
                <div style={{ position: "relative" }}>
                  <input type="date" style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* Select Columns Section */}
          <div className="card" style={{ padding: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                Select Columns to Export
              </h3>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: COLORS.PRIMARY_MAIN,
                    padding: "0",
                  }}
                >
                  Select All
                </button>
                <button
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_SECONDARY,
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem",
              }}
            >
              {[
                {
                  title: "Personal Information",
                  cols: [
                    { label: "Driver Name", checked: true },
                    { label: "Email", checked: true },
                    { label: "Phone", checked: true },
                    { label: "Date of Birth", checked: false },
                    { label: "Address", checked: false },
                  ],
                },
                {
                  title: "System Information",
                  cols: [
                    { label: "Driver ID", checked: true },
                    { label: "KYC Status", checked: true },
                    { label: "Account Status", checked: true },
                    { label: "Date Joined", checked: false },
                    { label: "Last Login", checked: false },
                  ],
                },
                {
                  title: "Documents & Compliance",
                  cols: [
                    { label: "Licence Number", checked: false },
                    { label: "Licence Expiry", checked: false },
                    { label: "Visa Expiry", checked: false },
                    { label: "ABN", checked: false },
                    { label: "Payment Status", checked: false },
                  ],
                },
              ].map((section, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_SECONDARY,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {section.title}
                  </h4>
                  {section.cols.map((col, j) => (
                    <label
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={col.checked}
                        style={{
                          width: "14px",
                          height: "14px",
                          accentColor: COLORS.PRIMARY_MAIN,
                        }}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Export Audit Information */}
          <div className="card" style={{ padding: "1rem" }}>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Export Audit Information
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                Reason for Export{" "}
                <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <textarea
                placeholder="Provide a reason for this data export for audit purposes..."
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.8rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <p style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}>
                This note will be logged in the audit trail
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Export Format */}
          <div className="card" style={{ padding: "1rem" }}>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Export Format
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="format"
                  defaultChecked
                  style={{
                    marginTop: "3px",
                    width: "16px",
                    height: "16px",
                    accentColor: COLORS.PRIMARY_MAIN,
                  }}
                />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>CSV</p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Comma-separated values
                  </p>
                </div>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="format"
                  style={{
                    marginTop: "3px",
                    width: "16px",
                    height: "16px",
                    accentColor: COLORS.PRIMARY_MAIN,
                  }}
                />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>XLSX</p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Excel spreadsheet
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Export Preview */}
          <div className="card" style={{ padding: "1rem" }}>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Export Preview
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                { label: "Estimated Records:", value: "1,247" },
                { label: "Selected Columns:", value: "8" },
                { label: "Format:", value: "CSV" },
                { label: "Est. File Size:", value: "~2.1 MB" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: COLORS.PRIMARY_MAIN,
                color: COLORS.BG_CARD,
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                width: "100%",
              }}
            >
              <Download size={16} />
              Generate & Download Export
            </button>
            <Link
              href="/drivers"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                color: COLORS.TEXT_SECONDARY,
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                padding: "8px",
              }}
            >
              <ArrowLeft size={14} />
              Back to Drivers
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Export History (Full Width) */}
      <div className="card" style={{ padding: "15px", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem 0.75rem 1.25rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>
            Recent Export History
          </h3>
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
                  background: COLORS.BG_PAGE,
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <th
                  style={{
                    padding: "0.6rem 1.25rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                  }}
                >
                  Date & Time
                </th>
                <th
                  style={{
                    padding: "0.6rem 1rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                  }}
                >
                  Exported By
                </th>
                <th
                  style={{
                    padding: "0.6rem 1rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                  }}
                >
                  Records
                </th>
                <th
                  style={{
                    padding: "0.6rem 1rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                  }}
                >
                  Format
                </th>
                <th
                  style={{
                    padding: "0.6rem 1rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                  }}
                >
                  Reason
                </th>
                <th
                  style={{
                    padding: "0.6rem 1.25rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i === history.length - 1
                        ? "none"
                        : `1px solid ${COLORS.BORDER_MAIN}`,
                  }}
                >
                  <td
                    style={{
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.8rem",
                      color: COLORS.TEXT_SECONDARY,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.date}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {item.user}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem" }}>
                    {item.records}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.format}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.8rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {item.reason}
                  </td>
                  <td style={{ padding: "0.75rem 1.25rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.6rem",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          color: COLORS.PRIMARY_MAIN,
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        style={{
                          color: COLORS.TEXT_MUTED,
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="View details"
                      >
                        <Eye size={14} />
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.50rem 1rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: COLORS.BG_CARD,
  fontSize: "0.9rem",
  color: COLORS.TEXT_MAIN,
  outline: "none",
  transition: "border-color 0.2s",
};
