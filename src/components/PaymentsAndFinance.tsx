"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import {
  CreditCard,
  Info,
  DollarSign,
  Briefcase,
  Smartphone,
  Wallet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@headlessui/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import SelectField from "./SelectField";
import { adminSettingsApi } from "@/services/api/adminSettings";

const METHOD_META: Record<string, { name: string; desc: string; icon: any }> = {
  stripe: { name: "Stripe", desc: "Credit/Debit Cards", icon: <CreditCard size={20} color="#6366F1" /> },
  paypal: { name: "PayPal", desc: "Digital Wallet", icon: <Wallet size={20} color="#003087" /> },
  bank: { name: "Bank Transfer", desc: "Direct Transfer", icon: <Briefcase size={20} color="#10B981" /> },
  gpay: { name: "Google Pay", desc: "Mobile Wallet", icon: <Smartphone size={20} color="#EA4335" /> },
  applepay: { name: "Apple Pay", desc: "Mobile Wallet", icon: <Smartphone size={20} color="#000000" /> },
  cash: { name: "Cash Payment", desc: "In-Person", icon: <DollarSign size={20} color="#059669" /> },
};

export default function PaymentsAndFinance() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Payment Methods State
  const [methods, setMethods] = useState<Record<string, { active: boolean; fee: string }>>({
    stripe: { active: true, fee: "2.9%" },
    paypal: { active: true, fee: "3.4%" },
    bank: { active: false, fee: "0%" },
    gpay: { active: true, fee: "2.9%" },
    applepay: { active: false, fee: "2.9%" },
    cash: { active: true, fee: "0%" },
  });

  // Commission & Fees State
  const [platformCommissionRate, setPlatformCommissionRate] = useState(15);
  const [lateReturnFeePerHour, setLateReturnFeePerHour] = useState(25);
  const [bookingFeeFixed, setBookingFeeFixed] = useState(5.99);
  const [cancellationFeeFixed, setCancellationFeeFixed] = useState(15);
  const [damageAssessmentFee, setDamageAssessmentFee] = useState(5.99);
  const [processingFeePercentage, setProcessingFeePercentage] = useState(2.9);

  // Tax & GST Settings State
  const [enableGstTax, setEnableGstTax] = useState(true);
  const [taxGstPercentage, setTaxGstPercentage] = useState(10);
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState("ABN 12 345 678 901");
  const [taxCalculationMethod, setTaxCalculationMethod] = useState("exclusive");
  const [taxDisplayMethod, setTaxDisplayMethod] = useState("separate");
  const [applyTaxToFees, setApplyTaxToFees] = useState(true);

  // Refund Rules State
  const [policyType, setPolicyType] = useState("moderate");
  const [processingTimeDays, setProcessingTimeDays] = useState(5);
  const [refundMethod, setRefundMethod] = useState("original");
  const [deductProcessingFee, setDeductProcessingFee] = useState(true);
  const [allowPartialRefunds, setAllowPartialRefunds] = useState(false);
  const [requireAdminApproval, setRequireAdminApproval] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminSettingsApi.getPaymentsAndFinance();
      const rules = (res.data as any)?.financialRules || {};

      if (rules.paymentMethods) {
        setMethods((prev) => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            if (rules.paymentMethods[key]) {
              updated[key] = {
                active: rules.paymentMethods[key].active ?? prev[key].active,
                fee: rules.paymentMethods[key].fee ?? prev[key].fee,
              };
            }
          }
          return updated;
        });
      }

      setPlatformCommissionRate(rules.platformCommissionRate ?? 15);
      setLateReturnFeePerHour(rules.lateReturnFeePerHour ?? 25);
      setBookingFeeFixed(rules.bookingFees?.fixed ?? 5.99);
      setCancellationFeeFixed(rules.cancellationFeeFixed ?? 15);
      setDamageAssessmentFee(rules.damageAssessmentFee ?? 5.99);
      setProcessingFeePercentage(rules.processingFeePercentage ?? 2.9);

      setEnableGstTax(rules.enableGstTax ?? true);
      setTaxGstPercentage(rules.taxGstPercentage ?? 10);
      setTaxRegistrationNumber(rules.taxRegistrationNumber || "ABN 12 345 678 901");
      setTaxCalculationMethod(rules.taxCalculationMethod || "exclusive");
      setTaxDisplayMethod(rules.taxDisplayMethod || "separate");

      if (rules.refundRules) {
        setProcessingTimeDays(rules.refundRules.processingTimeDays ?? 5);
        setPolicyType(rules.refundRules.policyType || "moderate");
        setRefundMethod(rules.refundRules.refundMethod || "original");
        setDeductProcessingFee(rules.refundRules.deductProcessingFee ?? true);
        setAllowPartialRefunds(rules.refundRules.allowPartialRefunds ?? false);
        setRequireAdminApproval(rules.refundRules.requireAdminApproval ?? true);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleMethodActive = (key: string) => {
    setMethods((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await adminSettingsApi.updatePaymentsAndFinance({
        platformCommissionRate,
        lateReturnFeePerHour,
        cancellationFeeFixed,
        damageAssessmentFee,
        processingFeePercentage,
        enableGstTax,
        taxGstPercentage,
        taxRegistrationNumber,
        taxCalculationMethod,
        taxDisplayMethod,
        bookingFees: {
          fixed: bookingFeeFixed,
          percentage: 0,
        },
        paymentMethods: methods,
        refundRules: {
          processingTimeDays,
          policyType,
          refundMethod,
          deductProcessingFee,
          allowPartialRefunds,
          requireAdminApproval,
        },
      });
      setStatusMsg({ text: "Payments & finance configuration saved successfully.", isError: false });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to save configuration.", isError: true });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
        Loading payments & finance settings...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
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
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {statusMsg.isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {statusMsg.text}
        </div>
      )}

      {/* Payment Methods Section */}
      <Card padding="2rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              Payment Methods
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Configure available payment options and their status
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: COLORS.PRIMARY_MAIN,
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            <Info size={16} />
            Live Configuration
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {Object.entries(methods).map(([key, method]) => {
            const meta = METHOD_META[key] || { name: key, desc: "", icon: null };
            return (
              <div
                key={key}
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: "#F9FAFB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                        }}
                      >
                        {meta.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {meta.desc}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={method.active}
                    onChange={() => toggleMethodActive(key)}
                    style={{
                      backgroundColor: method.active ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                        transform: method.active ? "translateX(24px)" : "translateX(4px)",
                        transition: "transform 0.2s",
                        marginTop: "4px",
                      }}
                    />
                  </Switch>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.5rem",
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
                  }}
                >
                  <StatusBadge status={method.active ? "Active" : "Inactive"} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Processing Fee:{" "}
                    <span style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                      {method.fee}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Commission & Fees Section */}
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
            Commission & Fees
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure platform commission rates and additional fees
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Platform Commission Rate
                </label>
                <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={platformCommissionRate}
                  onChange={(e) => setPlatformCommissionRate(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.5rem 0.75rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  %
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED, marginTop: "0.5rem" }}>
                Valid range: 0% - 50%
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Late Return Fee
                </label>
                <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
              </div>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  value={lateReturnFeePerHour}
                  onChange={(e) => setLateReturnFeePerHour(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 4rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  / hour
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Booking Fee (Fixed)
                </label>
                <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
              </div>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={bookingFeeFixed}
                  onChange={(e) => setBookingFeeFixed(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Cancellation Fee
                </label>
                <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
              </div>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={cancellationFeeFixed}
                  onChange={(e) => setCancellationFeeFixed(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Damage Assessment Fee
                </label>
                <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
              </div>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={damageAssessmentFee}
                  onChange={(e) => setDamageAssessmentFee(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Payment Processing Fee (%)
                </label>
                <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  step="0.1"
                  value={processingFeePercentage}
                  onChange={(e) => setProcessingFeePercentage(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.5rem 0.75rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tax & GST Settings Section */}
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
            Tax & GST Settings
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure tax rates and GST calculations
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={enableGstTax}
                  onChange={(e) => setEnableGstTax(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: COLORS.PRIMARY_MAIN }}
                />
                <span style={{ fontSize: "0.9rem", fontWeight: 500, color: COLORS.TEXT_MAIN }}>
                  Enable GST/Tax Collection
                </span>
              </label>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                    GST/Tax Rate
                  </label>
                  <Info size={14} style={{ color: COLORS.TEXT_MUTED }} />
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={taxGstPercentage}
                    onChange={(e) => setTaxGstPercentage(Number(e.target.value))}
                    disabled={!enableGstTax}
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 1rem",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.BORDER_MAIN}`,
                      fontSize: "1rem",
                      outline: "none",
                      backgroundColor: enableGstTax ? "#fff" : "#F3F4F6",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 500,
                    }}
                  >
                    %
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED, marginTop: "0.5rem" }}>
                  Valid range: 0% - 30%
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN, marginBottom: "0.75rem" }}>
                  Tax Registration Number
                </label>
                <input
                  type="text"
                  value={taxRegistrationNumber}
                  onChange={(e) => setTaxRegistrationNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <SelectField
                label="Tax Calculation Method"
                value={taxCalculationMethod}
                onChange={(e) => setTaxCalculationMethod(e.target.value)}
                options={[
                  { label: "Exclusive (Tax added to price)", value: "exclusive" },
                  { label: "Inclusive (Tax included in price)", value: "inclusive" },
                ]}
              />

              <SelectField
                label="Tax Display on Invoice"
                value={taxDisplayMethod}
                onChange={(e) => setTaxDisplayMethod(e.target.value)}
                options={[
                  { label: "Show as separate line item", value: "separate" },
                  { label: "Combined with item price", value: "combined" },
                ]}
              />

              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={applyTaxToFees}
                  onChange={(e) => setApplyTaxToFees(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: COLORS.PRIMARY_MAIN }}
                />
                <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                  Apply tax to processing & late return fees
                </span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Refund Rules Section */}
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
            Refund Rules
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure refund policies and conditions
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <SelectField
            label="Refund Policy Type"
            value={policyType}
            onChange={(e) => setPolicyType(e.target.value)}
            options={[
              { label: "Moderate - 50% refund up to 48h before", value: "moderate" },
              { label: "Strict - No refunds within 48h", value: "strict" },
              { label: "Flexible - Full refund up to 24h before", value: "flexible" },
            ]}
          />

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN, marginBottom: "0.75rem" }}>
                Processing Time (Days)
              </label>
              <input
                type="number"
                value={processingTimeDays}
                onChange={(e) => setProcessingTimeDays(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
              <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED, marginTop: "0.5rem" }}>
                Business days to process refund
              </p>
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <SelectField
                label="Refund Method"
                value={refundMethod}
                onChange={(e) => setRefundMethod(e.target.value)}
                options={[
                  { label: "Original payment method", value: "original" },
                  { label: "Store Credit", value: "store_credit" },
                ]}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={deductProcessingFee}
                onChange={(e) => setDeductProcessingFee(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: COLORS.PRIMARY_MAIN }}
              />
              <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                Deduct processing fees from refund
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={allowPartialRefunds}
                onChange={(e) => setAllowPartialRefunds(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: COLORS.PRIMARY_MAIN }}
              />
              <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                Allow partial refunds for early termination
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={requireAdminApproval}
                onChange={(e) => setRequireAdminApproval(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: COLORS.PRIMARY_MAIN }}
              />
              <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                Require admin approval for refunds over $500
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Footer Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "1rem",
          paddingTop: "2rem",
          borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          gap: "1rem",
        }}
      >
        <Button variant="secondary" size="lg" onClick={loadData}>
          Discard Changes
        </Button>
        <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
