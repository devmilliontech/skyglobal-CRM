"use client";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Check,
  X,
  UploadCloud,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  FileText,
  Edit3,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  DriverDocument,
  DriverDocumentDetails,
  DriverDocumentNote,
  DriverDocumentSummary,
  driversApi,
} from "@/services/api/drivers";

const DETAIL_FIELD_ORDER = [
  "name",
  "passportNumber",
  "licenceNumber",
  "nationalIdNumber",
  "issueDate",
  "expiryDate",
  "country",
  "dateOfBirth",
  "gender",
];

const DETAIL_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  passportNumber: "Passport Number",
  licenceNumber: "Licence Number",
  nationalIdNumber: "National ID Number",
  issueDate: "Issue Date",
  expiryDate: "Expiry Date",
  country: "Country",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
};

const DETAIL_LABEL_TO_KEY = Object.entries(DETAIL_FIELD_LABELS).reduce<
  Record<string, string>
>((labels, [key, label]) => {
  labels[label] = key;
  return labels;
}, {});

const getDocumentId = (doc: DriverDocument) => doc.id || doc._id || "";

const canRetryOcr = (doc: DriverDocument) => {
  const type = String(doc.type || "").toLowerCase();
  return (
    type.includes("licence") ||
    type.includes("license") ||
    type.includes("passport") ||
    type.includes("national") ||
    type.includes("visa")
  );
};

const isProvided = (value: DriverDocumentDetails[string]) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const formatFieldLabel = (key: string) =>
  DETAIL_FIELD_LABELS[key] ||
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatFieldValue = (value: DriverDocumentDetails[string]) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return isProvided(value) ? String(value) : "N/A";
};

const getDetailEntries = (details?: DriverDocumentDetails) =>
  Object.entries(details || {}).filter(([, value]) => isProvided(value));

const getOcrDetails = (doc: DriverDocument) =>
  doc.extractedData || doc.ocr?.extractedData;

const getEditableFieldsForDocument = (doc: DriverDocument) => {
  const type = String(doc.type || "").toLowerCase();
  const baseFields = ["name", "issueDate", "expiryDate", "country"];

  if (type.includes("passport")) {
    return [...baseFields, "passportNumber", "dateOfBirth", "gender"];
  }

  if (type.includes("licence") || type.includes("license")) {
    return [...baseFields, "licenceNumber", "dateOfBirth", "gender"];
  }

  if (type.includes("national")) {
    return [...baseFields, "nationalIdNumber", "dateOfBirth", "gender"];
  }

  if (type.includes("visa")) {
    return ["passportNumber", "issueDate", "expiryDate", "country"];
  }

  if (type.includes("selfie")) {
    return ["name"];
  }

  return DETAIL_FIELD_ORDER;
};

const buildEditableForm = (doc: DriverDocument) => {
  const source =
    doc.editableDetails || doc.verifiedData || getOcrDetails(doc) || {};
  const keys = Array.from(
    new Set([...getEditableFieldsForDocument(doc), ...Object.keys(source)]),
  );

  return keys.reduce<Record<string, string>>((form, key) => {
    const value = source[key];
    form[key] = isProvided(value) ? String(value) : "";
    return form;
  }, {});
};

const normalizedDetailsToDisplay = (
  details?: DriverDocumentDetails,
): DriverDocumentDetails =>
  Object.entries(details || {}).reduce<DriverDocumentDetails>(
    (displayDetails, [key, value]) => {
      if (isProvided(value)) {
        displayDetails[formatFieldLabel(key)] = value;
      }
      return displayDetails;
    },
    {},
  );

const buildDisplayDetails = (doc: DriverDocument) => {
  const displayDetails = { ...(doc.details || {}) };
  const normalizedSources = [
    doc.detailsSource === "Admin Verified" ? doc.verifiedData : undefined,
    doc.verifiedData,
    doc.editableDetails,
    doc.detailsSource === "OCR" ? getOcrDetails(doc) : undefined,
  ];

  normalizedSources.forEach((source) => {
    const normalizedDisplay = normalizedDetailsToDisplay(source);
    Object.entries(normalizedDisplay).forEach(([label, value]) => {
      const normalizedKey = DETAIL_LABEL_TO_KEY[label];
      const existingValue = displayDetails[label];
      const verifiedValue = normalizedKey ? doc.verifiedData?.[normalizedKey] : undefined;

      if (!isProvided(existingValue) || isProvided(verifiedValue)) {
        displayDetails[label] = value;
      }
    });
  });

  return displayDetails;
};

const formToDocumentDetails = (form: Record<string, string>) =>
  Object.entries(form).reduce<DriverDocumentDetails>((details, [key, value]) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      details[key] = trimmedValue;
    }
    return details;
  }, {});

const getSourceLabel = (source?: string) => {
  if (source === "OCR") return "OCR extracted";
  if (source === "Admin Verified") return "Admin verified";
  if (source === "Not Provided") return "Not provided";
  return source || "Not provided";
};

const formatConfidence = (confidence?: string | number | null) => {
  if (confidence === undefined || confidence === null || confidence === "") return null;
  const numeric = typeof confidence === "number" ? confidence : Number(confidence);
  if (Number.isNaN(numeric)) return String(confidence);
  return numeric <= 1 ? `${Math.round(numeric * 100)}%` : `${Math.round(numeric)}%`;
};

const ImageWrapper = ({
  src,
  alt,
  height,
}: {
  src: string;
  alt: string;
  height: string;
}) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div
        style={{
          width: "100%",
          height,
          background: "#F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94A3B8",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
      >
        {alt}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setError(true)}
    />
  );
};

export default function DriverDocuments({ driverId }: { driverId: string }) {
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [notes, setNotes] = useState<DriverDocumentNote[]>([]);
  const [summary, setSummary] = useState<DriverDocumentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DriverDocument | null>(null);
  const [detailForm, setDetailForm] = useState<Record<string, string>>({});
  const [savingDetails, setSavingDetails] = useState(false);
  const [retryingDocId, setRetryingDocId] = useState<string | null>(null);

  const [newNote, setNewNote] = useState("");

  const fetchDocuments = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const res = await driversApi.getDriverDocuments(driverId);
      if (res.success && res.data) {
        setDocuments(res.data.documents || []);
        setNotes(res.data.internalNotes || []);
        setSummary(res.data.summary || null);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      setError(error instanceof Error ? error.message : "Failed to fetch documents");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [driverId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const applyDocumentUpdate = (updatedDocument?: DriverDocument) => {
    const updatedDocumentId = updatedDocument ? getDocumentId(updatedDocument) : "";
    if (!updatedDocument || !updatedDocumentId) return;

    setDocuments((currentDocuments) =>
      currentDocuments.map((doc) =>
        getDocumentId(doc) === updatedDocumentId
          ? { ...doc, ...updatedDocument }
          : doc,
      ),
    );
  };

  const handleUpdateStatus = async (
    docId: string,
    status: string,
    reason?: string,
    documentDetails?: DriverDocumentDetails,
  ) => {
    if (!docId) return;

    try {
      const res = await driversApi.updateDriverDocumentStatus(driverId, docId, {
        status,
        ...(reason ? { reason } : {}),
        ...(documentDetails ? { documentDetails } : {}),
      });
      if (res.success) {
        applyDocumentUpdate(res.data?.document);
        fetchDocuments(false); // refresh summary/reviewer fields
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleRetryOcr = async (doc: DriverDocument) => {
    const docId = getDocumentId(doc);
    if (!docId) return;

    try {
      setRetryingDocId(docId);
      setError(null);
      const res = await driversApi.retryDriverDocumentOcr(driverId, docId);
      applyDocumentUpdate(res.data?.document);
      fetchDocuments(false);
    } catch (error) {
      console.error("Failed to retry OCR", error);
      setError(error instanceof Error ? error.message : "Failed to retry OCR");
    } finally {
      setRetryingDocId(null);
    }
  };

  const openEditDetails = (doc: DriverDocument) => {
    setSelectedDoc(doc);
    setDetailForm(buildEditableForm(doc));
  };

  const closeEditDetails = () => {
    if (savingDetails) return;
    setSelectedDoc(null);
    setDetailForm({});
  };

  const handleDetailFieldChange = (key: string, value: string) => {
    setDetailForm((current) => ({ ...current, [key]: value }));
  };

  const handleSaveDetails = async (approveAfterSave = false) => {
    if (!selectedDoc) return;

    const docId = getDocumentId(selectedDoc);
    if (!docId) {
      setError("Missing document id");
      return;
    }

    const documentDetails = formToDocumentDetails(detailForm);

    try {
      setSavingDetails(true);
      setError(null);
      let updatedDocument: DriverDocument | undefined;
      if (approveAfterSave) {
        const res = await driversApi.updateDriverDocumentStatus(driverId, docId, {
          status: "Approved",
          documentDetails,
        });
        updatedDocument = res.data?.document;
      } else {
        const res = await driversApi.updateDriverDocumentDetails(
          driverId,
          docId,
          documentDetails,
        );
        updatedDocument = res.data?.document;
      }
      applyDocumentUpdate(updatedDocument);
      setSelectedDoc(null);
      setDetailForm({});
      fetchDocuments(false); // refresh summary/reviewer fields
    } catch (error) {
      console.error("Failed to save document details", error);
      setError(error instanceof Error ? error.message : "Failed to save document details");
    } finally {
      setSavingDetails(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await driversApi.addDriverNote(driverId, { text: newNote });
      if (res.success) {
        setNewNote("");
        fetchDocuments(); // refresh
      }
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  const handleReject = (docId: string) => {
    const reason = window.prompt("Please enter the rejection reason:");
    if (reason !== null && reason.trim() !== "") {
      handleUpdateStatus(docId, "Rejected", reason);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        Loading documents...
      </div>
    );
  }

  // Split documents into columns to replicate the masonry layout
  const leftColumnDocs = documents.filter((_, i) => i % 2 === 0);
  const rightColumnDocs = documents.filter((_, i) => i % 2 !== 0);

  const renderDocumentCard = (doc: DriverDocument) => {
    const documentId = getDocumentId(doc);
    const documentTitle = doc.type || "Document";
    const primaryImage =
      doc.imageUrl ||
      doc.fileUrl ||
      doc.url ||
      doc.documentUrl ||
      (doc.imageUrls && doc.imageUrls[0]);
    const secondaryImage =
      doc.secondaryImageUrl ||
      doc.secondaryFileUrl ||
      doc.secondaryUrl ||
      (doc.imageUrls && doc.imageUrls.length > 1 ? doc.imageUrls[1] : null);
    const detailEntries = getDetailEntries(buildDisplayDetails(doc));
    const ocrEntries = getDetailEntries(getOcrDetails(doc));
    const ocrConfidence = formatConfidence(doc.ocr?.confidence);

    return (
      <div
        key={documentId || documentTitle}
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {primaryImage && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "180px",
              overflow: "hidden",
            }}
          >
            <ImageWrapper
              src={primaryImage}
              alt={`${documentTitle} preview`}
              height="100%"
            />
          </div>
        )}
        {secondaryImage && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              overflow: "hidden",
              borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <ImageWrapper
              src={secondaryImage}
              alt={`${documentTitle} details`}
              height="100%"
            />
          </div>
        )}

        <div
          style={{
            padding: "1.25rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {documentTitle === "Insurance Declaration" && (
                <ShieldCheck size={18} color={COLORS.PRIMARY_MAIN} />
              )}
              {documentTitle}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
              <DetailsSourceBadge source={doc.detailsSource} />
              {doc.status === "Approved" && (
                <span
                  style={{
                    color: COLORS.SUCCESS_MAIN,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Check size={14} /> Approved
                </span>
              )}
            </div>
          </div>

          {/* Details Table */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              fontSize: "0.8rem",
            }}
          >
            {detailEntries.length ? (
              detailEntries.map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderBottom: `1px dashed ${COLORS.BORDER_MAIN}`,
                    paddingBottom: "0.25rem",
                  }}
                >
                  <span style={{ color: COLORS.TEXT_SECONDARY }}>
                    {formatFieldLabel(key)}
                  </span>
                  <span style={{ fontWeight: 600, textAlign: "right" }}>
                    {formatFieldValue(value)}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: COLORS.TEXT_MUTED, margin: 0 }}>
                No document fields provided.
              </p>
            )}
          </div>

          {(doc.ocr?.status || ocrConfidence || ocrEntries.length > 0) && (
            <div
              style={{
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "1.25rem",
                background: "#F8FAFC",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  marginBottom: ocrEntries.length ? "0.6rem" : 0,
                  fontSize: "0.76rem",
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                <span style={{ fontWeight: 700, color: COLORS.TEXT_MAIN }}>
                  OCR extracted values
                </span>
                <span>
                  {[doc.ocr?.status, ocrConfidence ? `${ocrConfidence} confidence` : null]
                    .filter(Boolean)
                    .join(" | ")}
                </span>
              </div>
              {ocrEntries.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {ocrEntries.map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span style={{ color: COLORS.TEXT_SECONDARY }}>
                        {formatFieldLabel(key)}
                      </span>
                      <span style={{ fontWeight: 600, textAlign: "right" }}>
                        {formatFieldValue(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status specific UI */}
          {doc.status === "Rejected" && (
            <div style={{ marginTop: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.7rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "0.5rem",
                }}
              >
                <span>
                  Rejected by:{" "}
                  <strong style={{ color: COLORS.TEXT_MAIN }}>
                    {doc.rejectedBy}
                  </strong>
                </span>
                <span>{doc.rejectedAt || ""}</span>
              </div>
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  color: "#DC2626",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <AlertCircle size={12} /> Rejection Reason
                </p>
                <p>{doc.rejectionReason || "No rejection reason provided."}</p>
              </div>
            </div>
          )}

          {doc.status === "Approved" && doc.approvedBy && (
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              <span>
                Approved By:{" "}
                <strong style={{ color: COLORS.TEXT_MAIN }}>
                  {doc.approvedBy}
                </strong>
              </span>
              <span>{doc.approvedAt}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
            <button
              onClick={() => openEditDetails(doc)}
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "#FFFFFF",
                color: COLORS.PRIMARY_MAIN,
                border: `1px solid ${COLORS.PRIMARY_MAIN}`,
                borderRadius: "8px",
                fontWeight: 600,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <Edit3 size={16} /> Edit Details
            </button>

            {canRetryOcr(doc) && (
              <button
                onClick={() => handleRetryOcr(doc)}
                disabled={!documentId || retryingDocId === documentId}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  background: "#FFFFFF",
                  color: COLORS.SECONDARY_DARK,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor:
                    documentId && retryingDocId !== documentId
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <RotateCcw size={16} />
                {retryingDocId === documentId ? "Retrying OCR..." : "Retry OCR"}
              </button>
            )}

            {doc.status === "Pending" && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => handleUpdateStatus(documentId, "Approved")}
                  disabled={!documentId}
                  style={{
                    flex: 1,
                    padding: "0.6rem",
                    background: COLORS.SUCCESS_MAIN,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: documentId ? "pointer" : "not-allowed",
                  }}
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => handleReject(documentId)}
                  disabled={!documentId}
                  style={{
                    flex: 1,
                    padding: "0.6rem",
                    background: COLORS.ERROR_MAIN,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: documentId ? "pointer" : "not-allowed",
                  }}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            )}

            {doc.status === "Rejected" && (
              <button
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  background: COLORS.PRIMARY_MAIN,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <UploadCloud size={16} /> Requested for Re-upload
              </button>
            )}
          </div>

          {doc.status === "Approved" &&
            documentTitle === "Insurance Declaration" && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem",
                  background: "#ECFDF5",
                  color: "#059669",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <ShieldCheck size={16} /> Declaration verified and approved on{" "}
                {doc.approvedAt?.split(",")[0] || "the approval date"}
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {error && (
        <div
          style={{
            padding: "0.9rem 1rem",
            background: COLORS.ERROR_LIGHT,
            border: `1px solid ${COLORS.ERROR_MAIN}`,
            borderRadius: "8px",
            color: COLORS.ERROR_DARK,
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* Document Grid Layout */}
      {documents.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          <FileText size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: COLORS.TEXT_MAIN,
            }}
          >
            No Documents Uploaded
          </h3>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            This driver has not uploaded any documents yet. Documents will
            appear here once uploaded from the driver app.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {leftColumnDocs.map(renderDocumentCard)}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {rightColumnDocs.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {/* Internal Notes & Actions */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <MessageSquare size={18} color="#EAB308" /> Internal Notes & Actions
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {notes.map((note, idx) => (
            <div
              key={note.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                paddingBottom: "1rem",
                borderBottom:
                  idx !== notes.length - 1
                    ? `1px solid ${COLORS.BORDER_MAIN}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  {note.author}
                </span>
                <span
                  style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}
                >
                  {note.timestamp}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: COLORS.TEXT_SECONDARY,
                  margin: 0,
                }}
              >
                {note.text}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            Add Internal Note
          </label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add note about document verification, issues found, or actions taken..."
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              fontSize: "0.8rem",
              minHeight: "80px",
              resize: "vertical",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            <button
              onClick={handleAddNote}
              style={{
                padding: "0.5rem 1.5rem",
                background: COLORS.PRIMARY_MAIN,
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Document Verification Summary */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <ShieldCheck size={18} color={COLORS.PRIMARY_MAIN} /> Document
          Verification Summary
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#ECFDF5",
              borderBottom: "4px solid #10B981",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <div
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}
            >
              {summary?.approved || 0}
            </div>
            <div
              style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10B981" }}
            >
              Approved
            </div>
          </div>
          <div
            style={{
              background: "#FFF7ED",
              borderBottom: "4px solid #F97316",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <div
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "#C2410C" }}
            >
              {summary?.pendingReview || 0}
            </div>
            <div
              style={{ fontSize: "0.75rem", fontWeight: 600, color: "#F97316" }}
            >
              Pending Review
            </div>
          </div>
          <div
            style={{
              background: "#FEF2F2",
              borderBottom: "4px solid #EF4444",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <div
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "#B91C1C" }}
            >
              {summary?.rejected || 0}
            </div>
            <div
              style={{ fontSize: "0.75rem", fontWeight: 600, color: "#EF4444" }}
            >
              Rejected
            </div>
          </div>
          <div
            style={{
              background: "#EFF6FF",
              borderBottom: "4px solid #3B82F6",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <div
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1D4ED8" }}
            >
              {summary?.totalDocuments || 0}
            </div>
            <div
              style={{ fontSize: "0.75rem", fontWeight: 600, color: "#3B82F6" }}
            >
              Total Documents
            </div>
          </div>
        </div>
      </div>

      {selectedDoc && (
        <DocumentDetailsModal
          documentTitle={selectedDoc.type || "Document"}
          detailForm={detailForm}
          saving={savingDetails}
          onChange={handleDetailFieldChange}
          onClose={closeEditDetails}
          onSave={() => handleSaveDetails(false)}
          onApproveAndSave={() => handleSaveDetails(true)}
        />
      )}
    </div>
  );
}

function DetailsSourceBadge({ source }: { source?: string }) {
  const isOcr = source === "OCR";
  const isVerified = source === "Admin Verified";

  return (
    <span
      style={{
        padding: "0.22rem 0.55rem",
        borderRadius: "6px",
        background: isVerified
          ? COLORS.SUCCESS_LIGHT
          : isOcr
            ? COLORS.INFO_LIGHT
            : "#F1F5F9",
        color: isVerified
          ? COLORS.SUCCESS_DARK
          : isOcr
            ? COLORS.INFO_DARK
            : COLORS.TEXT_SECONDARY,
        fontSize: "0.68rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {getSourceLabel(source)}
    </span>
  );
}

function DocumentDetailsModal({
  documentTitle,
  detailForm,
  saving,
  onChange,
  onClose,
  onSave,
  onApproveAndSave,
}: {
  documentTitle: string;
  detailForm: Record<string, string>;
  saving: boolean;
  onChange: (key: string, value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onApproveAndSave: () => void;
}) {
  const fieldKeys = Object.keys(detailForm);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${documentTitle} details`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "min(760px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.24)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem 1.5rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
              Edit Document Details
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
              {documentTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close details editor"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              background: "#FFFFFF",
              color: COLORS.TEXT_SECONDARY,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            <X size={17} />
          </button>
        </div>

        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "1rem",
          }}
        >
          {fieldKeys.map((key) => {
            const lowerKey = key.toLowerCase();
            const inputType =
              lowerKey.includes("date") || lowerKey.includes("expiry")
                ? "date"
                : "text";

            return (
              <label
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                {formatFieldLabel(key)}
                <input
                  type={inputType}
                  value={detailForm[key] || ""}
                  onChange={(event) => onChange(key, event.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "0.86rem",
                    color: COLORS.TEXT_MAIN,
                    outline: "none",
                  }}
                />
              </label>
            );
          })}
        </div>

        <div
          style={{
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
              background: "#FFFFFF",
              color: COLORS.TEXT_SECONDARY,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.PRIMARY_MAIN}`,
              background: COLORS.PRIMARY_MAIN,
              color: "#FFFFFF",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Corrections"}
          </button>
          <button
            onClick={onApproveAndSave}
            disabled={saving}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.SUCCESS_MAIN}`,
              background: COLORS.SUCCESS_MAIN,
              color: "#FFFFFF",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            <Check size={16} /> Approve & Save
          </button>
        </div>
      </div>
    </div>
  );
}
