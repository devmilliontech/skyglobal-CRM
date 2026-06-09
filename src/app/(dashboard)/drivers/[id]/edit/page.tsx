"use client";
import { COLORS } from "@/constants/Constant";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Save,
  X,
  Calendar,
  CreditCard,
  Clock,
  User,
  AlertTriangle,
  CircleCheck,
  Eye,
  FileText,
  Folder,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import SelectField from "@/components/SelectField";
import { driversApi } from "@/services/api/drivers";

type DriverFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  driversLicenceNumber: string;
  licenceExpiry: string;
  passportNumber: string;
  visaExpiry: string;
  abn: string;
  accountStatus: string;
  kycStatus: string;
  reasonForChange: string;
};

type DriverDetail = Record<string, unknown>;

const EMPTY_FORM_DATA: DriverFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dob: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  driversLicenceNumber: "",
  licenceExpiry: "",
  passportNumber: "",
  visaExpiry: "",
  abn: "",
  accountStatus: "",
  kycStatus: "",
  reasonForChange: "",
};

const isRecord = (value: unknown): value is DriverDetail =>
  typeof value === "object" && value !== null;

const asRecord = (value: unknown): DriverDetail => (isRecord(value) ? value : {});

const nestedRecord = (record: DriverDetail, key: string): DriverDetail =>
  asRecord(record[key]);

const pickText = (...values: unknown[]) => {
  const value = values.find(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
  return typeof value === "string" ? value : "";
};

const toDateInputValue = (value: unknown) => {
  if (!value || typeof value !== "string") return "";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
};

const formatDate = (value: unknown) => {
  if (!value || typeof value !== "string") return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
};

const formatDateTime = (value: unknown) => {
  if (!value || typeof value !== "string") return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const splitName = (name?: string) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
};

const normalizeDriverToForm = (driver: DriverDetail): DriverFormData => {
  const personal = nestedRecord(driver, "personalInformation");
  const address = nestedRecord(driver, "addressInformation");
  const documentInfo = nestedRecord(driver, "documentInformation");
  const system = nestedRecord(driver, "systemInformation");
  const nameParts = splitName(pickText(driver.name));

  return {
    firstName: pickText(personal.firstName, driver.firstName, nameParts.firstName),
    middleName: pickText(personal.middleName, driver.middleName),
    lastName: pickText(personal.lastName, driver.lastName, nameParts.lastName),
    email: pickText(personal.email, driver.email),
    phoneNumber: pickText(personal.phone, driver.phone, driver.phoneNumber),
    dob: toDateInputValue(personal.dob || driver.dob),
    addressLine1: pickText(address.addressLine1, driver.addressLine1),
    addressLine2: pickText(address.addressLine2, driver.addressLine2),
    city: pickText(address.city, driver.city),
    state: pickText(address.state, driver.state),
    zipCode: pickText(address.postalCode, address.zipCode, driver.postalCode, driver.zipCode),
    country: pickText(address.country, driver.country),
    driversLicenceNumber: pickText(
      documentInfo.driverLicenceNumber,
      driver.driverLicenceNumber,
      driver.driversLicenceNumber,
    ),
    licenceExpiry: toDateInputValue(
      documentInfo.licenceExpiryDate || driver.licenceExpiry || driver.licenseExpiry,
    ),
    passportNumber: pickText(documentInfo.passportNumber, driver.passportNumber),
    visaExpiry: toDateInputValue(documentInfo.visaExpiryDate || driver.visaExpiry),
    abn: pickText(documentInfo.abn, driver.abn),
    accountStatus: pickText(system.accountStatus, driver.accountStatus),
    kycStatus: pickText(system.kycStatus, driver.kycStatus),
    reasonForChange: "",
  };
};

const buildDriverUpdatePayload = (formData: DriverFormData) => ({
  firstName: formData.firstName,
  middleName: formData.middleName,
  lastName: formData.lastName,
  name: [formData.firstName, formData.lastName].filter(Boolean).join(" "),
  email: formData.email,
  phone: formData.phoneNumber,
  phoneNumber: formData.phoneNumber,
  dob: formData.dob,
  addressLine1: formData.addressLine1,
  addressLine2: formData.addressLine2,
  city: formData.city,
  state: formData.state,
  postalCode: formData.zipCode,
  zipCode: formData.zipCode,
  country: formData.country,
  driverLicenceNumber: formData.driversLicenceNumber,
  licenceExpiry: formData.licenceExpiry,
  passportNumber: formData.passportNumber,
  visaExpiry: formData.visaExpiry,
  abn: formData.abn,
  accountStatus: formData.accountStatus,
  kycStatus: formData.kycStatus,
  reasonForChange: formData.reasonForChange,
  personalInformation: {
    firstName: formData.firstName,
    middleName: formData.middleName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phoneNumber,
    dob: formData.dob,
  },
  addressInformation: {
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    postalCode: formData.zipCode,
    country: formData.country,
  },
  documentInformation: {
    driverLicenceNumber: formData.driversLicenceNumber,
    licenceExpiryDate: formData.licenceExpiry,
    passportNumber: formData.passportNumber,
    visaExpiryDate: formData.visaExpiry,
    abn: formData.abn,
  },
  systemInformation: {
    accountStatus: formData.accountStatus,
    kycStatus: formData.kycStatus,
  },
});

const getLicenceAlert = (licenceExpiry: string) => {
  if (!licenceExpiry) {
    return {
      isWarning: true,
      title: "Licence Expiry Missing",
      message: "Add a licence expiry date before saving.",
    };
  }

  const expiry = new Date(`${licenceExpiry}T00:00:00`);
  if (Number.isNaN(expiry.getTime())) {
    return {
      isWarning: true,
      title: "Licence Expiry Invalid",
      message: "Check the licence expiry date format.",
    };
  }

  const days = Math.ceil((expiry.getTime() - Date.now()) / 86_400_000);
  if (days < 0) {
    return {
      isWarning: true,
      title: "Licence Expired",
      message: `Expired on ${formatDate(licenceExpiry)}.`,
    };
  }

  if (days <= 30) {
    return {
      isWarning: true,
      title: "Licence Expiring Soon",
      message: `Expires on ${formatDate(licenceExpiry)} (${days} days).`,
    };
  }

  return {
    isWarning: false,
    title: "Licence Valid",
    message: `Expires on ${formatDate(licenceExpiry)}.`,
  };
};

export default function EditDriverPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = String(params.id || "");
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [formData, setFormData] = useState<DriverFormData>(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) return;

    const fetchDriver = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await driversApi.getDriverById(driverId);
        const responseData = asRecord(res.data);
        const payload = isRecord(responseData.driver)
          ? responseData.driver
          : responseData;
        if (res.success && payload) {
          setDriver(payload);
          setFormData(normalizeDriverToForm(payload));
        } else {
          setError(res.message || "Driver details were not found.");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load driver details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.push(`/drivers/${driverId}`);
  };

  const handleViewHistory = () => {
    router.push(`/drivers/${driverId}?tab=${encodeURIComponent("Audit & Activity")}`);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await driversApi.updateDriver(
        driverId,
        buildDriverUpdatePayload(formData) as Record<string, unknown>,
      );
      router.push(`/drivers/${driverId}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to save driver changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  const driverRecord = driver || {};
  const personalInformation = nestedRecord(driverRecord, "personalInformation");
  const systemInformation = nestedRecord(driverRecord, "systemInformation");
  const lastModifiedByRecord = nestedRecord(driverRecord, "lastModifiedBy");
  const updatedByRecord = nestedRecord(driverRecord, "updatedBy");
  const systemLastModifiedByRecord = nestedRecord(systemInformation, "lastModifiedBy");
  const createdByRecord = nestedRecord(driverRecord, "createdBy");
  const systemCreatedByRecord = nestedRecord(systemInformation, "createdBy");
  const driverDisplayId = pickText(systemInformation.driverId, driverRecord.driverId, driverId);
  const dateJoined = systemInformation.dateJoined || driverRecord.createdAt;
  const lastLogin =
    systemInformation.lastLogin || driverRecord.lastLoginAt || driverRecord.lastLogin;
  const linkedPayment = pickText(systemInformation.linkedPayment, driverRecord.linkedPayment);
  const profileImage =
    pickText(driverRecord.avatar, driverRecord.profileImage, personalInformation.avatar) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      [formData.firstName, formData.lastName].filter(Boolean).join(" ") || "Driver",
    )}&background=E2E8F0&color=475569`;
  const lastModifiedBy = pickText(
    lastModifiedByRecord.name,
    updatedByRecord.name,
    systemLastModifiedByRecord.name,
    systemInformation.lastModifiedBy,
  );
  const lastModifiedDate =
    driverRecord.updatedAt || systemInformation.lastModifiedDate || systemInformation.updatedAt;
  const createdBy = pickText(
    createdByRecord.name,
    systemCreatedByRecord.name,
    systemInformation.createdBy,
  );
  const licenceAlert = getLicenceAlert(formData.licenceExpiry);
  const requiredFieldsValid = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phoneNumber,
    formData.addressLine1,
    formData.city,
    formData.state,
    formData.zipCode,
    formData.driversLicenceNumber,
    formData.licenceExpiry,
  ].every((value) => value.trim().length > 0);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_SECONDARY }}>
        Loading driver details...
      </div>
    );
  }

  if (!driver && error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: COLORS.ERROR_MAIN }}>
        {error}
      </div>
    );
  }

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
          href={`/drivers/${driverId}`}
          style={{ color: COLORS.TEXT_SECONDARY, textDecoration: "none" }}
        >
          Driver Profile
        </Link>
        <ChevronRight size={12} style={{ color: COLORS.TEXT_MUTED }} />
        <span style={{ color: COLORS.TEXT_MAIN, fontWeight: 500 }}>
          Edit Driver
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: "0.85rem 1rem",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "8px",
            color: "#DC2626",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

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
                src={profileImage}
                alt={`${formData.firstName || "Driver"} profile`}
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
                <span>Driver ID: {driverDisplayId || "--"}</span>
              </div>
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}
              >
                <span
                  className={`badge ${
                    formData.accountStatus === "Active"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                  style={{
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "4px 10px",
                    background: "#F0FDF4",
                    color:
                      formData.accountStatus === "Active" ? "#16A34A" : "#B45309",
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
                  {formData.accountStatus || "No Status"}
                </span>
                <span
                  className={`badge ${
                    formData.kycStatus === "Verified"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                  style={{
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "4px 10px",
                    background: "#F0FDF4",
                    color: formData.kycStatus === "Verified" ? "#16A34A" : "#B45309",
                  }}
                >
                  <ShieldCheck size={12} /> {formData.kycStatus || "KYC Pending"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleSave}
              disabled={saving}
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
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
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
                      name="accountStatus"
                      value={formData.accountStatus}
                      onChange={handleChange}
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
                    name="kycStatus"
                    value={formData.kycStatus}
                    onChange={handleChange}
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
                </label>
                <textarea
                  name="reasonForChange"
                  value={formData.reasonForChange}
                  onChange={handleChange}
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
              <SidebarItem label="Driver ID" value={driverDisplayId || "--"} />
              <SidebarItem
                label="Date Joined"
                value={formatDate(dateJoined)}
                icon={<Calendar size={14} />}
              />
              <SidebarItem
                label="Last Login"
                value={formatDateTime(lastLogin)}
                icon={<Clock size={14} />}
              />
              <SidebarItem
                label="Linked Payment Method"
                value={linkedPayment || "--"}
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
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      lastModifiedBy || "Admin",
                    )}&background=E2E8F0&color=475569`}
                    alt={lastModifiedBy || "Admin"}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    {lastModifiedBy || "--"}
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
                  {formatDateTime(lastModifiedDate)}
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
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      createdBy || "Admin",
                    )}&background=E2E8F0&color=475569`}
                    alt={createdBy || "Admin"}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    {createdBy || "--"}
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
                  {formatDateTime(dateJoined)}
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
                  backgroundColor: licenceAlert.isWarning ? "#FFF7ED" : "#F0FDF4",
                  padding: "0.85rem",
                  border: `1px solid ${
                    licenceAlert.isWarning ? "#FFEDD5" : "#DCFCE7"
                  }`,
                  borderRadius: "8px",
                }}
              >
                {licenceAlert.isWarning ? (
                  <AlertTriangle
                    size={18}
                    style={{ color: "#F97316", flexShrink: 0, marginTop: "2px" }}
                  />
                ) : (
                  <CircleCheck
                    size={18}
                    style={{ color: "#16A34A", flexShrink: 0, marginTop: "2px" }}
                  />
                )}
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
                      color: licenceAlert.isWarning ? "#9A3412" : COLORS.SUCCESS_DARK,
                    }}
                  >
                    {licenceAlert.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: licenceAlert.isWarning ? "#C2410C" : "#15803D",
                    }}
                  >
                    {licenceAlert.message}
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  backgroundColor: requiredFieldsValid ? "#F0FDF4" : "#FFF7ED",
                  padding: "0.85rem",
                  border: `1px solid ${
                    requiredFieldsValid ? "#DCFCE7" : "#FFEDD5"
                  }`,
                  borderRadius: "8px",
                }}
              >
                {requiredFieldsValid ? (
                  <CircleCheck
                    size={18}
                    style={{ color: "#16A34A", flexShrink: 0, marginTop: "2px" }}
                  />
                ) : (
                  <AlertTriangle
                    size={18}
                    style={{ color: "#F97316", flexShrink: 0, marginTop: "2px" }}
                  />
                )}
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
                      color: requiredFieldsValid ? COLORS.SUCCESS_DARK : "#9A3412",
                    }}
                  >
                    {requiredFieldsValid
                      ? "All Required Fields Valid"
                      : "Required Fields Missing"}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: requiredFieldsValid ? "#15803D" : "#C2410C",
                    }}
                  >
                    {requiredFieldsValid
                      ? "No validation errors detected"
                      : "Complete highlighted required fields before saving"}
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
                onClick={handleSave}
                disabled={saving}
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
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
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
                  cursor: "pointer",
                }}
              >
                <X size={16} /> Cancel & Return
              </button>
              <button
                onClick={handleViewHistory}
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
                  cursor: "pointer",
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
                href={`/drivers/${driverId}`}
              />
              <QuickNavLink
                icon={<FileText size={16} />}
                label="Agreements"
                href={`/drivers/${driverId}?tab=Agreements`}
              />
              <QuickNavLink
                icon={<CreditCard size={16} />}
                label="Payments"
                href={`/drivers/${driverId}?tab=Payments`}
              />
              <QuickNavLink
                icon={<Folder size={16} />}
                label="Documents"
                href={`/drivers/${driverId}?tab=${encodeURIComponent(
                  "Driver Documents",
                )}`}
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
