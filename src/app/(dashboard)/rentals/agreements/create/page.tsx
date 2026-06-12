"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Check,
  Clock,
  DollarSign,
  FileText,
  Info,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import { COLORS } from "@/constants/Constant";
import { driversApi, Driver } from "@/services/api/drivers";
import { ownersApi, Owner } from "@/services/api/owners";
import { vehiclesApi, Vehicle } from "@/services/api/vehicles";
import { rentalsApi } from "@/services/api/rentals";

const tabs = [
  { name: "Rentals Management", path: "/rentals" },
  { name: "Agreements", path: "/rentals/agreements" },
  { name: "Disputes & Refunds", path: "/rentals/disputes" },
  { name: "Admin Notes & Audit", path: "/rentals/audit" },
];

type AgreementForm = {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  driverId: string;
  ownerId: string;
  vehicleId: string;
  mileageStart: string;
  amount: string;
  repaymentAmount: string;
  fixedFee: string;
  deposit: string;
  paymentMethod: string;
  insuranceType: string;
  overrideDeposits: boolean;
  internalNotes: string;
};

const initialForm: AgreementForm = {
  title: "",
  type: "Short-Term",
  startDate: "",
  endDate: "",
  driverId: "",
  ownerId: "",
  vehicleId: "",
  mileageStart: "",
  amount: "",
  repaymentAmount: "",
  fixedFee: "0",
  deposit: "",
  paymentMethod: "Credit Card",
  insuranceType: "Comprehensive",
  overrideDeposits: false,
  internalNotes: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "38px",
  padding: "0 0.75rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: COLORS.BG_CARD,
  fontSize: "0.82rem",
  color: COLORS.TEXT_MAIN,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.35rem",
  fontSize: "0.72rem",
  fontWeight: 800,
  color: COLORS.TEXT_SECONDARY,
};

const sectionTitleStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1rem",
  fontSize: "0.95rem",
  fontWeight: 800,
  color: COLORS.TEXT_MAIN,
};

const parseMoney = (value: string) => Number(value || 0);

const dateTimeLocalToIso = (value: string) => value ? new Date(value).toISOString() : "";

const formatDate = (value: string) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString();
};

const formatMoney = (value: string | number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

const durationWeeks = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)));
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required ? <span style={{ color: COLORS.ERROR_MAIN }}>*</span> : null}
      </label>
      {children}
    </div>
  );
}

function InfoPanel({ tone = "info", children }: { tone?: "info" | "success" | "warning"; children: React.ReactNode }) {
  const palette = {
    info: { bg: "#EFF6FF", border: "#BFDBFE", color: COLORS.PRIMARY_MAIN, icon: <Info size={16} /> },
    success: { bg: "#ECFDF5", border: "#A7F3D0", color: COLORS.SUCCESS_MAIN, icon: <ShieldCheck size={16} /> },
    warning: { bg: "#FFFBEB", border: "#FDE68A", color: COLORS.WARNING_MAIN, icon: <AlertTriangle size={16} /> },
  }[tone];

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", padding: "0.75rem", borderRadius: "8px", border: `1px solid ${palette.border}`, background: palette.bg, color: palette.color, fontSize: "0.8rem", fontWeight: 600 }}>
      {palette.icon}
      <span>{children}</span>
    </div>
  );
}

export default function CreateAgreement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Agreements");
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<AgreementForm>(initialForm);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [driverRes, ownerRes, vehicleRes] = await Promise.all([
          driversApi.getDrivers({ limit: 100 }),
          ownersApi.getOwnersDashboard({ limit: 100 }),
          vehiclesApi.getVehicles({ limit: 100, adminListingStatus: "Approved" }),
        ]);
        setDrivers(driverRes.data.drivers || []);
        setOwners(ownerRes.data.owners || []);
        setVehicles(vehicleRes.data.vehicles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load form data");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const selectedDriver = useMemo(
    () => drivers.find((driver) => driver._id === form.driverId),
    [drivers, form.driverId],
  );
  const selectedOwner = useMemo(
    () => owners.find((owner) => owner._id === form.ownerId),
    [owners, form.ownerId],
  );
  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle._id === form.vehicleId),
    [vehicles, form.vehicleId],
  );
  const weeks = durationWeeks(form.startDate, form.endDate);

  const updateForm = (patch: Partial<AgreementForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const onVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find((item) => item._id === vehicleId);
    updateForm({
      vehicleId,
      ownerId: vehicle?.ownerId || form.ownerId,
      mileageStart: form.mileageStart,
      title: form.title || [vehicle?.make, vehicle?.model, selectedDriver?.name].filter(Boolean).join(" - "),
    });
  };

  const validate = () => {
    const required: Array<keyof AgreementForm> = [
      "title",
      "type",
      "startDate",
      "endDate",
      "driverId",
      "ownerId",
      "vehicleId",
      "amount",
      "deposit",
      "paymentMethod",
      "insuranceType",
    ];
    const missing = required.filter((field) => !String(form[field] || "").trim());
    if (missing.length) return "Please complete all required fields.";
    if (!weeks) return "End date must be after start date.";
    return null;
  };

  const buildPayload = (status: string) => ({
    title: form.title,
    type: form.type,
    startDate: dateTimeLocalToIso(form.startDate),
    endDate: dateTimeLocalToIso(form.endDate),
    driverId: form.driverId,
    ownerId: form.ownerId,
    vehicleId: form.vehicleId,
    mileageStart: Number(form.mileageStart || 0),
    amount: parseMoney(form.amount),
    repaymentAmount: parseMoney(form.repaymentAmount || String(parseMoney(form.amount) / Math.max(weeks, 1))),
    fixedFee: parseMoney(form.fixedFee),
    deposit: parseMoney(form.deposit),
    overrideDeposits: form.overrideDeposits,
    paymentMethod: form.paymentMethod,
    insuranceType: form.insuranceType,
    internalNotes: form.internalNotes,
    status: status === "Active" ? "Pending" : status,
  });

  const submitAgreement = async (status: "Draft" | "Pending" | "Active") => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await rentalsApi.createDraftAgreement(buildPayload(status));
      const identifier = created.data.agreementId || created.data._id;

      if (status === "Active" && identifier) {
        await rentalsApi.approveAgreement(identifier);
      }

      router.push(`/rentals/agreements/${encodeURIComponent(identifier)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agreement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <PageHeader title="Create Agreement" enableSearch={false} showBack />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Agreements", path: "/rentals/agreements" },
          { label: "Create Agreement" },
        ]}
      />

      <Card padding="1rem" style={{ borderRadius: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "0.98rem", fontWeight: 800 }}>
              Step {currentStep} of 2: {currentStep === 1 ? "Agreement Details" : "Review & Activate"}
            </h3>
            <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.78rem", marginTop: "0.25rem" }}>
              Driver bookings create pending agreements automatically; this form is for admin-created agreements.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {[1, 2].map((step) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", display: "grid", placeItems: "center", background: step < currentStep ? COLORS.SUCCESS_MAIN : step === currentStep ? COLORS.PRIMARY_MAIN : "#F1F5F9", color: step <= currentStep ? COLORS.BG_CARD : COLORS.TEXT_MUTED, fontSize: "0.75rem", fontWeight: 800 }}>
                  {step < currentStep ? <Check size={14} /> : step}
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: step === currentStep ? COLORS.PRIMARY_MAIN : COLORS.TEXT_SECONDARY }}>
                  {step === 1 ? "Details" : "Review"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {error && (
        <div style={{ padding: "0.9rem 1rem", borderRadius: "8px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {currentStep === 1 ? (
        <>
          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><FileText size={18} color={COLORS.PRIMARY_MAIN} /> Agreement Basics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <Field label="Agreement Title" required>
                <input value={form.title} onChange={(event) => updateForm({ title: event.target.value })} placeholder="Toyota Corolla - John Doe" style={inputStyle} />
              </Field>
              <Field label="Agreement Type" required>
                <select value={form.type} onChange={(event) => updateForm({ type: event.target.value })} style={inputStyle}>
                  <option>Short-Term</option>
                  <option>Rent-to-Own</option>
                  <option>Lease</option>
                </select>
              </Field>
              <Field label="Duration">
                <input value={weeks ? `${weeks} week${weeks > 1 ? "s" : ""}` : "Auto-calculated"} readOnly style={{ ...inputStyle, background: "#F8FAFC", color: COLORS.TEXT_SECONDARY }} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Start Date & Time" required>
                <input type="datetime-local" value={form.startDate} onChange={(event) => updateForm({ startDate: event.target.value })} style={inputStyle} />
              </Field>
              <Field label="End Date & Time" required>
                <input type="datetime-local" value={form.endDate} onChange={(event) => updateForm({ endDate: event.target.value })} style={inputStyle} />
              </Field>
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><Users size={18} color={COLORS.PRIMARY_MAIN} /> Driver & Owner Assignment</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Lease / Primary Driver" required>
                <select value={form.driverId} onChange={(event) => updateForm({ driverId: event.target.value })} style={inputStyle} disabled={loadingOptions}>
                  <option value="">Select driver</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} - {driver.kycStatus || "KYC Pending"}
                    </option>
                  ))}
                </select>
              </Field>
              <div>
                <Field label="Owner" required>
                  <select value={form.ownerId} onChange={(event) => updateForm({ ownerId: event.target.value })} style={inputStyle} disabled={loadingOptions}>
                    <option value="">Select owner</option>
                    {owners.map((owner) => (
                      <option key={owner._id} value={owner._id}>
                        {owner.name || owner.email} {owner.status ? `- ${owner.status}` : ""}
                      </option>
                    ))}
                  </select>
                </Field>
                <div style={{ marginTop: "0.75rem" }}>
                  <InfoPanel>Owner can be selected directly, or filled from the selected vehicle owner.</InfoPanel>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><Car size={18} color={COLORS.PRIMARY_MAIN} /> Vehicle Assignment</h3>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <Field label="Vehicle" required>
                <select value={form.vehicleId} onChange={(event) => onVehicleChange(event.target.value)} style={inputStyle} disabled={loadingOptions}>
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")} - {vehicle.registration || "No plate"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Mileage at Start">
                <input type="number" value={form.mileageStart} onChange={(event) => updateForm({ mileageStart: event.target.value })} placeholder="Enter mileage" style={inputStyle} />
              </Field>
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><DollarSign size={18} color={COLORS.PRIMARY_MAIN} /> Commercial Terms</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "0.75rem" }}>
              <Field label="Agreement Amount" required>
                <input type="number" value={form.amount} onChange={(event) => updateForm({ amount: event.target.value })} placeholder="0.00" style={inputStyle} />
              </Field>
              <Field label="Weekly Repayment">
                <input type="number" value={form.repaymentAmount} onChange={(event) => updateForm({ repaymentAmount: event.target.value })} placeholder={weeks ? String(Math.round(parseMoney(form.amount) / weeks)) : "0.00"} style={inputStyle} />
              </Field>
              <Field label="Fixed Fee">
                <input type="number" value={form.fixedFee} onChange={(event) => updateForm({ fixedFee: event.target.value })} placeholder="0.00" style={inputStyle} />
              </Field>
            </div>
            <InfoPanel>Hybrid pricing is supported: repayment plus fixed final fee can be stored on the agreement.</InfoPanel>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><ShieldCheck size={18} color={COLORS.PRIMARY_MAIN} /> Deposit & Insurance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
              <Field label="Deposit" required>
                <input type="number" value={form.deposit} onChange={(event) => updateForm({ deposit: event.target.value })} placeholder="0.00" style={inputStyle} />
              </Field>
              <Field label="Preferred Payment Method" required>
                <select value={form.paymentMethod} onChange={(event) => updateForm({ paymentMethod: event.target.value })} style={inputStyle}>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </Field>
              <Field label="Insurance Cover" required>
                <select value={form.insuranceType} onChange={(event) => updateForm({ insuranceType: event.target.value })} style={inputStyle}>
                  <option>Basic</option>
                  <option>Comprehensive</option>
                  <option>Premium</option>
                </select>
              </Field>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: COLORS.TEXT_MAIN, fontWeight: 700 }}>
              <input type="checkbox" checked={form.overrideDeposits} onChange={(event) => updateForm({ overrideDeposits: event.target.checked })} />
              Override default deposit rules for this agreement
            </label>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><FileText size={18} color={COLORS.PRIMARY_MAIN} /> Internal Notes</h3>
            <textarea value={form.internalNotes} onChange={(event) => updateForm({ internalNotes: event.target.value })} rows={4} placeholder="Add notes for audit or approval review..." style={{ ...inputStyle, height: "auto", padding: "0.75rem", resize: "vertical" }} />
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "1rem" }}>
            <Button variant="outline" onClick={() => router.push("/rentals/agreements")}>
              <ArrowLeft size={16} /> Cancel
            </Button>
            <Button onClick={() => {
              const validationError = validate();
              if (validationError) setError(validationError);
              else {
                setError(null);
                setCurrentStep(2);
              }
            }}>
              Review Agreement <ArrowRight size={16} />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "1rem" }}>
            <Card style={{ borderRadius: "8px" }}>
              <h3 style={sectionTitleStyle}><FileText size={18} color={COLORS.PRIMARY_MAIN} /> Agreement Preview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.9rem" }}>
                {[
                  ["Title", form.title],
                  ["Type", form.type],
                  ["Driver", selectedDriver?.name || "--"],
                  ["Owner", selectedOwner?.name || selectedOwner?.email || "--"],
                  ["Vehicle", selectedVehicle ? [selectedVehicle.year, selectedVehicle.make, selectedVehicle.model].filter(Boolean).join(" ") : "--"],
                  ["Registration", selectedVehicle?.registration || "--"],
                  ["Start", formatDate(form.startDate)],
                  ["End", formatDate(form.endDate)],
                  ["Duration", `${weeks} week${weeks === 1 ? "" : "s"}`],
                  ["Mileage", form.mileageStart || "--"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.2rem" }}>{label}</p>
                    <p style={{ color: COLORS.TEXT_MAIN, fontSize: "0.85rem", fontWeight: 700 }}>{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Card style={{ borderRadius: "8px" }}>
                <h3 style={sectionTitleStyle}><DollarSign size={18} color={COLORS.PRIMARY_MAIN} /> Summary</h3>
                {[
                  ["Agreement Amount", formatMoney(form.amount)],
                  ["Weekly Repayment", formatMoney(form.repaymentAmount || parseMoney(form.amount) / Math.max(weeks, 1))],
                  ["Deposit", formatMoney(form.deposit)],
                  ["Fixed Fee", formatMoney(form.fixedFee)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                    <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>{label}</span>
                    <strong style={{ fontSize: "0.82rem" }}>{value}</strong>
                  </div>
                ))}
              </Card>

              <Card style={{ borderRadius: "8px" }}>
                <h3 style={sectionTitleStyle}><AlertTriangle size={18} color={COLORS.WARNING_MAIN} /> Validation</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <InfoPanel tone={selectedDriver?.kycStatus === "Verified" ? "success" : "warning"}>
                    KYC status: {selectedDriver?.kycStatus || "Pending"}
                  </InfoPanel>
                  <InfoPanel tone={selectedVehicle?.isAvailable === false ? "warning" : "success"}>
                    Vehicle availability: {selectedVehicle?.isAvailable === false ? "Unavailable" : "Available"}
                  </InfoPanel>
                  <InfoPanel tone="success">Owner and vehicle are linked for agreement creation.</InfoPanel>
                </div>
              </Card>
            </div>
          </div>

          <Card style={{ borderRadius: "8px" }}>
            <h3 style={sectionTitleStyle}><Calendar size={18} color={COLORS.PRIMARY_MAIN} /> Activation Requirements</h3>
            <InfoPanel>
              Activating creates the agreement record, marks the vehicle as booked, and schedules repayment rows for the selected duration.
            </InfoPanel>
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "1rem" }}>
            <Button variant="outline" onClick={() => setCurrentStep(1)} disabled={saving}>
              <ArrowLeft size={16} /> Back to Details
            </Button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button variant="outline" onClick={() => submitAgreement("Draft")} disabled={saving}>
                <FileText size={16} /> Save Draft
              </Button>
              <Button variant="warning" onClick={() => submitAgreement("Pending")} disabled={saving}>
                <Clock size={16} /> Submit for Approval
              </Button>
              <Button variant="success" onClick={() => submitAgreement("Active")} disabled={saving}>
                <Check size={16} /> Approve & Activate
              </Button>
              <Button variant="danger" onClick={() => router.push("/rentals/agreements")} disabled={saving}>
                <X size={16} /> Cancel Agreement
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
