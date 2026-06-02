"use client";

import React, { useRef, useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  X,
} from "lucide-react";
import SelectField from "@/components/SelectField";
import Button from "@/components/Button";
import { financeApi } from "@/services/api/finance";

interface TransactionFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function TransactionForm({
  onClose,
  initialData,
}: TransactionFormProps) {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    proofOfAddress: null,
  });
  const [alertVisible, setAlertVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [txDate, setTxDate] = useState(initialData?.date || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [txType, setTxType] = useState(initialData?.type || "Income");
  const [amount, setAmount] = useState(initialData?.amount?.replace(/[^0-9.]/g, "") || "");
  const [driver, setDriver] = useState("");
  const [agreement, setAgreement] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!title || !amount || !txType) {
      setSaveMsg({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      await financeApi.createTransaction({
        transactionTitle: title,
        amount: parseFloat(amount),
        transactionType: txType,
        description,
        driverId: driver || undefined,
        agreementId: agreement || undefined,
        paymentMethod: paymentMethod || undefined,
        notes: notes || undefined,
        transactionDate: txDate || undefined,
      });
      setSaveMsg({ type: "success", text: "Transaction saved successfully!" });
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      console.error("[TransactionForm] Save failed:", err);
      setSaveMsg({ type: "error", text: err.message || "Failed to save transaction." });
    } finally {
      setSaving(false);
    }
  };

  const handleFile = (type: string, file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Save Feedback Toast */}
      {saveMsg && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
          padding: "1rem 1.5rem", borderRadius: "10px",
          background: saveMsg.type === "success" ? "#F0FDF4" : "#FEF2F2",
          border: `1px solid ${saveMsg.type === "success" ? "#BBF7D0" : "#FECACA"}`,
          color: saveMsg.type === "success" ? "#15803D" : "#DC2626",
          fontSize: "0.9rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          {saveMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {saveMsg.text}
        </div>
      )}
      {/* Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button variant="outline" size="md" onClick={onClose}>
          <ArrowLeft size={16} />
          Back to Transactions List
        </Button>
      </div>

      {/* Warning Alert */}
      {alertVisible && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FEF3C7",
            padding: "1rem",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle
              size={20}
              color="#D97706"
              style={{ marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#92400E",
                }}
              >
                Duplicate Transaction Warning
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#B45309",
                  marginTop: "2px",
                }}
              >
                A similar transaction "Weekly Rental Payment" for $450.00 was
                found. Please verify this is not a duplicate.
              </p>
            </div>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#92400E",
            }}
            onClick={() => setAlertVisible(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="card" style={{ padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
            }}
          >
            Transaction Details
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: COLORS.TEXT_SECONDARY,
              marginTop: "0.25rem",
            }}
          >
            Enter the transaction information below. Required fields are marked
            with *
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Title */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Transaction Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Weekly Rental Payment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Date */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Transaction Date *
            </label>
            <input
              type="date"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              gridColumn: "span 2",
            }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Description
            </label>
            <textarea
              placeholder="Enter transaction description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            />
          </div>

          {/* Type */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Transaction Type *
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "0.5rem",
              }}
            >
              <TypeOption
                label="Income"
                description="Rental payments, deposits, fees"
                color={COLORS.SUCCESS_MAIN}
                bg="#F0FDF4"
                checked={txType === "Income"}
                onChange={() => setTxType("Income")}
              />
              <TypeOption
                label="Expense"
                description="Maintenance, insurance, fuel"
                color={COLORS.ERROR_MAIN}
                bg="#FEF2F2"
                checked={txType === "Expense"}
                onChange={() => setTxType("Expense")}
              />
              <TypeOption
                label="Refund"
                description="Customer refunds, cancellations"
                color={COLORS.WARNING_MAIN}
                bg={COLORS.WARNING_LIGHT}
                checked={txType === "Refund"}
                onChange={() => setTxType("Refund")}
              />
              <TypeOption
                label="Chargeback"
                description="Disputed payments"
                color={COLORS.ERROR_MAIN}
                bg={COLORS.ERROR_LIGHT}
                checked={txType === "Chargeback"}
                onChange={() => setTxType("Chargeback")}
              />
            </div>
          </div>

          {/* Amount */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Amount *
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                $
              </span>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                style={{ ...inputStyle, paddingLeft: "2rem" }}
              />
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: COLORS.TEXT_MUTED,
                marginTop: "0.25rem",
              }}
            >
              Enter positive amount. System will handle negative values based on
              type.
            </p>
          </div>

          {/* Driver & Vehicle Owner */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              gridColumn: "span 2",
            }}
          >
            <div style={{ width: "100%" }}>
              <SelectField
                label="Select Driver (Optional)"
                options={[
                  { label: "Select Driver", value: "" },
                  { label: "John Smith", value: "johnsmith" },
                  { label: "Jane Smith", value: "janesmith" },
                  { label: "Mike Johnson", value: "mikejohnson" },
                  { label: "Sarah Johnson", value: "sarahjohnson" },
                ]}
              />
            </div>
            <div style={{ width: "100%" }}>
              <SelectField
                label="Vehicle Owner"
                options={[
                  { label: "Vehicle Owner", value: "" },
                  {
                    label: "ABC Fleet Management",
                    value: "abcfleetmanagement",
                  },
                  { label: "XYZ Car Rentals", value: "xyzcarrentals" },
                  { label: "Individual owner", value: "individualowner" },
                ]}
              />
            </div>
          </div>

          {/* Linked agreement & Payment method */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              gridColumn: "span 2",
            }}
          >
            <div style={{ width: "100%" }}>
              <SelectField
                label="Linked Agreement(Optional)"
                options={[
                  { label: "No Agreement", value: "" },
                  {
                    label: "AGR-2024-001 John Smith Rental",
                    value: "AGR-2024-001",
                  },
                  {
                    label: "AGR-2024-002 Jane Smith Rental",
                    value: "AGR-2024-002",
                  },
                  {
                    label: "AGR-2024-003 Mike Johnson Rental",
                    value: "AGR-2024-003",
                  },
                  {
                    label: "AGR-2024-004 Sarah Johnson Rental",
                    value: "AGR-2024-004",
                  },
                ]}
              />
            </div>
            <div style={{ width: "100%" }}>
              <SelectField
                label="Payment Method"
                options={[
                  { label: "Payment Method", value: "" },
                  {
                    label: "Credit / Debit Card",
                    value: "creditcard",
                  },
                  {
                    label: "UPI / Bank Transfer",
                    value: "upi",
                  },
                  { label: "Cash", value: "cash" },
                  { label: "Check", value: "check" },
                  { label: "Paypal", value: "paypal" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>
          </div>

          {/* Tax/GST Treatment & Invoice reference */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              gridColumn: "span 2",
            }}
          >
            <div style={{ width: "100%" }}>
              <SelectField
                label="Tax/GST Treatment"
                options={[
                  { label: "GST Inclusive", value: "gstinclusive" },
                  {
                    label: "GST Exclusive",
                    value: "gstexclusive",
                  },
                  {
                    label: "GST Exempt",
                    value: "gstexempt",
                  },
                  {
                    label: "Not Applicable",
                    value: "notapplicable",
                  },
                ]}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Invoice Reference (Optional)</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="eg. INV-001-2024-001"
              />
            </div>
          </div>

          {/* Attach Files */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Attach Files</label>
            <DocumentUploadCard
              title="Attach Files"
              subtitle="Drag and drop files here, or browse"
              icon={<FileText size={24} color={COLORS.GRAY_400} />}
              onFileSelect={(file) => handleFile("proofOfAddress", file)}
              file={files.proofOfAddress}
            />
          </div>

          {/* Internal Notes */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Note Content</label>
            <textarea
              placeholder="Enter internal note or observation..."
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: COLORS.GRAY_200,
            marginTop: "10px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "3rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              background: "white",
              color: COLORS.TEXT_MAIN,
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "0.6rem 2rem",
              borderRadius: "8px",
              border: "none",
              background: saving ? COLORS.GRAY_400 : COLORS.PRIMARY_MAIN,
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

const TypeOption = ({ label, description, color, bg, checked, onChange }: any) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      cursor: "pointer",
    }}
  >
    <input
      type="radio"
      name="txType"
      checked={checked}
      onChange={onChange}
      style={{ cursor: "pointer" }}
    />
    <span
      style={{
        padding: "0.3rem 0.6rem",
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: bg,
        color: color,
        minWidth: "80px",
        textAlign: "center",
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
      {description}
    </span>
  </label>
);

const inputStyle = {
  padding: "0.6rem 1rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  color: COLORS.TEXT_MAIN,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "0.5rem",
  display: "block",
};

function DocumentUploadCard({
  title,
  subtitle,
  icon,
  onFileSelect,
  file,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onFileSelect?: (file: File) => void;
  file?: File | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: `2px dashed ${file ? "#10B981" : isHovered ? "var(--primary)" : COLORS.GRAY_200}`,
        borderRadius: "12px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        background: file ? "#F0FDF4" : COLORS.BG_CARD,
        cursor: "pointer",
        transition: "all 0.2s ease",
        minHeight: "180px",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleChange}
        accept=".jpg,.jpeg,.png,.pdf"
      />

      <div>
        {file ? <CheckCircle2 size={24} color={COLORS.SUCCESS_MAIN} /> : icon}
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111827" }}>
          {title}
        </p>
        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
          {file ? `File: ${file.name}` : subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: file ? "#059669" : COLORS.PRIMARY_MAIN,
          fontWeight: 600,
          fontSize: "0.85rem",
        }}
      >
        <Upload size={16} />
        {file ? "Change File" : "Choose File"}
      </div>
    </div>
  );
}
