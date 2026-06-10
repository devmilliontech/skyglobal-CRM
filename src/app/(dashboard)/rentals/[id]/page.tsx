"use client";

import { COLORS } from "@/constants/Constant";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookMarked,
  Check,
  Clock,
  ExternalLink,
  FileText,
  FileWarning,
  MoreHorizontal,
  Notebook,
  RotateCcw,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import {
  rentalsApi,
  RentalAction,
  RentalDetailResponse,
  RentalHistoryItem,
  RentalTimelineItem,
} from "@/services/api/rentals";

const cardStyle: React.CSSProperties = {
  background: COLORS.BG_CARD,
  borderRadius: "12px",
  padding: "1.25rem",
  border: "1px solid #E5E7EB",
  height: "fit-content",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  marginBottom: "1rem",
  fontSize: "0.85rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "#6B7280",
  textTransform: "uppercase",
};

const valueStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: 600,
  color: COLORS.TEXT_MAIN,
};

const formatCurrency = (value?: number | string | null) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(num) ? num : 0);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const initials = (name?: string) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const formatPaymentStatusLabel = (status?: string | null) => {
  const clean = String(status || "").trim();
  if (!clean) return "--";
  if (clean.toLowerCase().startsWith("payment ")) return clean;
  return `Payment ${clean}`;
};

const formatRentalStatusLabel = (status?: string | null) => {
  const clean = String(status || "").trim();
  if (!clean) return "--";
  if (clean.toLowerCase().startsWith("rental ")) return clean;
  return `Rental ${clean}`;
};

const isSuccessfulPaymentStatus = (status?: string | null) => {
  const lower = String(status || "").toLowerCase();
  return (
    (lower.includes("completed") || lower.includes("paid")) &&
    !lower.includes("unpaid") &&
    !lower.includes("pending") &&
    !lower.includes("overdue") &&
    !lower.includes("failed")
  );
};

const DataRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value?: React.ReactNode;
  color?: string;
}) => (
  <div style={rowStyle}>
    <span style={{ color: "#6B7280" }}>{label}</span>
    <span style={{ fontWeight: 600, color: color || COLORS.TEXT_MAIN, textAlign: "right" }}>
      {value || "--"}
    </span>
  </div>
);

const PersonBadge = ({ name }: { name?: string }) => (
  <div
    style={{
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: COLORS.PRIMARY_LIGHT,
      color: COLORS.PRIMARY_MAIN,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      flexShrink: 0,
    }}
  >
    {initials(name)}
  </div>
);

export default function RentalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rentalId = String(params.id || "");
  const [data, setData] = useState<RentalDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"approve" | "cancel" | RentalAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadRental = useCallback(
    async ({ quiet = false }: { quiet?: boolean } = {}) => {
      if (!rentalId) return;
      if (!quiet) {
        setLoading(true);
        setError(null);
      }
      try {
        const res = await rentalsApi.getRentalById(rentalId);
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load rental details");
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [rentalId],
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await rentalsApi.getRentalById(rentalId);
        if (active) setData(res.data);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load rental details");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (rentalId) load();
    return () => {
      active = false;
    };
  }, [rentalId]);

  const handleStatusUpdate = async (
    action: "approve" | "cancel",
    status: "Upcoming" | "Cancelled",
  ) => {
    if (action === "cancel") {
      const confirmed = window.confirm("Cancel this booking/rental?");
      if (!confirmed) return;
    }

    setActionLoading(action);
    setActionError(null);
    try {
      await rentalsApi.updateRentalStatus(rentalId, {
        status,
        actionNote:
          action === "approve"
            ? "Approved by admin from CRM"
            : "Cancelled by admin from CRM",
      });
      await loadRental({ quiet: true });
    } catch (err: any) {
      setActionError(err.message || `Failed to ${action} rental`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRentalAction = async (
    action: RentalAction,
    payload: Record<string, unknown> = {},
    confirmMessage?: string,
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setActionLoading(action);
    setActionError(null);
    try {
      const res = await rentalsApi.performRentalAction(rentalId, action, payload);
      if (res.data?.detail) {
        setData(res.data.detail);
      } else {
        await loadRental({ quiet: true });
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to perform rental action");
    } finally {
      setActionLoading(null);
    }
  };

  const promptAndRunAction = (action: RentalAction) => {
    if (action === "request-extension") {
      const requestedEndDate = window.prompt("Requested end date (YYYY-MM-DD)");
      if (!requestedEndDate) return;
      const reason = window.prompt("Reason for extension") || "";
      handleRentalAction(action, { requestedEndDate, reason });
      return;
    }

    if (action === "send-reminder") {
      const message = window.prompt("Reminder message", "Please review this rental/return status.");
      if (!message) return;
      handleRentalAction(action, { message });
      return;
    }

    if (action === "add-note") {
      const note = window.prompt("Admin note");
      if (!note) return;
      handleRentalAction(action, { note });
      return;
    }

    if (action === "initiate-refund") {
      const amount = window.prompt("Refund amount");
      if (amount === null) return;
      const reason = window.prompt("Refund reason") || "";
      handleRentalAction(action, { amount: Number(amount || 0), reason });
      return;
    }

    if (action === "escalate-dispute" || action === "add-dispute") {
      const content = window.prompt("Dispute details");
      if (!content) return;
      handleRentalAction(action, { content });
    }
  };

  const rental = data?.rental;
  const vehicle = rental?.vehicleInfo || {};
  const driver = rental?.driverInfo || {};
  const owner = rental?.ownerInfo || {};
  const agreement = rental?.agreement;
  const pricing = rental?.pricing || rental?.booking?.pricing || {};
  const fareBreakdown = rental?.fareBreakdown || pricing.fareBreakdown || null;
  const fareLines = Array.isArray(fareBreakdown?.lines) ? fareBreakdown.lines : [];

  const paymentTimeline = useMemo(
    () => data?.paymentTimeline || [],
    [data?.paymentTimeline],
  );
  const adminHistory = useMemo(
    () => data?.adminHistory || [],
    [data?.adminHistory],
  );
  const disputeLog = useMemo(
    () => data?.disputeLog || [],
    [data?.disputeLog],
  );

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <PageHeader title="Rental Details" showBack notificationCount={3} />
        <div className="card" style={{ padding: "2rem", color: COLORS.TEXT_SECONDARY }}>
          Loading rental details...
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <PageHeader title="Rental Details" showBack notificationCount={3} />
        <div
          className="card"
          style={{
            padding: "1rem",
            border: "1px solid #FECACA",
            background: "#FEF2F2",
            color: COLORS.ERROR_MAIN,
          }}
        >
          {error || "Rental not found"}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader
        title="Rental Details"
        description={`Viewing details for rental ${rental.rentalId || rentalId}`}
        showBack
        notificationCount={3}
      />

      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: "1.35rem", fontWeight: 800, wordBreak: "break-word" }}>
                {rental.rentalId || rental.bookingId || rentalId}
              </h1>
              <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 500 }}>
                {vehicle.name || rental.vehicleName || "--"} -{" "}
                {vehicle.registration || rental.vehicleRegistration || "--"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <StatusBadge status={rental.agreementType || "--"} />
            <StatusBadge status={formatRentalStatusLabel(rental.rentalStatus)} />
            <StatusBadge status={formatPaymentStatusLabel(rental.paymentStatus)} />
          </div>
        </div>

        {actionError && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #FECACA",
              background: "#FEF2F2",
              color: COLORS.ERROR_MAIN,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {actionError}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "1.5rem",
            borderTop: "1px solid #F3F4F6",
            paddingTop: "1.5rem",
          }}
        >
          <div>
            <p style={labelStyle}>Start Date</p>
            <p style={valueStyle}>{formatDateTime(rental.startDate)}</p>
          </div>
          <div>
            <p style={labelStyle}>End Date</p>
            <p style={valueStyle}>{formatDateTime(rental.endDate)}</p>
          </div>
          <div>
            <p style={labelStyle}>Outstanding Balance</p>
            <p style={{ ...valueStyle, color: COLORS.ERROR_MAIN }}>
              {formatCurrency(rental.outstandingBalance)}
            </p>
          </div>
          <div>
            <p style={labelStyle}>Late Return Fee</p>
            <p style={{ ...valueStyle, color: COLORS.WARNING_MAIN }}>
              {formatCurrency(rental.lateReturnFee)}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Rental Overview
            </h3>
            <DataRow label="Rental Amount" value={formatCurrency(rental.rentalAmount)} />
            <DataRow label="Deposit" value={formatCurrency(rental.deposit)} />
            <DataRow label="Delivery Fee" value={formatCurrency(rental.deliveryFee || pricing.deliveryFee)} />
            <DataRow label="Duration" value={`${rental.durationDays || 0} days`} />
            <DataRow
              label="Mileage Start"
              value={rental.mileageStart ? `${Number(rental.mileageStart).toLocaleString()} km` : "--"}
            />
            {fareLines.length > 0 && (
              <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "1rem", marginTop: "1rem" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.TEXT_MAIN, marginBottom: "0.75rem" }}>
                  Fare Breakdown
                </p>
                {fareLines.map((line: any, index: number) => (
                  <DataRow
                    key={line.key || `${line.type || "fare"}-${index}`}
                    label={line.label || "Fare item"}
                    value={formatCurrency(line.amount)}
                    color={
                      line.type === "weekend" || line.type === "holiday"
                        ? COLORS.WARNING_MAIN
                        : COLORS.TEXT_MAIN
                    }
                  />
                ))}
              </div>
            )}
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "1rem", marginTop: "1rem" }}>
              <DataRow
                label="Total Paid"
                value={formatCurrency(rental.totalPaid)}
                color={COLORS.SUCCESS_MAIN}
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Driver Information
            </h3>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <PersonBadge name={driver.name || rental.driverName} />
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  {driver.name || rental.driverName || "--"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Driver ID: {driver.driverId || "--"}
                </p>
              </div>
            </div>
            <DataRow label="Phone" value={driver.phone || "--"} />
            <DataRow label="Email" value={driver.email || "--"} />
            <DataRow label="License" value={driver.license || "--"} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>KYC Status</span>
              <StatusBadge status={driver.kycStatus || "Pending"} />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Owner Information
            </h3>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <PersonBadge name={owner.name || rental.ownerName} />
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  {owner.name || rental.ownerName || "--"}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  {owner.businessName || "Vehicle Owner"}
                </p>
              </div>
            </div>
            <DataRow label="Phone" value={owner.phone || "--"} />
            <DataRow label="Email" value={owner.email || "--"} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Status</span>
              <StatusBadge status={owner.status || "Active"} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Vehicle Information
            </h3>
            <DataRow label="Make & Model" value={vehicle.name || rental.vehicleName || "--"} />
            <DataRow label="Registration" value={vehicle.registration || rental.vehicleRegistration || "--"} />
            <DataRow label="Insurance" value={<StatusBadge status={vehicle.insuranceStatus || "Missing"} />} />
            <DataRow label="VIN" value={vehicle.vin || "--"} />
            <DataRow label="Registration Expiry" value={formatDate(vehicle.registrationExpiry)} />
            <DataRow label="Insurance Expiry" value={formatDate(vehicle.insuranceExpiry)} />
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Check-in / Check-out
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ConditionBox
                title="Check-in Condition"
                date={rental.checkInCondition?.date}
                notes={rental.checkInCondition?.notes}
              />
              <ConditionBox
                title="Check-out Condition"
                date={rental.checkOutCondition?.date}
                notes={rental.checkOutCondition?.notes || rental.returnStatus || "Pending return"}
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Return Controls
            </h3>
            <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
              <ActionButton
                color={COLORS.PRIMARY_MAIN}
                icon={<Check size={18} />}
                label={actionLoading === "mark-returned" ? "Marking..." : "Mark as Returned"}
                disabled={Boolean(actionLoading)}
                onClick={() =>
                  handleRentalAction(
                    "mark-returned",
                    { actionNote: "Marked as returned from CRM" },
                    "Mark this rental as returned?",
                  )
                }
              />
              <ActionButton
                color="#fff"
                textColor={COLORS.TEXT_MAIN}
                icon={<Clock size={18} />}
                label={actionLoading === "request-extension" ? "Requesting..." : "Request Extension"}
                disabled={Boolean(actionLoading)}
                onClick={() => promptAndRunAction("request-extension")}
              />
              <ActionButton
                color={COLORS.WARNING_LIGHT}
                textColor={COLORS.WARNING_DARK}
                icon={<Bell size={18} />}
                label={actionLoading === "send-reminder" ? "Sending..." : "Send Reminder"}
                disabled={Boolean(actionLoading)}
                onClick={() => promptAndRunAction("send-reminder")}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TimelineCard items={paymentTimeline} />

          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Agreement
            </h3>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                cursor: "pointer",
                textAlign: "left",
              }}
              onClick={() =>
                agreement?.id
                  ? router.push(`/rentals/agreements/${agreement.id}`)
                  : router.push("/rentals/agreements")
              }
            >
              <div style={{ padding: "8px", background: "#EEF2FF", color: "#4F46E5", borderRadius: "8px" }}>
                <FileText size={20} />
              </div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  {agreement?.agreementId || "No agreement linked"}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  {agreement?.title || agreement?.type || rental.agreementType || "--"}
                </p>
              </div>
              <ExternalLink size={16} color={COLORS.PRIMARY_MAIN} />
            </button>
          </div>

          <HistoryCard items={adminHistory} />

          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Quick Actions
            </h3>
            <QuickAction
              icon={<FileText size={18} color={COLORS.PRIMARY_MAIN} />}
              label="View Agreement"
              onClick={() =>
                agreement?.id
                  ? router.push(`/rentals/agreements/${agreement.id}`)
                  : router.push("/rentals/agreements")
              }
            />
            <QuickAction
              icon={<Notebook size={18} color="#0ea5e9" />}
              label={actionLoading === "add-note" ? "Adding Note..." : "Add Note"}
              disabled={Boolean(actionLoading)}
              onClick={() => promptAndRunAction("add-note")}
            />
            <QuickAction
              icon={<RotateCcw size={18} color="#f6a61f" />}
              label={actionLoading === "initiate-refund" ? "Initiating..." : "Initiate Refund"}
              disabled={Boolean(actionLoading)}
              onClick={() => promptAndRunAction("initiate-refund")}
            />
            <QuickAction
              icon={<FileWarning size={18} color="#dc2626" />}
              label={actionLoading === "escalate-dispute" ? "Escalating..." : "Escalate Dispute"}
              disabled={Boolean(actionLoading)}
              onClick={() => promptAndRunAction("escalate-dispute")}
            />
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Issues and Dispute Log</h3>
          <button
            onClick={() => promptAndRunAction("add-dispute")}
            disabled={Boolean(actionLoading)}
            style={{
              backgroundColor: COLORS.PRIMARY_MAIN,
              color: COLORS.BG_CARD,
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "0.85rem",
              opacity: actionLoading ? 0.65 : 1,
              cursor: actionLoading ? "not-allowed" : "pointer",
            }}
          >
            <Notebook size={18} />
            <span>{actionLoading === "add-dispute" ? "Adding..." : "Add Entry"}</span>
          </button>
        </div>
        {disputeLog.length ? (
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
            {disputeLog.map((item) => (
              <HistoryItem key={item.id || item.createdAt || item.title} item={item} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2.5rem",
              marginBottom: "1.5rem",
              gap: "0.5rem",
            }}
          >
            <BookMarked size={35} color="#6B7280" />
            <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>
              No issues or disputes logged for this rental.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConditionBox({
  title,
  date,
  notes,
}: {
  title: string;
  date?: string | null;
  notes?: string;
}) {
  return (
    <div>
      <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.75rem" }}>{title}</p>
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          background: "#F9FAFB",
          border: "1px dashed #E5E7EB",
        }}
      >
        <p style={{ fontSize: "0.72rem", color: "#6B7280", marginBottom: "0.5rem" }}>
          {formatDateTime(date)}
        </p>
        <p style={{ fontSize: "0.8rem", color: "#374151" }}>{notes || "--"}</p>
      </div>
    </div>
  );
}

function ActionButton({
  color,
  textColor = COLORS.BG_CARD,
  icon,
  label,
  disabled,
  onClick,
}: {
  color: string;
  textColor?: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        fontWeight: 700,
        fontSize: "0.85rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        background: color,
        color: textColor,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function TimelineCard({ items }: { items: RentalTimelineItem[] }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
        Payment Timeline
      </h3>
      <div style={{ position: "relative", paddingLeft: "1.5rem", display: "grid", gap: "1rem" }}>
        {items.length ? (
          items.map((item, index) => (
            <div key={item.id || item.transactionId || `${item.label}-${index}`} style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "-22px",
                  top: "4px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isSuccessfulPaymentStatus(item.status) ? COLORS.SUCCESS_MAIN : "#E5E7EB",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>{item.label || "Payment"}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    {formatDate(item.paidDate || item.dueDate)} - {formatCurrency(item.amount)}
                  </p>
                </div>
                <StatusBadge status={formatPaymentStatusLabel(item.status || "Pending")} />
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.85rem" }}>No payment records found.</p>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ items }: { items: RentalHistoryItem[] }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
        Admin History
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.length ? (
          items.slice(0, 5).map((item) => (
            <HistoryItem key={item.id || item.createdAt || item.title} item={item} />
          ))
        ) : (
          <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.85rem" }}>No admin history yet.</p>
        )}
      </div>
    </div>
  );
}

function HistoryItem({ item }: { item: RentalHistoryItem }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem",
        borderRadius: "8px",
        background: "#F9FAFB",
      }}
    >
      <div>
        <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>{item.title || "Activity"}</p>
        <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
          {item.description || item.actorName || "System"}
        </p>
      </div>
      <p style={{ fontSize: "0.7rem", color: "#6B7280", whiteSpace: "nowrap" }}>
        {formatDate(item.createdAt)}
      </p>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.85rem",
        padding: "0.35rem 0",
        width: "100%",
        background: "transparent",
        border: "none",
        textAlign: "left",
        cursor: disabled ? "not-allowed" : "pointer",
        color: COLORS.TEXT_MAIN,
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
