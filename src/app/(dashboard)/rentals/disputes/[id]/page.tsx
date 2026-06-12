"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Flag,
  Image,
  MessageCircle,
  Plus,
  PlusCircle,
  Users,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import { disputesApi, DisputeDetailsResponse } from "@/services/api/disputes";
import {
  ActionButton,
  DetailCard,
  EvidenceItem,
  ExposureItem,
  InfoItem,
  NoteItem,
  PaymentTimelineItem,
  StatementBox,
  StatusBadge,
  TimelineItem,
} from "./components/CaseDetailsComponents";

const tabs = [
  { name: "Rentals Management", path: "/rentals" },
  { name: "Agreements", path: "/rentals/agreements" },
  { name: "Disputes & Refunds", path: "/rentals/disputes" },
  { name: "Admin Notes & Audit", path: "/rentals/audit" },
];

const avatar = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150";

const money = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusColor = (status?: string) => {
  if (status === "Escalated") return { color: COLORS.ERROR_MAIN, bg: COLORS.ERROR_LIGHT };
  if (status === "Resolved" || status === "Closed") {
    return { color: COLORS.SUCCESS_DARK, bg: COLORS.SUCCESS_LIGHT };
  }
  if (status === "Pending Evidence" || status === "Under Review") {
    return { color: COLORS.WARNING_MAIN, bg: COLORS.WARNING_LIGHT };
  }
  return { color: COLORS.PRIMARY_MAIN, bg: COLORS.PRIMARY_LIGHT };
};

type ResolutionAction = "Full Refund" | "Partial Refund" | "Reject" | "Mediate";

interface LinkedRecord {
  _id?: string;
  bookingId?: string;
  rentalId?: string;
  agreementId?: string | LinkedRecord;
  startDate?: string;
  endDate?: string;
  status?: string;
  returnStatus?: string;
  type?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  fullName?: string;
  businessName?: string;
  vehicleId?: LinkedRecord;
  driverId?: LinkedRecord;
  ownerId?: LinkedRecord;
  registration?: string;
  make?: string;
  model?: string;
}

interface EvidenceAttachment {
  fileUrl?: string;
  fileName?: string;
  uploadedBy?: string;
  size?: number;
}

interface InternalNote {
  adminId?: { email?: string };
  note?: string;
  createdAt?: string;
}

interface CaseStatements {
  driverStatement?: string;
  driverStatementAt?: string;
  ownerStatement?: string;
  ownerStatementAt?: string;
}

interface CaseRecord {
  caseId?: string;
  type?: string;
  status?: string;
  content?: string;
  source?: string;
  createdAt?: string;
  disputedAmount?: number;
  bookingId?: LinkedRecord;
  rentalId?: LinkedRecord;
  agreementId?: LinkedRecord;
  driverId?: LinkedRecord;
  ownerId?: LinkedRecord;
  statements?: CaseStatements;
  evidenceAttachments?: EvidenceAttachment[];
  internalNotes?: InternalNote[];
}

interface TimelineRecord {
  title?: string;
  action?: string;
  createdAt?: string;
  date?: string;
  description?: string;
  note?: string;
}

interface PaymentRecord {
  _id?: string;
  installmentNumber?: number;
  dueDate?: string;
  status?: string;
  amount?: number;
}

const asCaseRecord = (value: Record<string, unknown> | undefined): CaseRecord =>
  (value || {}) as CaseRecord;

const asLinkedRecord = (value: unknown): LinkedRecord =>
  value && typeof value === "object" ? (value as LinkedRecord) : {};

export default function CaseDetails() {
  const params = useParams<{ id: string }>();
  const disputeId = decodeURIComponent(params.id);
  const [activeTab, setActiveTab] = useState("Disputes & Refunds");
  const [data, setData] = useState<DisputeDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionAmount, setResolutionAmount] = useState("");
  const [notifyParties, setNotifyParties] = useState(true);
  const [closeCase, setCloseCase] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ResolutionAction>("Partial Refund");
  const [escalationReason, setEscalationReason] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCase = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await disputesApi.getDispute(disputeId);
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load case");
    } finally {
      setLoading(false);
    }
  }, [disputeId]);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  const caseDetails = asCaseRecord(data?.caseDetails);
  const booking = asLinkedRecord(caseDetails.bookingId);
  const rental = asLinkedRecord(caseDetails.rentalId);
  const agreement = asLinkedRecord(caseDetails.agreementId || booking.agreementId);
  const driver = asLinkedRecord(caseDetails.driverId || booking.driverId);
  const owner = asLinkedRecord(caseDetails.ownerId || booking.ownerId);
  const vehicle = asLinkedRecord(rental.vehicleId || booking.vehicleId);
  const badge = statusColor(caseDetails.status);

  const driverName =
    [driver.firstName, driver.lastName].filter(Boolean).join(" ").trim() ||
    driver.email ||
    "Driver";

  const ownerName = owner.email || owner.fullName || owner.businessName || "Owner";

  const vehicleName =
    [vehicle.registration, vehicle.make, vehicle.model].filter(Boolean).join(" - ") ||
    "--";
  const agreementDisplayId =
    typeof agreement.agreementId === "string" ? agreement.agreementId : "--";
  const evidenceAttachments = caseDetails.evidenceAttachments || [];
  const internalNotes = caseDetails.internalNotes || [];

  const timeline = useMemo(() => {
    const activityItems = ((data?.timelineOfEvents || []) as TimelineRecord[]).map((item) => ({
      title: item.title || item.action || "Case activity",
      time: item.createdAt || item.date,
      description: item.description || item.note || "",
    }));

    return [
      ...activityItems,
      {
        title: "Dispute Case Opened",
        time: caseDetails.createdAt,
        description: caseDetails.content || "Case submitted for admin review.",
      },
    ].filter((item) => item.time || item.description);
  }, [data?.timelineOfEvents, caseDetails.createdAt, caseDetails.content]);

  const addNote = async () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await disputesApi.addNote(disputeId, trimmed);
      setNote("");
      await loadCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setSaving(false);
    }
  };

  const escalate = async () => {
    const reason = escalationReason.trim() || resolutionNotes.trim();
    if (!reason) {
      setError("Escalation reason is required");
      return;
    }
    setSaving(true);
    try {
      await disputesApi.escalate(disputeId, reason);
      setEscalationReason("");
      await loadCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to escalate case");
    } finally {
      setSaving(false);
    }
  };

  const submitResolution = async () => {
    setSaving(true);
    try {
      await disputesApi.resolve(disputeId, {
        action: selectedAction,
        amount: Number(resolutionAmount || caseDetails.disputedAmount || 0),
        notes: resolutionNotes,
        notifyParties,
        closeCase,
      });
      await loadCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit resolution");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <PageHeader title="Case Details" showBack={true} />
        <div style={{ color: "#6B7280" }}>Loading case details...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title={`Case Details - ${caseDetails.caseId || disputeId}`} showBack={true} />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Disputes & Refunds", path: "/rentals/disputes" },
          { label: "Case Details" },
        ]}
      />

      {error && (
        <div style={{ color: COLORS.ERROR_MAIN, fontSize: "0.9rem", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <DetailCard
        style={{ padding: "1.5rem" }}
        headerStyle={{ marginBottom: "1.5rem", alignItems: "flex-start" }}
        title={
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div
              style={{
                background: COLORS.ERROR_LIGHT,
                padding: "0.75rem",
                borderRadius: "8px",
                display: "flex",
                color: COLORS.ERROR_MAIN,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>
                {caseDetails.type || "Dispute"} Case {caseDetails.caseId || disputeId}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#6B7280", marginTop: "0.25rem" }}>
                {caseDetails.content || "Submitted for admin review"}
              </p>
            </div>
          </div>
        }
        rightElement={
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <StatusBadge text={caseDetails.status || "New"} color={badge.color} background={badge.bg} />
            <button
              onClick={escalate}
              disabled={saving}
              style={{
                background: COLORS.ERROR_MAIN,
                color: COLORS.BG_CARD,
                padding: "0.55rem 0.9rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              Escalate
            </button>
          </div>
        }
      >
        <div style={{ height: "1px", background: "#F3F4F6", margin: "0 0 1.5rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2rem" }}>
          <InfoItem label="Rental/Booking ID" value={booking.bookingId || rental.rentalId || "--"} isLink={true} />
          <InfoItem label="Agreement ID" value={agreementDisplayId} isLink={true} />
          <InfoItem label="Submitted By" value={`${driverName} (${caseDetails.source || "Driver"})`} />
          <InfoItem label="Submitted On" value={formatDateTime(caseDetails.createdAt)} />
          <InfoItem label="Disputed Amount" value={money(caseDetails.disputedAmount)} color={COLORS.ERROR_MAIN} />
        </div>
      </DetailCard>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <DetailCard title="Linked Rental" rightElement={<ExternalLink size={16} color={COLORS.PRIMARY_MAIN} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <InfoItem label="Rental/Booking ID" value={booking.bookingId || rental.rentalId || "--"} />
                <InfoItem label="Vehicle" value={vehicleName} />
                <InfoItem
                  label="Rental Period"
                  value={`${formatDateTime(booking.startDate || rental.startDate)} - ${formatDateTime(booking.endDate || rental.endDate)}`}
                />
                <StatusBadge
                  text={rental.returnStatus || booking.status || "--"}
                  color={badge.color}
                  background={badge.bg}
                  style={{ alignSelf: "flex-start", borderRadius: "4px" }}
                />
              </div>
            </DetailCard>

            <DetailCard title="Linked Agreement" rightElement={<ExternalLink size={16} color={COLORS.PRIMARY_MAIN} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <InfoItem label="Agreement ID" value={agreementDisplayId} />
                <InfoItem label="Agreement Type" value={agreement.type || agreement.title || "--"} />
                <InfoItem label="Driver" value={driverName} />
                <InfoItem label="Owner" value={ownerName} />
              </div>
            </DetailCard>
          </div>

          <DetailCard title="Timeline of Events">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {timeline.map((item, index) => (
                <TimelineItem
                  key={`${item.title}-${index}`}
                  icon={index === 0 ? Flag : index === timeline.length - 1 ? PlusCircle : FileText}
                  iconBg={index === 0 ? COLORS.ERROR_LIGHT : COLORS.INFO_LIGHT}
                  iconColor={index === 0 ? COLORS.ERROR_MAIN : COLORS.PRIMARY_MAIN}
                  title={item.title}
                  time={formatDateTime(item.time)}
                  description={item.description}
                />
              ))}
            </div>
          </DetailCard>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <DetailCard title="Calculated Exposure">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ExposureItem label="Late Return Fee" value={money(data?.calculatedExposure.lateReturnFee)} />
              <ExposureItem label="Outstanding Balance" value={money(data?.calculatedExposure.outstandingBalance)} />
              <div style={{ height: "1px", background: "#F3F4F6", margin: "0.5rem 0" }} />
              <ExposureItem label="Total Exposure" value={money(data?.calculatedExposure.totalExposure)} isTotal={true} />
              <ExposureItem label="Driver Disputed" value={money(caseDetails.disputedAmount)} color="#D97706" />
            </div>
          </DetailCard>

          <DetailCard title="Payment Timeline">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {(data?.paymentTimeline || []).length === 0 ? (
                <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>No payment timeline found.</p>
              ) : (
                ((data?.paymentTimeline || []) as PaymentRecord[]).map((payment) => (
                  <PaymentTimelineItem
                    key={payment._id || `${payment.installmentNumber}-${payment.dueDate}`}
                    label={`Installment ${payment.installmentNumber || ""}`.trim()}
                    time={formatDateTime(payment.dueDate)}
                    statusText={`${payment.status} ${money(payment.amount)}`}
                    statusColor={payment.status === "Paid" ? COLORS.SUCCESS_MAIN : COLORS.ERROR_MAIN}
                    statusBg={payment.status === "Paid" ? COLORS.SUCCESS_LIGHT : COLORS.ERROR_LIGHT}
                  />
                ))
              )}
            </div>
          </DetailCard>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <DetailCard
          title="Evidence Attachments"
          rightElement={
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.PRIMARY_MAIN, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Plus size={16} /> Request More
            </span>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {evidenceAttachments.length === 0 ? (
              <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>No evidence uploaded yet.</p>
            ) : (
              evidenceAttachments.map((file, index) => (
                <EvidenceItem
                  key={`${file.fileUrl}-${index}`}
                  icon={String(file.fileName || "").match(/\.(png|jpg|jpeg|webp)$/i) ? Image : FileText}
                  iconBg={COLORS.INFO_LIGHT}
                  iconColor={COLORS.PRIMARY_MAIN}
                  fileName={file.fileName || `Evidence ${index + 1}`}
                  meta={`Uploaded by ${file.uploadedBy || "party"} - ${file.size ? `${Math.round(file.size / 1024)} KB` : "size unknown"}`}
                  onDownload={() => window.open(file.fileUrl, "_blank")}
                />
              ))
            )}
          </div>
        </DetailCard>

        <DetailCard title="Internal Communications">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {internalNotes.map((item, index) => (
              <NoteItem
                key={`${item.createdAt}-${index}`}
                avatar={avatar}
                name={item.adminId?.email || "Admin"}
                note={item.note || ""}
                time={formatDateTime(item.createdAt)}
              />
            ))}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Type your note..."
                style={{
                  width: "100%",
                  minHeight: "72px",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  resize: "vertical",
                }}
              />
              <button
                onClick={addNote}
                disabled={saving}
                style={{
                  alignSelf: "stretch",
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  padding: "0 1rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                }}
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </DetailCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <StatementBox
          title="Driver Statement"
          content={caseDetails.statements?.driverStatement || caseDetails.content || "No driver statement submitted."}
          avatar={avatar}
          author={driverName}
          time={formatDateTime(caseDetails.statements?.driverStatementAt || caseDetails.createdAt)}
        />
        <StatementBox
          title="Owner Statement"
          content={caseDetails.statements?.ownerStatement || "No owner statement submitted."}
          avatar={avatar}
          author={ownerName}
          time={formatDateTime(caseDetails.statements?.ownerStatementAt)}
        />
      </div>

      <DetailCard title="Resolution Actions">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <ActionButton icon={CheckCircle2} text="Approve Full Refund" background={COLORS.SUCCESS_MAIN} onClick={() => setSelectedAction("Full Refund")} />
          <ActionButton icon={AlertCircle} text="Partial Refund" background={COLORS.WARNING_MAIN} onClick={() => setSelectedAction("Partial Refund")} />
          <ActionButton icon={XCircle} text="Reject Dispute" background={COLORS.ERROR_MAIN} onClick={() => setSelectedAction("Reject")} />
          <ActionButton icon={Users} text="Request Mediation" background="#0EA5E9" onClick={() => setSelectedAction("Mediate")} />
        </div>

        <div style={{ backgroundColor: "#f0f2f4", height: "1px", width: "100%", margin: "1.5rem 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", marginBottom: "0.75rem" }}>
              Admin Resolution Notes
            </p>
            <textarea
              value={resolutionNotes}
              onChange={(event) => setResolutionNotes(event.target.value)}
              placeholder="Enter detailed resolution notes, reasoning, and next steps"
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.8rem",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                background: "#F9FAFB",
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", marginBottom: "0.75rem" }}>
              Amount
            </p>
            <input
              value={resolutionAmount}
              onChange={(event) => setResolutionAmount(event.target.value)}
              type="number"
              placeholder={String(caseDetails.disputedAmount || 0)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
              }}
            />
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.75rem" }}>
              Selected: {selectedAction}
            </p>
          </div>
        </div>

        <input
          value={escalationReason}
          onChange={(event) => setEscalationReason(event.target.value)}
          placeholder="Escalation reason"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
            marginBottom: "1rem",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input checked={notifyParties} onChange={(event) => setNotifyParties(event.target.checked)} type="checkbox" />
            <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>Notify parties</p>
            <span style={{ width: "1rem" }} />
            <input checked={closeCase} onChange={(event) => setCloseCase(event.target.checked)} type="checkbox" />
            <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>Close case after action</p>
          </div>
          <button
            onClick={submitResolution}
            disabled={saving}
            style={{
              background: COLORS.PRIMARY_MAIN,
              color: COLORS.BG_CARD,
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {saving ? "Saving..." : "Submit Resolution"}
          </button>
        </div>
      </DetailCard>
    </div>
  );
}
