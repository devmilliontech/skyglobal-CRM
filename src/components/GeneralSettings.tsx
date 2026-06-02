"use client";
import React, { useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Info,
  Move,
  CloudUpload,
  AlertTriangle,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Switch,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import Card from "@/components/Card";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import Button from "@/components/Button";

interface GeneralSettingsProps {
  maintenanceMode: boolean;
  setMaintenanceMode: (value: boolean) => void;
  newUserReg: boolean;
  setNewUserReg: (value: boolean) => void;
  twoFactorAuth: boolean;
  setTwoFactorAuth: (value: boolean) => void;
  ipWhitelisting: boolean;
  setIpWhitelisting: (value: boolean) => void;
  rbac: boolean;
  setRbac: (value: boolean) => void;
  loading?: boolean;
  saving?: boolean;
  onSave?: () => void;
}

export default function GeneralSettings({
  maintenanceMode,
  setMaintenanceMode,
  newUserReg,
  setNewUserReg,
  twoFactorAuth,
  setTwoFactorAuth,
  ipWhitelisting,
  setIpWhitelisting,
  rbac,
  setRbac,
  loading = false,
  saving = false,
  onSave,
}: GeneralSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acknowledgements, setAcknowledgements] = useState({
    impact: false,
    review: false,
    alternative: false,
  });
  const [confirmText, setConfirmText] = useState("");

  const isConfirmed =
    acknowledgements.impact &&
    acknowledgements.review &&
    acknowledgements.alternative &&
    confirmText === "DISABLE STRIPE";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "0.5rem",
          }}
        >
          General Settings
        </h2>
        <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
          Configure core platform behavior, branding, and security policies
        </p>
      </div>

      {/* Access Control Card */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Access Control
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure IP restrictions and access policies
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                IP Whitelisting
              </h4>
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
                Restrict access to specific IP addresses
              </p>
            </div>
            <Switch
              checked={ipWhitelisting}
              onChange={setIpWhitelisting}
              style={{
                backgroundColor: ipWhitelisting
                  ? COLORS.PRIMARY_MAIN
                  : "#E5E7EB",
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "block",
                  transform: ipWhitelisting
                    ? "translateX(24px)"
                    : "translateX(4px)",
                  transition: "transform 0.2s",
                }}
              />
            </Switch>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                Role-Based Access Control
              </h4>
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
                Enforce strict role permissions
              </p>
            </div>
            <Switch
              checked={rbac}
              onChange={setRbac}
              style={{
                backgroundColor: rbac ? COLORS.PRIMARY_MAIN : "#E5E7EB",
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "block",
                  transform: rbac ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                }}
              />
            </Switch>
          </div>
        </div>
      </Card>

      {/* Login & Security Card */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Login & Security
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure password policies and session management
          </p>
        </div>

        {/* Security Warning Alert */}
        <div
          style={{
            padding: "1rem 1.25rem",
            backgroundColor: "#FFFBEB",
            border: "1px solid #FEF3C7",
            borderRadius: "12px",
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ color: "#D97706", marginTop: "2px" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#92400E",
                marginBottom: "0.25rem",
              }}
            >
              Security Warning
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#B45309" }}>
              Changing these settings may affect all users. Proceed with
              caution.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <SelectField
            label="Minimum Password Length"
            options={[
              { label: "8 characters", value: "8" },
              { label: "10 characters", value: "10" },
              { label: "12 characters", value: "12" },
              { label: "16 characters", value: "16" },
            ]}
          />

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1rem",
              }}
            >
              Password Complexity
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                "Require uppercase letters (A-Z)",
                "Require lowercase letters (a-z)",
                "Require numbers (0-9)",
                "Require special characters (!@#$%)",
              ].map((requirement, index) => (
                <label
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      backgroundColor: COLORS.PRIMARY_MAIN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <Check size={14} />
                  </div>
                  <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                    {requirement}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <SelectField
            label="Session Timeout"
            options={[
              { label: "15 minutes", value: "15" },
              { label: "30 minutes", value: "30" },
              { label: "45 minutes", value: "45" },
              { label: "60 minutes", value: "60" },
              { label: "2 hours", value: "120" },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "0.5rem",
          }}
        >
          Platform Settings
        </h2>
        <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
          Configure core platform behavior and features
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Row 1 */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <InputField
            label="Platform Name"
            defaultValue="iRent"
            infoIcon={<Info size={14} style={{ color: COLORS.TEXT_MUTED }} />}
          />
          <InputField
            label="Platform URL"
            defaultValue="https://irent.com"
            infoIcon={<Info size={14} style={{ color: COLORS.TEXT_MUTED }} />}
          />
        </div>

        {/* Row 2 */}
        <InputField
          label="Platform Description"
          isTextArea
          defaultValue="Premium vehicle rental and rent-to-own platform connecting drivers with fleet owners"
        />

        {/* Row 3 */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <SelectField
            label="Default Language"
            options={[
              { label: "English (US)", value: "en_US" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
            ]}
          />
          <SelectField
            label="Default Currency"
            options={[
              { label: "USD - US Dollar", value: "USD" },
              { label: "EUR - Euro", value: "EUR" },
              { label: "GBP - British Pound", value: "GBP" },
            ]}
          />
        </div>

        {/* Row 4 */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <SelectField
            label="Timezone"
            options={[
              { label: "UTC-5 (Eastern Time)", value: "UTC-5" },
              { label: "UTC-8 (Pacific Time)", value: "UTC-8" },
              { label: "UTC+0 (GMT)", value: "UTC+0" },
            ]}
          />
          <SelectField
            label="Date Format"
            options={[
              { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
              { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
              { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
            ]}
          />
        </div>

        {/* Feature Toggles */}
        <div style={{ marginTop: "1rem" }}>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: COLORS.TEXT_MAIN,
              marginBottom: "1.5rem",
            }}
          >
            Feature Toggles
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                backgroundColor: COLORS.BG_PAGE,
                borderRadius: "8px",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Maintenance Mode
                </h4>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  Temporarily disable platform access for all users
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
                style={{
                  backgroundColor: maintenanceMode
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: maintenanceMode
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                backgroundColor: COLORS.BG_PAGE,
                borderRadius: "8px",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  New User Registration
                </h4>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  Allow new users to sign up on the platform
                </p>
              </div>
              <Switch
                checked={newUserReg}
                onChange={setNewUserReg}
                style={{
                  backgroundColor: newUserReg ? COLORS.PRIMARY_MAIN : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: newUserReg
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: COLORS.BG_PAGE,
                borderRadius: "8px",
                padding: "0.75rem",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Two Factor Authentication
                </h4>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  Require 2FA for all admin users
                </p>
              </div>
              <Switch
                checked={twoFactorAuth}
                onChange={setTwoFactorAuth}
                style={{
                  backgroundColor: twoFactorAuth
                    ? COLORS.PRIMARY_MAIN
                    : "#E5E7EB",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                    transform: twoFactorAuth
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    transition: "transform 0.2s",
                  }}
                />
              </Switch>
            </div>

            <div
              style={{
                width: "100%",
                height: "1px",
                marginTop: "1rem",
                marginBottom: "0.5rem",
                backgroundColor: COLORS.BORDER_MAIN,
              }}
            />

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Move
                    size={16}
                    style={{
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  />
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Reset to default
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <Button variant="secondary" size="lg">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onSave ?? (() => setIsModalOpen(true))}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information Card */}
      <Card padding="2rem" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Business Information
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Company details displayed in communications and legal documents
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <InputField
              label="Company Legal Name"
              defaultValue="iRent Technologies Inc."
            />
            <InputField
              label="Business Registration Number"
              defaultValue="ABN 12 345 678 901"
            />
          </div>

          {/* Row 2 - Address */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <InputField
              label="Business Address"
              defaultValue="123 Fleet Street, Suite 500"
            />
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <InputField defaultValue="Sydney" wrapperStyle={{ flex: 2 }} />
              <InputField defaultValue="NSW" wrapperStyle={{ flex: 1 }} />
              <InputField defaultValue="2000" wrapperStyle={{ flex: 1 }} />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <InputField
              label="Contact Email"
              defaultValue="support@irent.com"
            />
            <InputField
              label="Contact Phone"
              defaultValue="+1 (555) 123-4567"
            />
          </div>

          {/* Row 4 */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <InputField label="Support Email" defaultValue="help@irent.com" />
            <InputField
              label="Billing Email"
              defaultValue="billing@irent.com"
            />
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <Move size={16} style={{ color: COLORS.TEXT_SECONDARY }} />
            <span
              style={{
                fontSize: "0.85rem",
                color: COLORS.TEXT_SECONDARY,
                fontWeight: 500,
              }}
            >
              Reset to Default
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="secondary" size="lg">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Branding Card */}
      <Card padding="2rem" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Branding
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Customize your platform's visual identity and brand colors
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
          }}
        >
          {/* Logo Uploads */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            <LogoUploadBox
              label="Logo (Light Theme)"
              description="PNG, SVG (max 2MB)"
            />
            <LogoUploadBox
              label="Logo (Dark Theme)"
              description="PNG, SVG (max 2MB)"
              isDark
            />
            <LogoUploadBox label="Favicon" description="ICO, PNG (32x32)" />
          </div>

          {/* Brand Colors */}
          <div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.5rem",
              }}
            >
              Brand Colors
            </h3>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <ColorInput
                label="Primary Color"
                defaultValue="#2563EB"
                color="#2563EB"
              />
              <ColorInput
                label="Secondary Color"
                defaultValue="#64748B"
                color="#64748B"
              />
              <ColorInput
                label="Accent Color"
                defaultValue="#F59E0B"
                color="#F59E0B"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.5rem",
              }}
            >
              Live Preview
            </h3>
            <div
              style={{
                padding: "2rem",
                background: "#F9FAFB",
                borderRadius: "12px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#2563EB",
                    }}
                  >
                    iRent
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "#2563EB",
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        Primary color usage
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "#64748B",
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        Secondary color usage
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "#F59E0B",
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        Accent color usage
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="primary" style={{ background: "#2563EB" }}>
                  Primary Button
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <Move size={16} style={{ color: COLORS.TEXT_SECONDARY }} />
            <span
              style={{
                fontSize: "0.85rem",
                color: COLORS.TEXT_SECONDARY,
                fontWeight: 500,
              }}
            >
              Reset to Default
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="secondary" size="lg">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ position: "relative", zIndex: 50 }}
      >
        <DialogBackdrop
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />

        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <DialogPanel
            style={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.5rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#FEE2E2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#EF4444",
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <DialogTitle
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Critical Change Confirmation
                  </DialogTitle>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: COLORS.TEXT_SECONDARY,
                      margin: 0,
                    }}
                  >
                    This action requires explicit confirmation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: COLORS.TEXT_SECONDARY,
                  padding: "0.25rem",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.5rem", overflowY: "auto", flexGrow: 1 }}>
              {/* Action Summary */}
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  borderLeft: "4px solid #EF4444",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    color: "#B91C1C",
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} /> Action Summary
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "0.75rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ color: COLORS.TEXT_SECONDARY }}>
                    Action Type:
                  </div>
                  <div style={{ color: COLORS.TEXT_MAIN }}>
                    Disable Payment Method
                  </div>

                  <div style={{ color: COLORS.TEXT_SECONDARY }}>Module:</div>
                  <div style={{ color: COLORS.TEXT_MAIN }}>
                    Payments & Finance
                  </div>

                  <div style={{ color: COLORS.TEXT_SECONDARY }}>Target:</div>
                  <div style={{ color: COLORS.TEXT_MAIN }}>
                    Stripe Payment Gateway
                  </div>

                  <div style={{ color: COLORS.TEXT_SECONDARY }}>
                    Initiated By:
                  </div>
                  <div style={{ color: COLORS.TEXT_MAIN }}>
                    John Admin (Super Admin)
                  </div>

                  <div style={{ color: COLORS.TEXT_SECONDARY }}>Timestamp:</div>
                  <div style={{ color: COLORS.TEXT_MAIN }}>
                    January 15, 2024 at 3:45 PM
                  </div>
                </div>
              </div>

              {/* Impact Analysis */}
              <div
                style={{
                  backgroundColor: "#FEFCE8",
                  border: "1px solid #FEF08A",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    color: "#A16207",
                    fontWeight: 600,
                  }}
                >
                  <AlertTriangle size={16} /> Impact Analysis
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    fontSize: "0.85rem",
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EAB308",
                        marginTop: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong>Active Transactions:</strong> 127 pending
                      transactions will be affected
                    </div>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EAB308",
                        marginTop: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong>User Impact:</strong> 1,543 users currently using
                      this payment method
                    </div>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EAB308",
                        marginTop: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong>Revenue Impact:</strong> Estimated $45,230 in
                      daily transactions
                    </div>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EAB308",
                        marginTop: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong>System Impact:</strong> Automatic fallback to
                      secondary payment gateway will be triggered
                    </div>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EAB308",
                        marginTop: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong>Audit Trail:</strong> This action will be logged
                      in system audit logs with full context
                    </div>
                  </li>
                </ul>
              </div>

              {/* Acknowledgement Required */}
              <div
                style={{
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  padding: "1.25rem",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "1rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Acknowledgement Required
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={acknowledgements.impact}
                      onChange={(e) =>
                        setAcknowledgements((prev) => ({
                          ...prev,
                          impact: e.target.checked,
                        }))
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      I understand this action will affect active transactions
                      and user payments
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={acknowledgements.review}
                      onChange={(e) =>
                        setAcknowledgements((prev) => ({
                          ...prev,
                          review: e.target.checked,
                        }))
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      I have reviewed the impact analysis and accept the
                      consequences
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={acknowledgements.alternative}
                      onChange={(e) =>
                        setAcknowledgements((prev) => ({
                          ...prev,
                          alternative: e.target.checked,
                        }))
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      I confirm that alternative payment methods are properly
                      configured
                    </span>
                  </label>

                  <div
                    style={{
                      height: "1px",
                      width: "100%",
                      backgroundColor: COLORS.BORDER_MAIN,
                      marginTop: "10px",
                    }}
                  />

                  <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Type to confirm
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    To proceed, please type{" "}
                    <span
                      style={{
                        backgroundColor: COLORS.GRAY_200,
                        padding: "2px 4px",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      DISABLE STRIPE
                    </span>{" "}
                    in the field below:
                  </p>
                  <input
                    type="text"
                    placeholder="Type here.."
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    style={{
                      padding: "0.5rem 1rem",
                      border: `1px solid ${confirmText === "DISABLE STRIPE" ? "#10B981" : COLORS.BORDER_MAIN}`,
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_MAIN,
                      background: COLORS.BG_CARD,
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <AlertCircle size={16} color={COLORS.GRAY_600} />
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      This confirmation is case-sensitive and must match exactly
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  padding: "1.25rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "1rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Reason for Change (Optional)
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <textarea
                    placeholder="Type here.."
                    style={{
                      padding: "1rem 2rem",
                      border: `1px solid ${COLORS.BORDER_MAIN}`,
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_MAIN,
                      background: COLORS.BG_CARD,
                    }}
                    rows={5}
                    cols={50}
                    maxLength={2000}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  padding: "1.25rem",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  marginTop: "1rem",
                  backgroundColor: COLORS.INFO_LIGHT,
                }}
              >
                <p>Notifications Settings</p>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                backgroundColor: "#F9FAFB",
                borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexShrink: 0,
              }}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                style={{
                  backgroundColor: isConfirmed
                    ? COLORS.PRIMARY_MAIN
                    : COLORS.GRAY_300,
                  borderColor: isConfirmed
                    ? COLORS.PRIMARY_MAIN
                    : COLORS.GRAY_300,
                  cursor: isConfirmed ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  color: "#fff",
                }}
                disabled={!isConfirmed}
                onClick={() => {
                  if (isConfirmed) {
                    setIsModalOpen(false);
                    alert("Critical changes confirmed and saved.");
                  }
                }}
              >
                Confirm and Save Changes
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

function LogoUploadBox({
  label,
  description,
  isDark = false,
}: {
  label: string;
  description: string;
  isDark?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <span
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: "120px",
          borderRadius: "12px",
          border: isDark ? "none" : "2px dashed #E5E7EB",
          background: isDark ? "#111827" : "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          cursor: "pointer",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: isDark ? "rgba(255,255,255,0.1)" : "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDark ? "#fff" : COLORS.TEXT_SECONDARY,
          }}
        >
          <CloudUpload size={18} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: isDark ? "#fff" : COLORS.TEXT_MAIN,
            }}
          >
            Click to upload
          </p>
          <p
            style={{
              fontSize: "0.7rem",
              color: isDark ? "rgba(255,255,255,0.5)" : COLORS.TEXT_MUTED,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ColorInput({
  label,
  defaultValue,
  color,
}: {
  label: string;
  defaultValue: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flex: 1,
      }}
    >
      <label
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "0.6rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            background: color,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        ></div>
        <input
          type="text"
          defaultValue={defaultValue}
          style={{
            width: "100%",
            padding: "0.6rem 1rem 0.6rem 2.75rem",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            fontSize: "0.9rem",
            outline: "none",
            color: COLORS.TEXT_MAIN,
          }}
        />
      </div>
    </div>
  );
}
