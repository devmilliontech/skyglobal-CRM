"use client";
import { COLORS } from "@/constants/Constant";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Download,
  ArrowLeft,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { driversApi } from "@/services/api/drivers";
import { formatDate } from "@/services/api/client";

const COLUMN_MAPPINGS: Record<string, string> = {
  "First Name": "firstName",
  "Last Name": "lastName",
  "Email": "email",
  "Phone": "phone",
  "Date of Birth": "dob",
  "Address": "address",
  "Driver ID": "driverId",
  "KYC Status": "kycStatus",
  "Account Status": "accountStatus",
  "Date Joined": "createdAt",
  "Last Login": "lastLogin",
  "Licence Number": "licenceNumber",
  "Licence Expiry": "licenceExpiry",
  "Visa Expiry": "visaExpiry",
  "ABN": "abn",
  "Payment Status": "paymentStatus",
};

export default function ExportDriversPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Filter states
  const [status, setStatus] = useState("All Statuses");
  const [kycStatus, setKycStatus] = useState("All KYC Statuses");
  const [agreementStatus, setAgreementStatus] = useState("All Agreement Statuses");
  const [paymentStatus, setPaymentStatus] = useState("All Payment Statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Checkboxes
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set([
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Driver ID",
      "KYC Status",
      "Account Status",
    ])
  );

  const toggleColumn = (col: string) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(col)) {
      newSelected.delete(col);
    } else {
      newSelected.add(col);
    }
    setSelectedColumns(newSelected);
  };

  const selectAll = () => {
    setSelectedColumns(new Set(Object.keys(COLUMN_MAPPINGS)));
  };

  const clearAll = () => {
    setSelectedColumns(new Set());
  };

  // Audit Info & Format
  const [reason, setReason] = useState("");
  const [format, setFormat] = useState("csv");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await driversApi.getExportHistory();
      if (res.success) {
        // If res.data is an array, use it. If it's an object with .records, use that.
        const historyData = Array.isArray(res.data) 
          ? res.data 
          : Array.isArray((res.data as any)?.records) 
            ? (res.data as any).records 
            : Array.isArray((res.data as any)?.data)
              ? (res.data as any).data
              : res.data; // fallback for debugging
        setHistory(historyData || []);
      }
    } catch (err) {
      console.error("Failed to fetch export history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!reason) {
      alert("Please provide a reason for export.");
      return;
    }

    if (selectedColumns.size === 0) {
      alert("Please select at least one column to export.");
      return;
    }

    try {
      setExportLoading(true);

      const filters: any = {};
      if (status && status !== "All Statuses") filters.status = status;
      if (kycStatus && kycStatus !== "All KYC Statuses") filters.kycStatus = kycStatus;
      if (paymentStatus && paymentStatus !== "All Payment Statuses") filters.paymentStatus = paymentStatus;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      const columns = Array.from(selectedColumns)
        .map((col) => COLUMN_MAPPINGS[col])
        .filter(Boolean);

      const payload = {
        filters,
        columns,
        format,
        reason
      };

      const blob = await driversApi.exportDrivers(payload);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `drivers-export-${dateStr}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Reset reason and refresh history
      setReason("");
      fetchHistory();
      
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export drivers.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      <PageHeader title="Export Drivers" variant="light" />
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                  Status
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={selectStyle}
                  >
                    {["All Statuses", "Active", "Suspended", "Pending"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={chevronStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                  KYC Status
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={kycStatus}
                    onChange={(e) => setKycStatus(e.target.value)}
                    style={selectStyle}
                  >
                    {["All KYC Statuses", "Verified", "Pending", "Rejected"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={chevronStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                  Agreement Status
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={agreementStatus}
                    onChange={(e) => setAgreementStatus(e.target.value)}
                    style={selectStyle}
                  >
                    {["All Agreement Statuses", "Active Agreement", "Completed", "No Agreement"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={chevronStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                  Payment Status
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    style={selectStyle}
                  >
                    {["All Payment Statuses", "Current", "Overdue", "No Payment"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={chevronStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                  Date Joined From
                </label>
                <div style={{ position: "relative" }}>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                  Date Joined To
                </label>
                <div style={{ position: "relative" }}>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

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
                  onClick={selectAll}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: COLORS.PRIMARY_MAIN,
                    padding: "0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_SECONDARY,
                    padding: "0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer"
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
                  cols: ["First Name", "Last Name", "Email", "Phone", "Date of Birth", "Address"],
                },
                {
                  title: "System Information",
                  cols: ["Driver ID", "KYC Status", "Account Status", "Date Joined", "Last Login"],
                },
                {
                  title: "Documents & Compliance",
                  cols: ["Licence Number", "Licence Expiry", "Visa Expiry", "ABN", "Payment Status"],
                },
              ].map((section, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                        checked={selectedColumns.has(col)}
                        onChange={() => toggleColumn(col)}
                        style={{
                          width: "14px",
                          height: "14px",
                          accentColor: COLORS.PRIMARY_MAIN,
                        }}
                      />
                      {col}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

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
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  style={{
                    marginTop: "3px",
                    width: "16px",
                    height: "16px",
                    accentColor: COLORS.PRIMARY_MAIN,
                  }}
                />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>CSV</p>
                  <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>
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
                  checked={format === "xlsx"}
                  onChange={() => setFormat("xlsx")}
                  style={{
                    marginTop: "3px",
                    width: "16px",
                    height: "16px",
                    accentColor: COLORS.PRIMARY_MAIN,
                  }}
                />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>XLSX</p>
                  <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>
                    Excel spreadsheet
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button
              onClick={handleExport}
              disabled={exportLoading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: exportLoading ? COLORS.TEXT_MUTED : COLORS.PRIMARY_MAIN,
                color: COLORS.BG_CARD,
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                width: "100%",
                cursor: exportLoading ? "not-allowed" : "pointer",
                border: "none",
              }}
            >
              <Download size={16} />
              {exportLoading ? "Generating..." : "Generate & Download Export"}
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

      <div className="card" style={{ padding: "15px", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem 0.75rem 1.25rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>
            Recent Export History
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
             <div style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
               Loading history...
             </div>
          ) : !Array.isArray(history) ? (
             <div style={{ padding: "2rem", textAlign: "left", color: COLORS.TEXT_MUTED }}>
               <pre style={{ fontSize: '11px', whiteSpace: 'pre-wrap' }}>Debug Data: {JSON.stringify(history, null, 2)}</pre>
             </div>
          ) : history.length === 0 ? (
             <div style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
               No export history found.
             </div>
          ) : (
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
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Exported By</th>
                  <th style={thStyle}>Records</th>
                  <th style={thStyle}>Format</th>
                  <th style={thStyle}>Reason</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
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
                    <td style={tdStyle}>{formatDate(item.createdAt, { hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>
                      {item.exportedBy?.name || "Admin"}
                    </td>
                    <td style={tdStyle}>{item.recordsCount || "-"}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {(item.format || "CSV").toUpperCase()}
                    </td>
                    <td style={{ ...tdStyle, color: COLORS.TEXT_SECONDARY }}>
                      {item.reason || "-"}
                    </td>
                    <td style={tdStyle}>
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
                            background: "transparent",
                            border: "none",
                            cursor: "pointer"
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
                            background: "transparent",
                            border: "none",
                            cursor: "pointer"
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
          )}
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

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 10px",
  borderRadius: "6px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  appearance: "none",
  background: COLORS.BG_CARD,
  fontSize: "0.8rem",
};

const chevronStyle: React.CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: COLORS.TEXT_MUTED,
};

const thStyle: React.CSSProperties = {
  padding: "0.6rem 1.25rem",
  fontSize: "0.65rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontSize: "0.8rem",
  color: COLORS.TEXT_SECONDARY,
};
