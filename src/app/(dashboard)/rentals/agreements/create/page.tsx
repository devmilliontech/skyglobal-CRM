"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Plus,
  Bell,
  FileText,
  Users,
  Info,
  ChevronRight,
  SwitchCamera,
  NotepadText,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  X,
  Calendar,
  Car,
  AlertTriangle,
  Link,
  Package,
  Power,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import SelectField from "@/components/SelectField";

export default function CreateAgreement() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Agreements");
  const [currentStep, setCurrentStep] = useState(1);

  const tabs = [
    {
      name: "Rentals Management",
      path: "/rentals",
    },
    {
      name: "Agreements",
      path: "/rentals/agreements",
    },
    {
      name: "Disputes & Refunds",
      path: "/rentals/disputes",
    },
    {
      name: "Admin Notes & Audit",
      path: "/rentals/audit",
    },
  ];

  const inputStyle = {
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
    background: "#ffffff",
  };

  const readOnlyInputStyle = {
    ...inputStyle,
    background: "#F9FAFB",
    color: "#9CA3AF",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: "0.4rem",
    display: "block",
  };

  const requiredAsterisk = <span style={{ color: COLORS.ERROR_MAIN }}>*</span>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Header section */}
      <PageHeader title="Create Agreement" />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Agreements", path: "/rentals/agreements" },
          { label: "Create Agreement" },
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: COLORS.BG_CARD,
            padding: "1.25rem 1.5rem",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            Step {currentStep} of 2:{" "}
            {currentStep === 1
              ? "Create Agreement"
              : "Review & Activate Agreement"}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background:
                    currentStep === 1 ? "#2563EB" : COLORS.SUCCESS_MAIN,
                  color: COLORS.BG_CARD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {currentStep === 1 ? 1 : <Check size={14} />}
              </div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: currentStep === 1 ? "#2563EB" : COLORS.SUCCESS_MAIN,
                }}
              >
                Agreement Details
              </span>
            </div>
            <div
              style={{ width: "24px", height: "2px", background: "#d9d9d9ff" }}
            />
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: currentStep === 2 ? "#2563EB" : "#F3F4F6",
                  color: currentStep === 2 ? "white" : "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                2
              </div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: currentStep === 2 ? 600 : 500,
                  color: currentStep === 2 ? "#2563EB" : "#9CA3AF",
                }}
              >
                Review & Activate
              </span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            {/* Agreement Basics */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <FileText size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Agreement Basics
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Agreement Title {requiredAsterisk}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter agreement title"
                    style={inputStyle}
                  />
                </div>
                <SelectField
                  label="Agreement Type"
                  options={[
                    { label: "Select type", value: "Select type" },
                    { label: "Short-Term", value: "Short-Term" },
                    { label: "Rent-to-Own", value: "Rent-to-Own" },
                  ]}
                />
                <div>
                  <label style={labelStyle}>
                    Agreement Duration (Weeks) {requiredAsterisk}
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-calculated"
                    readOnly
                    style={readOnlyInputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Start Date & Time {requiredAsterisk}
                  </label>
                  <input type="datetime-local" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>
                    End Date & Time {requiredAsterisk}
                  </label>
                  <input type="datetime-local" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Driver & Owner Assignment */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <Users size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Driver & Owner Assignment
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <SelectField
                    label="Lease/Primary Driver"
                    options={[
                      { label: "Select driver", value: "Select driver" },
                      {
                        label: "John Doe - KYC Verified",
                        value: "John Doe - KYC Verified",
                      },
                      {
                        label: "Jane Smith - KYC Pending",
                        value: "Jane Smith - KYC Pending",
                      },
                    ]}
                  />
                </div>
                <div>
                  <SelectField
                    label="Owner"
                    options={[
                      { label: "Select owner", value: "Select owner" },
                      { label: "Sarah Johnson", value: "Sarah Johnson" },
                      {
                        label: "Emma Davis - Inactive",
                        value: "Emma Davis - Inactive",
                      },
                    ]}
                  />
                  <div
                    style={{
                      marginTop: "0.75rem",
                      background: COLORS.PRIMARY_LIGHT,
                      border: "1px solid #BFDBFE",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Info size={16} style={{ color: COLORS.PRIMARY_MAIN }} />
                    <span
                      style={{
                        backgroundColor: "#e0f2fe",
                        fontSize: "0.8rem",
                        color: "#0ea5e9",
                        fontWeight: 500,
                      }}
                    >
                      Owner will be bound to driver via selected vehicle
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Assignment */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <Users size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Vehicle Assignment
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <SelectField
                    label="Vehicle"
                    options={[
                      { label: "Select vehicle", value: "Select vehicle" },
                      {
                        label: "Toyota Corolla - ABC-1234 (Available)",
                        value: "Toyota Corolla - ABC-1234 (Available)",
                      },
                      {
                        label: "Honda Civic - XYZ-5678 (Insurance Expired)",
                        value: "Honda Civic - XYZ-5678 (Insurance Expired)",
                      },
                    ]}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Mileage at Agreement Start {requiredAsterisk}
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="Enter current mileage"
                  />
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <Users size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Commercial Terms
                </h3>
              </div>

              <div
                style={{
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <label style={labelStyle}>
                      Agreement Amount {requiredAsterisk}
                    </label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="$ 0.00"
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label style={labelStyle}>
                      Repayment {requiredAsterisk}
                    </label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="$ 0.00"
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label style={labelStyle}>
                      Repayment {requiredAsterisk}
                    </label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="$ 0.00"
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "0.75rem",
                    background: COLORS.PRIMARY_LIGHT,
                    border: "1px solid #BFDBFE",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Info size={16} style={{ color: COLORS.PRIMARY_MAIN }} />
                  <span
                    style={{
                      backgroundColor: "#e0f2fe",
                      fontSize: "0.8rem",
                      color: "#0ea5e9",
                      fontWeight: 500,
                    }}
                  >
                    Hybrid pricing model: Base repayment + variable charges
                    supported
                  </span>
                </div>
              </div>
            </div>

            {/* Deposit and Insurence */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <Users size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Deposit & Insurence
                </h3>
              </div>

              <div
                style={{
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <label style={labelStyle}>Deposit {requiredAsterisk}</label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="$ 0.00"
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <SelectField
                      label="Preferred Payment Method"
                      options={[
                        {
                          label: "Select payment method",
                          value: "Select payment method",
                        },
                        { label: "Credit Card", value: "Credit Card" },
                        { label: "Bank Transfer", value: "Bank Transfer" },
                        { label: "Cash", value: "Cash" },
                      ]}
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <SelectField
                      label="Insurance Cover"
                      options={[
                        {
                          label: "Select insurance",
                          value: "Select insurance",
                        },
                        { label: "Basic Coverage", value: "Basic Coverage" },
                        {
                          label: "Comprehensive Coverage",
                          value: "Comprehensive Coverage",
                        },
                        { label: "Premium", value: "Premium" },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <input
                    type="checkbox"
                    id="overrideDeposits"
                    style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="overrideDeposits"
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#374151",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    Override Deposits {requiredAsterisk}
                  </label>
                </div>
              </div>
            </div>

            {/* Status & Activation */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <SwitchCamera
                  size={18}
                  style={{ color: COLORS.PRIMARY_MAIN }}
                />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Status Activation
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <SelectField
                    label="Agreement Status"
                    options={[
                      { label: "Draft", value: "Draft" },
                      { label: "Pending Approval", value: "Pending Approval" },
                      { label: "Active", value: "Active" },
                      { label: "Cancelled", value: "Cancelled" },
                      { label: "Partially Paid", value: "Partially Paid" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Notes & Internal Flags */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <NotepadText size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Notes / Internal Flags
                </h3>
              </div>

              <div>
                <label style={labelStyle}>Internal Notes</label>
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
              </div>
            </div>
            <div
              style={{ backgroundColor: "#ddd", width: "100%", height: "1px" }}
            />
            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                gap: "1rem",
              }}
            >
              <div>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                  onClick={() => router.back()}
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                  }}
                >
                  Save Draft
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#333",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: COLORS.PRIMARY_MAIN,
                  }}
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Agreement Summary */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <FileText size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Agreement Summary
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Agreement Title
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      Toyota Corolla - John Doe - 4 Weeks
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Agreement Type
                    </p>
                    <span
                      style={{
                        background: COLORS.PRIMARY_LIGHT,
                        color: COLORS.PRIMARY_MAIN,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Short-Term Rental
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Duration
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      4 Weeks (28 Days)
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Start Date
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      Jan 15, 2024 - 09:00 AM
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      End Date
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      Feb 12, 2024 - 09:00 AM
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Status
                    </p>
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#d97706",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Pending Approval
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Primary Driver
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                        marginBottom: "0.25rem",
                      }}
                    >
                      John Doe
                    </p>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: COLORS.SUCCESS_DARK,
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      KYC Verified
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Vehicle Owner
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Sarah Johnson
                    </p>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: COLORS.SUCCESS_DARK,
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Commercial Terms Summary */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <FileText size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Commercial Terms Summary
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                }}
              >
                {/* Pricing Breakdown */}
                <div>
                  <h4
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "1rem",
                    }}
                  >
                    Pricing Breakdown
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                        Agreement Amount
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "#111827",
                        }}
                      >
                        $2,800.00
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                        Weekly Repayment
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "#111827",
                        }}
                      >
                        $700.00
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                        Fixed Fee
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "#111827",
                        }}
                      >
                        $50.00
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        background: "#E5E7EB",
                        margin: "0.25rem 0",
                      }}
                    ></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        Total Due
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        $2,850.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment & Security */}
                <div
                  style={{
                    background: "#F9FAFB",
                    padding: "1.25rem",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    Payment & Security
                  </h4>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Deposit Amount
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      $500.00
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Payment Method
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      Credit Card
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Insurance Cover
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      Comprehensive Coverage
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Repayment Schedule */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Calendar size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Repayment Schedule
                </h3>
              </div>

              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #E5E7EB",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Week
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Due Date
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Amount
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </div>
                </div>

                {[
                  { week: "Week 1", date: "Jan 22, 2024", amount: "$700.00" },
                  { week: "Week 2", date: "Jan 29, 2024", amount: "$700.00" },
                  { week: "Week 3", date: "Feb 05, 2024", amount: "$700.00" },
                  { week: "Week 4", date: "Feb 12, 2024", amount: "$750.00" },
                ].map((row, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr",
                      padding: "0.75rem 0",
                      borderBottom: index < 3 ? "1px solid #F3F4F6" : "none",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {row.week}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                      {row.date}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      {row.amount}
                    </div>
                    <div>
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#d97706",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          display: "inline-block",
                        }}
                      >
                        Scheduled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Vehicle Assignment Details */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Car size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Vehicle Assignment Details
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#9CA3AF",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Vehicle
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      2022 Toyota Corolla
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#9CA3AF",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Registration
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      ABC-1234
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#9CA3AF",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Starting Mileage
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      45,230 miles
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#9CA3AF",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Vehicle Status
                    </p>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: COLORS.SUCCESS_DARK,
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      Available
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#9CA3AF",
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Insurance Status
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          background: "#dcfce7",
                          color: COLORS.SUCCESS_DARK,
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          display: "inline-block",
                        }}
                      >
                        Active
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        Expires: Dec 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Conflict Detection & Validation */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertTriangle
                  size={18}
                  style={{ color: COLORS.WARNING_MAIN }}
                />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Conflict Detection & Validation
                </h3>
              </div>

              <div
                style={{
                  background: "#dcfce7",
                  border: "1px solid #58bd7e",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Clock size={18} style={{ color: COLORS.SUCCESS_DARK }} />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: COLORS.SUCCESS_DARK,
                  }}
                >
                  <p style={{ fontWeight: 600 }}>KYC Compliance - Verified</p>
                  <p>Driver KYC verification is complete and valid</p>
                </span>
              </div>

              <div
                style={{
                  background: "#dcfce7",
                  border: "1px solid #58bd7e",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <Clock size={18} style={{ color: COLORS.SUCCESS_DARK }} />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: COLORS.SUCCESS_DARK,
                  }}
                >
                  <p style={{ fontWeight: 600 }}>
                    Vehicle Availability - Confirmed
                  </p>
                  <p>No overlapping agreements found for this vehicle</p>
                </span>
              </div>

              <div
                style={{
                  background: "#dcfce7",
                  border: "1px solid #58bd7e",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <Clock size={18} style={{ color: COLORS.SUCCESS_DARK }} />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: COLORS.SUCCESS_DARK,
                  }}
                >
                  <p style={{ fontWeight: 600 }}>Owner Status - Active</p>
                  <p>Vehicle owner account is active and compliant</p>
                </span>
              </div>
            </div>

            {/* Approval History & Audit Trail */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertTriangle
                  size={18}
                  style={{ color: COLORS.WARNING_MAIN }}
                />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Approval History & Audit Trail
                </h3>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.BG_CARD,
                  }}
                >
                  <p>SA</p>
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                  }}
                >
                  <p style={{ fontWeight: 600 }}>Agreement Created</p>
                  <p>
                    Agreement created by Super Admin with all required fields
                    completed
                  </p>
                </span>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    backgroundColor: "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.BG_CARD,
                  }}
                >
                  <Clock size={12} />
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                  }}
                >
                  <p style={{ fontWeight: 600 }}>Pending Approval</p>
                  <p>Waiting for final approval and activation</p>
                </span>
              </div>
            </div>

            {/* Linked Invoices & Transactions */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Link size={18} style={{ color: "#2563eb" }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Linked Invoices & Transactions
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "3rem",
                }}
              >
                <Package size={30} style={{ color: "#555" }} />
                <p style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                  No Invoices or Transactions Yet
                </p>
                <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                  Invoices and transaction records will appear here once the
                  agreement is activated
                </p>
              </div>
            </div>

            {/* Activation Requirements */}
            <div
              style={{
                background: COLORS.BG_CARD,
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Power size={18} style={{ color: "#2563eb" }} />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Activation Requirements
                </h3>
              </div>

              <div
                style={{
                  background: "#dcfce7",
                  border: "1px solid #58bd7e",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <Clock size={18} style={{ color: COLORS.SUCCESS_DARK }} />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: COLORS.SUCCESS_DARK,
                  }}
                >
                  <p style={{ fontWeight: 600 }}>
                    All validation checks passed
                  </p>
                </span>
              </div>

              <div
                style={{
                  background: "#e0f2fe",
                  border: "1px solid #0ea5e9",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <Info size={18} style={{ color: "#0ea5e9" }} />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#0ea5e9",
                  }}
                >
                  <p style={{ fontWeight: 600 }}>Activation Notice</p>
                  <p>
                    Once activated, the agreement will be binding and payment
                    schedules will be enforced. Driver will be notified
                    immediately via email and SMS.
                  </p>
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#E5E7EB",
                width: "100%",
                height: "1px",
                marginTop: "1rem",
              }}
            />
            {/* Bottom Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingBottom: "1rem",
              }}
            >
              <div>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    background: COLORS.BG_CARD,
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft size={16} />
                  Back to Details
                </button>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    background: COLORS.BG_CARD,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Save Draft
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.BG_CARD,
                    backgroundColor: COLORS.WARNING_MAIN,
                    cursor: "pointer",
                  }}
                >
                  <Clock size={16} />
                  Submit for Approval
                </button>
                <button
                  onClick={() =>
                    router.push("/rentals/agreements/AGR-2024-001")
                  }
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.BG_CARD,
                    backgroundColor: COLORS.SUCCESS_MAIN,
                    cursor: "pointer",
                  }}
                >
                  <Check size={16} />
                  Approve & Activate
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.BG_CARD,
                    backgroundColor: COLORS.ERROR_MAIN,
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                  Cancel Agreement
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
