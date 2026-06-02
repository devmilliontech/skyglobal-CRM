"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Mail,
  ShieldCheck,
  Save,
  X,
  Calendar,
  CreditCard,
  Clock,
  User,
  History,
  AlertTriangle,
  CircleCheck,
  Eye,
  FileText,
  Folder,
  Search,
  Plus,
  Bell,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";

export default function EditDriverPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Mock initial data
  const [formData, setFormData] = useState({
    firstName: "Michael",
    middleName: "David",
    lastName: "Johnson",
    email: "michael.johnson@email.com",
    phoneNumber: "+61 412 345 678",
    dob: "1985-03-15",
    addressLine1: "123 Collins Street",
    addressLine2: "Apt 4B",
    city: "Melbourne",
    state: "Victoria",
    zipCode: "3000",
    country: "Australia",
    driversLicenceNumber: "123456789",
    licenceExpiry: "2025-08-15",
    passportNumber: "A123456789",
    visaExpiry: "2025-08-15",
    abn: "12 345 678 901",
    reasonForChange: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <PageHeader
        title="Edit Driver Profile"
        description="Update driver information and compliance status"
        showBack
        notificationCount={3}
      />
      {/* Breadcrumbs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.75rem",
        }}
      >
        <Link
          href="/drivers"
          style={{ color: COLORS.TEXT_SECONDARY, textDecoration: "none" }}
        >
          Drivers Management
        </Link>
        <ChevronRight size={12} style={{ color: COLORS.TEXT_MUTED }} />
        <Link
          href={`/drivers/${id}`}
          style={{ color: COLORS.TEXT_SECONDARY, textDecoration: "none" }}
        >
          Driver Profile
        </Link>
        <ChevronRight size={12} style={{ color: COLORS.TEXT_MUTED }} />
        <span style={{ color: COLORS.TEXT_MAIN, fontWeight: 500 }}>
          Edit Driver
        </span>
      </div>

      {/* Header Info Card */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}
          >
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                alt="Profile"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {formData.firstName} {formData.lastName}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  color: COLORS.TEXT_SECONDARY,
                  fontSize: "0.85rem",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  {formData.email}
                </span>
                <span>Driver ID: DRV-2024-001234</span>
              </div>
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}
              >
                <span
                  className="badge badge-success"
                  style={{
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "4px 10px",
                    background: "#F0FDF4",
                    color: "#16A34A",
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
                  Active
                </span>
                <span
                  className="badge badge-success"
                  style={{
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "4px 10px",
                    background: "#F0FDF4",
                    color: "#16A34A",
                  }}
                >
                  <ShieldCheck size={12} /> KYC Verified
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => router.push(`/drivers/${id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: COLORS.PRIMARY_MAIN,
                color: COLORS.BG_CARD,
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Save size={16} /> Save Changes
            </button>
            <button
              onClick={() => router.push(`/drivers/${id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: COLORS.BG_CARD,
                color: COLORS.TEXT_MAIN,
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                cursor: "pointer",
              }}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* Left Side: Form Sections */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Personal Information */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: COLORS.TEXT_MAIN,
              }}
            >
              Personal Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <InputField
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <InputField
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                type="date"
                required
              />
              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: COLORS.TEXT_MAIN,
              }}
            >
              Address Information
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <InputField
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <InputField
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Postal Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Infomation */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: COLORS.TEXT_MAIN,
              }}
            >
              Document Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <InputField
                label="Driver's Licence Number"
                name="driversLicenceNumber"
                value={formData.driversLicenceNumber}
                onChange={handleChange}
                required
              />
              <InputField
                label="Licence Expiry Date"
                name="licenceExpiry"
                type="date"
                value={formData.licenceExpiry}
                onChange={handleChange}
                required
              />
              <InputField
                label="Passport Number"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                required
              />
              <InputField
                label="Visa Expiry Date"
                name="visaExpiry"
                value={formData.visaExpiry}
                onChange={handleChange}
                type="date"
                required
              />
              <InputField
                label="ABN"
                name="abn"
                value={formData.abn}
                onChange={handleChange}
                required
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Account & KYC Status */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: COLORS.TEXT_MAIN,
              }}
            >
              Account & KYC Status
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // gap: "1.5rem",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%",
                  }}
                >
                  <div style={{ position: "relative", width: "100%" }}>
                    <SelectField
                      label="Account Status"
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "Suspended", value: "Suspended" },
                        { label: "Inactive", value: "Inactive" },
                        { label: "Pending", value: "Pending" },
                      ]}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%",
                  }}
                >
                  <SelectField
                    label="KYC Status"
                    options={[
                      { label: "Verified", value: "Verified" },
                      {
                        label: "Pending Verification",
                        value: "Pending Verification",
                      },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Incomplete", value: "Incomplete" },
                    ]}
                  />
                </div>
              </div>
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
                  Reason for Change
                  <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
                </label>
                <textarea
                  placeholder="Optional: Provide a reason for status change..."
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
                  This will be logged in the activity history
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Info */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* System Information */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              System Information
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <SidebarItem label="Driver ID" value="DRV-2024-001234" />
              <SidebarItem
                label="Date Joined"
                value="2024-01-15"
                icon={<Calendar size={14} />}
              />
              <SidebarItem
                label="Last Login"
                value="2024-01-26 14:30"
                icon={<Clock size={14} />}
              />
              <SidebarItem
                label="Linked Payment Method"
                value="**** 4532 (Visa)"
                icon={<CreditCard size={14} />}
              />
            </div>
          </div>

          {/* Change Tracking */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              Change Tracking
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
                  Last Modified By
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                    alt="Admin"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    Sarah Admin
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
                  Last Modified Date
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  2024-01-20 10:45
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: "1.3rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
                  Created By
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                    alt="Admin"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    John Admin
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
                  Created Date
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  2024-01-20 10:45
                </span>
              </div>
            </div>
          </div>

          {/* Validation Alerts */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              Validation Alerts
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {/* Alert 1 */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  backgroundColor: "#FFF7ED",
                  padding: "0.85rem",
                  border: "1px solid #FFEDD5",
                  borderRadius: "8px",
                }}
              >
                <AlertTriangle
                  size={18}
                  style={{ color: "#F97316", flexShrink: 0, marginTop: "2px" }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.1rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#9A3412",
                    }}
                  >
                    Licence Expiring Soon
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#C2410C" }}>
                    Expires on 2024-02-10 (15 days)
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  backgroundColor: "#F0FDF4",
                  padding: "0.85rem",
                  border: "1px solid #DCFCE7",
                  borderRadius: "8px",
                }}
              >
                <CircleCheck
                  size={18}
                  style={{ color: "#16A34A", flexShrink: 0, marginTop: "2px" }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.1rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: COLORS.SUCCESS_DARK,
                    }}
                  >
                    All Required Fields Valid
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#15803D" }}>
                    No validation errors detected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              Actions
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <Save size={16} /> Save Changes
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <X size={16} /> Cancel & Return
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <Eye size={16} /> View Edit History
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              Quick Navigation
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <QuickNavLink
                icon={<User size={16} />}
                label="View Profile"
                href={`/drivers/${id}`}
              />
              <QuickNavLink
                icon={<FileText size={16} />}
                label="Agreements"
                href={`/drivers/${id}?tab=Agreements`}
              />
              <QuickNavLink
                icon={<CreditCard size={16} />}
                label="Payments"
                href={`/drivers/${id}?tab=Payments`}
              />
              <QuickNavLink
                icon={<Folder size={16} />}
                label="Documents"
                href={`/drivers/${id}?tab=Documents`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickNavLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.6rem 0.75rem",
        borderRadius: "6px",
        color: COLORS.TEXT_SECONDARY,
        textDecoration: "none",
        fontSize: "0.85rem",
        fontWeight: 500,
        transition: "all 0.2s",
      }}
      className="quick-nav-link"
    >
      <span style={{ color: COLORS.TEXT_MUTED }}>{icon}</span>
      {label}
    </Link>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {label}{" "}
        {required && <span style={{ color: COLORS.ERROR_MAIN }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: `1px solid ${COLORS.BORDER_MAIN}`,
          fontSize: "0.9rem",
          outline: "none",
          width: "100%",
          backgroundColor: COLORS.BG_CARD,
        }}
      />
    </div>
  );
}

function SidebarItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
        {label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {icon}
        {value}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: COLORS.BG_CARD,
  fontSize: "0.9rem",
  color: COLORS.TEXT_MAIN,
  outline: "none",
  transition: "border-color 0.2s",
};

const iconRightStyle: React.CSSProperties = {
  position: "absolute",
  right: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: COLORS.TEXT_MUTED,
  pointerEvents: "none",
};
