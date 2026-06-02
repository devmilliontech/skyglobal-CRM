"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import { Switch } from "@headlessui/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "./SelectField";
import { Eye, EyeOff } from "lucide-react";

// ── Provider Card Header ──
function ProviderHeader({
  icon,
  iconBg,
  name,
  subtitle,
  enabled,
  onToggle,
  statusLabel,
}: {
  icon: React.ReactNode;
  iconBg: string;
  name: string;
  subtitle: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  statusLabel: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {icon}
        </div>
        <div>
          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
            }}
          >
            {name}
          </p>
          <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: enabled ? COLORS.SUCCESS_MAIN : COLORS.TEXT_MUTED,
          }}
        >
          {statusLabel}
        </span>
        <Switch
          checked={enabled}
          onChange={onToggle}
          style={{
            width: "42px",
            height: "24px",
            backgroundColor: enabled ? COLORS.PRIMARY_MAIN : "#D1D5DB",
            borderRadius: "9999px",
            position: "relative",
            cursor: "pointer",
            border: "none",
            transition: "background-color 0.2s",
          }}
        >
          <span
            style={{
              display: "block",
              width: "18px",
              height: "18px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              position: "absolute",
              top: "3px",
              left: enabled ? "21px" : "3px",
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}
          />
        </Switch>
      </div>
    </div>
  );
}

// ── Masked Input ──
function MaskedInput({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        width: "100%",
      }}
    >
      <label style={{ fontSize: "0.85rem", color: "#374151", fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={visible ? "text" : "password"}
          defaultValue={value}
          style={{
            padding: "0.6rem 2.5rem 0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#fff",
            fontSize: "0.9rem",
            outline: "none",
            width: "100%",
            color: COLORS.TEXT_MAIN,
          }}
        />
        <button
          onClick={() => setVisible(!visible)}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLORS.TEXT_MUTED,
            padding: 0,
          }}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function Integrations() {
  const [form, setForm] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    twilioEnabled: true,
    awsSnsEnabled: false,
    sendgridEnabled: true,
    googleMapsEnabled: true,
    s3Enabled: true,
    stripeEnv: "sandbox",
    paypalEnv: "sandbox",
    mailgunEnabled: true,
    mailgunEnv: "sandbox",
    googleAnalyticsEnabled: true,
    mixpanelEnabled: false,
    slackEnabled: true,
    awsS3ExtEnabled: false,
    figmaEnabled: false,
  });

  const toggle = (key: keyof typeof form) => (val: boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const setField =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* ── Payment Gateways ── */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.4rem",
            }}
          >
            Payment Gateways
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure payment processing integrations for secure transactions
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Stripe */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "1rem" }}>S</span>}
              iconBg="#635BFF"
              name="Stripe"
              subtitle="Payment processing"
              enabled={form.stripeEnabled}
              onToggle={toggle("stripeEnabled")}
              statusLabel={form.stripeEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.stripeEnabled ? 1 : 0.5,
                pointerEvents: form.stripeEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Publishable Key"
                defaultValue="pk_live_51..."
                placeholder="Enter Publishable Key"
              />
              <MaskedInput label="Secret Key" value="sk_live_51NxQwE..." />
              <InputField
                label="Webhook URL"
                defaultValue="https://api.irent.com/webhooks/stripe"
                placeholder="Enter Webhook URL"
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button variant="primary" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "1rem" }}>P</span>}
              iconBg="#003087"
              name="PayPal"
              subtitle="Digital wallet"
              enabled={form.paypalEnabled}
              onToggle={toggle("paypalEnabled")}
              statusLabel={form.paypalEnabled ? "Connected" : "Inactive"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.paypalEnabled ? 1 : 0.5,
                pointerEvents: form.paypalEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Client ID"
                placeholder="Enter PayPal Client ID"
              />
              <InputField
                label="Client Secret"
                placeholder="Enter Client Secret"
                type="password"
              />
              <SelectField
                label="Environment"
                options={[
                  { label: "Sandbox", value: "sandbox" },
                  { label: "Production", value: "production" },
                ]}
                value={form.paypalEnv}
                onChange={setField("paypalEnv")}
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <Button variant="outline" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="primary">Save</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── SMS Providers ── */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.4rem",
            }}
          >
            SMS Providers
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure SMS services for notifications and verification
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Twilio */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>T</span>}
              iconBg="#F22F46"
              name="Twilio"
              subtitle="SMS & Voice"
              enabled={form.twilioEnabled}
              onToggle={toggle("twilioEnabled")}
              statusLabel={form.twilioEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.twilioEnabled ? 1 : 0.5,
                pointerEvents: form.twilioEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Account SID"
                defaultValue="AC•••••••••••••••••••••••••••••••••"
                placeholder="Enter Account SID"
              />
              <MaskedInput label="Auth Token" value="a1b2c3d4e5f6g7h8i9j0..." />
              <InputField
                label="Phone Number"
                defaultValue="+1 (555) 000-0000"
                placeholder="Enter Twilio Phone Number"
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button variant="primary" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>

          {/* AWS SNS */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>A</span>}
              iconBg="#FF9900"
              name="AWS SNS"
              subtitle="Backup SMS service"
              enabled={form.awsSnsEnabled}
              onToggle={toggle("awsSnsEnabled")}
              statusLabel={form.awsSnsEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.awsSnsEnabled ? 1 : 0.5,
                pointerEvents: form.awsSnsEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Access Key ID"
                placeholder="Enter AWS Access Key"
              />
              <InputField
                label="Secret Access Key"
                placeholder="Enter Secret Key"
                type="password"
              />
              <SelectField
                label="Region"
                options={[
                  { label: "US East (N. Virginia)", value: "us-east-1" },
                  { label: "US West (Oregon)", value: "us-west-2" },
                  { label: "EU (Ireland)", value: "eu-west-1" },
                  { label: "Asia Pacific (Mumbai)", value: "ap-south-1" },
                ]}
                value=""
                placeholder="Select Region"
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <Button variant="outline" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="primary">Save</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Email Service ── */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.4rem",
            }}
          >
            Email Service
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure email delivery provider for transactional emails
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>SG</span>}
              iconBg="#1A82E2"
              name="SendGrid"
              subtitle="Transactional email"
              enabled={form.sendgridEnabled}
              onToggle={toggle("sendgridEnabled")}
              statusLabel={form.sendgridEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.sendgridEnabled ? 1 : 0.5,
                pointerEvents: form.sendgridEnabled ? "auto" : "none",
              }}
            >
              <MaskedInput label="API Key" value="SG.xxxxxxxxxxxxxxxxxxxx" />
              <InputField
                label="From Email"
                defaultValue="noreply@irent.com"
                placeholder="Enter Sender Email"
              />
              <InputField
                label="From Name"
                defaultValue="iRent Platform"
                placeholder="Enter Sender Name"
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button variant="primary" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>MG</span>}
              iconBg="#9333ea"
              name="Mailgun"
              subtitle="Transactional email"
              enabled={form.mailgunEnabled}
              onToggle={toggle("mailgunEnabled")}
              statusLabel={form.mailgunEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.mailgunEnabled ? 1 : 0.5,
                pointerEvents: form.mailgunEnabled ? "auto" : "none",
              }}
            >
              <MaskedInput label="API Key" value="SG.xxxxxxxxxxxxxxxxxxxx" />
              <InputField
                label="From Email"
                defaultValue="noreply@irent.com"
                placeholder="Enter Sender Email"
              />
              <InputField
                label="From Name"
                defaultValue="iRent Platform"
                placeholder="Enter Sender Name"
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button variant="primary" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Third-Party Tools ── */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.4rem",
            }}
          >
            Third-Party Tools
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Connect external services and analytics platforms
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Google Analytics */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>G</span>}
              iconBg="#E37400"
              name="Google Analytics"
              subtitle="Web analytics"
              enabled={form.googleAnalyticsEnabled}
              onToggle={toggle("googleAnalyticsEnabled")}
              statusLabel={
                form.googleAnalyticsEnabled ? "Connected" : "Disabled"
              }
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.googleAnalyticsEnabled ? 1 : 0.5,
                pointerEvents: form.googleAnalyticsEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Tracking ID"
                defaultValue="G-XXXXXXXXXX"
                placeholder="Enter Tracking ID"
              />
              <InputField
                label="Property Name"
                defaultValue="iRent Platform"
                placeholder="Enter Property Name"
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button variant="primary" style={{ flex: 1 }}>
                  View Dashboard
                </Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>

          {/* Mixpanel */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>M</span>}
              iconBg="#7856FF"
              name="Mixpanel"
              subtitle="Product analytics"
              enabled={form.mixpanelEnabled}
              onToggle={toggle("mixpanelEnabled")}
              statusLabel={form.mixpanelEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.mixpanelEnabled ? 1 : 0.5,
                pointerEvents: form.mixpanelEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Project Token"
                placeholder="Enter Mixpanel Token"
              />
              <InputField
                label="API Secret"
                placeholder="Enter API Secret"
                type="password"
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <Button variant="outline" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="primary">Save</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slack */}
        <div
          style={{
            border: `1px solid ${COLORS.BORDER_MAIN}`,
            borderRadius: "12px",
            padding: "1.5rem",
            maxWidth: "50%",
            marginTop: "2rem",
          }}
        >
          <ProviderHeader
            icon={<span style={{ fontSize: "0.85rem" }}>S</span>}
            iconBg="#E01E5A"
            name="Slack"
            subtitle="Team notifications"
            enabled={form.slackEnabled}
            onToggle={toggle("slackEnabled")}
            statusLabel={form.slackEnabled ? "Connected" : "Disabled"}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              opacity: form.slackEnabled ? 1 : 0.5,
              pointerEvents: form.slackEnabled ? "auto" : "none",
            }}
          >
            <MaskedInput
              label="Webhook URL"
              value="https://hooks.slack.com/services/T00..."
            />
            <InputField
              label="Channel"
              defaultValue="#alerts"
              placeholder="Enter Slack Channel"
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button variant="primary" style={{ flex: 1 }}>
                Test Connection
              </Button>
              <Button variant="outline">Edit</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Integrations ── */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.4rem",
            }}
          >
            Integrations
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Connect with external services to extend platform functionality
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* AWS S3 */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>S3</span>}
              iconBg="#569A31"
              name="AWS S3"
              subtitle="Cloud storage"
              enabled={form.awsS3ExtEnabled}
              onToggle={toggle("awsS3ExtEnabled")}
              statusLabel={form.awsS3ExtEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.awsS3ExtEnabled ? 1 : 0.5,
                pointerEvents: form.awsS3ExtEnabled ? "auto" : "none",
              }}
            >
              <InputField
                label="Access Key"
                placeholder="Enter AWS Access Key"
              />
              <InputField
                label="Secret Key"
                placeholder="Enter Secret Key"
                type="password"
              />
              <SelectField
                label="Region"
                options={[
                  { label: "US East (N. Virginia)", value: "us-east-1" },
                  { label: "US West (Oregon)", value: "us-west-2" },
                  { label: "EU (Ireland)", value: "eu-west-1" },
                  { label: "Asia Pacific (Mumbai)", value: "ap-south-1" },
                ]}
                value=""
                placeholder="Select Region"
              />
              <InputField
                label="Bucket Name"
                placeholder="Enter S3 Bucket Name"
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <Button variant="outline" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="primary">Save</Button>
              </div>
            </div>
          </div>

          {/* Figma */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <ProviderHeader
              icon={<span style={{ fontSize: "0.85rem" }}>F</span>}
              iconBg="#A259FF"
              name="Figma"
              subtitle="Design collaboration"
              enabled={form.figmaEnabled}
              onToggle={toggle("figmaEnabled")}
              statusLabel={form.figmaEnabled ? "Connected" : "Disabled"}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                opacity: form.figmaEnabled ? 1 : 0.5,
                pointerEvents: form.figmaEnabled ? "auto" : "none",
              }}
            >
              <InputField label="API Key" placeholder="Enter Figma API Key" />
              <InputField
                label="Workspace ID"
                placeholder="Enter Workspace ID"
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <Button variant="outline" style={{ flex: 1 }}>
                  Test Connection
                </Button>
                <Button variant="primary">Save</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer Buttons */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.GRAY_300}`,
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="outline" size="lg">
          Cancel
        </Button>
        <Button variant="primary" size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
