"use client";

import React from "react";
import { COLORS } from "@/constants/Constant";
import {
  ArrowLeft,
  Pencil,
  Paperclip,
  Download,
  AlertTriangle,
  FileWarning,
  X,
  ChevronRight,
  CarFront,
  History,
  CalendarDays,
  Plus,
  Eye,
} from "lucide-react";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";

interface VehicleFinanceDetailProps {
  record: any; // Using any for simplicity here, can be refined based on FinanceRecord type
  onBack: () => void;
}

export default function VehicleFinanceDetail({
  record,
  onBack,
}: VehicleFinanceDetailProps) {
  const adminNotes = [
    {
      date: "2024-04-10",
      author: "John Admin",
      message:
        "Payment overdue. Contacted owner on 2024-03-30. Promised payment by 2024-04-05. Follow up required if not received.",
      action: "Urgent",
      actionColor: "error",
    },
    {
      date: "2024-03-20",
      author: "Sarah Manager",
      message:
        "Finance contract document missing from system. Requested copy from AutoFinance Plus. Awaiting response.",
      action: "Action Required",
      actionColor: "warning",
    },
    {
      date: "2024-03-10",
      author: "Mike Finance",
      message:
        "Finance record created. Vehicle ABC123 purchased for $45,000. 36-month term at 18.4% fixed rate with AutoFinance Plus.",
      action: "info",
      actionColor: "primary",
    },
  ];

  const relatedItems = {
    vehicleDetails: [
      {
        title: "Make & Model",
        description: "Toyota Camry 2023",
      },
      {
        title: "Purchase Date",
        description: "2023-08-10",
      },
      {
        title: "Status",
        description: "Active",
      },
    ],
    financeSummary: [
      {
        title: "Record Created",
        description: "2023-08-15",
      },
      {
        title: "Created By",
        description: "Mike Finance",
      },
      {
        title: "Last Updated",
        description: "2024-01-20",
      },
    ],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Detail Header area replacing the PageHeader temporarily or just above it. Since it's inside the tab, we show a breadcrumb/back button. */}

      {/* Overdue Alert */}
      {record.registrationStatus.toLowerCase() === "overdue" && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <AlertTriangle
              size={18}
              color={COLORS.ERROR_MAIN}
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#991B1B",
                }}
              >
                Overdue Repayment
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#B91C1C",
                  marginTop: "2px",
                }}
              >
                This finance record has repayments overdue by 7 days. Last
                payment received: 2024-03-15
              </p>
            </div>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#991B1B",
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Missing Docs Alert */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          background: "#FEFCE8",
          border: "1px solid #FEF08A",
          borderRadius: "10px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
        >
          <FileWarning
            size={18}
            color={COLORS.WARNING_MAIN}
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#854D0E",
              }}
            >
              Missing Documents
            </p>
            <p
              style={{ fontSize: "0.8rem", color: "#A16207", marginTop: "2px" }}
            >
              Finance contract document is missing. Please attach the signed
              agreement.
            </p>
          </div>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#854D0E",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button variant="outline" size="md" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Finance List
        </Button>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button variant="primary" size="md">
            <Pencil size={16} />
            Edit Record
          </Button>
          <Button variant="outline" size="md">
            <Paperclip size={16} />
            Attach Documents
          </Button>
          <Button variant="outline" size="md">
            <Download size={16} />
            Export Record
          </Button>
        </div>
      </div>

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
          {/* Finance Overview */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Finance Overview
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <StatusBadge status="Overdue" />
                <span
                  style={{
                    background: "#FEFCE8",
                    color: "#854D0E",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FileWarning size={12} />
                  Missing Docs
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Vehicle Registration
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {record.registration}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Vehicle Owner
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  FleetCo Rentals Ltd
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Finance Provider
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {record.financeProvider}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Interest Model
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  Fixed Rate - 18.4% p.a.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  background: COLORS.PRIMARY_LIGHT,
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.5rem",
                  }}
                >
                  Original Loan Amount
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: COLORS.PRIMARY_MAIN,
                  }}
                >
                  ${record.loanAmount.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  background: "#FAF5FF",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.5rem",
                  }}
                >
                  Total Interest Charges
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#9333EA",
                  }}
                >
                  ${record.totalInterest.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  background: COLORS.GRAY_50,
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.5rem",
                  }}
                >
                  Total Amount Payable
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  ${record.totalPayable.toLocaleString()}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Monthly Repayment
                </p>
                <p
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  ${record.monthlyRepayment.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: COLORS.TEXT_MUTED,
                    marginTop: "0.25rem",
                  }}
                >
                  Includes ${record.monthlyInterest} monthly interest
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Repayment Period
                </p>
                <p
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {record.periodMonths} Months
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: COLORS.TEXT_MUTED,
                    marginTop: "0.25rem",
                  }}
                >
                  3 years term
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.25rem",
              }}
            >
              Payment Status
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #86EFAC",
                  background: "#F0FDF4",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#166534",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  Amount Paid to Date
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#166534",
                    marginBottom: "0.5rem",
                  }}
                >
                  $14,790.00
                </p>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "#BBF7D0",
                    borderRadius: "2px",
                    marginBottom: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "27.8%",
                      height: "100%",
                      background: "#22C55E",
                      borderRadius: "2px",
                    }}
                  />
                </div>
                <p style={{ fontSize: "0.7rem", color: "#166534" }}>
                  27.8% of total payable
                </p>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#991B1B",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  Outstanding Balance
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#991B1B",
                    marginBottom: "0.5rem",
                  }}
                >
                  $38,460.00
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#B91C1C",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <AlertTriangle size={12} /> 1 payment overdue
                </p>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  background: COLORS.BG_CARD,
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  Credit Fees & Charges
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.5rem",
                  }}
                >
                  $450.00
                </p>
                <p style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}>
                  Paid upfront
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                paddingTop: "1rem",
                borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Repayment Start Date
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  2023-09-15
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Projected End Date
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  2026-09-15
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginBottom: "0.25rem",
                  }}
                >
                  Payments Made
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  10 of 36
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
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
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Admin Notes
              </h3>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "none",
                  border: "none",
                  color: COLORS.PRIMARY_MAIN,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Add Note
              </button>
            </div>
            {adminNotes.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderLeft: `3px solid ${COLORS.PRIMARY_MAIN}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img
                      src="https://i.pravatar.cc/150?u=1"
                      alt="avatar"
                      style={{ width: 24, height: 24, borderRadius: "50%" }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      {item.author}
                    </span>
                    <span
                      style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}
                    >
                      {item.date}
                    </span>
                  </div>
                  <span
                    style={{
                      background:
                        item.action === "Info"
                          ? COLORS.PRIMARY_LIGHT
                          : item.action === "Action Required"
                            ? COLORS.WARNING_LIGHT
                            : item.action === "Urgent"
                              ? COLORS.ERROR_LIGHT
                              : COLORS.PRIMARY_LIGHT,
                      color:
                        item.action === "Info"
                          ? COLORS.PRIMARY_MAIN
                          : item.action === "Action Required"
                            ? COLORS.WARNING_MAIN
                            : item.action === "Urgent"
                              ? COLORS.ERROR_MAIN
                              : COLORS.PRIMARY_MAIN,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.action}
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.25rem",
              }}
            >
              Quick Actions
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: COLORS.PRIMARY_MAIN,
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Pencil size={16} />
                  Edit Finance Record
                </div>
                <ChevronRight size={16} />
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <Paperclip size={16} />
                  Attached Documents
                </div>
                <ChevronRight size={16} color={COLORS.TEXT_MUTED} />
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <CarFront size={16} />
                  Open Vehicle Detail
                </div>
                <ChevronRight size={16} color={COLORS.TEXT_MUTED} />
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <History size={16} />
                  View Payment History
                </div>
                <ChevronRight size={16} color={COLORS.TEXT_MUTED} />
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <CalendarDays size={16} />
                  View Outstanding Schedule
                </div>
                <ChevronRight size={16} color={COLORS.TEXT_MUTED} />
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <Download size={16} />
                  Export Record
                </div>
                <ChevronRight size={16} color={COLORS.TEXT_MUTED} />
              </button>
            </div>
          </div>

          {/* Related Information */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.25rem",
              }}
            >
              Related Information
            </h3>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: COLORS.TEXT_MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              Vehicle details
            </p>
            {relatedItems.vehicleDetails.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    backgroundColor:
                      item.description === "Active"
                        ? COLORS.SUCCESS_LIGHT
                        : item.description === "Overdue"
                          ? COLORS.ERROR_LIGHT
                          : "#fff",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color:
                      item.description === "Active"
                        ? COLORS.SUCCESS_MAIN
                        : "#000",
                  }}
                >
                  {item.description}
                </span>
              </div>
            ))}

            <div
              style={{
                backgroundColor: COLORS.GRAY_200,
                height: "1px",
                width: "100%",
                marginTop: "1rem",
              }}
            />

            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                Finance Summary
              </p>
              {relatedItems.financeSummary.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      backgroundColor:
                        item.description === "Active"
                          ? COLORS.SUCCESS_LIGHT
                          : item.description === "Overdue"
                            ? COLORS.ERROR_LIGHT
                            : "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      color:
                        item.description === "Active"
                          ? COLORS.SUCCESS_MAIN
                          : "#000",
                    }}
                  >
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attached Documents */}
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
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Attached Documents
              </h3>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.PRIMARY_MAIN,
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      padding: "6px",
                      background: "#FEE2E2",
                      borderRadius: "6px",
                      color: "#EF4444",
                      display: "flex",
                    }}
                  >
                    <FileWarning size={16} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#991B1B",
                      }}
                    >
                      Finance Contract
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#B91C1C" }}>
                      Missing - Required
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EF4444",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                  }}
                >
                  <Download size={16} style={{ transform: "rotate(180deg)" }} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  background: COLORS.BG_CARD,
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      padding: "6px",
                      background: COLORS.PRIMARY_LIGHT,
                      borderRadius: "6px",
                      color: COLORS.PRIMARY_MAIN,
                      display: "flex",
                    }}
                  >
                    <Paperclip size={16} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      Purchase Invoice
                    </p>
                    <p style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}>
                      1.2 MB • Uploaded 2023-08-15
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: COLORS.PRIMARY_MAIN,
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                    }}
                  >
                    <Download size={16} />
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: COLORS.TEXT_SECONDARY,
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  background: COLORS.BG_CARD,
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      padding: "6px",
                      background: "#DCFCE7",
                      borderRadius: "6px",
                      color: "#16A34A",
                      display: "flex",
                    }}
                  >
                    <Paperclip size={16} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      Vehicle Registration
                    </p>
                    <p style={{ fontSize: "0.7rem", color: COLORS.TEXT_MUTED }}>
                      850 KB • Uploaded 2023-08-15
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: COLORS.PRIMARY_MAIN,
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                    }}
                  >
                    <Download size={16} />
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: COLORS.TEXT_SECONDARY,
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
