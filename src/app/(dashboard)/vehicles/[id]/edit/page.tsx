"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useState } from "react";
import { Ban, ChevronRight, History, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import { AdminVehicleDetail, vehiclesApi } from "@/services/api/vehicles";

const dateInputValue = (value?: string) =>
  value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : "";

type VehicleForm = {
  registration: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  odometer: string;
  fuelType: string;
  transmission: string;
  adminListingStatus: string;
  status: string;
  isAvailable: boolean;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  securityDeposit: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  auditNote: string;
};

const emptyForm: VehicleForm = {
  registration: "",
  vin: "",
  make: "",
  model: "",
  year: "",
  odometer: "",
  fuelType: "",
  transmission: "",
  adminListingStatus: "Pending",
  status: "Available",
  isAvailable: true,
  dailyRate: "",
  weeklyRate: "",
  monthlyRate: "",
  securityDeposit: "",
  registrationExpiry: "",
  insuranceExpiry: "",
  auditNote: "",
};

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [detail, setDetail] = useState<AdminVehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (field: keyof VehicleForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const fetchVehicle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehiclesApi.getVehicleById(vehicleId);
      const data = response.data;
      setDetail(data);
      setForm({
        registration: data.vehicleOverview.registration || "",
        vin: data.vehicleOverview.vin === "N/A" ? "" : data.vehicleOverview.vin || "",
        make: data.vehicleOverview.make || "",
        model: data.vehicleOverview.model || "",
        year: String(data.vehicleOverview.year || ""),
        odometer: data.vehicleOverview.mileage?.replace(/[^0-9.]/g, "") || "",
        fuelType: data.vehicleOverview.fuelType === "N/A" ? "" : data.vehicleOverview.fuelType || "",
        transmission: data.vehicleOverview.transmission === "N/A" ? "" : data.vehicleOverview.transmission || "",
        adminListingStatus: data.vehicleOverview.listingStatus || "Pending",
        status: data.vehicleOverview.rentalStatus || "Available",
        isAvailable: data.vehicleOverview.isAvailable !== false,
        dailyRate: String(data.listingDetails.dailyRate || ""),
        weeklyRate: String(data.listingDetails.weeklyRate || ""),
        monthlyRate: String(data.listingDetails.monthlyRate || ""),
        securityDeposit: String(data.listingDetails.securityDeposit || ""),
        registrationExpiry: dateInputValue(data.complianceDocuments.registration?.expiry),
        insuranceExpiry: dateInputValue(data.complianceDocuments.insurance?.expiry),
        auditNote: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (vehicleId) fetchVehicle();
  }, [fetchVehicle, vehicleId]);

  const saveVehicle = async () => {
    if (form.auditNote.trim().length < 5) {
      setError("Audit note is required and must be at least 5 characters.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await vehiclesApi.updateVehicle(vehicleId, {
        ...form,
        dailyRate: Number(form.dailyRate || 0),
        weeklyRate: Number(form.weeklyRate || 0),
        monthlyRate: Number(form.monthlyRate || 0),
        securityDeposit: Number(form.securityDeposit || 0),
      });
      router.push(`/vehicles/${vehicleId}`);
    } catch (err: any) {
      setError(err.message || "Failed to save vehicle");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    background: COLORS.BG_CARD,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title="Edit Vehicle" showBack notificationCount={5} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p style={breadcrumbStyle} onClick={() => router.push("/")}>Dashboard</p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={breadcrumbStyle} onClick={() => router.push("/vehicles")}>Vehicles Management</p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={breadcrumbStyle} onClick={() => router.push(`/vehicles/${vehicleId}`)}>
          {detail?.vehicleOverview.registration || vehicleId}
        </p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={{ ...breadcrumbStyle, fontWeight: 700 }}>Edit</p>
      </div>

      {loading ? (
        <Card>
          <p style={{ color: COLORS.TEXT_SECONDARY }}>Loading vehicle...</p>
        </Card>
      ) : (
        <>
          {error && (
            <div style={{ background: COLORS.ERROR_LIGHT, border: "1px solid #FCA5A5", padding: "1rem", borderRadius: "8px", color: COLORS.ERROR_MAIN, fontWeight: 650 }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card>
                <h3 style={cardTitle}>Registration Details</h3>
                <FieldGrid>
                  <TextField label="Registration Number" value={form.registration} onChange={(value) => setField("registration", value)} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <TextField label="VIN Number" value={form.vin} onChange={(value) => setField("vin", value)} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <TextField label="Registration Expiry" value={form.registrationExpiry} onChange={(value) => setField("registrationExpiry", value)} inputStyle={inputStyle} labelStyle={labelStyle} type="date" />
                  <TextField label="Insurance Expiry" value={form.insuranceExpiry} onChange={(value) => setField("insuranceExpiry", value)} inputStyle={inputStyle} labelStyle={labelStyle} type="date" />
                </FieldGrid>
              </Card>

              <Card>
                <h3 style={cardTitle}>Vehicle Specifications</h3>
                <FieldGrid>
                  <TextField label="Make" value={form.make} onChange={(value) => setField("make", value)} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <TextField label="Model" value={form.model} onChange={(value) => setField("model", value)} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <TextField label="Year" value={form.year} onChange={(value) => setField("year", value)} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <TextField label="Current Mileage" value={form.odometer} onChange={(value) => setField("odometer", value)} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <SelectField
                    label="Fuel Type"
                    options={["", "Gasoline", "Diesel", "Electric", "Hybrid", "Plugin Hybrid"].map((value) => ({ label: value || "Select fuel type", value }))}
                    value={form.fuelType}
                    onChange={(event) => setField("fuelType", event.target.value)}
                  />
                  <SelectField
                    label="Transmission"
                    options={["", "Automatic", "Manual"].map((value) => ({ label: value || "Select transmission", value }))}
                    value={form.transmission}
                    onChange={(event) => setField("transmission", event.target.value)}
                  />
                </FieldGrid>
              </Card>

              <Card>
                <h3 style={cardTitle}>Listing & Pricing</h3>
                <FieldGrid>
                  <TextField label="Daily Rate" value={form.dailyRate} onChange={(value) => setField("dailyRate", value)} inputStyle={inputStyle} labelStyle={labelStyle} type="number" />
                  <TextField label="Weekly Rate" value={form.weeklyRate} onChange={(value) => setField("weeklyRate", value)} inputStyle={inputStyle} labelStyle={labelStyle} type="number" />
                  <TextField label="Monthly Rate" value={form.monthlyRate} onChange={(value) => setField("monthlyRate", value)} inputStyle={inputStyle} labelStyle={labelStyle} type="number" />
                  <TextField label="Security Deposit" value={form.securityDeposit} onChange={(value) => setField("securityDeposit", value)} inputStyle={inputStyle} labelStyle={labelStyle} type="number" />
                </FieldGrid>
              </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card>
                <h3 style={cardTitle}>Status Controls</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SelectField
                    label="Listing Status"
                    options={["Approved", "Pending", "Rejected", "Inactive"].map((value) => ({ label: value, value }))}
                    value={form.adminListingStatus}
                    onChange={(event) => setField("adminListingStatus", event.target.value)}
                  />
                  <SelectField
                    label="Vehicle Status"
                    options={["Available", "Booked", "Maintenance"].map((value) => ({ label: value, value }))}
                    value={form.status}
                    onChange={(event) => setField("status", event.target.value)}
                  />
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", fontSize: "0.9rem", fontWeight: 650 }}>
                    Available for rentals
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(event) => setField("isAvailable", event.target.checked)}
                    />
                  </label>
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Audit Note</h3>
                <textarea
                  value={form.auditNote}
                  onChange={(event) => setField("auditNote", event.target.value)}
                  placeholder="Reason for this change..."
                  style={{ ...inputStyle, height: "110px", resize: "none", borderColor: "#FCA5A5" }}
                />
                <p style={{ fontSize: "0.72rem", color: COLORS.ERROR_MAIN, marginTop: "0.5rem" }}>
                  Required for admin vehicle changes.
                </p>
              </Card>

              <Card>
                <h3 style={cardTitle}>Recent Changes</h3>
                {detail?.auditTrail?.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {detail.auditTrail.slice(0, 4).map((item) => (
                      <div key={item._id} style={{ display: "flex", gap: "0.75rem" }}>
                        <History size={16} color={COLORS.PRIMARY_MAIN} />
                        <div>
                          <p style={{ fontSize: "0.86rem", fontWeight: 700 }}>{item.title}</p>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{item.description || item.status || ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.86rem" }}>No changes logged yet.</p>
                )}
              </Card>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Button disabled={saving} onClick={saveVehicle}>
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
            <Button variant="outline" style={{ color: COLORS.ERROR_MAIN, borderColor: "#FCA5A5" }} onClick={() => setField("adminListingStatus", "Inactive")}>
              <Ban size={16} />
              Disable Vehicle
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

const breadcrumbStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#6B7280",
  cursor: "pointer",
};

const cardTitle: React.CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 750,
  marginBottom: "1.25rem",
};

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  inputStyle,
  labelStyle,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} />
    </div>
  );
}
