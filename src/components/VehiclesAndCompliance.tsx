"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import { Info, AlertCircle, Check } from "lucide-react";
import { Switch } from "@headlessui/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "./SelectField";
import { adminSettingsApi } from "@/services/api/adminSettings";

const DEFAULT_DOCS = [
  { label: "Vehicle Registration Certificate", checked: true },
  { label: "Valid Insurance Policy", checked: true },
  { label: "Pollution Under Control (PUC) Certificate", checked: true },
  { label: "Owner KYC Documents (ID + Address Proof)", checked: true },
  { label: "Fitness Certificate (Commercial vehicles)", checked: false },
  { label: "Vehicle Inspection Report", checked: false },
  { label: "Vehicle Photos (Minimum 6 angles)", checked: false },
];

export default function VehiclesAndCompliance({
  setActiveTab,
}: {
  setActiveTab?: (tab: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [settings, setSettings] = useState({
    requireManualApproval: true,
    autoApproveVerified: false,
    enforceExpiryChecks: true,
    annualSafetyInspection: true,
    enforcePUC: true,
    commercialPermit: false,
    notifyAuthorities: false,
    mandatoryInsurance: true,
    verifyInsuranceAPI: true,
    suspendOnLapse: true,
  });

  const [minVehicleAgeYears, setMinVehicleAgeYears] = useState(10);
  const [maxOdometerReading, setMaxOdometerReading] = useState(200000);
  const [approvalSla, setApprovalSla] = useState(48);
  const [documentExpiryAlertDays, setDocumentExpiryAlertDays] = useState(30);
  const [minCoverageAmount, setMinCoverageAmount] = useState(1000000);
  const [expiryAlertDays, setExpiryAlertDays] = useState(15);
  const [scoreThreshold, setScoreThreshold] = useState(80);

  const [rejectionNotification, setRejectionNotification] = useState("Email + SMS + In-App");
  const [pucRenewalFrequency, setPucRenewalFrequency] = useState("Every 6 Months");
  const [complianceViolationHandling, setComplianceViolationHandling] = useState("Immediate Suspension + Owner Alert");
  const [auditTrailRetentionPeriod, setAuditTrailRetentionPeriod] = useState("5 Years");

  const [requiredDocs, setRequiredDocs] = useState(DEFAULT_DOCS);
  const [acceptedProviders, setAcceptedProviders] = useState<string[]>(["All Certified Providers"]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminSettingsApi.getVehicleApprovalRules();
      const d = res.data as any;
      if (d?.rules) {
        const v = d.rules.vehicleApprovalRules || {};
        const c = d.rules.complianceSettings || {};
        const i = d.rules.insuranceRules || {};

        setSettings({
          requireManualApproval: v.requireManualApproval ?? true,
          autoApproveVerified: v.autoApproveVerified ?? false,
          enforceExpiryChecks: c.enforceExpiryChecks ?? true,
          annualSafetyInspection: c.annualSafetyInspection ?? true,
          enforcePUC: c.enforcePUC ?? true,
          commercialPermit: c.commercialPermit ?? false,
          notifyAuthorities: c.notifyAuthorities ?? false,
          mandatoryInsurance: i.mandatoryInsurance ?? true,
          verifyInsuranceAPI: i.verifyInsuranceAPI ?? true,
          suspendOnLapse: i.suspendOnLapse ?? true,
        });

        setMinVehicleAgeYears(v.minVehicleAgeYears ?? 10);
        setMaxOdometerReading(v.maxOdometerReading?.value ?? 200000);
        setApprovalSla(v.approvalSla?.value ?? 48);
        setDocumentExpiryAlertDays(c.documentExpiryAlertDays ?? 30);
        setMinCoverageAmount(i.minCoverageAmount ?? 1000000);
        setExpiryAlertDays(i.expiryAlertDays ?? 15);
        setScoreThreshold(c.complianceScoreThreshold ?? 80);

        if (v.rejectionNotification) setRejectionNotification(v.rejectionNotification);
        if (c.pucRenewalFrequency) setPucRenewalFrequency(c.pucRenewalFrequency);
        if (c.complianceViolationHandling) setComplianceViolationHandling(c.complianceViolationHandling);
        if (c.auditTrailRetentionPeriod) setAuditTrailRetentionPeriod(c.auditTrailRetentionPeriod);

        if (Array.isArray(v.requiredDocuments) && v.requiredDocuments.length > 0) {
          setRequiredDocs(v.requiredDocuments);
        }
        if (Array.isArray(i.acceptedProviders) && i.acceptedProviders.length > 0) {
          setAcceptedProviders(i.acceptedProviders);
        }
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDoc = (idx: number) => {
    setRequiredDocs((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, checked: !doc.checked } : doc))
    );
  };

  const toggleProvider = (provider: string) => {
    setAcceptedProviders((prev) => {
      if (provider === "All Certified Providers") {
        return ["All Certified Providers"];
      }
      const filtered = prev.filter((p) => p !== "All Certified Providers");
      if (filtered.includes(provider)) {
        const next = filtered.filter((p) => p !== provider);
        return next.length === 0 ? ["All Certified Providers"] : next;
      }
      return [...filtered, provider];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await adminSettingsApi.updateVehicleApprovalRules({
        vehicleApprovalRules: {
          requireManualApproval: settings.requireManualApproval,
          autoApproveVerified: settings.autoApproveVerified,
          minVehicleAgeYears,
          maxOdometerReading: { value: maxOdometerReading, unit: "km" },
          approvalSla: { value: approvalSla, unit: "hours" },
          requiredDocumentsList: requiredDocs,
          rejectionNotification,
        },
        complianceSettings: {
          enforceExpiryChecks: settings.enforceExpiryChecks,
          documentExpiryAlertDays,
          annualSafetyInspection: settings.annualSafetyInspection,
          enforcePUC: settings.enforcePUC,
          pucRenewalFrequency,
          commercialPermit: settings.commercialPermit,
          complianceViolationHandling,
          auditTrailRetentionPeriod,
          notifyAuthorities: settings.notifyAuthorities,
          complianceScoreThreshold: scoreThreshold,
        },
        insuranceRules: {
          mandatoryInsurance: settings.mandatoryInsurance,
          minCoverageAmount,
          coverageCurrency: "₹",
          expiryAlertDays,
          verifyInsuranceAPI: settings.verifyInsuranceAPI,
          suspendOnLapse: settings.suspendOnLapse,
          acceptedProviders,
        },
      });
      setStatusMsg({ text: "Vehicle & compliance settings saved successfully.", isError: false });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to save settings.", isError: true });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleReset = () => {
    setRequiredDocs(DEFAULT_DOCS);
    setSettings({
      requireManualApproval: true,
      autoApproveVerified: false,
      enforceExpiryChecks: true,
      annualSafetyInspection: true,
      enforcePUC: true,
      commercialPermit: false,
      notifyAuthorities: false,
      mandatoryInsurance: true,
      verifyInsuranceAPI: true,
      suspendOnLapse: true,
    });
    setMinVehicleAgeYears(10);
    setMaxOdometerReading(200000);
    setApprovalSla(48);
    setDocumentExpiryAlertDays(30);
    setMinCoverageAmount(1000000);
    setExpiryAlertDays(15);
    setScoreThreshold(80);
    setRejectionNotification("Email + SMS + In-App");
    setPucRenewalFrequency("Every 6 Months");
    setComplianceViolationHandling("Immediate Suspension + Owner Alert");
    setAuditTrailRetentionPeriod("5 Years");
    setAcceptedProviders(["All Certified Providers"]);
  };

  const inputBaseStyle: React.CSSProperties = {
    flex: 1,
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    border: `1px solid ${COLORS.BORDER_MAIN}`,
    fontSize: "0.9rem",
    outline: "none",
    height: "42px",
    boxSizing: "border-box",
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
        Loading compliance settings...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "-1rem",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setActiveTab && setActiveTab("reports")}
        >
          View Compliance Reports
        </Button>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: "1rem 1.25rem",
            backgroundColor: statusMsg.isError ? "#FEF2F2" : "#F0FDF4",
            border: `1px solid ${statusMsg.isError ? "#FECACA" : "#BBF7D0"}`,
            borderRadius: "12px",
            color: statusMsg.isError ? "#991B1B" : "#15803D",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Warning Banner */}
      <div
        style={{
          padding: "1rem 1.25rem",
          backgroundColor: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: "12px",
          display: "flex",
          gap: "1rem",
        }}
      >
        <div style={{ color: "#EF4444", marginTop: "2px" }}>
          <AlertCircle size={20} />
        </div>
        <div>
          <h4
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#991B1B",
              marginBottom: "0.25rem",
            }}
          >
            Compliance Impact Warning
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#B91C1C" }}>
            Stricter compliance rules may affect existing vehicle approvals and
            active rentals. Changes require confirmation before applying.
          </p>
        </div>
      </div>

      {/* Vehicle Approval Rules */}
      <Card padding="2rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
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
              Vehicle Approval Rules
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Configure approval thresholds and verification requirements for
              vehicle onboarding
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: COLORS.PRIMARY_MAIN,
                backgroundColor: COLORS.INFO_LIGHT,
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              Role: Super Admin
            </span>
            <Info size={16} style={{ color: COLORS.PRIMARY_MAIN }} />
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Require Manual Admin Approval
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  All vehicle submissions require admin review before approval
                </p>
              </div>
              <Switch
                checked={settings.requireManualApproval}
                onChange={() => toggleSetting("requireManualApproval")}
                style={{
                  backgroundColor: settings.requireManualApproval
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.requireManualApproval
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Auto-Approve Verified Owners
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Skip manual review for owners with verified KYC and past
                  approvals
                </p>
              </div>
              <Switch
                checked={settings.autoApproveVerified}
                onChange={() => toggleSetting("autoApproveVerified")}
                style={{
                  backgroundColor: settings.autoApproveVerified
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.autoApproveVerified
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Minimum Vehicle Age Allowed
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={minVehicleAgeYears}
                  onChange={(e) => setMinVehicleAgeYears(Number(e.target.value))}
                  style={inputBaseStyle}
                />
                <div style={{ width: "120px" }}>
                  <SelectField
                    options={[
                      { label: "years", value: "years" },
                      { label: "months", value: "months" },
                    ]}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderColor: COLORS.BORDER_MAIN,
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Maximum Odometer Reading
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={maxOdometerReading}
                  onChange={(e) => setMaxOdometerReading(Number(e.target.value))}
                  style={inputBaseStyle}
                />
                <div style={{ width: "120px" }}>
                  <SelectField
                    options={[
                      { label: "km", value: "km" },
                      { label: "miles", value: "miles" },
                    ]}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderColor: COLORS.BORDER_MAIN,
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Approval Turnaround Time (SLA)
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={approvalSla}
                  onChange={(e) => setApprovalSla(Number(e.target.value))}
                  style={inputBaseStyle}
                />
                <div style={{ width: "120px" }}>
                  <SelectField
                    options={[
                      { label: "hours", value: "hours" },
                      { label: "days", value: "days" },
                    ]}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderColor: COLORS.BORDER_MAIN,
                    }}
                  />
                </div>
              </div>
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Required Documents for Approval
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {requiredDocs.map((doc, idx) => (
                  <label
                    key={idx}
                    onClick={() => toggleDoc(idx)}
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
                        border: `1px solid ${doc.checked ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                        backgroundColor: doc.checked
                          ? COLORS.PRIMARY_MAIN
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {doc.checked && <Check size={12} color="#fff" />}
                    </div>
                    <span
                      style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}
                    >
                      {doc.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Rejection Notification
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ height: "42px" }}>
                <SelectField
                  value={rejectionNotification}
                  onChange={(e) => setRejectionNotification(e.target.value)}
                  options={[
                    { label: "Email + SMS + In-App", value: "Email + SMS + In-App" },
                    { label: "Email + In-App", value: "Email + In-App" },
                    { label: "Email Only", value: "Email Only" },
                  ]}
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                    borderColor: COLORS.BORDER_MAIN,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Requirements */}
      <Card padding="2rem">
        <div
          style={{
            marginBottom: "2rem",
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
              Compliance Requirements
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Define regulatory compliance thresholds and enforcement policies
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#D97706",
                backgroundColor: "#FEF3C7",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              Regulatory
            </span>
            <Info size={16} style={{ color: COLORS.PRIMARY_MAIN }} />
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Enforce Document Expiry Checks
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Automatically suspend vehicles with expired compliance
                  documents
                </p>
              </div>
              <Switch
                checked={settings.enforceExpiryChecks}
                onChange={() => toggleSetting("enforceExpiryChecks")}
                style={{
                  backgroundColor: settings.enforceExpiryChecks
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.enforceExpiryChecks
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Document Expiry Alert Threshold
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  value={documentExpiryAlertDays}
                  onChange={(e) => setDocumentExpiryAlertDays(Number(e.target.value))}
                  style={inputBaseStyle}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontSize: "0.85rem",
                    pointerEvents: "none",
                  }}
                >
                  days before expiry
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Mandatory Annual Safety Inspection
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Require annual safety inspection by certified mechanic
                </p>
              </div>
              <Switch
                checked={settings.annualSafetyInspection}
                onChange={() => toggleSetting("annualSafetyInspection")}
                style={{
                  backgroundColor: settings.annualSafetyInspection
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.annualSafetyInspection
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Enforce Pollution Standards (PUC)
                  </h4>
                  <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
                </div>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Block vehicles without valid PUC from being listed
                </p>
              </div>
              <Switch
                checked={settings.enforcePUC}
                onChange={() => toggleSetting("enforcePUC")}
                style={{
                  backgroundColor: settings.enforcePUC
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.enforcePUC
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  PUC Renewal Frequency
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ height: "42px" }}>
                <SelectField
                  value={pucRenewalFrequency}
                  onChange={(e) => setPucRenewalFrequency(e.target.value)}
                  options={[
                    { label: "Every 6 Months", value: "Every 6 Months" },
                    { label: "Annually", value: "Annually" },
                  ]}
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                    borderColor: COLORS.BORDER_MAIN,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Commercial Permit Requirement
                  </h4>
                  <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
                </div>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Require commercial permit for vehicles used in rental
                  operations
                </p>
              </div>
              <Switch
                checked={settings.commercialPermit}
                onChange={() => toggleSetting("commercialPermit")}
                style={{
                  backgroundColor: settings.commercialPermit
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.commercialPermit
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Compliance Violation Handling
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ height: "42px" }}>
                <SelectField
                  value={complianceViolationHandling}
                  onChange={(e) => setComplianceViolationHandling(e.target.value)}
                  options={[
                    {
                      label: "Immediate Suspension + Owner Alert",
                      value: "Immediate Suspension + Owner Alert",
                    },
                    { label: "Warning Only", value: "Warning Only" },
                    {
                      label: "Grace Period (7 days)",
                      value: "Grace Period (7 days)",
                    },
                  ]}
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                    borderColor: COLORS.BORDER_MAIN,
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Audit Trail Retention Period
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ height: "42px" }}>
                <SelectField
                  value={auditTrailRetentionPeriod}
                  onChange={(e) => setAuditTrailRetentionPeriod(e.target.value)}
                  options={[
                    { label: "5 Years", value: "5 Years" },
                    { label: "3 Years", value: "3 Years" },
                    { label: "7 Years", value: "7 Years" },
                  ]}
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                    borderColor: COLORS.BORDER_MAIN,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Notify Authorities of Violations
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Automatically report serious compliance violations to
                  regulatory bodies
                </p>
              </div>
              <Switch
                checked={settings.notifyAuthorities}
                onChange={() => toggleSetting("notifyAuthorities")}
                style={{
                  backgroundColor: settings.notifyAuthorities
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.notifyAuthorities
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Compliance Score Threshold
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoreThreshold}
                  onChange={(e) => setScoreThreshold(Number(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: COLORS.PRIMARY_MAIN,
                    cursor: "pointer",
                    height: "4px",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    minWidth: "40px",
                  }}
                >
                  {scoreThreshold}%
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginTop: "0.5rem",
                }}
              >
                Vehicles below this score will be flagged for review
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Insurance Rules */}
      <Card padding="2rem">
        <div
          style={{
            marginBottom: "2rem",
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
              Insurance Rules
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Configure insurance coverage requirements and validation rules
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#DC2626",
                backgroundColor: "#FEE2E2",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              Critical
            </span>
            <Info size={16} style={{ color: COLORS.PRIMARY_MAIN }} />
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Mandatory Insurance Coverage
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  All vehicles must have active insurance to be listed
                </p>
              </div>
              <Switch
                checked={settings.mandatoryInsurance}
                onChange={() => toggleSetting("mandatoryInsurance")}
                style={{
                  backgroundColor: settings.mandatoryInsurance
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.mandatoryInsurance
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            {/* Minimum Coverage Amount */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Minimum Coverage Amount
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1.75rem",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80px" }}>
                  <SelectField
                    options={[
                      { label: "₹", value: "₹" },
                      { label: "$", value: "$" },
                      { label: "€", value: "€" },
                    ]}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderColor: COLORS.BORDER_MAIN,
                    }}
                  />
                </div>
                <input
                  type="number"
                  value={minCoverageAmount}
                  onChange={(e) => setMinCoverageAmount(Number(e.target.value))}
                  style={inputBaseStyle}
                />
              </div>
            </div>

            {/* Required Coverage Types */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Required Coverage Types
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {[
                  { label: "Third-Party Liability", checked: true },
                  { label: "Comprehensive Coverage", checked: true },
                  { label: "Personal Accident Cover", checked: false },
                  { label: "Zero Depreciation", checked: false },
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
                        flexShrink: 0,
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

            {/* Insurance Expiry Alert */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Insurance Expiry Alert
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  value={expiryAlertDays}
                  onChange={(e) => setExpiryAlertDays(Number(e.target.value))}
                  style={inputBaseStyle}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontSize: "0.85rem",
                    pointerEvents: "none",
                  }}
                >
                  days before expiry
                </span>
              </div>
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
            {/* Verify Insurance with Provider API */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Verify Insurance with Provider API
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Automatically validate insurance policy with provider database
                </p>
              </div>
              <Switch
                checked={settings.verifyInsuranceAPI}
                onChange={() => toggleSetting("verifyInsuranceAPI")}
                style={{
                  backgroundColor: settings.verifyInsuranceAPI
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.verifyInsuranceAPI
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            {/* Suspend on Insurance Lapse */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Suspend on Insurance Lapse
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Automatically suspend vehicle listing if insurance expires
                </p>
              </div>
              <Switch
                checked={settings.suspendOnLapse}
                onChange={() => toggleSetting("suspendOnLapse")}
                style={{
                  backgroundColor: settings.suspendOnLapse
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: settings.suspendOnLapse
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            {/* Accepted Insurance Providers */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Accepted Insurance Providers
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  padding: "0.75rem",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {[
                  "All Certified Providers",
                  "ICICI Lombard",
                  "HDFC ERGO",
                  "Bajaj Allianz",
                  "TATA AIG",
                  "Oriental Insurance",
                ].map((provider) => {
                  const isSelected = acceptedProviders.includes(provider);
                  return (
                    <div
                      key={provider}
                      onClick={() => toggleProvider(provider)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        backgroundColor: isSelected ? COLORS.PRIMARY_MAIN : "transparent",
                        color: isSelected ? "#fff" : COLORS.TEXT_MAIN,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: isSelected ? 600 : 500,
                        transition: "all 0.2s",
                      }}
                    >
                      {provider}
                    </div>
                  );
                })}
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginTop: "0.4rem",
                }}
              >
                Click to toggle providers
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <Button variant="secondary" size="lg" onClick={loadData}>
            Cancel
          </Button>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button variant="secondary" size="lg" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
