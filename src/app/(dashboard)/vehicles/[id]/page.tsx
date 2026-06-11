"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronRight,
  Edit3,
  History,
  Image as ImageIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import { AdminVehicleDetail, vehiclesApi } from "@/services/api/vehicles";

const currency = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const dateText = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

const cleanText = (value?: string | null) => {
  const text = String(value || "").trim();
  return text || undefined;
};

export default function VehicleDetails() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;
  const [detail, setDetail] = useState<AdminVehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehiclesApi.getVehicleById(vehicleId);
      setDetail(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (vehicleId) fetchVehicle();
  }, [fetchVehicle, vehicleId]);

  const updateStatus = async (newStatus: "Approved" | "Rejected" | "Inactive") => {
    const reason =
      newStatus === "Rejected"
        ? window.prompt("Reason for rejecting this vehicle listing")
        : newStatus === "Inactive"
          ? window.prompt("Reason for disabling this vehicle listing")
          : "Approved from admin vehicle detail page";

    if ((newStatus === "Rejected" || newStatus === "Inactive") && reason === null) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await vehiclesApi.updateListingStatus(
        vehicleId,
        newStatus,
        reason || `Updated from admin vehicle detail page`,
      );
      await fetchVehicle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update listing status");
    } finally {
      setSaving(false);
    }
  };

  const vehicle = detail?.vehicleOverview;
  const listing = detail?.listingDetails;
  const owner = detail?.ownerInformation;
  const documents = useMemo(
    () => Object.values(detail?.complianceDocuments || {}),
    [detail?.complianceDocuments],
  );
  const expiryRows = useMemo(() => {
    if (!vehicle) return [];

    const registration = detail?.complianceExpiry?.registration;
    const insurance = detail?.complianceExpiry?.insurance;

    return [
      {
        label: "Registration Expires",
        value:
          cleanText(vehicle.registrationExpiryDisplay) ||
          cleanText(registration?.displayDate) ||
          cleanText(registration?.expiryDate) ||
          "N/A",
        status:
          cleanText(vehicle.registrationExpiryStatus) ||
          cleanText(registration?.status),
      },
      {
        label: "Insurance Expires",
        value:
          cleanText(vehicle.insuranceExpiryDisplay) ||
          cleanText(insurance?.displayDate) ||
          cleanText(insurance?.expiryDate) ||
          "N/A",
        status:
          cleanText(vehicle.insuranceExpiryStatus) ||
          cleanText(insurance?.status),
      },
    ];
  }, [detail?.complianceExpiry, vehicle]);
  const primaryImage = vehicle?.images?.[0] || vehicle?.mainPhoto;

  const labelStyle: React.CSSProperties = {
    fontSize: "0.82rem",
    color: "#6B7280",
    marginBottom: "0.25rem",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "0.92rem",
    fontWeight: 650,
    color: "#111827",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title="Vehicle Details" showBack notificationCount={5} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p style={breadcrumbStyle} onClick={() => router.push("/")}>Dashboard</p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={breadcrumbStyle} onClick={() => router.push("/vehicles")}>Vehicles Management</p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={{ ...breadcrumbStyle, fontWeight: 700 }}>{vehicle?.registration || vehicleId}</p>
      </div>

      {loading ? (
        <Card>
          <p style={{ color: COLORS.TEXT_SECONDARY }}>Loading vehicle from backend...</p>
        </Card>
      ) : error ? (
        <Card>
          <p style={{ color: COLORS.ERROR_MAIN, fontWeight: 700 }}>{error}</p>
          <Button variant="outline" style={{ marginTop: "1rem" }} onClick={fetchVehicle}>
            Retry
          </Button>
        </Card>
      ) : detail && vehicle ? (
        <>
          {detail.alerts.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {detail.alerts.slice(0, 2).map((alert) => (
                <div
                  key={`${alert.title}-${alert.message}`}
                  style={{
                    background: alert.severity === "critical" ? COLORS.ERROR_LIGHT : "#FFFBEB",
                    border: `1px solid ${alert.severity === "critical" ? "#FCA5A5" : "#FEF3C7"}`,
                    padding: "1rem 1.5rem",
                    borderRadius: "12px",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                  }}
                >
                  <AlertTriangle size={20} color={alert.severity === "critical" ? COLORS.ERROR_MAIN : "#D97706"} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{alert.title}</p>
                    <p style={{ color: "#6B7280", fontSize: "0.82rem" }}>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div
                  style={{
                    width: "128px",
                    height: "86px",
                    borderRadius: "8px",
                    background: "#F3F4F6",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {primaryImage ? (
                    <img src={primaryImage} alt={vehicle.makeModel} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <ImageIcon size={26} color="#9CA3AF" />
                  )}
                </div>
                <div>
                  <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#111827" }}>
                    {vehicle.makeModel || "Vehicle"}
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "0.95rem", marginTop: "0.3rem" }}>
                    Registration: {vehicle.registration}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                    <StatusBadge status={vehicle.listingStatus || "Unknown"} />
                    <StatusBadge status={vehicle.rentalStatus || "Unknown"} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {vehicle.listingStatus !== "Approved" && (
                  <Button variant="success" disabled={saving} onClick={() => updateStatus("Approved")}>
                    <CheckCircle2 size={18} />
                    {saving ? "Updating..." : "Approve"}
                  </Button>
                )}
                {vehicle.listingStatus !== "Rejected" && (
                  <Button variant="danger" disabled={saving} onClick={() => updateStatus("Rejected")}>
                    <Ban size={18} />
                    {saving ? "Updating..." : "Reject"}
                  </Button>
                )}
                <Button variant="outline" onClick={() => router.push(`/vehicles/${vehicleId}/edit`)}>
                  <Edit3 size={18} />
                  Edit
                </Button>
                <Button variant="outline" disabled={saving} style={{ color: COLORS.ERROR_MAIN, border: "1px solid #FCA5A5" }} onClick={() => updateStatus("Inactive")}>
                  <Ban size={18} />
                  {saving ? "Updating..." : "Disable"}
                </Button>
              </div>
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            <Card>
              <h3 style={cardTitle}>Vehicle Overview</h3>
              <InfoGrid
                rows={[
                  ["Make & Model", vehicle.makeModel],
                  ["Year", String(vehicle.year || "--")],
                  ["Category", vehicle.category || "--"],
                  ["Transmission", vehicle.transmission || "--"],
                  ["Fuel Type", vehicle.fuelType || "--"],
                  ["Mileage", vehicle.mileage || "--"],
                  ["Engine Number", vehicle.engine || "--"],
                  ["VIN", vehicle.vin || "--"],
                  ["Seats", vehicle.seatingCapacity || "--"],
                ]}
                labelStyle={labelStyle}
                valueStyle={valueStyle}
              />
              <ExpiryStatusGrid
                rows={expiryRows}
                labelStyle={labelStyle}
                valueStyle={valueStyle}
              />
            </Card>

            <Card>
              <h3 style={cardTitle}>Owner Information</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
                <img
                  src={owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner?.fullName || "Owner")}&background=E2E8F0&color=475569`}
                  alt={owner?.fullName || "Owner"}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <p style={{ fontWeight: 750 }}>{owner?.fullName || "N/A"}</p>
                  <p style={{ fontSize: "0.78rem", color: "#6B7280" }}>{owner?.businessName || "Vehicle Owner"}</p>
                </div>
              </div>
              <InfoList
                rows={[
                  ["Email", owner?.email || "--"],
                  ["Phone", owner?.phone || "--"],
                  ["Member Since", dateText(owner?.memberSince)],
                  ["Total Vehicles", owner?.totalVehicles || "--"],
                ]}
                labelStyle={labelStyle}
                valueStyle={valueStyle}
              />
            </Card>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card>
                <h3 style={cardTitle}>Listing Details</h3>
                <InfoGrid
                  rows={[
                    ["Daily Rate", currency(listing?.dailyRate)],
                    ["Weekly Rate", currency(listing?.weeklyRate)],
                    ["Monthly Rate", currency(listing?.monthlyRate)],
                    ["Security Deposit", currency(listing?.securityDeposit)],
                    ["Listing Created", dateText(listing?.listingCreated)],
                    ["Last Updated", dateText(listing?.lastUpdated)],
                  ]}
                  labelStyle={labelStyle}
                  valueStyle={valueStyle}
                />
                <div style={{ marginTop: "1.25rem" }}>
                  <p style={labelStyle}>Description</p>
                  <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5 }}>
                    {listing?.description || "No owner description has been added yet."}
                  </p>
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Current Rental Agreement</h3>
                {detail.currentRentalAgreement ? (
                  <InfoGrid
                    rows={[
                      ["Driver", detail.currentRentalAgreement.driver || "--"],
                      ["Agreement ID", String(detail.currentRentalAgreement.agreementId || "--")],
                      ["Start Date", dateText(detail.currentRentalAgreement.startDate)],
                      ["End Date", dateText(detail.currentRentalAgreement.endDate)],
                      ["Rental Type", detail.currentRentalAgreement.rentalType || "--"],
                      ["Status", detail.currentRentalAgreement.status || "--"],
                    ]}
                    labelStyle={labelStyle}
                    valueStyle={valueStyle}
                  />
                ) : (
                  <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.88rem" }}>No active rental or agreement for this vehicle.</p>
                )}
              </Card>

              <Card>
                <h3 style={cardTitle}>Maintenance History</h3>
                {detail.maintenanceHistory.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {detail.maintenanceHistory.map((record) => (
                      <div key={record.id} style={{ padding: "1rem", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                          <div>
                            <p style={{ fontWeight: 700 }}>{record.event}</p>
                            <p style={{ color: "#6B7280", fontSize: "0.82rem" }}>
                              {dateText(record.date)} | {record.reading || "N/A"}
                            </p>
                          </div>
                          <StatusBadge status={record.status || "Unknown"} />
                        </div>
                        <p style={{ color: "#4B5563", fontSize: "0.82rem", marginTop: "0.5rem" }}>Cost: {record.cost || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.88rem" }}>No maintenance activity logged yet.</p>
                )}
              </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card>
                <h3 style={cardTitle}>Compliance Documents</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {documents.map((doc) => (
                    <div key={doc.title} style={{ padding: "0.8rem", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div>
                          <p style={{ fontWeight: 650, fontSize: "0.86rem" }}>{doc.title}</p>
                          <p style={{ color: "#6B7280", fontSize: "0.76rem" }}>{doc.expiry || "--"}</p>
                        </div>
                        <StatusBadge status={doc.status || "Unknown"} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Utilization Metrics</h3>
                <Metric label="This Month" value={detail.utilizationMetrics.thisMonth || "0%"} />
                <Metric label="Last 3 Months" value={detail.utilizationMetrics.last3Months || "0%"} />
                <Metric label="All Time" value={detail.utilizationMetrics.allTime || "0%"} />
                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "1rem", marginTop: "1rem" }}>
                  <InfoList
                    rows={[
                      ["Total Rentals", String(detail.utilizationMetrics.totalRentals ?? 0)],
                      ["Total Revenue", detail.utilizationMetrics.totalRevenue || "$0"],
                    ]}
                    labelStyle={labelStyle}
                    valueStyle={valueStyle}
                  />
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Recent Activity</h3>
                {detail.auditTrail.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {detail.auditTrail.slice(0, 5).map((item) => (
                      <div key={item._id} style={{ display: "flex", gap: "0.75rem" }}>
                        <History size={16} color={COLORS.PRIMARY_MAIN} />
                        <div>
                          <p style={{ fontSize: "0.86rem", fontWeight: 700 }}>{item.title}</p>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{dateText(item.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.88rem" }}>No activity logged yet.</p>
                )}
              </Card>
            </div>
          </div>
        </>
      ) : null}
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

function InfoGrid({
  rows,
  labelStyle,
  valueStyle,
}: {
  rows: [string, string][];
  labelStyle: React.CSSProperties;
  valueStyle: React.CSSProperties;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1.25rem" }}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <p style={labelStyle}>{label}</p>
          <p style={valueStyle}>{value || "--"}</p>
        </div>
      ))}
    </div>
  );
}

function InfoList({
  rows,
  labelStyle,
  valueStyle,
}: {
  rows: [string, string][];
  labelStyle: React.CSSProperties;
  valueStyle: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <p style={labelStyle}>{label}</p>
          <p style={{ ...valueStyle, fontSize: "0.88rem" }}>{value || "--"}</p>
        </div>
      ))}
    </div>
  );
}

function ExpiryStatusGrid({
  rows,
  labelStyle,
  valueStyle,
}: {
  rows: { label: string; value: string; status?: string }[];
  labelStyle: React.CSSProperties;
  valueStyle: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "1.25rem",
        marginTop: "1.25rem",
        paddingTop: "1.25rem",
        borderTop: "1px solid #F3F4F6",
      }}
    >
      {rows.map((row) => (
        <div key={row.label}>
          <p style={labelStyle}>{row.label}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <p style={valueStyle}>{row.value || "N/A"}</p>
            {row.status ? <StatusBadge status={row.status} /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.82rem", color: "#6B7280" }}>{label}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: value, background: COLORS.PRIMARY_MAIN }} />
      </div>
    </div>
  );
}
