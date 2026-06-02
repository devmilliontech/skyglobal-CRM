"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Plus,
  Bell,
  ClipboardList,
  AlertTriangle,
  RotateCcw,
  Clock,
  Filter,
  Download,
  MoreHorizontal,
  ChevronRight,
  Eye,
  FileText,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import SelectField from "@/components/SelectField";

export default function DisputesAndRefunds() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Disputes & Refunds");
  const [subTab, setSubTab] = useState("Disputes");

  const tabs = [
    { name: "Rentals Management", path: "/rentals" },
    { name: "Agreements", path: "/rentals/agreements" },
    { name: "Disputes & Refunds", path: "/rentals/disputes" },
    { name: "Admin Notes & Audit", path: "/rentals/audit" },
  ];

  const topStats = [
    {
      title: "Total Cases",
      value: "47",
      badge: "All disputes & refunds",
      icon: <ClipboardList size={20} color="#6B7280" />,
      valueColor: "#111827",
    },
    {
      title: "Active Disputes",
      value: "18",
      badge: "Pending resolution",
      icon: <AlertTriangle size={20} color={COLORS.WARNING_MAIN} />,
      valueColor: COLORS.WARNING_MAIN,
    },
    {
      title: "Refund Requests",
      value: "12",
      badge: "Awaiting approval",
      icon: <RotateCcw size={20} color={COLORS.PRIMARY_MAIN} />,
      valueColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "SLA Critical",
      value: "5",
      badge: "Exceeding 48 hours",
      icon: <Clock size={20} color={COLORS.ERROR_MAIN} />,
      valueColor: COLORS.ERROR_MAIN,
    },
  ];

  const casesData = [
    {
      id: "DSP-2024-018",
      type: "Dispute",
      rentalId: "RNT-2024-145",
      driver: "John Doe",
      owner: "Fleet Owner A",
      vehicle: "ABC-1234",
      amount: "$1,250.00",
      ageHours: "52 hrs",
      slaStatus: "Critical",
      status: "Escalated",
    },
    {
      id: "DSP-2024-017",
      type: "Dispute",
      rentalId: "AGR-2024-089",
      driver: "Sarah Smith",
      owner: "Fleet Owner B",
      vehicle: "XYZ-5678",
      amount: "$850.00",
      ageHours: "28 hrs",
      slaStatus: "Normal",
      status: "Under Review",
    },
    {
      id: "DSP-2024-016",
      type: "Dispute",
      rentalId: "RNT-2024-132",
      driver: "Mike Johnson",
      owner: "Fleet Owner C",
      vehicle: "DEF-9012",
      amount: "$2,100.00",
      ageHours: "8 hrs",
      slaStatus: "New",
      status: "Pending Evidence",
    },
    {
      id: "DSP-2024-015",
      type: "Dispute",
      rentalId: "AGR-2024-076",
      driver: "Emma Davis",
      owner: "Fleet Owner A",
      vehicle: "GHI-3456",
      amount: "$950.00",
      ageHours: "65 hrs",
      slaStatus: "Critical",
      status: "Escalated",
    },
  ];

  const inputStyle = {
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
    background: "#F9FAFB",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: "0.4rem",
    display: "block",
  };

  const statusColors: any = {
    Escalated: { bg: COLORS.ERROR_LIGHT, text: COLORS.ERROR_MAIN },
    "Under Review": { bg: "#FEF3C7", text: COLORS.WARNING_MAIN },
    "Pending Evidence": { bg: COLORS.INFO_LIGHT, text: COLORS.PRIMARY_MAIN },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Header section */}
      <PageHeader title="Disputes & Refunds" />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Disputes & Refunds" },
        ]}
      />

      <div
        style={{
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {topStats.map((stat, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                background: COLORS.BG_CARD,
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#4B5563",
                      fontWeight: 500,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {stat.title}
                  </p>
                  <p
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: stat.valueColor,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div>{stat.icon}</div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    fontWeight: 500,
                  }}
                >
                  {stat.badge}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Sub-tabs */}
        <div
          style={{
            background: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setSubTab("Disputes")}
              style={{
                padding: "0.5rem 0",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: subTab === "Disputes" ? "#2563EB" : "#6B7280",
                borderBottom:
                  subTab === "Disputes"
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Disputes{" "}
              <span
                style={{
                  background: subTab === "Disputes" ? "#DBEAFE" : "#F3F4F6",
                  color: subTab === "Disputes" ? "#2563EB" : "#6B7280",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                }}
              >
                18
              </span>
            </button>
            <button
              onClick={() => setSubTab("Refunds")}
              style={{
                padding: "0.5rem 0",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: subTab === "Refunds" ? "#2563EB" : "#6B7280",
                borderBottom:
                  subTab === "Refunds"
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Refunds{" "}
              <span
                style={{
                  background: subTab === "Refunds" ? "#DBEAFE" : "#F3F4F6",
                  color: subTab === "Refunds" ? "#2563EB" : "#6B7280",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                }}
              >
                12
              </span>
            </button>
            <button
              onClick={() => setSubTab("Resolved")}
              style={{
                padding: "0.5rem 0",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: subTab === "Resolved" ? "#2563EB" : "#6B7280",
                borderBottom:
                  subTab === "Resolved"
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Resolved{" "}
              <span
                style={{
                  background: subTab === "Resolved" ? "#DBEAFE" : "#F3F4F6",
                  color: subTab === "Resolved" ? "#2563EB" : "#6B7280",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                }}
              >
                17
              </span>
            </button>
          </div>

          <div
            style={{
              background: COLORS.BG_CARD,
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-end",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label style={labelStyle}>Rental/Agreement ID</label>
                  <input
                    type="text"
                    placeholder="Search ID..."
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <SelectField
                    label="All Drivers"
                    options={[
                      { label: "All Drivers", value: "All Drivers" },
                      { label: "John Doe", value: "John Doe" },
                      { label: "Sarah Smith", value: "Sarah Smith" },
                    ]}
                  />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <SelectField
                    label="All Owners"
                    options={[
                      { label: "All Owners", value: "All Owners" },
                      { label: "Fleet Owner A", value: "Fleet Owner A" },
                      { label: "Fleet Owner B", value: "Fleet Owner B" },
                    ]}
                  />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label style={labelStyle}>Vehicle</label>
                  <input
                    type="text"
                    placeholder="Reg. number..."
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <SelectField
                    label="All Status"
                    options={[
                      { label: "New", value: "New" },
                      { label: "Under Review", value: "Under Review" },
                      { label: "Pending Evidence", value: "Pending Evidence" },
                      { label: "Escalated", value: "Escalated" },
                    ]}
                  />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label style={labelStyle}>Date Range</label>
                  <input type="date" style={inputStyle} />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  style={{
                    background: COLORS.PRIMARY_MAIN,
                    color: COLORS.BG_CARD,
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  <Filter size={16} />
                  <span>Apply Filters</span>
                </button>
                <button
                  style={{
                    background: COLORS.BG_CARD,
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>
              <button
                style={{
                  background: COLORS.BG_CARD,
                  color: "#4B5563",
                  border: "1px solid #E5E7EB",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <Download size={16} />
                <span>Export Cases</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div
          className="card"
          style={{
            padding: "0",
            overflow: "hidden",
            background: COLORS.BG_CARD,
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {[
                    "CASE ID",
                    "TYPE",
                    "RENTAL/AGREEMENT",
                    "DRIVER",
                    "OWNER",
                    "VEHICLE",
                    "AMOUNT",
                    "AGE/SLA",
                    "STATUS",
                    "ACTIONS",
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {casesData.map((caseItem, i) => (
                  <tr
                    key={i}
                    onClick={() =>
                      router.push(`/rentals/disputes/${caseItem.id}`)
                    }
                    style={{
                      borderBottom: "1px solid #E5E7EB",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#F9FAFB")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.PRIMARY_MAIN,
                      }}
                    >
                      {caseItem.id}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          backgroundColor: "#FEF3C7",
                          color: "#D97706",
                        }}
                      >
                        {caseItem.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontSize: "0.85rem",
                        color: "#111827",
                      }}
                    >
                      {caseItem.rentalId}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontSize: "0.85rem",
                        color: "#111827",
                      }}
                    >
                      {caseItem.driver}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontSize: "0.85rem",
                        color: "#6B7280",
                      }}
                    >
                      {caseItem.owner}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontSize: "0.85rem",
                        color: "#6B7280",
                      }}
                    >
                      {caseItem.vehicle}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {caseItem.amount}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color:
                              caseItem.slaStatus === "Critical"
                                ? "#EF4444"
                                : "#D97706",
                          }}
                        >
                          {caseItem.ageHours}
                        </span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color:
                              caseItem.slaStatus === "Critical"
                                ? "#EF4444"
                                : "#6B7280",
                          }}
                        >
                          {caseItem.slaStatus}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          backgroundColor:
                            statusColors[caseItem.status]?.bg || "#F3F4F6",
                          color:
                            statusColors[caseItem.status]?.text || "#6B7280",
                        }}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Eye
                          size={16}
                          color={COLORS.PRIMARY_MAIN}
                          style={{ cursor: "pointer" }}
                        />
                        <FileText
                          size={16}
                          color={COLORS.SUCCESS_MAIN}
                          style={{ cursor: "pointer" }}
                        />
                        <User
                          size={16}
                          color={COLORS.SUCCESS_MAIN}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
