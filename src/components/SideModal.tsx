import React, { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Switch } from "@headlessui/react";
import { X } from "lucide-react";
import { COLORS } from "@/constants/Constant";
import SelectField from "./SelectField";

export interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  status: string;
  requireAccess: boolean;
}

interface SideModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  accessEnabled: boolean;
  setAccessEnabled: (enabled: boolean) => void;
  accountStatus: boolean;
  setAccountStatus: (status: boolean) => void;
  onCreateUser?: (data: CreateUserFormData) => Promise<void>;
}

function SideModal({
  isOpen,
  setIsOpen,
  accessEnabled,
  setAccessEnabled,
  accountStatus,
  setAccountStatus,
  onCreateUser,
}: SideModalProps) {
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [location, setLocation] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("ADMIN");
    setLocation("all");
    setSubmitError(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onCreateUser || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onCreateUser({
        firstName,
        lastName,
        email,
        phone,
        role,
        location,
        status: accountStatus ? "active" : "suspended",
        requireAccess: accessEnabled,
      });
      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      setSubmitError(error.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        height: "100vh",
        width: "100vw",
        zIndex: 99999,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.25s ease",
        backdropFilter: "blur(2px)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "500px",
          height: "100vh",
          maxHeight: "100vh",
          backgroundColor: COLORS.BG_CARD,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.08)",
          zIndex: 100000,
        }}
      >
        <div style={headerStyle}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}>
              Create New User
            </p>
            <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "12px" }}>
              Add a new staff member to the platform
            </p>
          </div>
          <button type="button" onClick={closeModal} style={iconButtonStyle}>
            <X size={20} />
          </button>
        </div>

        <div style={bodyStyle}>
          {submitError && (
            <div style={errorStyle}>
              {submitError}
            </div>
          )}

          <SectionTitle title="Personal Information" />
          <div style={{ display: "flex", gap: "1rem" }}>
            <TextField
              label="First Name"
              placeholder="e.g. Jane"
              value={firstName}
              onChange={setFirstName}
            />
            <TextField
              label="Last Name"
              placeholder="e.g. Doe"
              value={lastName}
              onChange={setLastName}
            />
          </div>
          <TextField
            label="Email Address"
            placeholder="jane.doe@irent.com"
            value={email}
            onChange={setEmail}
            type="email"
            required
          />
          <TextField
            label="Phone Number"
            placeholder="e.g. +1 234 567 890"
            value={phone}
            onChange={setPhone}
          />

          <SectionTitle title="Role and Access" style={{ marginTop: "1.5rem" }} />
          <FieldLabel label="Platform Roles" />
          <SelectField
            options={[
              { label: "Admin", value: "ADMIN" },
              { label: "Owner", value: "OWNER" },
              { label: "Customer", value: "CUSTOMER" },
            ]}
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
          <p style={helpTextStyle}>
            Defines permission level across the admin portal.
          </p>

          <FieldLabel label="Assigned Location" />
          <SelectField
            options={[
              { label: "Global (All locations)", value: "all" },
              { label: "New York HQ", value: "new_york" },
              { label: "Chicago Branch", value: "chicago" },
            ]}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <SectionTitle title="Security Settings" style={{ marginTop: "1.5rem" }} />
          <SwitchRow
            title="Require Access"
            description="Force user to set up two-factor auth on next login"
            checked={accessEnabled}
            onChange={setAccessEnabled}
            activeColor="#2563eb"
          />
          <SwitchRow
            title="Account Status"
            description="Set to active or suspended immediately."
            checked={accountStatus}
            onChange={setAccountStatus}
            activeColor="#16a34a"
          />
        </div>

        <div style={footerStyle}>
          <button type="button" onClick={closeModal} style={cancelButtonStyle}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...submitButtonStyle,
              backgroundColor: submitting ? COLORS.GRAY_400 : COLORS.PRIMARY_MAIN,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function SectionTitle({
  title,
  style,
}: {
  title: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <p style={{ fontWeight: 600, fontSize: "14px" }}>{title}</p>
      <div style={dividerStyle} />
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <p style={labelStyle}>{label}</p>;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ flex: 1 }}>
      <FieldLabel label={label} />
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function SwitchRow({
  title,
  description,
  checked,
  onChange,
  activeColor,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor: string;
}) {
  return (
    <div style={switchRowStyle}>
      <div>
        <p style={{ fontWeight: 600, fontSize: "14px" }}>{title}</p>
        <p style={{ fontSize: "12px", color: "#6B7280" }}>{description}</p>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: "44px",
          height: "24px",
          backgroundColor: checked ? activeColor : "#e5e7eb",
          borderRadius: "9999px",
          cursor: "pointer",
          position: "relative",
          transition: "background-color 0.2s",
          border: "none",
        }}
      >
        <span
          style={{
            width: "16px",
            height: "16px",
            backgroundColor: COLORS.BG_CARD,
            borderRadius: "9999px",
            position: "absolute",
            left: "4px",
            transform: checked ? "translateX(20px)" : "translateX(0px)",
            transition: "transform 0.2s",
          }}
        />
      </Switch>
    </div>
  );
}

export default SideModal;

const headerStyle: React.CSSProperties = {
  backgroundColor: COLORS.BG_CARD,
  minHeight: "70px",
  padding: "0 1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
  flexShrink: 0,
};

const bodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "1.5rem",
  paddingBottom: "3rem",
  minHeight: 0,
  boxSizing: "border-box",
};

const footerStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
  display: "flex",
  gap: "1rem",
  backgroundColor: COLORS.BG_CARD,
  flexShrink: 0,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  width: "100%",
  color: "inherit",
  outline: "none",
  marginTop: "0.4rem",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "14px",
  marginTop: "1rem",
  marginBottom: "0.4rem",
};

const helpTextStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#6B7280",
  marginTop: "0.4rem",
};

const dividerStyle: React.CSSProperties = {
  backgroundColor: "#eee",
  height: "1px",
  width: "100%",
  margin: "0.3rem 0",
};

const switchRowStyle: React.CSSProperties = {
  backgroundColor: "#fbfcfd",
  width: "100%",
  padding: "0.75rem",
  display: "flex",
  gap: "0.75rem",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #eee",
  borderRadius: "8px",
  marginTop: "1rem",
};

const errorStyle: React.CSSProperties = {
  padding: "0.75rem",
  borderRadius: "8px",
  background: COLORS.ERROR_LIGHT,
  color: COLORS.ERROR_MAIN,
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "1rem",
};

const iconButtonStyle: React.CSSProperties = {
  color: COLORS.TEXT_MUTED,
  padding: "4px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  backgroundColor: COLORS.BG_CARD,
  fontWeight: 600,
  fontSize: "0.9rem",
  color: COLORS.TEXT_MAIN,
  cursor: "pointer",
};

const submitButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: "8px",
  border: "none",
  color: COLORS.BG_CARD,
  fontWeight: 600,
  fontSize: "0.9rem",
};
