"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import { Edit2, Trash2, Check, Info, AlertTriangle } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "./SelectField";

export default function ReportsAndData() {
  const [form, setForm] = useState({
    maxExportRecords: "10000",
    exportFrequency: "5_per_hour",
    vehicleDataScope: "all_roles",
    financialDataScope: "super_admin_finance",
    userRecordsScope: "super_admin",
    userPersonalDataScope: "super_admin",
    operationalDataScope: "all_roles",
    activeRentalData: "1_year",
    completedRentalData: "5_years",
    communicationRecords: "1_year",
    userAccountData: "2_years",
    vehicleHistoryData: "5_years",
    auditLogs: "3_years",
    financialRecords: "5_years",
    deletedUserData: "30_days",
    // Checkbox arrays
    exportFormats: ["CSV (Comma Separated Values)", "Excel (.xlsx)"],
    sensitiveDataHandling: [
      "Mask personal identifiers (PII)",
      "Exclude payment details",
    ],
    emailExportOptions: ["Email export to user"],
    complianceAutomation: [] as string[],
    // Report schedules
    reportSchedules: {
      "Financial Summary": "daily",
      "Vehicle Performance": "weekly",
      "Compliance Audit": "monthly",
      "Customer Analytics": "weekly",
    } as Record<string, string>,
  });

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const toggleArrayField = (key: keyof typeof form, value: string) => {
    const current = form[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setForm((prev) => ({ ...prev, [key]: updated }));
  };

  const setReportSchedule = (reportName: string, schedule: string) => {
    setForm((prev) => ({
      ...prev,
      reportSchedules: { ...prev.reportSchedules, [reportName]: schedule },
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Report Configuration */}
      <Card padding="0">
        <div
          style={{
            padding: "2rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
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
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Report Configuration
              </h2>
              <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
                Configure available reports, scheduling, and access permissions
              </p>
            </div>
            <Button size="lg" variant="primary">
              + Add Report
            </Button>
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
              <th
                style={{
                  padding: "1rem 2rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Report Name
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Auto Schedule
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Access Roles
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "1rem 2rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  textAlign: "right",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Financial Summary",
                desc: "Revenue, expenses, commissions",
                category: "Financial",
                schedule: "Daily",
                roles: [
                  { label: "Super Admin", variant: "primary" },
                  { label: "Finance", variant: "default" },
                ],
                status: "Active",
              },
              {
                name: "Vehicle Performance",
                desc: "Utilization, earnings, maintenance",
                category: "Operational",
                schedule: "Weekly",
                roles: [
                  { label: "Super Admin", variant: "primary" },
                  { label: "Operations", variant: "default" },
                ],
                status: "Active",
              },
              {
                name: "Compliance Audit",
                desc: "Document status, expiry tracking",
                category: "Compliance",
                schedule: "Monthly",
                roles: [
                  { label: "Super Admin", variant: "primary" },
                  { label: "Compliance", variant: "default" },
                ],
                status: "Inactive",
              },
              {
                name: "Customer Analytics",
                desc: "User behavior, booking patterns",
                category: "Analytics",
                schedule: "Weekly",
                roles: [
                  { label: "Super Admin", variant: "primary" },
                  { label: "Marketing", variant: "default" },
                ],
                status: "Active",
              },
            ].map((row, idx, arr) => (
              <tr
                key={idx}
                style={{
                  borderBottom:
                    idx === arr.length - 1
                      ? "none"
                      : `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <td style={{ padding: "1rem 2rem" }}>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {row.name}
                  </p>
                  <p
                    style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
                  >
                    {row.desc}
                  </p>
                </td>
                <td
                  style={{
                    padding: "1rem",
                    fontSize: "0.9rem",
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {row.category}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <SelectField
                    options={[
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Quarterly", value: "quarterly" },
                    ]}
                    placeholder={row.schedule}
                    value=""
                    onChange={() => {}}
                  />
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {row.roles.map((role, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "9999px",
                          backgroundColor:
                            role.variant === "primary" ? "#EFF6FF" : "#F3F4F6",
                          color:
                            role.variant === "primary"
                              ? COLORS.PRIMARY_MAIN
                              : COLORS.TEXT_SECONDARY,
                          fontWeight: 600,
                        }}
                      >
                        {role.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: row.status === "Active" ? "#10B981" : "#F59E0B",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 2rem", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.75rem",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: COLORS.PRIMARY_MAIN,
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9CA3AF",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Data Export Settings */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Data Export Settings
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure export formats, data scopes, and access permissions
          </p>
        </div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Left Column */}
          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1rem",
              }}
            >
              Allowed Export Formats
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                { label: "CSV (Comma Separated Values)", checked: true },
                { label: "Excel (.xlsx)", checked: true },
                { label: "PDF Document (.pdf)", checked: false },
                { label: "JSON (API Integration)", checked: false },
              ].map((format, idx) => (
                <label
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      border: `1px solid ${format.checked ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                      backgroundColor: format.checked
                        ? COLORS.PRIMARY_MAIN
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {format.checked && <Check size={12} color="#fff" />}
                  </div>
                  <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                    {format.label}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Maximum Export Records
              </h4>
              <SelectField
                options={[
                  { label: "1,000 records", value: "1000" },
                  { label: "5,000 records", value: "5000" },
                  { label: "10,000 records", value: "10000" },
                  { label: "50,000 records", value: "50000" },
                ]}
                onChange={setField("maxExportRecords")}
                placeholder="10,000 records"
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Export Frequency Limit
              </h4>
              <SelectField
                options={[
                  { label: "1 per hour", value: "1_per_hour" },
                  { label: "5 per hour", value: "5_per_hour" },
                  { label: "10 per hour", value: "10_per_hour" },
                  { label: "Unlimited", value: "unlimited" },
                ]}
                onChange={setField("exportFrequency")}
                placeholder="5 per hour"
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "1rem",
                }}
              >
                Sensitive Data Handling
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  { label: "Mask personal identifiers (PII)", checked: true },
                  { label: "Exclude payment details", checked: true },
                  { label: "Watermark exports", checked: false },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                        border: `1px solid ${item.checked ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                        backgroundColor: item.checked
                          ? COLORS.PRIMARY_MAIN
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.checked && <Check size={12} color="#fff" />}
                    </div>
                    <span
                      style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1rem",
              }}
            >
              Data Scope Access
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.35rem",
                  }}
                >
                  Vehicle Data
                </p>
                <SelectField
                  options={[
                    { label: "All Roles", value: "all_roles" },
                    { label: "Super Admin Only", value: "super_admin" },
                    {
                      label: "Super Admin, Finance",
                      value: "super_admin_finance",
                    },
                  ]}
                  onChange={setField("vehicleDataScope")}
                  placeholder="All Roles"
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.35rem",
                  }}
                >
                  Financial Data
                </p>
                <SelectField
                  options={[
                    { label: "All Roles", value: "all_roles" },
                    { label: "Super Admin Only", value: "super_admin" },
                    {
                      label: "Super Admin, Finance",
                      value: "super_admin_finance",
                    },
                  ]}
                  onChange={setField("financialDataScope")}
                  placeholder="Super Admin, Finance"
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.35rem",
                  }}
                >
                  User Records
                </p>
                <SelectField
                  options={[
                    { label: "All Roles", value: "all_roles" },
                    { label: "Super Admin Only", value: "super_admin" },
                    {
                      label: "Super Admin, Finance",
                      value: "super_admin_finance",
                    },
                  ]}
                  onChange={setField("userRecordsScope")}
                  placeholder="Super Admin Only"
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.35rem",
                  }}
                >
                  User Personal Data
                </p>
                <SelectField
                  options={[
                    { label: "All Roles", value: "all_roles" },
                    { label: "Super Admin Only", value: "super_admin" },
                    {
                      label: "Super Admin, Finance",
                      value: "super_admin_finance",
                    },
                  ]}
                  onChange={setField("userPersonalDataScope")}
                  placeholder="Super Admin Only"
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.35rem",
                  }}
                >
                  Operational Data
                </p>
                <SelectField
                  options={[
                    { label: "All Roles", value: "all_roles" },
                    { label: "Super Admin Only", value: "super_admin" },
                    {
                      label: "Super Admin, Finance",
                      value: "super_admin_finance",
                    },
                  ]}
                  onChange={setField("operationalDataScope")}
                  placeholder="All Roles"
                />
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "1rem",
                }}
              >
                Export Audit Trail
              </h4>
              <div
                style={{
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  gap: "0.75rem",
                }}
              >
                <div style={{ color: COLORS.PRIMARY_MAIN, marginTop: "2px" }}>
                  <Info size={16} />
                </div>
                <div>
                  <h5
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#1E3A8A",
                      marginBottom: "0.25rem",
                    }}
                  >
                    All exports are logged
                  </h5>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#1E40AF",
                      lineHeight: "1.4",
                    }}
                  >
                    Export activities are tracked with user, timestamp, data
                    scope, and format for compliance and security auditing.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "1rem",
                }}
              >
                Email Export Options
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  { label: "Email export to user", checked: true },
                  { label: "Notify admin on large exports", checked: false },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                        border: `1px solid ${item.checked ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                        backgroundColor: item.checked
                          ? COLORS.PRIMARY_MAIN
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.checked && <Check size={12} color="#fff" />}
                    </div>
                    <span
                      style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Retention Policy */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Data Retention Policy
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure data retention periods and compliance settings
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: "8px",
            padding: "1rem",
            display: "flex",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ color: "#D97706", marginTop: "2px" }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h5
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#92400E",
                marginBottom: "0.25rem",
              }}
            >
              Warning: Retention Policy Changes
            </h5>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#92400E",
                lineHeight: "1.4",
              }}
            >
              Modifying retention policies may result in permanent data
              deletion. Ensure compliance with legal and regulatory requirements
              before making changes.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Left Column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Active Rental Data
              </h4>
              <SelectField
                options={[
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("activeRentalData")}
                placeholder="1 year"
              />
            </div>
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Completed Rental Data
              </h4>
              <SelectField
                options={[
                  { label: "6 months", value: "6_months" },
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("completedRentalData")}
                placeholder="5 years"
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Communication Records
              </h4>
              <SelectField
                options={[
                  { label: "6 months", value: "6_months" },
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("communicationRecords")}
                placeholder="1 year"
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                User Account Data(Inactive)
              </h4>
              <SelectField
                options={[
                  { label: "6 months", value: "6_months" },
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("userAccountData")}
                placeholder="2 years"
              />
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Vehicle History Data
              </h4>
              <SelectField
                options={[
                  { label: "6 months", value: "6_months" },
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("vehicleHistoryData")}
                placeholder="5 years"
              />
            </div>
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Audit Logs
              </h4>
              <SelectField
                options={[
                  { label: "6 months", value: "6_months" },
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("auditLogs")}
                placeholder="3 years"
              />
            </div>
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Financial Records
              </h4>
              <SelectField
                options={[
                  { label: "6 months", value: "6_months" },
                  { label: "1 year", value: "1_year" },
                  { label: "2 years", value: "2_years" },
                  { label: "3 years", value: "3_years" },
                ]}
                onChange={setField("financialRecords")}
                placeholder="5 years"
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.5rem",
                }}
              >
                Deleted User Data(Soft Delete)
              </h4>
              <SelectField
                options={[
                  { label: "7 Days", value: "7_days" },
                  { label: "1 month", value: "1_month" },
                  { label: "2 months", value: "2_months" },
                  { label: "3 months", value: "3_months" },
                ]}
                onChange={setField("deletedUserData")}
                placeholder="30 days"
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Compliance & Automation
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <input type="checkbox" />
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
              Automatic data purge on retention expiry
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <input type="checkbox" />
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
              Email notification before data purge (7 days)
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <input type="checkbox" />
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
              Require admin approval for purge
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <input type="checkbox" />
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
              GDPR compliance mode (right to be forgotten)
            </p>
          </div>
        </div>
      </Card>

      <div
        style={{
          height: "1px",
          background: COLORS.GRAY_300,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.5rem",
            marginTop: "2rem",
          }}
        >
          <button
            style={{
              padding: "0.5rem 1rem",
              border: `1px solid ${COLORS.GRAY_300}`,
              borderRadius: "0.5rem",
              cursor: "pointer",
              color: COLORS.GRAY_600,
            }}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              background: COLORS.PRIMARY_MAIN,
              border: "none",
              borderRadius: "0.5rem",
              color: COLORS.TEXT_INVERSE,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
