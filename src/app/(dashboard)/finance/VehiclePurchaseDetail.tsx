"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Paperclip,
  Link as LinkIcon,
  ExternalLink,
  Download,
  Trash2,
  AlertTriangle,
  X,
  FileText,
  Eye,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import Button from "@/components/Button";
import Card from "@/components/Card";

interface VehiclePurchaseDetailProps {
  record: any;
  onBack: () => void;
}

export default function VehiclePurchaseDetail({
  record,
  onBack,
}: VehiclePurchaseDetailProps) {
  const [alertVisible, setAlertVisible] = useState(true);

  const documents = [
    { name: "Purchase Invoice", file: "INV-2024-0405-001.pdf" },
    { name: "Vehicle Inspection", file: "inspection-report.pdf" },
    { name: "Title Transfer", file: "title-transfer.pdf" },
  ];

  const activityData = [
    {
      title: "Purchase record created",
      description: "2024-04-05 14:30 by Admin User",
      color: "blue",
    },
    {
      title: "Invoice document uploaded",
      description: "2024-04-05 15:15 by Admin User",
      color: "green",
    },
    {
      title: "Finance record linked",
      description: "2024-04-06 09:45 by Finance Team",
      color: "blue",
    },
    {
      title: "GST mismatch detected",
      description: "2024-04-06 10:20 by System",
      color: "yellow",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.5rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: COLORS.TEXT_SECONDARY,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        ></button>
        <Button variant="outline" size="md" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Purchase Records - {record.registration}
        </Button>
      </div>

      {/* Warning Banner */}
      {alertVisible && (
        <div
          style={{
            background: "#FEFCE8",
            border: "1px solid #FEF08A",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ color: "#EAB308", marginTop: "2px" }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#854D0E",
                  marginBottom: "0.25rem",
                }}
              >
                GST Mismatch Warning
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#A16207" }}>
                GST calculation appears incorrect. Expected: $6,750.00, Actual:
                $
                {record.gst.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertVisible(false)}
            style={{
              background: "none",
              border: "none",
              color: "#A16207",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            variant="primary"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "400",
              padding: "10px 16px",
            }}
          >
            <Edit size={16} />
            <span>Edit Purchase Record</span>
          </Button>
          <Button
            variant="outline"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "400",
              padding: "10px 16px",
            }}
          >
            <Paperclip size={16} />
            <span>Attach Documents</span>
          </Button>
          <Button
            variant="outline"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "400",
              padding: "10px 16px",
            }}
          >
            <LinkIcon size={16} />
            <span>Link Finance Record</span>
          </Button>
          <Button
            variant="outline"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "400",
              padding: "10px 16px",
            }}
          >
            <ExternalLink size={16} />
            <span>Open Vehicle Detail</span>
          </Button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Button
            variant="outline"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "400",
              padding: "10px 16px",
            }}
          >
            <Download size={16} />
            <span>Export Receipt Bundle</span>
          </Button>
          <Button
            variant="outline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: COLORS.ERROR_MAIN,
              background: "none",
              border: "1px solid rgba(146, 152, 171, 0.40)",
              fontSize: "12px",
              fontWeight: "400",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            <Trash2 size={16} />
            Delete Record
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.25rem",
        }}
      >
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Purchase Details Card */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.5rem",
              }}
            >
              Purchase Details
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <DetailField label="Purchase Date" value={record.date} />
              <DetailField label="Registration" value={record.registration} />
              <DetailField label="Make & Model" value={record.makeModel} />
              <DetailField
                label="Supplier / Purchased From"
                value={record.purchasedFrom}
              />
              <DetailField label="Payment Method" value="Bank Transfer" />
              <DetailField label="Invoice Number" value="INV-2024-0405-001" />
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.5rem",
              }}
            >
              Financial Breakdown
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  GST Exclusive Cost
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  $
                  {record.exCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  GST Amount (15%)
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    $
                    {record.gst.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "2px 6px",
                      background: "#FEF9C3",
                      borderRadius: "4px",
                      color: "#854D0E",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    <AlertTriangle size={10} />
                    <span>Mismatch</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  paddingTop: "1rem",
                  borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  GST Inclusive Cost
                </span>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  $
                  {record.incCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Card style={{ padding: "1.25rem" }}>
            <div
              style={{
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Notes
              </h3>
              <div
                style={{
                  backgroundColor: COLORS.BG_PAGE,
                  padding: "1rem",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Vehicle purchased from AutoDirect Ltd auction. Clean title,
                  single previous owner. Minor cosmetic wear on front bumper
                  noted during inspection. Finance application pending approval
                  from ANZ Bank.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Linked Finance Record */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Linked Finance Record
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  background: "#DCFCE7",
                  borderRadius: "12px",
                  color: "#166534",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={10} />
                <span>Linked</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <SideField label="Provider" value="ANZ Bank" />
              <SideField label="Loan Amount" value="$40,500.00" />
              <SideField label="Monthly Payment" value="$892.45" />
              <SideField label="Term" value="48 months" />
              <button
                style={{
                  marginTop: "0.5rem",
                  background: "none",
                  border: "none",
                  color: COLORS.PRIMARY_MAIN,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Eye size={16} />
                View Finance Details
              </button>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Uploaded Documents
              </h3>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.PRIMARY_MAIN,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px",
                        background: COLORS.BG_PAGE,
                        borderRadius: "8px",
                        color: COLORS.TEXT_SECONDARY,
                        display: "flex",
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MAIN,
                        }}
                      >
                        {doc.name}
                      </p>
                      <p
                        style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}
                      >
                        {doc.file}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={iconButtonStyle}>
                      <Download size={14} />
                    </button>
                    <button style={iconButtonStyle}>
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity log */}
          <Card style={{ padding: "1.5rem" }}>
            <div
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "1rem",
                  gap: "8px",
                }}
              >
                Activity log
              </h3>
              <div>
                {activityData.map((activity) => (
                  <div
                    key={activity.title}
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <p
                      style={{
                        backgroundColor:
                          activity.color == "green"
                            ? "#16A34A"
                            : activity.color == "red"
                              ? "#F97316"
                              : activity.color == "yellow"
                                ? "#EAB308"
                                : activity.color == "blue"
                                  ? "#3B82F6"
                                  : "#F0FDF4",
                        height: "10px",
                        width: "10px",
                        marginTop: "2px",
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexDirection: "column",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1rem",
                          color: COLORS.TEXT_MAIN,
                          fontWeight: 500,
                        }}
                      >
                        {activity.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        {activity.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
    <span
      style={{ fontSize: "0.9rem", color: COLORS.TEXT_MUTED, fontWeight: 500 }}
    >
      {label}
    </span>
    <div
      style={{
        width: "100%",
        height: "1px",
        backgroundColor: COLORS.BORDER_MAIN,
      }}
    />
    <span
      style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}
    >
      {value}
    </span>
  </div>
);

const SideField = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
      {label}
    </span>
    <span
      style={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.TEXT_MAIN }}
    >
      {value}
    </span>
  </div>
);

const iconButtonStyle: React.CSSProperties = {
  background: "none",
  color: COLORS.TEXT_SECONDARY,
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
};
