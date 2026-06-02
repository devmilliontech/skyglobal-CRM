"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  File,
  Image as ImageIcon,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/Button";
import { ApprovalReview, vehiclesApi } from "@/services/api/vehicles";

const money = (value: unknown) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const dateText = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export default function ListingApprovalReview() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [review, setReview] = useState<ApprovalReview | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehiclesApi.getApprovalReview(id);
      setReview(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load approval review");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchReview();
  }, [fetchReview, id]);

  const updateStatus = async (status: "Approved" | "Rejected" | "Pending") => {
    setSaving(true);
    setError(null);
    try {
      await vehiclesApi.updateListingStatus(id, status, notes || `Listing ${status.toLowerCase()} from approval review`);
      if (status === "Approved") {
        router.push(`/vehicles/${id}`);
      } else {
        await fetchReview();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update listing status");
    } finally {
      setSaving(false);
    }
  };

  const listing = review?.listingDetails || {};
  const photos = useMemo(
    () => [review?.photos?.primary, ...(review?.photos?.gallery || [])].filter(Boolean) as string[],
    [review?.photos],
  );
  const documents = Object.values(review?.complianceDocuments || {});
  const checklistItems: [string, any][] = [
    ["Registration Valid", review?.complianceChecklist?.registrationValid],
    ["Insurance Active", review?.complianceChecklist?.insuranceActive],
    ["Safety Inspection", review?.complianceChecklist?.safetyInspection],
    ["Ownership Verified", review?.complianceChecklist?.ownershipVerified],
    ["Photos Complete", review?.complianceChecklist?.photosComplete],
    ["Owner KYC Verified", review?.complianceChecklist?.ownerKycVerified],
  ];
  const riskFlags: [string, any][] = [
    ["No Fraud Indicators", review?.riskFlags?.noFraudIndicators],
    ["No Duplicate Listings", review?.riskFlags?.noDuplicateListings],
    ["Pricing Normal", review?.riskFlags?.pricingNormal],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Listing Approval Review"
        searchPlaceholder="Search vehicles..."
        notificationCount={3}
      />

      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Vehicles", path: "/vehicles" },
          { label: "Pending Approvals", path: "/vehicles" },
          { label: listing.registration || id },
        ]}
      />

      {loading ? (
        <Card>
          <p style={{ color: COLORS.TEXT_SECONDARY }}>Loading vehicle review from backend...</p>
        </Card>
      ) : error ? (
        <Card>
          <p style={{ color: COLORS.ERROR_MAIN, fontWeight: 700 }}>{error}</p>
          <Button variant="outline" style={{ marginTop: "1rem" }} onClick={fetchReview}>
            Retry
          </Button>
        </Card>
      ) : review ? (
        <>
          <div
            style={{
              background: "#FEF3C7",
              border: "1px solid #FDE68A",
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <AlertTriangle size={22} color="#D97706" />
            <div>
              <p style={{ fontWeight: 750, color: "#92400E" }}>Pending Approval Required</p>
              <p style={{ fontSize: "0.88rem", color: "#B45309" }}>
                Submitted {dateText(listing.submittedAt)}. Review vehicle details, documents, owner data, and risk checks.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <div>
                    <h3 style={cardTitle}>Listing Details</h3>
                    <p style={{ color: "#6B7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Info size={14} /> Owner submitted vehicle information
                    </p>
                  </div>
                  <StatusBadge status={listing.status || "Pending"} />
                </div>

                <InfoGrid
                  rows={[
                    ["Registration Number", listing.registration || id],
                    ["VIN Number", listing.vin || "--"],
                    ["Make & Model", listing.makeModel || "--"],
                    ["Daily Rate", money(listing.dailyRate)],
                    ["Security Deposit", money(listing.securityDeposit)],
                    ["Current Mileage", listing.mileage || "--"],
                    ["Fuel Type", listing.fuelType || "--"],
                    ["Submitted", dateText(listing.submittedAt)],
                  ]}
                />

                <div style={{ background: "#F9FAFB", padding: "1rem", borderRadius: "8px", border: "1px solid #F3F4F6", marginTop: "1.25rem" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.5rem" }}>
                    Vehicle Description
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", lineHeight: 1.55 }}>
                    {listing.description || "No owner description was submitted."}
                  </p>
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Vehicle Photos</h3>
                {photos.length ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    {photos.slice(0, 6).map((photo, index) => (
                      <div key={photo} style={{ borderRadius: "8px", overflow: "hidden", aspectRatio: "16/10", background: "#F3F4F6" }}>
                        <img src={photo} alt={`Vehicle photo ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ minHeight: "140px", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", borderRadius: "8px" }}>
                    <ImageIcon size={28} color="#9CA3AF" />
                  </div>
                )}
              </Card>

              <Card>
                <h3 style={cardTitle}>Compliance Documents</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {documents.map((doc: any, index) => (
                    <div key={`${doc.status}-${index}`} style={{ border: "1px solid #E5E7EB", borderRadius: "8px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <File size={18} color={doc.status === "Verified" || doc.status === "Valid" ? COLORS.SUCCESS_MAIN : COLORS.WARNING_MAIN} />
                        <div>
                          <p style={{ fontWeight: 650 }}>{documentLabel(index)}</p>
                          <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>Expiry: {doc.expiry || "N/A"}</p>
                        </div>
                      </div>
                      <StatusBadge status={doc.status || "Unknown"} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Owner Identity Snapshot</h3>
                <InfoGrid
                  rows={[
                    ["Owner", review.ownerSnapshot?.name || "--"],
                    ["Owner ID", review.ownerSnapshot?.ownerId || "--"],
                    ["Email", review.ownerSnapshot?.email || "--"],
                    ["Phone", review.ownerSnapshot?.phone || "--"],
                    ["KYC Status", review.ownerSnapshot?.kycStatus || "--"],
                    ["Account Status", review.ownerSnapshot?.accountStatus || "--"],
                    ["Total Vehicles", String(review.ownerSnapshot?.totalVehicles ?? 0)],
                    ["Member Since", dateText(review.ownerSnapshot?.memberSince)],
                  ]}
                />
                <button
                  style={{ marginTop: "1rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", color: COLORS.PRIMARY_MAIN, fontWeight: 650 }}
                  onClick={() => router.push("/owners")}
                >
                  <ExternalLink size={16} />
                  View Owners
                </button>
              </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card>
                <h3 style={cardTitle}>Compliance Checklist</h3>
                <CheckList items={checklistItems} />
                <div style={{ borderTop: "1px solid #E5E7EB", marginTop: "1rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>Overall Status</p>
                  <StatusBadge status={String(review.complianceChecklist?.overallStatus || "Unknown")} />
                </div>
              </Card>

              <Card>
                <h3 style={cardTitle}>Risk Flags</h3>
                <CheckList items={riskFlags} />
              </Card>

              <Card>
                <h3 style={cardTitle}>Approval Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Button variant="success" disabled={saving} onClick={() => updateStatus("Approved")}>
                    <Check size={18} />
                    Approve Listing
                  </Button>
                  <Button variant="danger" disabled={saving} onClick={() => updateStatus("Rejected")}>
                    <X size={18} />
                    Reject Listing
                  </Button>
                  <Button variant="outline" disabled={saving} onClick={() => updateStatus("Pending")}>
                    <Clock size={18} />
                    Keep Pending
                  </Button>
                </div>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add approval notes or conditions..."
                  style={{ width: "100%", height: "92px", border: `1px solid ${COLORS.BORDER_MAIN}`, borderRadius: "8px", padding: "0.85rem", fontSize: "0.9rem", marginTop: "1rem" }}
                />
              </Card>

              <Card>
                <h3 style={cardTitle}>Activity Log</h3>
                {review.activityLog.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {review.activityLog.map((item) => (
                      <div key={`${item.action}-${item.date}`} style={{ display: "flex", gap: "0.75rem" }}>
                        <CheckCircle2 size={16} color={COLORS.PRIMARY_MAIN} />
                        <div>
                          <p style={{ fontSize: "0.88rem", fontWeight: 700 }}>{item.action}</p>
                          <p style={{ fontSize: "0.76rem", color: "#9CA3AF" }}>{dateText(item.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.86rem" }}>No activity logged yet.</p>
                )}
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

const cardTitle: React.CSSProperties = {
  fontSize: "1.08rem",
  fontWeight: 800,
  marginBottom: "1.25rem",
};

function InfoGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: "0.35rem" }}>
            {label}
          </p>
          <p style={{ fontSize: "0.92rem", fontWeight: 650, color: "#111827" }}>{value || "--"}</p>
        </div>
      ))}
    </div>
  );
}

function CheckList({ items }: { items: [string, any][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {items.map(([title, passed]) => (
        <div key={title} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {passed ? (
            <CheckCircle2 size={18} color={COLORS.SUCCESS_MAIN} />
          ) : (
            <XCircle size={18} color={COLORS.ERROR_MAIN} />
          )}
          <p style={{ fontSize: "0.9rem", fontWeight: 650 }}>{title}</p>
        </div>
      ))}
    </div>
  );
}

function documentLabel(index: number) {
  const labels = ["Registration", "Insurance", "Safety", "Ownership"];
  return labels[index] || "Document";
}
