"use client";

import { COLORS } from "@/constants/Constant";
import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CheckCircle,
  CheckCircle2,
  Download,
  Eye,
  FileBadge,
  FileText,
  Plus,
  ShieldAlert,
  Upload,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import {
  complianceApi,
  VehicleComplianceRecord,
} from "@/services/api/compliance";

const documentIcon = (title: string, status: string) => {
  const color =
    status === "Missing" || status === "Expired"
      ? COLORS.ERROR_MAIN
      : status === "Expiring Soon" || status === "Expiring"
        ? COLORS.WARNING_MAIN
        : COLORS.SUCCESS_MAIN;

  if (title.toLowerCase().includes("insurance")) {
    return { icon: <ShieldAlert size={18} />, color };
  }
  if (title.toLowerCase().includes("road")) {
    return { icon: <Wrench size={18} />, color };
  }
  return { icon: <FileText size={18} />, color };
};

export default function VehicleComplianceRecordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [record, setRecord] = useState<VehicleComplianceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await complianceApi.getVehicleRecord(id);
        setRecord(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load compliance record");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecord();
  }, [id]);

  const vehicle = record?.vehicleInformation;
  const overview = record?.complianceStatusOverview ?? {};
  const progressPercent = useMemo(() => {
    if (!record?.complianceProgress.total) return 0;
    return Math.round(
      (record.complianceProgress.completed / record.complianceProgress.total) *
        100,
    );
  }, [record]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Vehicle Compliance Record"
        notificationCount={3}
        showNotifications
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <p style={breadcrumbLink} onClick={() => router.push("/")}>Dashboard</p>
          <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
          <p style={breadcrumbLink} onClick={() => router.push("/vehicles")}>Vehicles</p>
          <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
          <p style={breadcrumbLink} onClick={() => router.push("/vehicles/compliance")}>Compliance</p>
          <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
          <p style={{ fontSize: "0.75rem", color: COLORS.SECONDARY_MAIN, fontWeight: 700 }}>
            {vehicle?.registration || id}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button variant="outline" size="lg">
            <Download size={16} />
            Export Record
          </Button>
          <Button variant="primary" size="lg">
            <Bell size={16} />
            Set Reminder
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <p style={{ color: COLORS.TEXT_SECONDARY }}>Loading compliance record...</p>
        </Card>
      ) : error ? (
        <Card>
          <p style={{ color: COLORS.ERROR_MAIN, fontWeight: 600 }}>{error}</p>
          <Button variant="outline" style={{ marginTop: "1rem" }} onClick={() => router.push("/vehicles/compliance")}>
            Back to Compliance
          </Button>
        </Card>
      ) : record && vehicle ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {(record.alerts.length ? record.alerts : [
              {
                title: vehicle.overallStatus,
                message: `Current vehicle compliance status is ${vehicle.overallStatus}.`,
                type: vehicle.overallStatus === "Compliant" ? "success" : "warning",
              },
            ]).slice(0, 2).map((alert) => (
              <StatusBanner key={alert.title} alert={alert} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "1.5rem" }}>
            <Card>
              <h3 style={cardTitle}>Vehicle Information</h3>
              <InfoList
                rows={[
                  ["Registration", vehicle.registration],
                  ["Make & Model", vehicle.makeModel],
                  ["Color", vehicle.color],
                  ["Owner", vehicle.owner],
                ]}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "space-between", marginTop: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>Overall Status</p>
                <StatusBadge status={vehicle.overallStatus} />
              </div>
            </Card>

            <Card>
              <h3 style={cardTitle}>Compliance Status Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <StatusItem icon={<ShieldAlert size={20} />} title="Insurance" subtitle={overview.insurance || "--"} />
                <StatusItem icon={<FileBadge size={20} />} title="Registration" subtitle={overview.registration || "--"} />
                <StatusItem icon={<Wrench size={20} />} title="Roadworthy" subtitle={overview.roadworthy || "--"} />
                <StatusItem icon={<UserCheck size={20} />} title="License" subtitle={overview.license || "--"} />
              </div>
            </Card>
          </div>

          <Card padding="0">
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Documents & Verification</h3>
              <Button variant="primary" size="sm">
                <Upload size={16} />
                Upload Document
              </Button>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              {record.documents.map((doc, index) => {
                const icon = documentIcon(doc.title, doc.status);
                return (
                  <div key={doc.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: index === record.documents.length - 1 ? "none" : `1px solid ${COLORS.BORDER_MAIN}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ background: "#F9FAFB", padding: "10px", borderRadius: "8px", color: icon.color }}>{icon.icon}</div>
                      <div>
                        <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{doc.title}</p>
                        <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{doc.details}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <StatusBadge status={doc.status} />
                      <Eye size={18} style={{ cursor: "pointer" }} color={COLORS.PRIMARY_MAIN} />
                      <Download size={18} style={{ cursor: "pointer" }} color={COLORS.PRIMARY_MAIN} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
            <Card style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontWeight: 700, fontSize: "1rem" }}>Active Reminders</p>
                <Button variant="primary" size="sm">
                  <Plus size={16} />
                  Add Reminder
                </Button>
              </div>
              <Divider />
              {record.activeReminders.length === 0 ? (
                <p style={{ color: COLORS.TEXT_MUTED, fontSize: "0.85rem" }}>No active reminders</p>
              ) : (
                record.activeReminders.map((reminder) => (
                  <ReminderCard key={`${reminder.title}-${reminder.createdAt}`} reminder={reminder} />
                ))
              )}
            </Card>

            <Card style={{ width: "100%" }}>
              <p style={{ fontWeight: 700, fontSize: "1rem", padding: "0rem 1rem" }}>
                Missing Items Checklist
              </p>
              <Divider />
              {record.missingItemsChecklist.map((item) => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                    {item.status === "Complete" ? (
                      <CheckCircle size={18} color={COLORS.SUCCESS_MAIN} />
                    ) : (
                      <AlertTriangle size={18} color={COLORS.WARNING_MAIN} />
                    )}
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>{item.name}</p>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: item.status === "Complete" ? COLORS.SUCCESS_MAIN : COLORS.WARNING_MAIN, fontWeight: 600 }}>
                    {item.status}
                  </p>
                </div>
              ))}
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Compliance Progress</span>
                <span style={{ fontSize: "0.9rem", color: COLORS.WARNING_MAIN, fontWeight: 600 }}>
                  {record.complianceProgress.text}
                </span>
              </div>
              <progress value={progressPercent} max="100" style={{ width: "100%", height: "12px", marginTop: "1rem" }} />
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}

const breadcrumbLink: React.CSSProperties = {
  fontSize: "0.75rem",
  color: COLORS.SECONDARY_MAIN,
  cursor: "pointer",
};

const cardTitle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  marginBottom: "1.5rem",
};

function InfoList({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY, marginBottom: "0.25rem" }}>{label}</p>
          <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{value || "--"}</p>
        </div>
      ))}
    </div>
  );
}

function StatusBanner({ alert }: { alert: { title: string; message: string; type: string } }) {
  const isSuccess = alert.type === "success";
  const bg = isSuccess ? "#F0FDF4" : "#FFFBEB";
  const border = isSuccess ? "#DCFCE7" : "#FEF3C7";
  const color = isSuccess ? COLORS.SUCCESS_MAIN : COLORS.WARNING_MAIN;

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, padding: "1rem 1.5rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ background: color, borderRadius: "50%", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
        {isSuccess ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", color }}>{alert.title}</p>
        <p style={{ fontSize: "0.8rem", color }}>{alert.message}</p>
      </div>
    </div>
  );
}

function StatusItem({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ background: COLORS.SUCCESS_LIGHT, padding: "1.25rem", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "0.5rem" }}>
      <div style={{ color: COLORS.SUCCESS_MAIN }}>{icon}</div>
      <div>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.TEXT_MAIN }}>{title}</p>
        <p style={{ fontSize: "0.75rem", color: COLORS.SUCCESS_MAIN, fontWeight: 500 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ReminderCard({ reminder }: { reminder: { title: string; message: string; createdAt?: string } }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.WARNING_LIGHT, padding: "1rem 1.5rem", borderRadius: "12px", marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Bell size={18} color={COLORS.WARNING_MAIN} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{reminder.title}</p>
          <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{reminder.message}</p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ backgroundColor: COLORS.GRAY_200, marginTop: "1rem", marginBottom: "1rem", width: "100%", height: "1px" }} />
  );
}
