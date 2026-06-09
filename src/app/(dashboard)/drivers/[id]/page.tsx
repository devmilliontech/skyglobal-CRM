"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { driversApi } from "@/services/api/drivers";
import {
  ChevronRight,
  AlertTriangle,
  Edit,
  UserCheck,
  Ban,
  Key,
  Mail,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  FileText,
  MessageSquare,
  ExternalLink,
  CircleCheck,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import KYCVerificationQueue from "@/components/KYCVerificationQueue";
import DriverPayments from "@/components/DriverPayments";
import DriverAuditActivity from "@/components/DriverAuditActivity";
import DriverAgreements from "@/components/DriverAgreements";
import DriverDocuments from "@/components/DriverDocuments";

const DRIVER_TABS = [
  "Profile Details",
  "KYC Verification Queue",
  "Payments",
  "Driver Documents",
  "Agreements",
  "Audit & Activity",
] as const;

type DriverTab = (typeof DRIVER_TABS)[number];

type DriverSection = Record<string, unknown>;

type DriverDetail = {
  personalInformation?: DriverSection;
  systemInformation?: DriverSection;
  addressInformation?: DriverSection;
  documentInformation?: DriverSection;
  complianceStatus?: DriverSection;
  driver?: unknown;
  [key: string]: unknown;
};

const isDriverDetail = (value: unknown): value is DriverDetail =>
  typeof value === "object" && value !== null;

const getDriverPayload = (data: unknown): DriverDetail | null => {
  if (!isDriverDetail(data)) return null;
  return isDriverDetail(data.driver) ? data.driver : data;
};

const asRecord = (value: unknown): DriverSection =>
  isDriverDetail(value) ? value : {};

const nestedRecord = (record: DriverSection, key: string): DriverSection =>
  asRecord(record[key]);

const pickText = (...values: unknown[]) => {
  const value = values.find(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
  return typeof value === "string" ? value : "";
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
};

const toImageUrl = (value: string) => {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (!value.startsWith("/")) return value;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  try {
    return `${new URL(apiBaseUrl).origin}${value}`;
  } catch {
    return value;
  }
};

const normalizeDriverProfile = (driver: DriverDetail, routeId: string) => {
  const personal = nestedRecord(driver, "personalInformation");
  const address = nestedRecord(driver, "addressInformation");
  const documents = nestedRecord(driver, "documentInformation");
  const system = nestedRecord(driver, "systemInformation");
  const compliance = nestedRecord(driver, "complianceStatus");
  const user = nestedRecord(driver, "user");
  const nameParts = splitName(pickText(driver.name, user.name));

  const kycStatus = pickText(system.kycStatus, driver.kycStatus);
  const accountStatus = pickText(system.accountStatus, driver.accountStatus);
  const displayName = pickText(
    driver.name,
    user.name,
    [nameParts.firstName, nameParts.lastName].filter(Boolean).join(" "),
    "Driver",
  );
  const imageCandidate = pickText(
    driver.avatar,
    driver.profileImage,
    driver.profilePhoto,
    driver.image,
    personal.avatar,
    personal.profileImage,
    user.avatar,
    user.profileImage,
  );

  return {
    profileImage:
      toImageUrl(imageCandidate) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName,
      )}&background=E2E8F0&color=475569`,
    personalInformation: {
      firstName: pickText(personal.firstName, driver.firstName, nameParts.firstName),
      middleName: pickText(personal.middleName, driver.middleName),
      lastName: pickText(personal.lastName, driver.lastName, nameParts.lastName),
      email: pickText(personal.email, driver.email, user.email),
      phone: pickText(personal.phone, driver.phone, driver.phoneNumber, user.phone),
      dob: pickText(personal.dob, driver.dob),
    },
    addressInformation: {
      addressLine1: pickText(address.addressLine1, driver.addressLine1),
      addressLine2: pickText(address.addressLine2, driver.addressLine2),
      city: pickText(address.city, driver.city),
      state: pickText(address.state, driver.state),
      postalCode: pickText(address.postalCode, address.zipCode, driver.postalCode, driver.zipCode),
      country: pickText(address.country, driver.country),
    },
    documentInformation: {
      driverLicenceNumber: pickText(
        documents.driverLicenceNumber,
        driver.driverLicenceNumber,
        driver.driversLicenceNumber,
      ),
      licenceExpiryDate: pickText(
        documents.licenceExpiryDate,
        documents.licenseExpiryDate,
        driver.licenceExpiry,
        driver.licenseExpiry,
      ),
      passportNumber: pickText(documents.passportNumber, driver.passportNumber),
      visaExpiryDate: pickText(documents.visaExpiryDate, driver.visaExpiry),
      abn: pickText(documents.abn, driver.abn),
    },
    systemInformation: {
      driverId: pickText(system.driverId, driver.driverId, driver._id, routeId),
      kycStatus,
      accountStatus,
      dateJoined: pickText(system.dateJoined, driver.createdAt),
      lastLogin: pickText(system.lastLogin, driver.lastLoginAt, driver.lastLogin),
      linkedPayment: pickText(system.linkedPayment, driver.linkedPayment),
    },
    complianceStatus: {
      identityVerification: pickText(compliance.identityVerification, kycStatus),
      addressVerification: pickText(compliance.addressVerification),
      paymentSetup: pickText(compliance.paymentSetup, driver.paymentStatus),
    },
  };
};

export default function DriverProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const driverId = String(params?.id || "");
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) return;
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const res = await driversApi.getDriverById(driverId);
        const payload = getDriverPayload(res.data);
        if (res.success && payload) {
          setDriver(payload);
        }
      } catch (error) {
        console.error("Failed to fetch driver:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [driverId]);

  const [activeTab, setActiveTab] = useState<DriverTab>("Profile Details");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (DRIVER_TABS as readonly string[]).includes(tab)) {
      setActiveTab(tab as DriverTab);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading driver profile...
      </div>
    );
  }

  if (!driver) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: COLORS.ERROR_MAIN,
        }}
      >
        Driver not found
      </div>
    );
  }

  const {
    personalInformation,
    systemInformation,
    addressInformation,
    documentInformation,
    complianceStatus,
    profileImage,
  } = normalizeDriverProfile(driver, driverId);

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      <PageHeader
        title="Driver Profile"
        description="Manage driver information and compliance status"
        showBack
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
        <span style={{ color: COLORS.TEXT_MAIN, fontWeight: 500 }}>
          Driver Profile
        </span>
      </div>

      {/* Expiry Warning */}
      <div
        style={{
          background: "#FFF7ED",
          border: "1px solid #FFEDD5",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-start",
        }}
      >
        <AlertTriangle
          size={18}
          style={{ color: "#F97316", marginTop: "2px" }}
        />
        <div>
          <h4
            style={{ fontSize: "0.85rem", fontWeight: 700, color: "#9A3412" }}
          >
            Driver licence expiry
          </h4>
          <p style={{ fontSize: "0.8rem", color: "#C2410C" }}>
            Licence expires on{" "}
            {documentInformation?.licenceExpiryDate
              ? new Date(
                  documentInformation.licenceExpiryDate,
                ).toLocaleDateString()
              : "--"}
            . Please notify driver to renew before expiry.
          </p>
        </div>
      </div>

      {/* Profile Header */}
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
            <div
              style={{
                position: "relative",
                width: "95px",
                height: "95px",
                borderRadius: "50%",
                background: COLORS.PRIMARY_LIGHT,
                border: `2px solid ${COLORS.PRIMARY_LIGHT}`,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={profileImage}
                alt={`${personalInformation.firstName || "Driver"} profile`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {personalInformation?.firstName} {personalInformation?.lastName}
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
                  <Mail size={14} /> {personalInformation?.email}
                </span>
                <span>Driver ID: {systemInformation?.driverId}</span>
              </div>
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}
              >
                <span
                  className="badge badge-success"
                  style={{
                    fontSize: "0.65rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "currentColor",
                    }}
                  />{" "}
                  Active
                </span>
                <span
                  className="badge badge-success"
                  style={{
                    fontSize: "0.65rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <ShieldCheck size={12} /> KYC Verified
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href={`/drivers/${driverId}/edit`} style={{ textDecoration: "none" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  padding: "13px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <Edit size={14} /> Edit Driver
              </button>
            </Link>
            <button
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                padding: "13px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <UserCheck size={14} /> Approve Verification
            </button>
            <button
              style={{
                border: "1px solid #FECACA",
                color: "#DC2626",
                padding: "13px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Ban size={14} /> Suspend
            </button>
            <button
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                padding: "13px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Key size={14} /> Reset Password
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
          padding: "0 0.5rem",
        }}
      >
        {DRIVER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.75rem 0.25rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color:
                activeTab === tab ? COLORS.PRIMARY_MAIN : COLORS.TEXT_SECONDARY,
              borderBottom:
                activeTab === tab
                  ? `2px solid ${COLORS.PRIMARY_MAIN}`
                  : "2px solid transparent",
              transition: "all 0.2s",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ marginTop: "-1rem" }}>
        {activeTab === "Profile Details" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            {/* Left Side: Information Cards */}
            <div
              className="animate-fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Personal Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
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
                  <div>
                    <LabelValue
                      label="First Name"
                      value={personalInformation?.firstName || "--"}
                    />
                    <LabelValue
                      label="Last Name"
                      value={personalInformation?.lastName || "--"}
                    />
                    <LabelValue
                      label="Email"
                      value={personalInformation?.email || "--"}
                    />
                  </div>
                  <div>
                    <LabelValue
                      label="Middle Name"
                      value={personalInformation?.middleName || "--"}
                    />
                    <LabelValue
                      label="Date of Birth"
                      value={
                        personalInformation?.dob
                          ? new Date(
                              personalInformation.dob,
                            ).toLocaleDateString()
                          : "--"
                      }
                    />
                    <LabelValue
                      label="Phone Number"
                      value={personalInformation?.phone || "--"}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Address Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <LabelValue
                      label="Address Line 1"
                      value={addressInformation?.addressLine1 || "--"}
                    />
                    <LabelValue
                      label="City"
                      value={addressInformation?.city || "--"}
                    />
                    <LabelValue
                      label="Postal Code"
                      value={addressInformation?.postalCode || "--"}
                    />
                  </div>
                  <div>
                    <LabelValue
                      label="Address Line 2"
                      value={addressInformation?.addressLine2 || "--"}
                    />
                    <LabelValue
                      label="State"
                      value={addressInformation?.state || "--"}
                    />
                    <LabelValue
                      label="Country"
                      value={addressInformation?.country || "--"}
                    />
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
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
                  <div>
                    <LabelValue
                      label="Driver's Licence Number"
                      value={documentInformation?.driverLicenceNumber || "--"}
                    />
                    <LabelValue
                      label="Passport Number"
                      value={documentInformation?.passportNumber || "--"}
                    />
                    <LabelValue
                      label="ABN"
                      value={documentInformation?.abn || "--"}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MUTED,
                          marginBottom: "0.2rem",
                        }}
                      >
                        Licence Expiry Date
                      </p>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "#DC2626",
                        }}
                      >
                        {documentInformation?.licenceExpiryDate
                          ? new Date(
                              documentInformation.licenceExpiryDate,
                            ).toLocaleDateString()
                          : "--"}
                      </p>
                    </div>
                    <LabelValue
                      label="Visa Expiry Date"
                      value={
                        documentInformation?.visaExpiryDate
                          ? new Date(
                              documentInformation.visaExpiryDate,
                            ).toLocaleDateString()
                          : "--"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Active Agreements */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                  }}
                >
                  Active Agreements
                </h3>
                <div style={{ overflowX: "auto" }}>
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
                        <th style={tableHeaderStyle}>Agreement Title</th>
                        <th style={tableHeaderStyle}>Vehicle</th>
                        <th style={tableHeaderStyle}>Type</th>
                        <th style={tableHeaderStyle}>Start Date</th>
                        <th style={tableHeaderStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "none" }}>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          Toyota Camry Agreement
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          Toyota Camry 2023
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          Rent-to-Own
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          2024-01-15
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            className="badge badge-success"
                            style={{ fontSize: "0.6rem" }}
                          >
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Side: System Information, Compliance, Quick Actions, Notes */}
            <div
              className="animate-fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* System Information */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  System Information
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Driver ID
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      {systemInformation?.driverId || "--"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      KYC Status
                    </span>
                    <span
                      className={
                        systemInformation?.kycStatus === "Verified"
                          ? "badge badge-success"
                          : "badge badge-warning"
                      }
                      style={{ fontSize: "0.65rem" }}
                    >
                      {systemInformation?.kycStatus || "--"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Account Status
                    </span>
                    <span
                      className={
                        systemInformation?.accountStatus === "Active"
                          ? "badge badge-success"
                          : "badge badge-warning"
                      }
                      style={{ fontSize: "0.65rem" }}
                    >
                      {systemInformation?.accountStatus || "--"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Calendar size={14} /> Date Joined
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      {systemInformation?.dateJoined
                        ? new Date(
                            systemInformation.dateJoined,
                          ).toLocaleDateString()
                        : "--"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Clock size={14} /> Last Login
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      {systemInformation?.lastLogin
                        ? new Date(systemInformation.lastLogin).toLocaleString()
                        : "--"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <CreditCard size={14} /> Linked Payment
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      {systemInformation?.linkedPayment || "--"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Compliance Status
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Driver&apos;s Licence
                    </span>
                    <div
                      style={{
                        backgroundColor: "#ffedd5",
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "#B45309",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                        }}
                      >
                        <AlertTriangle size={12} /> Expiring Soon
                      </div>
                    </div>
                  </div>
                  {[
                    {
                      label: "Identity Verification",
                      status: complianceStatus?.identityVerification || "--",
                    },
                    {
                      label: "Address Verification",
                      status: complianceStatus?.addressVerification || "--",
                    },
                    {
                      label: "Payment Setup",
                      status: complianceStatus?.paymentSetup || "--",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        className={
                          item.status === "Verified" ||
                          item.status === "Complete"
                            ? "badge badge-success"
                            : "badge badge-warning"
                        }
                        style={{
                          fontSize: "0.65rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "4px 12px",
                        }}
                      >
                        {item.status === "Verified" ||
                        item.status === "Complete" ? (
                          <CircleCheck size={14} />
                        ) : (
                          <AlertTriangle size={14} />
                        )}
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid var(--bg-page)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {[
                    {
                      label: "View Agreements",
                      icon: <ExternalLink size={14} />,
                    },
                    { label: "View Payments", icon: <CreditCard size={14} /> },
                    { label: "View Documents", icon: <FileText size={14} /> },
                    { label: "View Notes", icon: <MessageSquare size={14} /> },
                  ].map((action, i) => (
                    <button
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 0",
                        color: COLORS.TEXT_SECONDARY,
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = COLORS.PRIMARY_MAIN)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = COLORS.TEXT_SECONDARY)
                      }
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.6rem 0",
                      color: "#DC2626",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Ban size={14} /> Suspend Account
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  Internal Notes
                </h3>
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
                <button
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    background: COLORS.PRIMARY_MAIN,
                    color: COLORS.BG_CARD,
                  }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "KYC Verification Queue" && (
          <div className="animate-fade-in">
            <KYCVerificationQueue />
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="animate-fade-in">
            <DriverPayments />
          </div>
        )}

        {activeTab === "Driver Documents" && (
          <div className="animate-fade-in">
            <DriverDocuments driverId={driverId} />
          </div>
        )}

        {activeTab === "Agreements" && (
          <div className="animate-fade-in">
            <DriverAgreements />
          </div>
        )}

        {activeTab === "Audit & Activity" && (
          <div className="animate-fade-in">
            <DriverAuditActivity
              onBack={() => setActiveTab("Profile Details")}
            />
          </div>
        )}

        {activeTab !== "Profile Details" &&
          activeTab !== "KYC Verification Queue" &&
          activeTab !== "Payments" &&
          activeTab !== "Driver Documents" &&
          activeTab !== "Agreements" &&
          activeTab !== "Audit & Activity" && (
            <div
              className="card"
              style={{
                padding: "3rem",
                textAlign: "center",
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              <h3>{activeTab} content is coming soon...</h3>
            </div>
          )}
      </div>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: COLORS.TEXT_MUTED,
  textAlign: "left",
  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
  textTransform: "uppercase",
};

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: COLORS.TEXT_MUTED,
          marginBottom: "0.2rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {value}
      </p>
    </div>
  );
}
