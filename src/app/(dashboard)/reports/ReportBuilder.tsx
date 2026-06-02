"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Activity,
  AlertCircle,
  DollarSign,
  FileText,
  Users,
  Car,
  Check,
  AlertTriangle,
  FileBarChart,
  Plus,
  Trash2,
  Download,
  Calendar,
  Save,
  LogOut,
  File,
  FileArchive,
  Code,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import InputField from "@/components/InputField";

const REPORT_TYPES = [
  { id: "operational", title: "Operational", icon: Activity, color: "#3B82F6" },
  { id: "overdue", title: "Overdue", icon: AlertCircle, color: "#F59E0B" },
  { id: "financial", title: "Financial", icon: DollarSign, color: "#10B981" },
  { id: "agreement", title: "Agreement", icon: FileText, color: "#3B82F6" },
  { id: "driver", title: "Driver Activity", icon: Users, color: "#F59E0B" },
  { id: "utilisation", title: "Utilisation", icon: Car, color: "#10B981" },
];

const METRICS = [
  { id: "revenue", label: "Total Revenue" },
  { id: "outstanding", label: "Outstanding Balance" },
  { id: "vehicle_count", label: "Vehicle Count" },
  { id: "active_agreements", label: "Active Agreements" },
  { id: "driver_activity", label: "Driver Activity" },
  { id: "utilisation_rate", label: "Utilisation Rate" },
];

export default function ReportBuilder({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [selectedType, setSelectedType] = useState("operational");
  const [selectedMetrics, setSelectedMetrics] = useState([
    "revenue",
    "outstanding",
    "active_agreements",
  ]);

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!hideHeader && (
        <PageHeader
          title="Report Builder"
          description="Configure custom reports with advanced filters and metrics"
          searchPlaceholder="Search drivers, vehicles, agreements..."
          notificationCount={3}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1.5rem",
        }}
      >
        {/* Left Column: Configuration */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Report Type */}
          <Card padding="1.5rem">
            <SectionHeader
              title="Report Type"
              subtitle="Select the primary report category"
              icon={<FileBarChart size={18} color={COLORS.PRIMARY_MAIN} />}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              {REPORT_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    border: `2px solid ${selectedType === type.id ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                    backgroundColor:
                      selectedType === type.id ? "#EFF6FF" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ color: type.color }}>
                    <type.icon size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {type.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Metrics & KPIs */}
          <Card padding="1.5rem">
            <SectionHeader
              title="Metrics & KPIs"
              subtitle="Choose data points to include"
              icon={<Activity size={18} color="#10B981" />}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              {METRICS.map((metric) => (
                <label
                  key={metric.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => toggleMetric(metric.id)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    {metric.label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Grouping & Columns */}
          <Card padding="1.5rem">
            <SectionHeader
              title="Grouping & Columns"
              subtitle="Configure data structure and display columns"
              icon={<Users size={18} color="#F59E0B" />}
            />
            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Group By
                </label>
                <SelectField
                  options={[
                    { label: "Vehicle", value: "vehicle" },
                    { label: "Driver", value: "driver" },
                  ]}
                  placeholder="Vehicle"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Display Columns
                </label>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  <Tag label="Vehicle" />
                  <Tag label="Revenue" />
                  <Tag label="Status" />
                  <button
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "9999px",
                      border: `1px dashed ${COLORS.PRIMARY_MAIN}`,
                      color: COLORS.PRIMARY_MAIN,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      background: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={14} /> Add Column
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Filters */}
          <Card padding="1.5rem">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <SectionHeader
                title="Filters"
                subtitle="Refine your report data"
                icon={<Filter size={18} color="#3B82F6" />}
              />
              <Button
                variant="outline"
                size="sm"
                style={{
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                  borderRadius: "9999px",
                  color: COLORS.PRIMARY_MAIN,
                  borderColor: COLORS.PRIMARY_MAIN,
                }}
              >
                <Plus size={14} /> Add Filter
              </Button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <SelectField options={[{ label: "Vehicle", value: "vehicle" }]} />
              <SelectField options={[{ label: "equals", value: "equals" }]} />
              <input
                placeholder="Value"
                style={{
                  height: "30px",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.9rem",
                }}
              />
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#EF4444",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </Card>

          {/* Date Range */}
          <Card padding="1.5rem">
            <div
              style={
                {
                  // display: "flex",
                  // justifyContent: "space-between",
                  // alignItems: "center",
                }
              }
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: COLORS.SUCCESS_MAIN,
                    padding: "0.5rem",
                    borderRadius: "8px",
                  }}
                >
                  <Calendar size={16} color={COLORS.GRAY_100} />
                </div>
                <div style={{ flexDirection: "column", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    Date Range
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Select reporting period
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                }}
              >
                <SelectField
                  label="Period"
                  options={[
                    { label: "Today", value: "today" },
                    { label: "Yesterday", value: "yesterday" },
                    { label: "This Week", value: "this_week" },
                    { label: "Last Week", value: "last_week" },
                    { label: "This Month", value: "this_month" },
                    { label: "Last Month", value: "last_month" },
                    { label: "Custom Range", value: "custom" },
                  ]}
                  placeholder="Select Date Range"
                />
                <InputField type="date" label="Custom Range" />
              </div>
            </div>
          </Card>

          {/* Output Format */}
          <Card>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  backgroundColor: COLORS.WARNING_MAIN,
                  height: "30px",
                  width: "30px",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <LogOut size={16} color={COLORS.GRAY_100} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Output Format
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  Choose export format and options
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  height: "80px",
                  width: "30%",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: COLORS.PRIMARY_LIGHT,
                  marginTop: "1rem",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <File color={COLORS.PRIMARY_MAIN} size={16} />
                <p>CSV</p>
              </div>

              <div
                style={{
                  height: "80px",
                  width: "30%",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: COLORS.PRIMARY_LIGHT,
                  marginTop: "1rem",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <FileBarChart color={COLORS.PRIMARY_MAIN} size={16} />
                <p>PDF</p>
              </div>

              <div
                style={{
                  height: "80px",
                  width: "30%",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: COLORS.PRIMARY_LIGHT,
                  marginTop: "1rem",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <FileArchive color={COLORS.PRIMARY_MAIN} size={16} />
                <p>Excel</p>
              </div>

              <div
                style={{
                  height: "80px",
                  width: "30%",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: COLORS.PRIMARY_LIGHT,
                  marginTop: "1rem",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Code color={COLORS.PRIMARY_MAIN} size={16} />
                <p>JSON</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Validation & Actions */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Validation Status */}
          <Card padding="1.5rem">
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Validation
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <StatusItem
                label="Report type selected"
                checked={true}
                description="Operational reports"
              />
              <StatusItem
                label="Metrics configured"
                checked={true}
                description="4 metrics selected"
              />
              <StatusItem
                label="Date range valid"
                checked={true}
                description="Last 30 days"
              />
            </div>
            <div
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                backgroundColor: "#FFFBEB",
                borderRadius: "8px",
                border: "1px solid #FEF3C7",
                display: "flex",
                gap: "0.75rem",
              }}
            >
              <AlertTriangle
                size={18}
                color="#F59E0B"
                style={{ flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#92400E",
                  }}
                >
                  Large dataset
                </p>
                <p style={{ fontSize: "0.8rem", color: "#B45309" }}>
                  ~2,500 records expected
                </p>
              </div>
            </div>
          </Card>

          {/* Preview Summary */}
          <Card padding="1.5rem">
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Preview
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Report Name
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  Operational Report - Q1 2024
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MUTED,
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Records
                  </p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>2,487</p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MUTED,
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Columns
                  </p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>8</p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.75rem",
                  borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
                  ESTIMATED SIZE
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    CSV 245 KB
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    PDF 1.2 MB
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card
            padding="1.5rem"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Button
              variant="primary"
              size="lg"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Generate Report
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ width: "100%", justifyContent: "center", gap: "8px" }}
            >
              <Download size={18} /> Export
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ width: "100%", justifyContent: "center", gap: "8px" }}
            >
              <Save size={18} /> Save Preset
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{
                width: "100%",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Calendar size={18} /> Schedule Report
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <div style={{ marginTop: "2px" }}>{icon}</div>
      <div>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: "0.35rem 0.75rem",
        borderRadius: "9999px",
        backgroundColor: "#EFF6FF",
        color: COLORS.PRIMARY_MAIN,
        fontSize: "0.8rem",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {label}
      <span
        style={{
          cursor: "pointer",
          fontSize: "1.1rem",
          lineHeight: 0,
          marginTop: "-2px",
        }}
      >
        ×
      </span>
    </span>
  );
}

function StatusItem({
  label,
  checked,
  description,
}: {
  label: string;
  checked: boolean;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: checked ? "#DCFCE7" : "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: checked ? "#10B981" : "#9CA3AF",
          marginTop: "2px",
        }}
      >
        <Check size={12} />
      </div>
      <div>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: COLORS.TEXT_MAIN,
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function Filter({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: any;
}) {
  return <FileBarChart size={size} color={color} style={style} />;
}
