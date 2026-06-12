"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Notebook,
  Pause,
  Receipt,
  RefreshCw,
  User,
  X,
} from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import { COLORS } from "@/constants/Constant";
import { rentalsApi } from "@/services/api/rentals";

const tabs = [
  { name: "Rentals Management", path: "/rentals" },
  { name: "Agreements", path: "/rentals/agreements" },
  { name: "Disputes & Refunds", path: "/rentals/disputes" },
  { name: "Admin Notes & Audit", path: "/rentals/audit" },
];

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString();
};

const formatMoney = (value?: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

const getId = (value: any) => value?._id || value?.id || value;

const fullName = (person: any) =>
  [person?.firstName, person?.middleName, person?.lastName].filter(Boolean).join(" ").trim()
  || person?.name
  || person?.userId?.email
  || person?.email
  || "Unknown";

const vehicleName = (vehicle: any) =>
  [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(" ").trim()
  || vehicle?.registration
  || "N/A";

const statusColor = (status?: string) => {
  if (status === "Active" || status === "Completed" || status === "Paid") return COLORS.SUCCESS_MAIN;
  if (status === "Pending" || status === "Draft" || status === "Upcoming") return COLORS.WARNING_MAIN;
  if (status === "Suspended" || status === "Cancelled" || status === "Overdue") return COLORS.ERROR_MAIN;
  return COLORS.TEXT_SECONDARY;
};

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.2rem" }}>{label}</p>
      <div style={{ color: COLORS.TEXT_MAIN, fontSize: "0.84rem", fontWeight: 700, overflowWrap: "anywhere" }}>{value}</div>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: 800, marginBottom: "1rem", color: COLORS.TEXT_MAIN }}>
      {icon}
      {children}
    </h3>
  );
}

function TimelineItem({
  tone,
  title,
  text,
  date,
}: {
  tone: "success" | "warning" | "info" | "danger";
  title: string;
  text?: string;
  date?: string;
}) {
  const color = {
    success: COLORS.SUCCESS_MAIN,
    warning: COLORS.WARNING_MAIN,
    info: COLORS.PRIMARY_MAIN,
    danger: COLORS.ERROR_MAIN,
  }[tone];

  return (
    <div style={{ display: "flex", gap: "0.8rem" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: color, color: COLORS.BG_CARD, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
        {tone === "success" ? <Check size={14} /> : <Clock size={13} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <p style={{ fontSize: "0.84rem", fontWeight: 800, color: COLORS.TEXT_MAIN }}>{title}</p>
          <span style={{ fontSize: "0.72rem", color: COLORS.TEXT_SECONDARY, whiteSpace: "nowrap" }}>{date}</span>
        </div>
        {text ? <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.78rem", marginTop: "0.2rem" }}>{text}</p> : null}
      </div>
    </div>
  );
}

export default function AgreementDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const agreementId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [activeTab, setActiveTab] = useState("Agreements");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAgreementPreview, setShowAgreementPreview] = useState(false);

  const fetchAgreement = useCallback(async () => {
    if (!agreementId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await rentalsApi.getAgreementDashboard(agreementId);
      setData(res.data);
    } catch (err) {
      try {
        const fallback = await rentalsApi.getAgreementById(agreementId);
        setData({ agreement: fallback.data.agreement, auditTrail: fallback.data.adminHistory || [] });
      } catch (fallbackErr) {
        setError(fallbackErr instanceof Error ? fallbackErr.message : err instanceof Error ? err.message : "Failed to load agreement");
      }
    } finally {
      setLoading(false);
    }
  }, [agreementId]);

  useEffect(() => {
    fetchAgreement();
  }, [fetchAgreement]);

  const agreement = data?.agreement || {};
  const driver = agreement.driverId || {};
  const owner = agreement.ownerId || {};
  const ownerProfile = agreement.ownerProfile || {};
  const vehicle = agreement.vehicleId || {};
  const payments = data?.repaymentTracking || [];
  const linkedBookings = data?.linkedBookings || [];
  const linkedRentals = data?.linkedRentals || [];
  const alerts = data?.alerts || [];
  const auditTrail = data?.auditTrail || [];
  const mileage = data?.mileageTracking || {};
  const financial = data?.financialSummary || {};

  const progress = useMemo(() => {
    const [paid, total] = String(financial.progressWeeks || "0/0").split("/").map((value) => Number(value || 0));
    return total ? Math.round((paid / total) * 100) : 0;
  }, [financial.progressWeeks]);

  const nextPayment = payments.find((payment: any) => payment.status !== "Paid");

  const runStatusAction = async (status: "Active" | "Cancelled" | "Suspended") => {
    if (!agreementId) return;
    setActionLoading(status);
    setError(null);
    try {
      if (status === "Suspended") await rentalsApi.suspendAgreement(agreementId);
      else await rentalsApi.updateAgreementStatus(agreementId, status);
      await fetchAgreement();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to set agreement ${status.toLowerCase()}`);
    } finally {
      setActionLoading(null);
    }
  };

  const markNextPaymentPaid = async () => {
    if (!nextPayment?._id || !agreementId) return;
    setActionLoading("payment");
    setError(null);
    try {
      await rentalsApi.markAgreementPaymentPaid(agreementId, nextPayment._id);
      await fetchAgreement();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark payment as paid");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <PageHeader title="Agreement Details" enableSearch={false} showBack />
        <Card>Loading agreement...</Card>
      </div>
    );
  }

  if (error && !agreement?._id) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <PageHeader title="Agreement Details" enableSearch={false} showBack />
        <Card>
          <p style={{ color: COLORS.ERROR_MAIN, marginBottom: "0.75rem" }}>{error}</p>
          <Button onClick={fetchAgreement}><RefreshCw size={16} /> Retry</Button>
        </Card>
      </div>
    );
  }

  const displayId = agreement.agreementId || agreementId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <PageHeader title="Agreement Details" enableSearch={false} showBack />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Agreements", path: "/rentals/agreements" },
          { label: displayId },
        ]}
      />

      {error && (
        <div style={{ padding: "0.9rem 1rem", borderRadius: "8px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <Card style={{ borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: COLORS.TEXT_MAIN }}>
                {agreement.title || `${vehicleName(vehicle)} - ${fullName(driver)}`}
              </h2>
              <span style={{ padding: "0.22rem 0.55rem", borderRadius: "6px", background: `${statusColor(agreement.status)}20`, color: statusColor(agreement.status), fontSize: "0.72rem", fontWeight: 900 }}>
                {agreement.status || "Unknown"}
              </span>
            </div>
            <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.82rem" }}>
              {displayId} {agreement.source ? `- ${agreement.source}` : ""} {agreement.bookingId?.bookingId ? `- ${agreement.bookingId.bookingId}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setShowAgreementPreview((value) => !value)}>
              <Eye size={16} /> Full Agreement
            </Button>
            <Button onClick={() => router.push(`/rentals/agreements/create`)}>
              <Edit size={16} /> New Agreement
            </Button>
            <Button variant="warning" onClick={() => runStatusAction("Suspended")} disabled={Boolean(actionLoading)}>
              <Pause size={16} /> Suspend
            </Button>
            <Button variant="danger" onClick={() => runStatusAction("Cancelled")} disabled={Boolean(actionLoading)}>
              <X size={16} /> Cancel
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <DetailItem label="Agreement ID" value={displayId} />
          <DetailItem label="Agreement Type" value={agreement.type || "--"} />
          <DetailItem label="Duration" value={agreement.duration || `${formatDate(agreement.startDate)} - ${formatDate(agreement.endDate)}`} />
          <div>
            <DetailItem label="Progress" value={`${progress}%`} />
            <div style={{ width: "100%", height: "6px", borderRadius: "999px", background: "#E2E8F0", overflow: "hidden", marginTop: "0.35rem" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: COLORS.SUCCESS_MAIN }} />
            </div>
            <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.7rem", textAlign: "right", marginTop: "0.25rem" }}>
              {financial.progressWeeks || "No payments yet"}
            </p>
          </div>
        </div>
      </Card>

      {showAgreementPreview && (
        <Card style={{ borderRadius: "8px", background: "#F8FAFC" }}>
          <SectionTitle icon={<FileText size={18} color={COLORS.PRIMARY_MAIN} />}>Full Agreement Snapshot</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <DetailItem label="Driver" value={fullName(driver)} />
            <DetailItem label="Owner" value={ownerProfile.fullName || ownerProfile.businessName || owner.email || "--"} />
            <DetailItem label="Vehicle" value={vehicleName(vehicle)} />
            <DetailItem label="Registration" value={vehicle.registration || "--"} />
            <DetailItem label="Start" value={formatDateTime(agreement.startDate)} />
            <DetailItem label="End" value={formatDateTime(agreement.endDate)} />
            <DetailItem label="Payment Method" value={agreement.paymentMethod || "--"} />
            <DetailItem label="Insurance" value={agreement.insuranceType || "--"} />
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "1rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<Clock size={18} color={COLORS.PRIMARY_MAIN} />}>Status Timeline</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TimelineItem tone="info" title="Agreement Created" text={agreement.source === "Driver Booking" ? "Created automatically from driver app booking data." : "Created by admin."} date={formatDateTime(agreement.createdAt)} />
              {agreement.status === "Active" ? (
                <TimelineItem tone="success" title="Agreement Activated" text="Agreement is active and repayment tracking is available." date={formatDateTime(agreement.updatedAt)} />
              ) : (
                <TimelineItem tone="warning" title="Pending Activation" text="Admin can approve and activate when checks are complete." date="" />
              )}
              {alerts.map((alert: any) => (
                <TimelineItem key={alert.title} tone={alert.severity === "high" ? "danger" : "warning"} title={alert.title} text={alert.message} date="" />
              ))}
            </div>
          </Card>

          <Card padding="0" style={{ borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
              <SectionTitle icon={<Receipt size={18} color={COLORS.PRIMARY_MAIN} />}>Repayment Schedule</SectionTitle>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Payment", "Due Date", "Amount", "Method", "Status", "Action"].map((head) => (
                      <th key={head} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.68rem", color: COLORS.TEXT_MUTED, textTransform: "uppercase" }}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "1.5rem", textAlign: "center", color: COLORS.TEXT_SECONDARY }}>
                        No repayment rows yet. Activate the agreement to generate the schedule.
                      </td>
                    </tr>
                  ) : payments.map((payment: any) => (
                    <tr key={payment._id} style={{ borderTop: `1px solid ${COLORS.BORDER_MAIN}` }}>
                      <td style={{ padding: "0.8rem 1rem", fontWeight: 800, fontSize: "0.8rem" }}>{payment.transactionId || payment._id}</td>
                      <td style={{ padding: "0.8rem 1rem", fontSize: "0.8rem" }}>{formatDate(payment.dueDate)}</td>
                      <td style={{ padding: "0.8rem 1rem", fontWeight: 800, fontSize: "0.8rem" }}>{formatMoney(payment.amount)}</td>
                      <td style={{ padding: "0.8rem 1rem", fontSize: "0.8rem" }}>{payment.method || agreement.paymentMethod || "--"}</td>
                      <td style={{ padding: "0.8rem 1rem", fontWeight: 800, color: statusColor(payment.status), fontSize: "0.8rem" }}>{payment.status}</td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        {payment.status !== "Paid" ? (
                          <button onClick={() => rentalsApi.markAgreementPaymentPaid(agreementId, payment._id).then(fetchAgreement)} style={{ border: "none", background: "transparent", color: COLORS.PRIMARY_MAIN, fontWeight: 800, cursor: "pointer", fontSize: "0.78rem" }}>
                            Mark paid
                          </button>
                        ) : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<Calendar size={18} color={COLORS.PRIMARY_MAIN} />}>Linked Booking & Rental Records</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 900, marginBottom: "0.6rem" }}>Driver Bookings</h4>
                {linkedBookings.length === 0 ? (
                  <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem" }}>No linked booking found.</p>
                ) : linkedBookings.map((booking: any) => (
                  <div key={booking._id} style={{ padding: "0.75rem", border: `1px solid ${COLORS.BORDER_MAIN}`, borderRadius: "8px", marginBottom: "0.6rem" }}>
                    <p style={{ fontWeight: 900 }}>{booking.bookingId}</p>
                    <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.78rem" }}>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                    <p style={{ color: statusColor(booking.status), fontSize: "0.78rem", fontWeight: 800 }}>{booking.status}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 900, marginBottom: "0.6rem" }}>Rental Records</h4>
                {linkedRentals.length === 0 ? (
                  <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem" }}>No linked rental record found.</p>
                ) : linkedRentals.map((rental: any) => (
                  <div key={rental._id} style={{ padding: "0.75rem", border: `1px solid ${COLORS.BORDER_MAIN}`, borderRadius: "8px", marginBottom: "0.6rem" }}>
                    <p style={{ fontWeight: 900 }}>{rental.rentalId}</p>
                    <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.78rem" }}>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                    <p style={{ color: statusColor(rental.rentalStatus), fontSize: "0.78rem", fontWeight: 800 }}>{rental.rentalStatus}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<Notebook size={18} color={COLORS.PRIMARY_MAIN} />}>Approval History & Audit Trail</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {auditTrail.length === 0 ? (
                <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem" }}>No audit events yet.</p>
              ) : auditTrail.map((item: any) => (
                <TimelineItem key={item._id} tone="info" title={item.title || item.type || "Audit event"} text={item.description} date={formatDateTime(item.createdAt)} />
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<User size={18} color={COLORS.PRIMARY_MAIN} />}>Parties</SectionTitle>
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <DetailItem label="Driver" value={fullName(driver)} />
              <DetailItem label="Driver Email" value={driver.userId?.email || driver.email || "--"} />
              <DetailItem label="Driver Licence" value={driver.driverLicenceNumber || "--"} />
              <DetailItem label="Owner" value={ownerProfile.fullName || ownerProfile.businessName || owner.email || "--"} />
              <DetailItem label="Owner Email" value={owner.email || "--"} />
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<Car size={18} color={COLORS.PRIMARY_MAIN} />}>Vehicle & Compliance</SectionTitle>
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <DetailItem label="Vehicle" value={vehicleName(vehicle)} />
              <DetailItem label="Registration" value={vehicle.registration || "--"} />
              <DetailItem label="VIN" value={vehicle.vin || "--"} />
              <DetailItem label="Insurance Expiry" value={formatDate(vehicle.insuranceData?.insuranceExpiry)} />
            </div>
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<CheckCircle2 size={18} color={COLORS.PRIMARY_MAIN} />}>Mileage Tracking</SectionTitle>
            {[
              ["Start Mileage", mileage.startMileage ?? agreement.mileageStart ?? "--"],
              ["Current Mileage", mileage.currentMileage ?? "--"],
              ["Mileage Used", mileage.mileageUsed ?? "--"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                <span style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem" }}>{label}</span>
                <strong style={{ fontSize: "0.82rem" }}>{value}</strong>
              </div>
            ))}
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<DollarSign size={18} color={COLORS.PRIMARY_MAIN} />}>Agreement Summary</SectionTitle>
            {[
              ["Agreement Amount", formatMoney(agreement.amount)],
              ["Weekly Repayment", formatMoney(agreement.repaymentAmount)],
              ["Deposit", formatMoney(agreement.deposit)],
              ["Fixed Fee", formatMoney(agreement.fixedFee)],
              ["Total Paid", formatMoney(financial.totalPaid)],
              ["Remaining", formatMoney(financial.remainingBalance)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                <span style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem" }}>{label}</span>
                <strong style={{ fontSize: "0.82rem" }}>{value}</strong>
              </div>
            ))}
          </Card>

          <Card style={{ borderRadius: "8px" }}>
            <SectionTitle icon={<Bell size={18} color={COLORS.PRIMARY_MAIN} />}>Quick Actions</SectionTitle>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              <Button onClick={() => runStatusAction("Active")} disabled={agreement.status === "Active" || Boolean(actionLoading)}>
                <Check size={16} /> Approve & Activate
              </Button>
              <Button variant="success" onClick={markNextPaymentPaid} disabled={!nextPayment || Boolean(actionLoading)}>
                <Check size={16} /> Mark Payment Received
              </Button>
              <Button variant="warning" disabled>
                <Bell size={16} /> Send Payment Reminder
              </Button>
              <Button variant="outline" disabled>
                <Notebook size={16} /> Add Admin Note
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
