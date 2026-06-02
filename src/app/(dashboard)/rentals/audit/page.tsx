"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  History,
  MessageSquare,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Plus,
  Clock,
  User,
  Activity,
  Eye,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";

export default function AdminNotesAudit() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Admin Notes & Audit");
  const [search, setSearch] = useState("");

  const tabs = [
    { name: "Rentals Management", path: "/rentals" },
    { name: "Agreements", path: "/rentals/agreements" },
    { name: "Disputes & Refunds", path: "/rentals/disputes" },
    { name: "Admin Notes & Audit", path: "/rentals/audit" },
  ];

  const summaryStats = [
    { label: "Total Entries", value: "1,847", color: "#111827" },
    { label: "Last 24 Hours", value: "23", color: COLORS.PRIMARY_MAIN },
    { label: "Manual Notes", value: "156", color: COLORS.WARNING_MAIN },
    { label: "System Events", value: "1,691", color: COLORS.SUCCESS_MAIN },
  ];

  const auditData = [
    {
      timestamp: "2024-04-21 08:30:15",
      entityType: "Rental",
      entityId: "REN-2024-001",
      actionType: "Manual Note",
      adminUser: "John Admin",
      description: "Added internal note regarding late return penalty waiver.",
      outcome: "Success",
    },
    {
      timestamp: "2024-04-21 07:45:22",
      entityType: "Agreement",
      entityId: "AGR-2024-055",
      actionType: "Status Change",
      adminUser: "Sarah Manager",
      description: "Approved extension for agreement duration.",
      outcome: "Success",
    },
    {
      timestamp: "2024-04-21 06:12:05",
      entityType: "Dispute",
      entityId: "DISP-2024-012",
      actionType: "System Event",
      adminUser: "System",
      description: "Automated verification of refund eligibility completed.",
      outcome: "Success",
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Admin Notes & Audit"
        searchValue={search}
        onSearchChange={setSearch}
        notificationCount={3}
      />

      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          Dashboard
        </p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            cursor: "pointer",
          }}
          onClick={() => router.push("/rentals")}
        >
          Rentals
        </p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Admin Notes & Audit
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Add Internal Note */}
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: COLORS.INFO_LIGHT,
                borderRadius: "8px",
                color: COLORS.PRIMARY_MAIN,
              }}
            >
              <FileText size={20} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Add Internal Note
            </h3>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B7280",
              marginBottom: "1.5rem",
            }}
          >
            Link a manual note or observation to any rental, agreement, or case
            record
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <SelectField
              label="Entity Type"
              options={[
                { label: "Select Type", value: "Select Type" },
                { label: "Rental", value: "Rental" },
                { label: "Agreement", value: "Agreement" },
                { label: "Dispute", value: "Dispute" },
              ]}
            />

            <div>
              <label style={labelStyle}>Entity ID</label>
              <input
                type="text"
                placeholder="Enter Rental/Agreement/Case ID"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Note Content</label>
              <textarea
                placeholder="Enter internal note or observation..."
                style={{
                  ...inputStyle,
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </div>

            <Button style={{ width: "100%", marginTop: "0.5rem" }}>
              <Plus size={18} />
              <span>Add Note</span>
            </Button>
          </div>
        </Card>

        {/* Audit Trail Summary */}
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: COLORS.INFO_LIGHT,
                borderRadius: "8px",
                color: COLORS.PRIMARY_MAIN,
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Audit Trail Summary
            </h3>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B7280",
              marginBottom: "1.5rem",
            }}
          >
            Immutable log of all administrative interventions across the
            platform
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {summaryStats.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "1.25rem",
                  background: "#F9FAFB",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Audit Trail & Intervention History Table Card */}
      <Card padding="0">
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #E5E7EB" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                Audit Trail & Intervention History
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                Search and review all administrative actions across rentals,
                agreements, and cases
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download size={16} />
              <span>Export Log</span>
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <SelectField
              label="Entity Type"
              options={[
                { label: "All Types", value: "All Types" },
                { label: "Rental", value: "Rental" },
                { label: "Agreement", value: "Agreement" },
                { label: "Dispute", value: "Dispute" },
              ]}
            />
            <div>
              <label style={labelStyle}>Entity ID</label>
              <input
                type="text"
                placeholder="Search ID..."
                style={inputStyle}
              />
            </div>
            <SelectField
              label="Admin User"
              options={[
                { label: "All Admins", value: "All Admins" },
                { label: "Super Admin", value: "Super Admin" },
                { label: "Admin User 1", value: "Admin User 1" },
                { label: "Admin User 2", value: "Admin User 2" },
              ]}
            />
            <SelectField
              label="Action Type"
              options={[
                { label: "All Actions", value: "All Actions" },
                { label: "Manual Note", value: "Manual Note" },
                { label: "Approval/Rejection", value: "Approval/Rejection" },
                { label: "Status Change", value: "Status Change" },
                { label: "Refund Issued", value: "Refund Issued" },
                { label: "Dispute Resolved", value: "Dispute Resolved" },
                { label: "Agreement Cancelled", value: "Agreement Cancelled" },
              ]}
            />
            <div>
              <label style={labelStyle}>Date From</label>
              <input type="date" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date To</label>
              <input type="date" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <Button size="sm">
              <Filter size={16} />
              <span>Apply Filters</span>
            </Button>
            <Button variant="outline" size="sm">
              <History size={16} />
              <span>Reset</span>
            </Button>
          </div>
        </div>

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
                  "TIMESTAMP",
                  "ENTITY TYPE",
                  "ENTITY ID",
                  "ACTION TYPE",
                  "ADMIN USER",
                  "DESCRIPTION",
                  "OUTCOME",
                  "ACTIONS",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6B7280",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditData.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#6B7280",
                      textAlign: "center",
                    }}
                  >
                    {row.timestamp}
                  </td>
                  <td
                    style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem" }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: COLORS.PRIMARY_LIGHT,
                        color: COLORS.INFO_DARK,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {row.entityType}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#111827",
                      textAlign: "center",
                    }}
                  >
                    {row.entityId}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#374151",
                      textAlign: "center",
                    }}
                  >
                    {row.actionType}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#111827",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    {row.adminUser}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#6B7280",
                      maxWidth: "300px",
                      textAlign: "center",
                    }}
                  >
                    {row.description}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ color: COLORS.SUCCESS_MAIN, fontWeight: 600 }}
                    >
                      {row.outcome}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    <button style={{ color: "#9CA3AF" }}>
                      <Eye size={18} color="#2563eb" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
