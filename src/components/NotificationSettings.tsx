"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import { Plus, Send, Eye, Edit2, Trash2 } from "lucide-react";
import { Switch } from "@headlessui/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "./SelectField";
import { adminSettingsApi } from "@/services/api/adminSettings";

// ─── Reusable sub-components ────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
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
            marginBottom: "0.4rem",
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        backgroundColor: "#F3F4F6",
        borderRadius: "8px",
        padding: "4px",
        marginBottom: "2rem",
        gap: "2px",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: "0.4rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            background: active === tab ? "#fff" : "transparent",
            color: active === tab ? COLORS.TEXT_MAIN : COLORS.TEXT_SECONDARY,
            fontWeight: active === tab ? 600 : 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: active === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.15s",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  fontSize: "0.9rem",
  outline: "none",
  color: COLORS.TEXT_MAIN,
  boxSizing: "border-box",
};

const selectBg =
  '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 1rem top 50%';

const VARIABLES = [
  "{{owner_name}}",
  "{{vehicle_name}}",
  "{{vehicle_reg}}",
  "{{approval_date}}",
  "{{platform_url}}",
  "{{support_email}}",
];

const DEFAULT_TEMPLATES = [
  { id: "1", name: "Vehicle Approval Confirmation", channel: "Email", eventType: "Vehicle Approval", subject: "Your vehicle {{vehicle_name}} has been approved!", body: "Hello {{owner_name}},\n\nGreat news! Your vehicle {{vehicle_name}} ({{vehicle_reg}}) has been approved for rental on iRent platform.\n\nYour vehicle is now live and available for bookings. You can track your earnings and manage bookings from your dashboard.\n\nBest regards,\niRent Team", updated: "2 days ago" },
  { id: "2", name: "Booking Confirmation", channel: "Email", eventType: "Booking Confirmation", subject: "Booking Confirmed for {{vehicle_name}}", body: "Hello {{owner_name}},\n\nYour vehicle {{vehicle_name}} has a confirmed booking.\n\nBest regards,\niRent Team", updated: "2 days ago" },
  { id: "3", name: "Payment Reminder", channel: "Email", eventType: "Payment Reminder", subject: "Payment Reminder for your recent rental", body: "Hello,\n\nPlease note your upcoming payment details.\n\nBest regards,\niRent Team", updated: "1 week ago" }
];

const DEFAULT_TRIGGERS = [
  { id: "1", event: "Vehicle Approved", emailTemplate: "Approval Confirmation", smsTemplate: "Approval SMS", pushTemplate: "None", delay: "Immediate", active: true },
  { id: "2", event: "Booking Confirmed", emailTemplate: "Booking Confirmation", smsTemplate: "Booking SMS", pushTemplate: "Booking Push", delay: "Immediate", active: true },
  { id: "3", event: "Payment Due", emailTemplate: "Payment Reminder", smsTemplate: "Payment SMS", pushTemplate: "None", delay: "3 days before", active: true },
  { id: "4", event: "Document Expiry", emailTemplate: "Document Expiry Alert", smsTemplate: "None", pushTemplate: "None", delay: "30 days before", active: false }
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function NotificationSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [activeTab, setActiveTab] = useState("Email");
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTplId, setSelectedTplId] = useState("1");

  // Current editing template fields
  const [templateName, setTemplateName] = useState("Vehicle Approval Confirmation");
  const [eventType, setEventType] = useState("Vehicle Approval");
  const [subject, setSubject] = useState("Your vehicle {{vehicle_name}} has been approved!");
  const [body, setBody] = useState(DEFAULT_TEMPLATES[0].body);

  // Triggers list
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS);

  // Channel settings
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailProvider, setEmailProvider] = useState("SendGrid");
  const [fromEmail, setFromEmail] = useState("noreply@irent.com");
  const [fromName, setFromName] = useState("iRent Platform");
  const [emailDailyLimit, setEmailDailyLimit] = useState(10000);

  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsProvider, setSmsProvider] = useState("Twilio");
  const [senderId, setSenderId] = useState("IRENT");
  const [smsRateLimit, setSmsRateLimit] = useState(100);
  const [smsDailyLimit, setSmsDailyLimit] = useState(5000);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushProvider, setPushProvider] = useState("Firebase Cloud Messaging");
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••");
  const [pushRateLimit, setPushRateLimit] = useState(500);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminSettingsApi.getNotificationSettings();
      const d = res.data as any;
      if (d) {
        if (Array.isArray(d.templates) && d.templates.length > 0) {
          setTemplates(d.templates);
          selectTemplate(d.templates[0]);
        }
        if (Array.isArray(d.triggers) && d.triggers.length > 0) {
          setTriggers(d.triggers);
        }
        if (d.channels) {
          const e = d.channels.email || {};
          const s = d.channels.sms || {};
          const p = d.channels.push || {};

          setEmailEnabled(e.enabled ?? true);
          if (e.provider) setEmailProvider(e.provider);
          if (e.fromEmail) setFromEmail(e.fromEmail);
          if (e.fromName) setFromName(e.fromName);
          setEmailDailyLimit(e.dailyLimit ?? 10000);

          setSmsEnabled(s.enabled ?? true);
          if (s.provider) setSmsProvider(s.provider);
          if (s.senderId) setSenderId(s.senderId);
          setSmsRateLimit(s.rateLimit ?? 100);
          setSmsDailyLimit(s.dailyLimit ?? 5000);

          setPushEnabled(p.enabled ?? false);
          if (p.provider) setPushProvider(p.provider);
          if (p.apiKey) setApiKey(p.apiKey);
          setPushRateLimit(p.rateLimit ?? 500);
        }
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectTemplate = (tpl: any) => {
    setSelectedTplId(tpl.id);
    setTemplateName(tpl.name);
    setEventType(tpl.eventType || "Vehicle Approval");
    setSubject(tpl.subject || "");
    setBody(tpl.body || "");
    setActiveTab(tpl.channel || "Email");
  };

  const handleUpdateTemplate = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTplId
          ? { ...t, name: templateName, eventType, subject, body, channel: activeTab, updated: "Just now" }
          : t
      )
    );
    setStatusMsg({ text: "Template updated locally. Click Save Changes to apply.", isError: false });
  };

  const handleAddNewTemplate = () => {
    const newId = String(Date.now());
    const newTpl = {
      id: newId,
      name: "New Template " + (templates.length + 1),
      channel: activeTab,
      eventType: "Vehicle Approval",
      subject: "New Subject",
      body: "New Body content...",
      updated: "Just now"
    };
    setTemplates((prev) => [...prev, newTpl]);
    selectTemplate(newTpl);
  };

  const handleDeleteTemplate = (id: string) => {
    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    if (next.length > 0) {
      selectTemplate(next[0]);
    }
  };

  const toggleTriggerActive = (id: string) => {
    setTriggers((prev) =>
      prev.map((tr) => (tr.id === id ? { ...tr, active: !tr.active } : tr))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await adminSettingsApi.updateNotificationSettings({
        templates,
        triggers,
        channels: {
          email: { enabled: emailEnabled, provider: emailProvider, fromEmail, fromName, dailyLimit: emailDailyLimit },
          sms: { enabled: smsEnabled, provider: smsProvider, senderId, rateLimit: smsRateLimit, dailyLimit: smsDailyLimit },
          push: { enabled: pushEnabled, provider: pushProvider, apiKey, rateLimit: pushRateLimit },
        },
      });
      setStatusMsg({ text: "Notification settings & templates saved successfully.", isError: false });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to save settings.", isError: true });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
        Loading notification settings...
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

      <Card padding="2rem">
        <SectionHeader
          title="Notification Templates"
          subtitle="Create and manage email, SMS, and push notification templates"
          action={
            <Button variant="primary" size="md" onClick={handleAddNewTemplate}>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Plus size={16} />
                New Template
              </span>
            </Button>
          }
        />

        <TabBar
          tabs={["Email", "SMS", "Push"]}
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            const found = templates.find((t) => t.channel === tab);
            if (found) selectTemplate(found);
          }}
        />

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          {/* ── Left: Form ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <FormField label="Template Name">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onBlur={handleUpdateTemplate}
                style={inputStyle}
              />
            </FormField>

            <SelectField
              label="Event Type"
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                handleUpdateTemplate();
              }}
              options={[
                { value: "Vehicle Approval", label: "Vehicle Approval" },
                {
                  value: "Booking Confirmation",
                  label: "Booking Confirmation",
                },
                { value: "Payment Reminder", label: "Payment Reminder" },
                { value: "Driver Registration", label: "Driver Registration" },
                { value: "Rental Completion", label: "Rental Completion" },
              ]}
            />

            {activeTab === "Email" && (
              <FormField label="Subject Line">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onBlur={handleUpdateTemplate}
                  style={inputStyle}
                />
              </FormField>
            )}

            <FormField label={activeTab + " Body"}>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onBlur={handleUpdateTemplate}
                rows={8}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
              />
            </FormField>

            {/* Available Variables */}
            <div>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.6rem",
                }}
              >
                Available Variables
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.4rem",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                {VARIABLES.map((v) => (
                  <span
                    key={v}
                    onClick={() => {
                      setBody((b) => b + " " + v);
                      handleUpdateTemplate();
                    }}
                    style={{
                      fontSize: "0.8rem",
                      color: COLORS.PRIMARY_MAIN,
                      padding: "0.3rem 0.6rem",
                      borderRadius: "4px",
                      backgroundColor: "#EFF6FF",
                      cursor: "pointer",
                      textAlign: "center",
                      fontFamily: "monospace",
                    }}
                    title="Click to insert"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Preview + Existing templates ── */}
          <div
            style={{
              width: "320px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Preview card */}
            <div>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.75rem",
                }}
              >
                Preview ({activeTab})
              </p>
              <div
                style={{
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "10px",
                  padding: "1.25rem",
                  backgroundColor: "#FAFAFA",
                  fontSize: "0.85rem",
                  color: COLORS.TEXT_MAIN,
                  lineHeight: 1.7,
                  minHeight: "220px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {activeTab === "Email" && (
                  <p style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                    {subject.replace("{{vehicle_name}}", "Honda City")}
                  </p>
                )}
                {body
                  .replace("{{owner_name}}", "John Doe")
                  .replace("{{vehicle_name}}", "Honda City")
                  .replace("{{vehicle_reg}}", "MH12AB1234")}
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "0.75rem",
                }}
              >
                <button
                  onClick={() => alert("Test notification sent successfully!")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: COLORS.PRIMARY_MAIN,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <Send size={14} />
                  Test Send
                </button>
                <button
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 1rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    backgroundColor: "#fff",
                    color: COLORS.TEXT_MAIN,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <Eye size={14} />
                  Preview
                </button>
              </div>
            </div>

            {/* Existing Templates */}
            <div>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.75rem",
                }}
              >
                Templates ({activeTab})
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {templates.filter((t) => t.channel === activeTab).map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => selectTemplate(tpl)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.85rem 1rem",
                      borderRadius: "8px",
                      border: `1px solid ${tpl.id === selectedTplId ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                      backgroundColor: tpl.id === selectedTplId ? "#EFF6FF" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                        }}
                      >
                        {tpl.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_SECONDARY,
                          marginTop: "0.15rem",
                        }}
                      >
                        Last updated: {tpl.updated}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectTemplate(tpl);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: COLORS.PRIMARY_MAIN,
                          padding: "0.25rem",
                        }}
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(tpl.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#EF4444",
                          padding: "0.25rem",
                        }}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Notification Triggers ── */}
      <Card padding="2rem">
        <SectionHeader
          title="Notification Triggers"
          subtitle="Map system events to notification templates and define trigger conditions"
        />

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {[
                  "Event",
                  "Email Template",
                  "SMS Template",
                  "Push Template",
                  "Delay",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_SECONDARY,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {triggers.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Event */}
                  <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: COLORS.PRIMARY_MAIN,
                      }}
                    >
                      {row.event}
                    </span>
                  </td>

                  {/* Email Template */}
                  <td style={{ padding: "0.75rem" }}>
                    <select
                      value={row.emailTemplate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTriggers((prev) =>
                          prev.map((tr) => (tr.id === row.id ? { ...tr, emailTemplate: val } : tr))
                        );
                      }}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "6px",
                        border: `1px solid ${COLORS.BORDER_MAIN}`,
                        fontSize: "0.8rem",
                        outline: "none",
                        appearance: "none",
                        background: selectBg,
                        backgroundSize: "0.55rem auto",
                        paddingRight: "1.6rem",
                        cursor: "pointer",
                      }}
                    >
                      <option>Approval Confirmation</option>
                      <option>Booking Confirmation</option>
                      <option>Payment Reminder</option>
                      <option>Document Expiry Alert</option>
                      <option>None</option>
                    </select>
                  </td>

                  {/* SMS Template */}
                  <td style={{ padding: "0.75rem" }}>
                    <select
                      value={row.smsTemplate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTriggers((prev) =>
                          prev.map((tr) => (tr.id === row.id ? { ...tr, smsTemplate: val } : tr))
                        );
                      }}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "6px",
                        border: `1px solid ${COLORS.BORDER_MAIN}`,
                        fontSize: "0.8rem",
                        outline: "none",
                        appearance: "none",
                        background: selectBg,
                        backgroundSize: "0.55rem auto",
                        paddingRight: "1.6rem",
                        cursor: "pointer",
                      }}
                    >
                      <option>Approval SMS</option>
                      <option>Booking SMS</option>
                      <option>Payment SMS</option>
                      <option>None</option>
                    </select>
                  </td>

                  {/* Push Template */}
                  <td style={{ padding: "0.75rem" }}>
                    <select
                      value={row.pushTemplate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTriggers((prev) =>
                          prev.map((tr) => (tr.id === row.id ? { ...tr, pushTemplate: val } : tr))
                        );
                      }}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "6px",
                        border: `1px solid ${COLORS.BORDER_MAIN}`,
                        fontSize: "0.8rem",
                        outline: "none",
                        appearance: "none",
                        background: selectBg,
                        backgroundSize: "0.55rem auto",
                        paddingRight: "1.6rem",
                        cursor: "pointer",
                      }}
                    >
                      <option>Booking Push</option>
                      <option>None</option>
                    </select>
                  </td>

                  {/* Delay */}
                  <td
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.delay}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      onClick={() => toggleTriggerActive(row.id)}
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px",
                        backgroundColor: row.active ? "#DCFCE7" : "#FEF3C7",
                        color: row.active ? "#16A34A" : "#D97706",
                        cursor: "pointer",
                      }}
                    >
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Channel Settings ── */}
      <Card padding="2rem">
        <SectionHeader
          title="Channel Settings"
          subtitle="Configure notification providers, sender IDs, and delivery settings"
        />

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Email Configuration */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: COLORS.PRIMARY_MAIN,
                marginBottom: "-0.25rem",
              }}
            >
              Email Configuration
            </h3>

            <SelectField
              value={emailProvider}
              onChange={(e) => setEmailProvider(e.target.value)}
              options={[
                { value: "SendGrid", label: "SendGrid" },
                { value: "Mailgun", label: "Mailgun" },
                { value: "Amazon SES", label: "Amazon SES" },
                { value: "SMTP", label: "SMTP" },
              ]}
            />

            <FormField label="From Email">
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                style={inputStyle}
              />
            </FormField>

            <FormField label="From Name">
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Daily Send Limit">
              <input
                type="number"
                value={emailDailyLimit}
                onChange={(e) => setEmailDailyLimit(Number(e.target.value))}
                style={inputStyle}
              />
            </FormField>
          </div>

          {/* SMS Configuration */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: COLORS.PRIMARY_MAIN,
                marginBottom: "-0.25rem",
              }}
            >
              SMS Configuration
            </h3>

            <SelectField
              value={smsProvider}
              onChange={(e) => setSmsProvider(e.target.value)}
              options={[
                { value: "Twilio", label: "Twilio" },
                { value: "AWS SNS", label: "AWS SNS" },
                { value: "MessageBird", label: "MessageBird" },
                { value: "Vonage", label: "Vonage" },
              ]}
            />

            <FormField label="Sender ID">
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                style={inputStyle}
              />
            </FormField>

            <FormField label="SMS Rate Limit (per minute)">
              <input
                type="number"
                value={smsRateLimit}
                onChange={(e) => setSmsRateLimit(Number(e.target.value))}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Daily Send Limit">
              <input
                type="number"
                value={smsDailyLimit}
                onChange={(e) => setSmsDailyLimit(Number(e.target.value))}
                style={inputStyle}
              />
            </FormField>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
            margin: "2rem 0",
          }}
        />

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Email Enable */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.2rem",
                }}
              >
                Enable Email Notifications
              </h4>
              <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                Send notifications via email
              </p>
            </div>
            <Switch
              checked={emailEnabled}
              onChange={setEmailEnabled}
              style={{
                backgroundColor: emailEnabled ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                  transform: emailEnabled ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                  marginTop: "4px",
                }}
              />
            </Switch>
          </div>

          {/* SMS Enable */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.2rem",
                }}
              >
                Enable SMS Notifications
              </h4>
              <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                Send notifications via SMS
              </p>
            </div>
            <Switch
              checked={smsEnabled}
              onChange={setSmsEnabled}
              style={{
                backgroundColor: smsEnabled ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                  transform: smsEnabled ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                  marginTop: "4px",
                }}
              />
            </Switch>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
            margin: "2rem 0",
          }}
        />

        {/* Push Notification Configuration */}
        <div>
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: COLORS.PRIMARY_MAIN,
              marginBottom: "1.25rem",
            }}
          >
            Push Notification Configuration
          </h3>
          <div style={{ display: "flex", gap: "3rem" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <SelectField
                value={pushProvider}
                onChange={(e) => setPushProvider(e.target.value)}
                options={[
                  {
                    value: "Firebase Cloud Messaging",
                    label: "Firebase Cloud Messaging",
                  },
                  { value: "OneSignal", label: "OneSignal" },
                  { value: "Pusher", label: "Pusher" },
                  {
                    value: "Apple Push Notification Service",
                    label: "Apple Push Notification Service",
                  },
                ]}
              />

              <FormField label="API Key">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={inputStyle}
                />
              </FormField>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <FormField label="Push Rate Limit (per minute)">
                <input
                  type="number"
                  value={pushRateLimit}
                  onChange={(e) => setPushRateLimit(Number(e.target.value))}
                  style={inputStyle}
                />
              </FormField>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  paddingBottom: "0.5rem",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "0.2rem",
                    }}
                  >
                    Enable Push Notifications
                  </h4>
                  <p
                    style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
                  >
                    Send notifications via push
                  </p>
                </div>
                <Switch
                  checked={pushEnabled}
                  onChange={setPushEnabled}
                  style={{
                    backgroundColor: pushEnabled ? COLORS.PRIMARY_MAIN : "#E5E7EB",
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
                      transform: pushEnabled ? "translateX(24px)" : "translateX(4px)",
                      transition: "transform 0.2s",
                      marginTop: "4px",
                    }}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

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
            <Button variant="secondary" size="lg" onClick={() => { setTemplates(DEFAULT_TEMPLATES); setTriggers(DEFAULT_TRIGGERS); }}>
              Reset to Defaults
            </Button>
            <Button variant="primary" size="lg" onClick={handleSaveAll} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
