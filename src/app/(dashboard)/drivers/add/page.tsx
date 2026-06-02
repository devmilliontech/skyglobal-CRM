"use client";
import { COLORS } from "@/constants/Constant";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Calendar,
  ChevronDown,
  Mail,
  CreditCard,
  Globe,
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Search,
  Plus,
  Bell,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";
import { driversApi } from "@/services/api/drivers";

export default function AddDriverPage() {
  const router = useRouter();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    licenceFront: null,
    licenceBack: null,
    passport: null,
    proofOfAddress: null,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    abn: "",
    passportNumber: "",
    driverLicenceNumber: "",
    licenceExpiry: "",
    visaExpiry: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    accountStatus: "Pending",
    kycStatus: "Pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = (type: string, file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Please fill in all required fields (First Name, Last Name, Email, Phone).");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) fd.append(key, val);
      });
      // Add a default password for the driver user account
      fd.append("password", "Driver@123!");
      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      await driversApi.createDriver(fd as any);
      setSuccess(true);
      setTimeout(() => router.push("/drivers"), 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to create driver. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        title="Add New Driver"
        description="Create a new driver account and upload documents"
        showBack
        notificationCount={3}
      />
      {/* Breadcrumbs */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.85rem",
          color: COLORS.TEXT_SECONDARY,
          marginBottom: "0.5rem",
        }}
      >
        <Link
          href="/drivers"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Drivers
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: COLORS.TEXT_MAIN, fontWeight: 500 }}>
          Add Driver
        </span>
      </nav>

      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "0.75rem 1rem", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", color: "#16A34A", fontSize: "0.9rem" }}>
          Driver created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Personal Information */}
        <section
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "0.25rem",
            }}
          >
            Personal Information
          </h3>

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
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                First Name <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                style={inputStyle}
              />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Middle Name
              </label>
              <input
                type="text"
                placeholder="Enter middle name"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                style={inputStyle}
              />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Last Name <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                style={inputStyle}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Date of Birth{" "}
                <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} style={inputStyle} />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                ABN <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="XX XXX XXX XXX"
                value={formData.abn}
                onChange={(e) => handleChange("abn", e.target.value)}
                style={inputStyle}
              />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Passport Number{" "}
                <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter passport number"
                value={formData.passportNumber}
                onChange={(e) => handleChange("passportNumber", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        {/* Licence & Visa Information */}
        <section
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "0.25rem",
            }}
          >
            Licence & Visa Information
          </h3>

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
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Driver's Licence Number{" "}
                <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter licence number"
                value={formData.driverLicenceNumber}
                onChange={(e) => handleChange("driverLicenceNumber", e.target.value)}
                style={inputStyle}
              />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Licence Expiry Date{" "}
                <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input type="date" value={formData.licenceExpiry} onChange={(e) => handleChange("licenceExpiry", e.target.value)} style={inputStyle} />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Visa Expiry Date
              </label>
              <div style={{ position: "relative" }}>
                <input type="date" value={formData.visaExpiry} onChange={(e) => handleChange("visaExpiry", e.target.value)} style={inputStyle} />
              </div>
              <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
                Optional if not required
              </span>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "0.25rem",
            }}
          >
            Contact Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Email <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={inputStyle}
              />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Phone Number <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="+61 XXX XXX XXX"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Address Line 1{" "}
                <span style={{ color: COLORS.ERROR_MAIN }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter address line 1"
                value={formData.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
                style={inputStyle}
              />
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
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Address Line 2
              </label>
              <input
                type="text"
                placeholder="Enter address line 2"
                value={formData.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        {/* Account Status */}
        <section
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "0.25rem",
            }}
          >
            Account Status
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <SelectField
                label="Account Status"
                value={formData.accountStatus}
                onChange={(e) => handleChange("accountStatus", e.target.value)}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Suspended", value: "Suspended" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Pending", value: "Pending" },
                ]}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <SelectField
                label="KYC Status"
                value={formData.kycStatus}
                onChange={(e) => handleChange("kycStatus", e.target.value)}
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Verified", value: "Verified" },
                  { label: "Rejected", value: "Rejected" },
                ]}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#F9FAFB",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  width: "100%",
                }}
              >
                <label
                  htmlFor="invite-link"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "#374151",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <Mail size={16} />
                  Send Invite Link
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Initial Documents (Optional) */}
        <section
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "0.25rem",
              }}
            >
              Initial Documents (Optional)
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              Upload driver documents now or leave blank to collect later
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <DocumentUploadCard
              title="Driver's Licence Front"
              subtitle="Upload front side of licence"
              icon={<CreditCard size={24} color={COLORS.GRAY_400} />}
              onFileSelect={(file) => handleFile("licenceFront", file)}
              file={files.licenceFront}
            />
            <DocumentUploadCard
              title="Driver's Licence Back"
              subtitle="Upload back side of licence"
              icon={<CreditCard size={24} color={COLORS.GRAY_400} />}
              onFileSelect={(file) => handleFile("licenceBack", file)}
              file={files.licenceBack}
            />
            <DocumentUploadCard
              title="Passport"
              subtitle="Upload passport photo page"
              icon={<Globe size={24} color={COLORS.GRAY_400} />}
              onFileSelect={(file) => handleFile("passport", file)}
              file={files.passport}
            />
            <DocumentUploadCard
              title="Proof of Address"
              subtitle="Utility bill or bank statement"
              icon={<FileText size={24} color={COLORS.GRAY_400} />}
              onFileSelect={(file) => handleFile("proofOfAddress", file)}
              file={files.proofOfAddress}
            />
          </div>
        </section>

        {/* Form Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <Link
            href="/drivers"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              background: COLORS.BG_CARD,
              color: "#374151",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={18} />
            Back to Drivers
          </Link>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                background: COLORS.BG_CARD,
                color: "#374151",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                background: submitting ? "#9CA3AF" : COLORS.PRIMARY_MAIN,
                color: COLORS.BG_CARD,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Creating..." : "✓ Create Driver Account"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function DocumentUploadCard({
  title,
  subtitle,
  icon,
  onFileSelect,
  file,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onFileSelect?: (file: File) => void;
  file?: File | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: `2px dashed ${file ? "#10B981" : isHovered ? "var(--primary)" : COLORS.GRAY_200}`,
        borderRadius: "12px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        background: file ? "#F0FDF4" : COLORS.BG_CARD,
        cursor: "pointer",
        transition: "all 0.2s ease",
        minHeight: "180px",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleChange}
        accept=".jpg,.jpeg,.png,.pdf"
      />

      <div>
        {file ? <CheckCircle2 size={24} color={COLORS.SUCCESS_MAIN} /> : icon}
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111827" }}>
          {title}
        </p>
        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
          {file ? `File: ${file.name}` : subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: file ? "#059669" : COLORS.PRIMARY_MAIN,
          fontWeight: 600,
          fontSize: "0.85rem",
        }}
      >
        <Upload size={16} />
        {file ? "Change File" : "Choose File"}
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
