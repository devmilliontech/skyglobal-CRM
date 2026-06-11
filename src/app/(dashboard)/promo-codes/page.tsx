"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, RefreshCw, Trash2, X } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { COLORS } from "@/constants/Constant";
import {
  PromoCode,
  PromoCodePayload,
  PromoDiscountType,
  promoCodesApi,
} from "@/services/api/promoCodes";

type PromoFormState = {
  code: string;
  discountType: PromoDiscountType;
  discountValue: string;
  minBookingDays: string;
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
};

const emptyForm: PromoFormState = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minBookingDays: "1",
  maxUses: "100",
  expiresAt: "",
  isActive: true,
};

const pageSize = 25;

const generateCode = () =>
  `PROMO${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

const isExpired = (value?: string) => {
  if (!value) return false;
  const expiry = new Date(`${formatDate(value)}T23:59:59`);
  return !Number.isNaN(expiry.getTime()) && expiry < new Date();
};

const getPromoStatus = (promo: PromoCode) => {
  if (!promo.isActive) return "Disabled";
  if (isExpired(promo.expiresAt)) return "Expired";
  if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) return "Used Up";
  return "Active";
};

const getDiscountText = (promo: Pick<PromoCode, "discountType" | "discountValue">) =>
  promo.discountType === "percentage"
    ? `${promo.discountValue}%`
    : `$${promo.discountValue.toFixed(2)}`;

const toFormState = (promo: PromoCode): PromoFormState => ({
  code: promo.code,
  discountType: promo.discountType,
  discountValue: String(promo.discountValue),
  minBookingDays: String(promo.minBookingDays),
  maxUses: String(promo.maxUses),
  expiresAt: formatDate(promo.expiresAt),
  isActive: promo.isActive,
});

const validatePromoForm = (form: PromoFormState) => {
  const discountValue = Number(form.discountValue);
  const minBookingDays = Number(form.minBookingDays);
  const maxUses = Number(form.maxUses);
  const expiresAt = new Date(`${form.expiresAt}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!form.code.trim()) return "Code is required";
  if (!["percentage", "fixed"].includes(form.discountType)) {
    return "Discount type must be percentage or fixed";
  }
  if (
    form.discountType === "percentage" &&
    (!Number.isFinite(discountValue) || discountValue < 1 || discountValue > 100)
  ) {
    return "Percentage discount must be between 1 and 100";
  }
  if (
    form.discountType === "fixed" &&
    (!Number.isFinite(discountValue) || discountValue <= 0)
  ) {
    return "Fixed discount must be greater than 0";
  }
  if (!Number.isInteger(minBookingDays) || minBookingDays < 1) {
    return "Min booking days must be at least 1";
  }
  if (!Number.isInteger(maxUses) || maxUses < 1) {
    return "Max uses must be at least 1";
  }
  if (!form.expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt <= today) {
    return "Expiry date must be a future date";
  }
  return "";
};

const buildPayload = (form: PromoFormState): PromoCodePayload => ({
  code: form.code.trim().toUpperCase(),
  discountType: form.discountType,
  discountValue: Number(form.discountValue),
  minBookingDays: Number(form.minBookingDays),
  maxUses: Number(form.maxUses),
  expiresAt: form.expiresAt,
  isActive: form.isActive,
});

const getPromoApiError = (err: unknown, fallback: string) => {
  const message = err instanceof Error ? err.message : fallback;
  if (message.includes("Cannot GET") && message.includes("promo-codes")) {
    return "Promo Codes API is not available on the configured backend. Deploy the latest backend or point NEXT_PUBLIC_API_BASE_URL to a backend that includes /api/v1/admin/promo-codes.";
  }
  return message || fallback;
};

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | "">("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [form, setForm] = useState<PromoFormState>(emptyForm);

  const loadPromoCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await promoCodesApi.getPromoCodes({
        page,
        limit: pageSize,
        search,
        isActive: activeFilter,
      });
      setPromoCodes(response.data.promoCodes);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      setError(getPromoApiError(err, "Failed to load promo codes"));
    } finally {
      setLoading(false);
    }
  }, [activeFilter, page, search]);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  const stats = useMemo(
    () => ({
      active: promoCodes.filter((promo) => getPromoStatus(promo) === "Active").length,
      expired: promoCodes.filter((promo) => getPromoStatus(promo) === "Expired").length,
      totalUses: promoCodes.reduce((sum, promo) => sum + promo.usedCount, 0),
    }),
    [promoCodes],
  );

  const openCreateModal = () => {
    setEditingPromo(null);
    setForm({ ...emptyForm, code: generateCode() });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (promo: PromoCode) => {
    setEditingPromo(promo);
    setForm(toFormState(promo));
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingPromo(null);
    setForm(emptyForm);
    setFormError("");
  };

  const updateForm = (key: keyof PromoFormState, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [key]: key === "code" && typeof value === "string"
        ? value.toUpperCase()
        : value,
    }));
  };

  const submitPromo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validatePromoForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSaving(true);
    setFormError("");
    setError(null);
    try {
      const payload = buildPayload(form);
      if (editingPromo) {
        await promoCodesApi.updatePromoCode(editingPromo._id, payload);
      } else {
        await promoCodesApi.createPromoCode(payload);
      }
      closeModal();
      await loadPromoCodes();
    } catch (err) {
      setFormError(getPromoApiError(err, "Failed to save promo code"));
    } finally {
      setSaving(false);
    }
  };

  const togglePromoActive = async (promo: PromoCode) => {
    setUpdatingId(promo._id);
    setError(null);
    try {
      await promoCodesApi.updatePromoCode(promo._id, { isActive: !promo.isActive });
      await loadPromoCodes();
    } catch (err) {
      setError(getPromoApiError(err, "Failed to update promo code"));
    } finally {
      setUpdatingId(null);
    }
  };

  const deletePromo = async (promo: PromoCode) => {
    if (!window.confirm(`Delete promo code ${promo.code}?`)) return;

    setUpdatingId(promo._id);
    setError(null);
    try {
      await promoCodesApi.deletePromoCode(promo._id);
      await loadPromoCodes();
    } catch (err) {
      setError(getPromoApiError(err, "Failed to delete promo code"));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Promo Codes"
        description="Create and manage booking discount codes"
        searchPlaceholder="Search promo codes..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value.trim());
          setPage(1);
        }}
        customActions={
          <Button onClick={openCreateModal}>
            <Plus size={17} />
            Generate Promo Code
          </Button>
        }
      />

      {error && (
        <div
          style={{
            padding: "0.85rem 1rem",
            border: `1px solid ${COLORS.ERROR_MAIN}`,
            background: COLORS.ERROR_LIGHT,
            borderRadius: "8px",
            color: COLORS.ERROR_DARK,
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
        <SummaryTile label="Total Codes" value={String(total || promoCodes.length)} />
        <SummaryTile label="Active" value={String(stats.active)} tone="success" />
        <SummaryTile label="Expired" value={String(stats.expired)} tone="danger" />
        <SummaryTile label="Total Uses" value={String(stats.totalUses)} tone="warning" />
      </div>

      <Card padding="0">
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 750, margin: 0 }}>
              Promo Code List
            </h3>
            <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Showing {promoCodes.length} of {total || promoCodes.length} codes
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <select
              value={activeFilter === "" ? "all" : String(activeFilter)}
              onChange={(event) => {
                const value = event.target.value;
                setActiveFilter(value === "all" ? "" : value === "true");
                setPage(1);
              }}
              style={selectStyle}
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Disabled</option>
            </select>
            <Button variant="outline" onClick={loadPromoCodes}>
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "980px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                {["Code", "Discount", "Min Days", "Usage", "Expiry Date", "Status", "Actions"].map((head) => (
                  <th key={head} style={tableHeaderStyle}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={emptyCellStyle}>Loading promo codes...</td>
                </tr>
              ) : promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={emptyCellStyle}>No promo codes found</td>
                </tr>
              ) : (
                promoCodes.map((promo) => (
                  <tr key={promo._id} style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                    <td style={{ ...tableCellStyle, fontWeight: 800, color: COLORS.TEXT_MAIN }}>
                      {promo.code}
                    </td>
                    <td style={tableCellStyle}>{getDiscountText(promo)}</td>
                    <td style={tableCellStyle}>{promo.minBookingDays} day{promo.minBookingDays === 1 ? "" : "s"}</td>
                    <td style={tableCellStyle}>{promo.usedCount} / {promo.maxUses}</td>
                    <td style={tableCellStyle}>{formatDate(promo.expiresAt)}</td>
                    <td style={tableCellStyle}>
                      <StatusBadge status={getPromoStatus(promo)} />
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <ActionButton onClick={() => openEditModal(promo)} disabled={updatingId === promo._id}>
                          <Edit3 size={14} />
                          Edit
                        </ActionButton>
                        <ActionButton onClick={() => togglePromoActive(promo)} disabled={updatingId === promo._id}>
                          {promo.isActive ? "Disable" : "Enable"}
                        </ActionButton>
                        <ActionButton
                          danger
                          onClick={() => deletePromo(promo)}
                          disabled={updatingId === promo._id}
                        >
                          <Trash2 size={14} />
                          Delete
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <p style={{ color: COLORS.TEXT_SECONDARY, fontSize: "0.8rem" }}>
            Page {page} of {pages}
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage((current) => Math.min(pages, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {modalOpen && (
        <PromoCodeModal
          form={form}
          formError={formError}
          saving={saving}
          isEditing={Boolean(editingPromo)}
          onChange={updateForm}
          onClose={closeModal}
          onSubmit={submitPromo}
          onGenerateCode={() => updateForm("code", generateCode())}
        />
      )}
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const colors = {
    neutral: [COLORS.PRIMARY_LIGHT, COLORS.PRIMARY_MAIN],
    success: [COLORS.SUCCESS_LIGHT, COLORS.SUCCESS_DARK],
    warning: [COLORS.WARNING_LIGHT, COLORS.WARNING_DARK],
    danger: [COLORS.ERROR_LIGHT, COLORS.ERROR_DARK],
  }[tone];

  return (
    <div
      style={{
        background: colors[0],
        borderBottom: `4px solid ${colors[1]}`,
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <p style={{ fontSize: "1.45rem", fontWeight: 850, color: colors[1], margin: 0 }}>
        {value}
      </p>
      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: colors[1], marginTop: "0.25rem" }}>
        {label}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  danger = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        padding: "0.4rem 0.6rem",
        borderRadius: "6px",
        border: `1px solid ${danger ? "#FECACA" : "#BFDBFE"}`,
        background: danger ? "#FEF2F2" : "#EFF6FF",
        color: danger ? "#B91C1C" : COLORS.PRIMARY_MAIN,
        fontSize: "0.75rem",
        fontWeight: 750,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {children}
    </button>
  );
}

function PromoCodeModal({
  form,
  formError,
  saving,
  isEditing,
  onChange,
  onClose,
  onSubmit,
  onGenerateCode,
}: {
  form: PromoFormState;
  formError: string;
  saving: boolean;
  isEditing: boolean;
  onChange: (key: keyof PromoFormState, value: string | boolean) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGenerateCode: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit promo code" : "Generate promo code"}
      style={modalOverlayStyle}
    >
      <form onSubmit={onSubmit} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 850 }}>
              {isEditing ? "Edit Promo Code" : "Generate Promo Code"}
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
              Configure discount rules for bookings
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} style={modalCloseStyle}>
            <X size={17} />
          </button>
        </div>

        {formError && (
          <div style={formErrorStyle}>{formError}</div>
        )}

        <div style={formGridStyle}>
          <label style={fieldLabelStyle}>
            Code
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={form.code}
                onChange={(event) => onChange("code", event.target.value)}
                placeholder="WELCOME10"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={onGenerateCode}
                style={smallButtonStyle}
              >
                Random
              </button>
            </div>
          </label>

          <label style={fieldLabelStyle}>
            Discount Type
            <select
              value={form.discountType}
              onChange={(event) => onChange("discountType", event.target.value)}
              style={inputStyle}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </label>

          <label style={fieldLabelStyle}>
            Discount Value
            <input
              type="number"
              min="0"
              step={form.discountType === "percentage" ? "1" : "0.01"}
              value={form.discountValue}
              onChange={(event) => onChange("discountValue", event.target.value)}
              placeholder={form.discountType === "percentage" ? "10" : "25.00"}
              style={inputStyle}
            />
          </label>

          <label style={fieldLabelStyle}>
            Min Booking Days
            <input
              type="number"
              min="1"
              step="1"
              value={form.minBookingDays}
              onChange={(event) => onChange("minBookingDays", event.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={fieldLabelStyle}>
            Max Uses
            <input
              type="number"
              min="1"
              step="1"
              value={form.maxUses}
              onChange={(event) => onChange("maxUses", event.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={fieldLabelStyle}>
            Expiry Date
            <input
              type="date"
              value={form.expiresAt}
              onChange={(event) => onChange("expiresAt", event.target.value)}
              style={inputStyle}
            />
          </label>

          <label
            style={{
              ...fieldLabelStyle,
              flexDirection: "row",
              alignItems: "center",
              gap: "0.6rem",
              marginTop: "1.35rem",
            }}
          >
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => onChange("isActive", event.target.checked)}
            />
            Active
          </label>
        </div>

        <div style={modalFooterStyle}>
          <Button variant="outline" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Generate Promo Code"}
          </Button>
        </div>
      </form>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 800,
  color: COLORS.TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.84rem",
  color: COLORS.TEXT_SECONDARY,
  verticalAlign: "middle",
};

const emptyCellStyle: React.CSSProperties = {
  padding: "2rem",
  textAlign: "center",
  color: COLORS.TEXT_MUTED,
  fontSize: "0.9rem",
};

const selectStyle: React.CSSProperties = {
  padding: "0.55rem 0.75rem",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  borderRadius: "8px",
  background: "#FFFFFF",
  color: COLORS.TEXT_MAIN,
  fontSize: "0.85rem",
  outline: "none",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 200,
  background: "rgba(15, 23, 42, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.5rem",
};

const modalStyle: React.CSSProperties = {
  width: "min(780px, 100%)",
  maxHeight: "90vh",
  overflow: "auto",
  background: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.24)",
};

const modalHeaderStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
};

const modalCloseStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "6px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const formGridStyle: React.CSSProperties = {
  padding: "1.5rem",
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "1rem",
};

const fieldLabelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  color: COLORS.TEXT_SECONDARY,
  fontSize: "0.78rem",
  fontWeight: 750,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.75rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  color: COLORS.TEXT_MAIN,
  fontSize: "0.86rem",
  outline: "none",
};

const smallButtonStyle: React.CSSProperties = {
  padding: "0.7rem 0.75rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.PRIMARY_MAIN}`,
  background: COLORS.PRIMARY_LIGHT,
  color: COLORS.PRIMARY_MAIN,
  fontSize: "0.8rem",
  fontWeight: 750,
  cursor: "pointer",
};

const formErrorStyle: React.CSSProperties = {
  margin: "1rem 1.5rem 0",
  padding: "0.75rem 0.9rem",
  background: COLORS.ERROR_LIGHT,
  border: `1px solid ${COLORS.ERROR_MAIN}`,
  borderRadius: "8px",
  color: COLORS.ERROR_DARK,
  fontSize: "0.82rem",
  fontWeight: 700,
};

const modalFooterStyle: React.CSSProperties = {
  padding: "1rem 1.5rem 1.5rem",
  borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
};
