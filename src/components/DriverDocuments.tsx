"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Check,
  X,
  UploadCloud,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  FileText,
} from "lucide-react";
import { driversApi } from "@/services/api/drivers";

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
  const [documents, setDocuments] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [newNote, setNewNote] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await driversApi.getDriverDocuments(driverId);
      if (res.success && res.data) {
        setDocuments(res.data.documents || []);
        setNotes(res.data.internalNotes || []);
        setSummary(res.data.summary || null);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [driverId]);

  const handleUpdateStatus = async (
    docId: string,
    status: string,
    reason?: string,
  ) => {
    try {
      const res = await driversApi.updateDriverDocumentStatus(driverId, docId, {
        status,
        reason,
      });
      if (res.success) {
        fetchDocuments(); // refresh
      }
    } catch (error) {
      console.error("Failed to update status", error);
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

  const renderDocumentCard = (doc: any) => {
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

    return (
      <div
        key={doc.id || doc._id}
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
              alt={`${doc.type} preview`}
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
              alt={`${doc.type} details`}
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
              {doc.type === "Insurance Declaration" && (
                <ShieldCheck size={18} color={COLORS.PRIMARY_MAIN} />
              )}
              {doc.type}
            </h4>
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
            {Object.entries(doc.details).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: `1px dashed ${COLORS.BORDER_MAIN}`,
                  paddingBottom: "0.25rem",
                }}
              >
                <span style={{ color: COLORS.TEXT_SECONDARY }}>{key}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>
                  {value as React.ReactNode}
                </span>
              </div>
            ))}
          </div>

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
                <span>{doc.rejectedAt}</span>
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
                <p>{doc.rejectionReason}</p>
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
          {doc.status === "Pending" && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
              <button
                onClick={() => handleUpdateStatus(doc.id, "Approved")}
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
                  cursor: "pointer",
                }}
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => handleReject(doc.id)}
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
                  cursor: "pointer",
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

          {doc.status === "Approved" &&
            doc.type === "Insurance Declaration" && (
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
                {doc.approvedAt.split(",")[0]}
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
    </div>
  );
}
