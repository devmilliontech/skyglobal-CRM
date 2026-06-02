"use client";
import { COLORS } from "@/constants/Constant";

import React, { useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Bell,
  Search,
  Check,
  X,
  MoreVertical,
  User,
  Car,
  FileText,
  Clock,
  History,
  ExternalLink,
  MoreHorizontal,
  CheckCircle2,
  Clock1,
  ClockFading,
  Notebook,
  FileWarning,
  ArrowDownCircle,
  RotateCcw,
  BookMarked,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import PageHeader from "@/components/PageHeader";

export default function RentalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    console.log(params.id);
  }, [params]);
  const rentalId = (params.id as string) || "RNT-2024-001";

  const rentalsData = [
    {
      id: "REN-2024-001",
      vehicle: "Toyota Corolla",
      registration: "ABC-1234",
      driver: "John Doe",
      owner: "Sarah Johnson",
      agreementType: "Short-Term",
      startDateAndTime: "Oct 24, 2023 10:00 AM",
      endDateAndTime: "Oct 31, 2023 10:00 AM",
      rentalStatus: "On Time",
      paymentStatus: "Paid",
      returnStatus: "Not Returned",
    },
    {
      id: "RNT-2024-002",
      vehicle: "Honda Civic",
      registration: "XYZ-7890",
      driver: "Jane Smith",
      owner: "Mike brown",
      agreementType: "Monthly Rental",
      startDateAndTime: "Oct 28, 2023 10:00 AM",
      endDateAndTime: "Nov 28, 2023 10:00 AM",
      rentalStatus: "Scheduled",
      paymentStatus: "Pending",
      returnStatus: "Not Returned",
    },
    {
      id: "REN-2024-003",
      vehicle: "Nissan Leaf",
      registration: "EV-4566",
      driver: "David Chen",
      owner: "Global Remote",
      agreementType: "Daily Flex",
      startDateAndTime: "Oct 22, 2023 10:00 AM",
      endDateAndTime: "Oct 23, 2023 10:00 AM",
      rentalStatus: "Cancelled",
      paymentStatus: "Refunded",
      returnStatus: "Not Returned",
    },
  ];
  const rental = rentalsData.find((r) => r.id === rentalId) || rentalsData[0];

  const cardStyle: React.CSSProperties = {
    background: COLORS.BG_CARD,
    borderRadius: "12px",
    padding: "1.25rem",
    border: "1px solid #E5E7EB",
    height: "fit-content",
  };

  const labelValueRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    fontSize: "0.85rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader
        title="Rental Details"
        description={`Viewing details for rental ${rentalId}`}
        showBack
        notificationCount={3}
      />

      {/* Main Rental Info Header */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => router.back()}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                {rentalId}
              </h1>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                {rental.vehicle} - {rental.registration}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                background: COLORS.PRIMARY_LIGHT,
                color: COLORS.PRIMARY_MAIN,
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Short Term
            </span>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                background:
                  rental.rentalStatus === "On Time"
                    ? "#DCFCE7"
                    : rental.rentalStatus === "Scheduled"
                      ? "#DBEAFE"
                      : COLORS.ERROR_LIGHT,
                color:
                  rental.rentalStatus === "On Time"
                    ? "#10B981"
                    : rental.rentalStatus === "Scheduled"
                      ? "#3B82F6"
                      : COLORS.ERROR_MAIN,
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Active
            </span>

            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.1rem 0.5rem",
                  background: COLORS.SUCCESS_MAIN,
                  color: COLORS.BG_CARD,
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <Check size={18} /> Approve
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  background: COLORS.ERROR_MAIN,
                  color: COLORS.BG_CARD,
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <X size={18} /> Cancel
              </button>
              <button
                style={{
                  padding: "8px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#6B7280",
                }}
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "3rem",
            borderTop: "1px solid #F3F4F6",
            paddingTop: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6B7280",
                marginBottom: "0.25rem",
              }}
            >
              Start Date
            </p>
            <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              {rental.startDateAndTime}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6B7280",
                marginBottom: "0.25rem",
              }}
            >
              End Date
            </p>
            <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              {rental.endDateAndTime}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6B7280",
                marginBottom: "0.25rem",
              }}
            >
              Outstanding Balance
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: COLORS.ERROR_MAIN,
              }}
            >
              $0.00
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6B7280",
                marginBottom: "0.25rem",
              }}
            >
              Late Return Fee
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: COLORS.WARNING_MAIN,
              }}
            >
              $0.00
            </p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Rental Overview
            </h3>
            <div style={labelValueRow}>
              <span style={{ color: "#6B7280" }}>Rental Amount</span>
              <span style={{ fontWeight: 500 }}>$350.00</span>
            </div>
            <div style={labelValueRow}>
              <span style={{ color: "#6B7280" }}>Deposit</span>
              <span style={{ fontWeight: 500 }}>$500.00</span>
            </div>
            <div style={labelValueRow}>
              <span style={{ color: "#6B7280" }}>Duration</span>
              <span style={{ fontWeight: 500 }}>7 days</span>
            </div>
            <div style={labelValueRow}>
              <span style={{ color: "#6B7280" }}>Mileage Start</span>
              <span style={{ fontWeight: 500 }}>45,230 km</span>
            </div>
            <div
              style={{
                ...labelValueRow,
                marginTop: "1.5rem",
                borderTop: "1px solid #F3F4F6",
                paddingTop: "1rem",
                marginBottom: 0,
              }}
            >
              <span style={{ fontWeight: 500 }}>Total Paid</span>
              <span style={{ fontWeight: 800, color: COLORS.SUCCESS_MAIN }}>
                $850.00
              </span>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Driver Information
            </h3>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                style={{ width: "48px", height: "48px", borderRadius: "50%" }}
              />
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                  {rental.driver}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Driver ID: DRV-{rental.id.split("-").pop()}
                </p>
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                  }}
                >
                  Phone
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  +1 (555) 123-4567
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  john.doe@email.com
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                  }}
                >
                  License
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  DL-123456789
                </p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  KYC Status
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: COLORS.SUCCESS_LIGHT,
                    color: COLORS.SUCCESS_MAIN,
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Owner Information
            </h3>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.85rem" }}>
                  {rental.owner}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  Owner ID: OWN-{rental.id.split("-").pop()}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                  }}
                >
                  Phone
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  +1 (555) 123-4567
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  sarah.j@email.com
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                  }}
                >
                  Fleet size
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  12 vehicles
                </p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Status
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: COLORS.SUCCESS_LIGHT,
                    color: COLORS.SUCCESS_MAIN,
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Vehicle Information
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Make & Model
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {rental.vehicle}
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Registration
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {rental.registration}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Insurance
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.2rem",
                      padding: "2px 8px",
                      background: COLORS.SUCCESS_LIGHT,
                      color: COLORS.SUCCESS_MAIN,
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    Active
                  </span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>VIN</p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    letterSpacing: "1px",
                  }}
                >
                  1HGBH41JXMN109186
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Registration Expiry
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                  Dec 31, 2024
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Check-in / Check-out
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.75rem",
                  }}
                >
                  Check-in Condition
                </p>
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "8px",
                    background: "#F9FAFB",
                    border: "1px dashed #E5E7EB",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "#6B7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Jan 15, 2024 10:00 AM
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#374151" }}>
                    Vehicle in excellent condition. No visible damages. Full
                    fuel tank. Interior clean.
                  </p>
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.75rem",
                  }}
                >
                  Check-out Condition
                </p>
                <div
                  style={{
                    padding: "0.5rem",
                    borderRadius: "8px",
                    background: "#F9FAFB",
                    border: "1px dashed #E5E7EB",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                    Pending return
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Return Controls
            </h3>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "column",
              }}
            >
              <button
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#2563eb",
                  color: COLORS.BG_CARD,
                }}
              >
                <p>Mark as Returned</p>
                <Check size={18} />
              </button>
              <button
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <p>Request Extension</p>
                <Clock size={18} />
              </button>
              <button
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #f9c462",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#fef3c7",
                  color: "#ffa600ff",
                }}
              >
                <p>Send Reminder</p>
                <Bell size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Payment Timeline
            </h3>
            <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "-22px",
                    top: "4px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: COLORS.SUCCESS_MAIN,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                      Initial Payment
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Jan 15, 2024 • $850.00
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: COLORS.SUCCESS_LIGHT,
                      color: COLORS.SUCCESS_MAIN,
                      borderRadius: "4px",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                    }}
                  >
                    Paid
                  </span>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "-22px",
                    top: "4px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#E5E7EB",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                      Final Payment
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Upon return • $0.00
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: "#F3F4F6",
                      color: "#6B7280",
                      borderRadius: "4px",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                    }}
                  >
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Agreement
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                cursor: "pointer",
              }}
              onClick={() => router.push("/rentals/agreements")}
            >
              <div
                style={{
                  padding: "8px",
                  background: "#EEF2FF",
                  color: "#4F46E5",
                  borderRadius: "8px",
                }}
              >
                <FileText size={20} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  AGR-2024-001
                </p>
                <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  Short-term Rental Agreement
                </p>
              </div>
              <button style={{ color: COLORS.PRIMARY_MAIN }}>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Admin History
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                    Rental Created
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                    by Admin Sarah K.
                  </p>
                </div>
                <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  Jan 15, 10:00
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                    Payment Confirmed
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                    by System Auto
                  </p>
                </div>
                <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  Jan 15, 10:15
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 500,
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
                  gap: "0.75rem",
                  fontSize: "0.85rem",
                }}
              >
                <FileText size={18} color={COLORS.PRIMARY_MAIN} /> View
                Agreement
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.85rem",
                }}
              >
                <Notebook size={18} color="#0ea5e9" /> Add Note
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.85rem",
                }}
              >
                <RotateCcw size={18} color="#f6a61f" /> Initiate Refund
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.85rem",
                }}
              >
                <FileWarning size={18} color="#dc2626" /> Escalate Dispute
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          height: "100%",
          border: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>Issues and Dispute Log</p>
          <button
            style={{
              backgroundColor: COLORS.PRIMARY_MAIN,
              color: COLORS.BG_CARD,
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            <Plus size={18} />
            <span>Add Entry</span>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <BookMarked size={35} color="#6B7280" />
          <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>
            No issues or disputes logged for this rental.
          </p>
        </div>
      </div>
    </div>
  );
}
