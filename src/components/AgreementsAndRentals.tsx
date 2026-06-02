"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import { Info, AlertTriangle } from "lucide-react";
import { Switch } from "@headlessui/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "./SelectField";
import { adminSettingsApi } from "@/services/api/adminSettings";

export default function AgreementsAndRentals() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Agreement Rules state
  const [enforceDigitalSignature, setEnforceDigitalSignature] = useState(true);
  const [mandatoryIdVerification, setMandatoryIdVerification] = useState(true);
  const [autoRenewalAllowed, setAutoRenewalAllowed] = useState(false);
  const [agreementTemplateType, setAgreementTemplateType] = useState("standard");
  const [minRentalPeriodVal, setMinRentalPeriodVal] = useState(1);
  const [minRentalPeriodUnit, setMinRentalPeriodUnit] = useState("days");
  const [maxRentalPeriodVal, setMaxRentalPeriodVal] = useState(12);
  const [maxRentalPeriodUnit, setMaxRentalPeriodUnit] = useState("months");
  const [cancellationPolicy, setCancellationPolicy] = useState("full_refund");
  const [lateReturnGraceHours, setLateReturnGraceHours] = useState(2);

  // Rental Rules state
  const [minRentalDurationVal, setMinRentalDurationVal] = useState(1);
  const [minRentalDurationUnit, setMinRentalDurationUnit] = useState("hours");

  // Deposit Settings state
  const [requireDeposit, setRequireDeposit] = useState(true);
  const [depositCalculationMethod, setDepositCalculationMethod] = useState("fixed");
  const [defaultDepositAmount, setDefaultDepositAmount] = useState(500);
  const [depositRefundTimelineDays, setDepositRefundTimelineDays] = useState(7);
  const [allowDepositWaiver, setAllowDepositWaiver] = useState(false);
  const [waiverEligibilityCriteria, setWaiverEligibilityCriteria] = useState("5+");
  const [depositHoldMethod, setDepositHoldMethod] = useState("credit_card_hold");
  const [deductibleAmount, setDeductibleAmount] = useState(1000);

  // Pricing Logic state
  const [enableDynamicPricing, setEnableDynamicPricing] = useState(true);
  const [pricingStrategy, setPricingStrategy] = useState("fixed");
  const [longTermDiscountStrategy, setLongTermDiscountStrategy] = useState("standard");
  const [enableTimeBasedPricing, setEnableTimeBasedPricing] = useState(false);
  const [enableLocationBasedPricing, setEnableLocationBasedPricing] = useState(false);
  const [enableVehicleTypePricing, setEnableVehicleTypePricing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminSettingsApi.getAgreementRules();
      const d = res.data as any;
      if (d) {
        const a = d.agreementRules || {};
        const r = d.rentalRules || {};
        const dep = d.depositSettings || {};
        const p = d.pricingLogic || {};

        setEnforceDigitalSignature(a.enforceDigitalSignature ?? true);
        setMandatoryIdVerification(a.mandatoryIdVerification ?? true);
        setAutoRenewalAllowed(a.autoRenewalAllowed ?? false);
        setAgreementTemplateType(a.agreementTemplateType ?? "standard");
        setMinRentalPeriodVal(a.minRentalPeriod?.value ?? 1);
        setMinRentalPeriodUnit(a.minRentalPeriod?.unit ?? "days");
        setMaxRentalPeriodVal(a.maxRentalPeriod?.value ?? 12);
        setMaxRentalPeriodUnit(a.maxRentalPeriod?.unit ?? "months");
        setCancellationPolicy(a.cancellationPolicy ?? "full_refund");
        setLateReturnGraceHours(a.lateReturnGraceHours ?? 2);

        setMinRentalDurationVal(r.minRentalDuration?.value ?? 1);
        setMinRentalDurationUnit(r.minRentalDuration?.unit ?? "hours");

        setRequireDeposit(dep.requireDeposit ?? true);
        setDepositCalculationMethod(dep.depositCalculationMethod ?? "fixed");
        setDefaultDepositAmount(dep.defaultDepositAmount ?? 500);
        setDepositRefundTimelineDays(dep.depositRefundTimelineDays ?? 7);
        setAllowDepositWaiver(dep.allowDepositWaiver ?? false);
        setWaiverEligibilityCriteria(dep.waiverEligibilityCriteria ?? "5+");
        setDepositHoldMethod(dep.depositHoldMethod ?? "credit_card_hold");
        setDeductibleAmount(dep.deductibleAmount ?? 1000);

        setEnableDynamicPricing(p.enableDynamicPricing ?? true);
        setPricingStrategy(p.pricingStrategy ?? "fixed");
        setLongTermDiscountStrategy(p.longTermDiscountStrategy ?? "standard");
        setEnableTimeBasedPricing(p.enableTimeBasedPricing ?? false);
        setEnableLocationBasedPricing(p.enableLocationBasedPricing ?? false);
        setEnableVehicleTypePricing(p.enableVehicleTypePricing ?? false);
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

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await adminSettingsApi.updateAgreementRules({
        agreementRules: {
          enforceDigitalSignature,
          mandatoryIdVerification,
          autoRenewalAllowed,
          agreementTemplateType,
          minRentalPeriod: { value: minRentalPeriodVal, unit: minRentalPeriodUnit },
          maxRentalPeriod: { value: maxRentalPeriodVal, unit: maxRentalPeriodUnit },
          cancellationPolicy,
          lateReturnGraceHours,
        },
        rentalRules: {
          minRentalDuration: { value: minRentalDurationVal, unit: minRentalDurationUnit },
        },
        depositSettings: {
          requireDeposit,
          depositCalculationMethod,
          defaultDepositAmount,
          depositRefundTimelineDays,
          allowDepositWaiver,
          waiverEligibilityCriteria,
          depositHoldMethod,
          deductibleAmount,
        },
        pricingLogic: {
          enableDynamicPricing,
          pricingStrategy,
          longTermDiscountStrategy,
          enableTimeBasedPricing,
          enableLocationBasedPricing,
          enableVehicleTypePricing,
        },
      });
      setStatusMsg({ text: "Agreement & rental settings saved successfully.", isError: false });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to save settings.", isError: true });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleReset = () => {
    setEnforceDigitalSignature(true);
    setMandatoryIdVerification(true);
    setAutoRenewalAllowed(false);
    setAgreementTemplateType("standard");
    setMinRentalPeriodVal(1);
    setMinRentalPeriodUnit("days");
    setMaxRentalPeriodVal(12);
    setMaxRentalPeriodUnit("months");
    setCancellationPolicy("full_refund");
    setLateReturnGraceHours(2);

    setMinRentalDurationVal(1);
    setMinRentalDurationUnit("hours");

    setRequireDeposit(true);
    setDepositCalculationMethod("fixed");
    setDefaultDepositAmount(500);
    setDepositRefundTimelineDays(7);
    setAllowDepositWaiver(false);
    setWaiverEligibilityCriteria("5+");
    setDepositHoldMethod("credit_card_hold");
    setDeductibleAmount(1000);

    setEnableDynamicPricing(true);
    setPricingStrategy("fixed");
    setLongTermDiscountStrategy("standard");
    setEnableTimeBasedPricing(false);
    setEnableLocationBasedPricing(false);
    setEnableVehicleTypePricing(false);
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
        Loading agreement & rental settings...
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
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Warning Banner */}
      <div
        style={{
          padding: "1rem 1.25rem",
          backgroundColor: "#FFFBEB",
          border: "1px solid #FEF3C7",
          borderRadius: "12px",
          display: "flex",
          gap: "1rem",
        }}
      >
        <div style={{ color: "#D97706", marginTop: "2px" }}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#92400E",
              marginBottom: "0.25rem",
            }}
          >
            Policy Change Impact Warning
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#B45309" }}>
            Changes to agreement and rental rules may affect existing active
            bookings. Review carefully before saving.
          </p>
        </div>
      </div>

      {/* Agreement Rules Section */}
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
              Agreement Rules
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Configure rental agreement policies and enforcement rules
            </p>
          </div>
          <Info size={18} style={{ color: COLORS.PRIMARY_MAIN }} />
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
                  Enforce Digital Signature
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Require digital signature on all rental agreements
                </p>
              </div>
              <Switch
                checked={enforceDigitalSignature}
                onChange={() => setEnforceDigitalSignature(!enforceDigitalSignature)}
                style={{
                  backgroundColor: enforceDigitalSignature ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: enforceDigitalSignature ? "translateX(24px)" : "translateX(4px)",
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
                  Mandatory ID Verification
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Verify government-issued ID before agreement activation
                </p>
              </div>
              <Switch
                checked={mandatoryIdVerification}
                onChange={() => setMandatoryIdVerification(!mandatoryIdVerification)}
                style={{
                  backgroundColor: mandatoryIdVerification ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: mandatoryIdVerification ? "translateX(24px)" : "translateX(4px)",
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
                  Auto-Renewal Allowed
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Enable automatic agreement renewal upon expiration
                </p>
              </div>
              <Switch
                checked={autoRenewalAllowed}
                onChange={() => setAutoRenewalAllowed(!autoRenewalAllowed)}
                style={{
                  backgroundColor: autoRenewalAllowed ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: autoRenewalAllowed ? "translateX(24px)" : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
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
                  Agreement Template Type
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={agreementTemplateType}
                onChange={(e) => setAgreementTemplateType(e.target.value)}
                options={[
                  { label: "Standard Rental Agreement", value: "standard" },
                  { label: "Corporate Rental Agreement", value: "corporate" },
                ]}
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
            <div
              style={{
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
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
                  Minimum Rental Period
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <input
                  type="number"
                  value={minRentalPeriodVal}
                  onChange={(e) => setMinRentalPeriodVal(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                    height: "30px",
                  }}
                />
                <SelectField
                  value={minRentalPeriodUnit}
                  onChange={(e) => setMinRentalPeriodUnit(e.target.value)}
                  options={[
                    { label: "Days", value: "days" },
                    { label: "Hours", value: "hours" },
                  ]}
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
                  Maximum Rental Period
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input
                  type="number"
                  value={maxRentalPeriodVal}
                  onChange={(e) => setMaxRentalPeriodVal(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
                <SelectField
                  value={maxRentalPeriodUnit}
                  onChange={(e) => setMaxRentalPeriodUnit(e.target.value)}
                  options={[
                    { label: "Months", value: "months" },
                    { label: "Weeks", value: "weeks" },
                    { label: "Days", value: "days" },
                  ]}
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
                  Agreement Cancellation Policy
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                options={[
                  {
                    label: "No cancellations allowed",
                    value: "no_cancellation",
                  },
                  {
                    label: "Cancellations allowed with full refund",
                    value: "full_refund",
                  },
                  {
                    label: "Cancellations allowed with partial refund",
                    value: "partial_refund",
                  },
                ]}
              />
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
                  Late Return Grace Period
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={lateReturnGraceHours}
                  onChange={(e) => setLateReturnGraceHours(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 4rem 0.75rem 1rem",
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
                    fontSize: "0.9rem",
                  }}
                >
                  hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Rental Rules Section */}
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
            Rental Rules
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Define operational rules and restrictions for rentals
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 160px",
            gap: "0.75rem",
            alignItems: "end",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Minimum Rental Duration
              </label>
              <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
            </div>

            <input
              type="number"
              value={minRentalDurationVal}
              onChange={(e) => setMinRentalDurationVal(Number(e.target.value))}
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

          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: COLORS.TEXT_SECONDARY,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Unit
            </label>
            <SelectField
              value={minRentalDurationUnit}
              onChange={(e) => setMinRentalDurationUnit(e.target.value)}
              options={[
                { label: "Hours", value: "hours" },
                { label: "Days", value: "days" },
                { label: "Weeks", value: "weeks" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Deposit Settings Section */}
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
            Deposit Settings
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure security deposit requirements and strategies
          </p>
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
                  Require Security Deposit
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Mandatory deposit for all rentals
                </p>
              </div>
              <Switch
                checked={requireDeposit}
                onChange={() => setRequireDeposit(!requireDeposit)}
                style={{
                  backgroundColor: requireDeposit ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: requireDeposit ? "translateX(24px)" : "translateX(4px)",
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
                  Deposit Calculation Method
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={depositCalculationMethod}
                onChange={(e) => setDepositCalculationMethod(e.target.value)}
                options={[
                  { label: "Fixed Amount", value: "fixed" },
                  { label: "Percentage of Rental Cost", value: "percentage" },
                ]}
              />
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
                  Default Deposit Amount
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
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
                  value={defaultDepositAmount}
                  onChange={(e) => setDefaultDepositAmount(Number(e.target.value))}
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
                  Deposit Refund Timeline
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={depositRefundTimelineDays}
                  onChange={(e) => setDepositRefundTimelineDays(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 6.5rem 0.75rem 1rem",
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
                    fontSize: "0.9rem",
                  }}
                >
                  business days
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
                  Allow Deposit Waiver
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Enable deposit waiver for qualified drivers
                </p>
              </div>
              <Switch
                checked={allowDepositWaiver}
                onChange={() => setAllowDepositWaiver(!allowDepositWaiver)}
                style={{
                  backgroundColor: allowDepositWaiver ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: allowDepositWaiver ? "translateX(24px)" : "translateX(4px)",
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
                  Waiver Eligibility Criteria
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={waiverEligibilityCriteria}
                onChange={(e) => setWaiverEligibilityCriteria(e.target.value)}
                options={[
                  { label: "5+ Completed Rentals", value: "5+" },
                  { label: "10+ Completed Rentals", value: "10+" },
                ]}
              />
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
                  Deposit Hold Method
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={depositHoldMethod}
                onChange={(e) => setDepositHoldMethod(e.target.value)}
                options={[
                  {
                    label: "Credit Card Authorization Hold",
                    value: "credit_card_hold",
                  },
                  {
                    label: "Direct Charge & Refund",
                    value: "direct_charge_refund",
                  },
                ]}
              />
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
                  Deductible Amount
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
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
                  value={deductibleAmount}
                  onChange={(e) => setDeductibleAmount(Number(e.target.value))}
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
        </div>
      </Card>

      {/* Pricing Logic Section */}
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
            Pricing Logic
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Define dynamic pricing rules and rate strategies
          </p>
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
                  Enable Dynamic Pricing
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Adjust prices based on demand and availability
                </p>
              </div>
              <Switch
                checked={enableDynamicPricing}
                onChange={() => setEnableDynamicPricing(!enableDynamicPricing)}
                style={{
                  backgroundColor: enableDynamicPricing ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: enableDynamicPricing ? "translateX(24px)" : "translateX(4px)",
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
                  Pricing Strategy
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={pricingStrategy}
                onChange={(e) => setPricingStrategy(e.target.value)}
                options={[
                  { label: "Fixed Rate", value: "fixed" },
                  { label: "Algorithmic (AI-driven)", value: "algorithmic" },
                ]}
              />
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
                  Long-Term Discount Strategy
                </label>
                <Info size={14} style={{ color: COLORS.PRIMARY_MAIN }} />
              </div>
              <SelectField
                value={longTermDiscountStrategy}
                onChange={(e) => setLongTermDiscountStrategy(e.target.value)}
                options={[
                  {
                    label: "Standard Tiers (Weekly/Monthly)",
                    value: "standard",
                  },
                  {
                    label: "Custom Scaling",
                    value: "custom",
                  },
                ]}
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
                  Enable Time-Based Pricing
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Apply different rates during peak/off-peak hours
                </p>
              </div>
              <Switch
                checked={enableTimeBasedPricing}
                onChange={() => setEnableTimeBasedPricing(!enableTimeBasedPricing)}
                style={{
                  backgroundColor: enableTimeBasedPricing ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: enableTimeBasedPricing ? "translateX(24px)" : "translateX(4px)",
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
                  Enable Location-Based Pricing
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Adjust prices based on geographic location
                </p>
              </div>
              <Switch
                checked={enableLocationBasedPricing}
                onChange={() => setEnableLocationBasedPricing(!enableLocationBasedPricing)}
                style={{
                  backgroundColor: enableLocationBasedPricing ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: enableLocationBasedPricing ? "translateX(24px)" : "translateX(4px)",
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
                  Enable Vehicle Type Pricing
                </h4>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Apply different rates based on vehicle category
                </p>
              </div>
              <Switch
                checked={enableVehicleTypePricing}
                onChange={() => setEnableVehicleTypePricing(!enableVehicleTypePricing)}
                style={{
                  backgroundColor: enableVehicleTypePricing ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                    transform: enableVehicleTypePricing ? "translateX(24px)" : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
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
