"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Users,
  Clock,
  DollarSign,
  PieChart,
  Download,
  FileText,
  Mail,
  Bookmark,
  Eye,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import { reportsApi } from "@/services/api/reports";

const SUB_TABS = [
  "Rent & Rent-to-Own Overdue Report",
  "Insurance Overdue Report",
];

export default function OverdueReportsDetail({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [activeSubTab, setActiveSubTab] = useState(SUB_TABS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchOverdueReports = async () => {
      try {
        setIsLoading(true);
        const response = await reportsApi.getOverdueReports();
        if (response?.data) {
          setReportData(response.data);
        }
      } catch (err) {
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverdueReports();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!hideHeader && (
        <PageHeader
          title="Overdue Reports"
          description="Monitor overdue payments and compliance issues"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* Overdue Ageing */}
        <Card padding="1.25rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Overdue Ageing
            </span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {[
              { label: "0-30 days", count: 18 },
              { label: "31-60 days", count: 8 },
              { label: "60+ days", count: 6 },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: COLORS.TEXT_SECONDARY }}>
                  {item.label}
                </span>
                <span style={{ fontWeight: 700, color: COLORS.TEXT_MAIN }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Overdue Drivers */}
        <Card padding="1.25rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Overdue Drivers
            </span>
            <Users size={18} color="#EF4444" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <h3
              style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827" }}
            >
              24
            </h3>
            <span
              style={{ fontSize: "0.75rem", color: "#EF4444", fontWeight: 600 }}
            >
              +3 since yesterday
            </span>
          </div>
        </Card>

        {/* Total Outstanding */}
        <Card padding="1.25rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Total Outstanding
            </span>
            <DollarSign size={18} color="#F59E0B" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <h3
              style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827" }}
            >
              £45,280
            </h3>
            <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
              Across all accounts
            </span>
          </div>
        </Card>

        {/* By Agreement Type */}
        <Card padding="1.25rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              By Agreement Type
            </span>
            <PieChart size={18} color="#3B82F6" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {[
              { label: "Rent", amount: "£28K" },
              { label: "Rent-to-Own", amount: "£17K" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: COLORS.TEXT_SECONDARY }}>
                  {item.label}
                </span>
                <span style={{ fontWeight: 700, color: COLORS.TEXT_MAIN }}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card padding="1.25rem">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr)) 100px",
            gap: "1rem",
            alignItems: "flex-end",
          }}
        >
          <SelectField
            label="Period"
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Weekly", value: "weekly" },
              { label: "Daily", value: "daily" },
            ]}
          />
          <SelectField
            label="Driver"
            options={[
              { label: "All Drivers", value: "all" },
              { label: "Active", value: "active" },
              { label: "Overdue", value: "overdue" },
            ]}
          />
          <SelectField
            label="Vehicle"
            options={[
              { label: "All Vehicles", value: "all" },
              { label: "Rentals", value: "rentals" },
              { label: "Fleet", value: "fleet" },
            ]}
          />
          <SelectField
            label="Agreement Type"
            options={[
              { label: "All Types", value: "all" },
              { label: "Rent", value: "rent" },
              { label: "Rent-to-Own", value: "rent_to_own" },
            ]}
          />
          <SelectField
            label="Owner"
            options={[
              { label: "All Owners", value: "all" },
              { label: "Direct", value: "direct" },
              { label: "Lease", value: "lease" },
            ]}
          />
          <Button variant="primary" size="lg">
            Apply
          </Button>
        </div>
      </Card>

      {/* Sub Tabs & Export Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#F3F4F6",
            padding: "4px",
            borderRadius: "8px",
            gap: "4px",
          }}
        >
          {SUB_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: activeSubTab === tab ? 600 : 500,
                cursor: "pointer",
                border: "none",
                backgroundColor: activeSubTab === tab ? "#fff" : "transparent",
                color:
                  activeSubTab === tab
                    ? COLORS.PRIMARY_MAIN
                    : COLORS.TEXT_SECONDARY,
                boxShadow:
                  activeSubTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            variant="secondary"
            size="md"
            style={{
              backgroundColor: "#10B981",
              color: "#fff",
              borderColor: "#10B981",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Download size={16} /> CSV
          </Button>
          <Button
            variant="secondary"
            size="md"
            style={{
              backgroundColor: "#EF4444",
              color: "#fff",
              borderColor: "#EF4444",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Download size={16} /> PDF
          </Button>
          <Button
            variant="secondary"
            size="md"
            style={{
              backgroundColor: "#10B981",
              color: "#fff",
              borderColor: "#10B981",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Download size={16} /> Excel
          </Button>
          <div
            style={{
              width: "1px",
              backgroundColor: "#E5E7EB",
              height: "30px",
              margin: "0 0.5rem",
            }}
          />
          <Button
            variant="primary"
            size="md"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Bookmark size={16} /> Save Preset
          </Button>
          <Button
            variant="secondary"
            size="md"
            style={{
              backgroundColor: "#F59E0B",
              color: "#fff",
              borderColor: "#F59E0B",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Mail size={16} /> Schedule Email
          </Button>
        </div>
      </div>

      {/* Report Table */}
      <Card padding="0">
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
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                backgroundColor: "#F9FAFB",
              }}
            >
              <th style={headerCellStyle}>Vehicle</th>
              <th style={headerCellStyle}>Outstanding Installments</th>
              <th style={headerCellStyle}>Total Outstanding</th>
              <th style={headerCellStyle}>Driver</th>
              <th style={{ ...headerCellStyle, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                vehicle: "BMW X5",
                reg: "ABC123",
                overdueCount: 3,
                amount: "£2,450",
                driver: "John Smith",
                avatar:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
              },
              {
                vehicle: "Audi A4",
                reg: "XYZ789",
                overdueCount: 2,
                amount: "£1,850",
                driver: "Sarah Johnson",
                avatar:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
              },
              {
                vehicle: "Mercedes C-Class",
                reg: "DEF456",
                overdueCount: 5,
                amount: "£3,200",
                driver: "Mike Wilson",
                avatar:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
              },
            ].map((row, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
              >
                <td style={bodyCellStyle}>
                  <p
                    style={{
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                  >
                    {row.vehicle}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: COLORS.TEXT_MUTED,
                      margin: 0,
                    }}
                  >
                    {row.reg}
                  </p>
                </td>
                <td style={bodyCellStyle}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: "#FEE2E2",
                      color: "#EF4444",
                      fontWeight: 600,
                    }}
                  >
                    {row.overdueCount} overdue
                  </span>
                </td>
                <td
                  style={{
                    ...bodyCellStyle,
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {row.amount}
                </td>
                <td style={bodyCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img
                      src={row.avatar}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{ fontSize: "0.85rem", color: COLORS.TEXT_MAIN }}
                    >
                      {row.driver}
                    </span>
                  </div>
                </td>
                <td style={{ ...bodyCellStyle, textAlign: "right" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: COLORS.PRIMARY_MAIN,
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#F9FAFB", fontWeight: 700 }}>
              <td style={bodyCellStyle}>Total (3 vehicles)</td>
              <td style={bodyCellStyle}>10 installments</td>
              <td style={bodyCellStyle}>£7,500</td>
              <td style={bodyCellStyle}>3 drivers</td>
              <td style={bodyCellStyle}></td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}

const headerCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
};

const bodyCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};
