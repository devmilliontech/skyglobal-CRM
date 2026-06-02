"use client";
import React from "react";
import {
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  FileText,
  Filter,
  Download,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  User,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import Button from "./Button";
import SelectField from "./SelectField";

const DriverAuditActivity = ({ onBack }: { onBack: () => void }) => {
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Left Column: Internal Notes */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Internal Notes
            </h3>
            <span
              style={{
                fontSize: "0.7rem",
                color: COLORS.TEXT_SECONDARY,
                background: "#F3F4F6",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              Private
            </span>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <textarea
              placeholder="Add internal note or comment..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.85rem",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <input type="checkbox" style={{ cursor: "pointer" }} /> High
                  Priority
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  <input type="checkbox" style={{ cursor: "pointer" }} />{" "}
                  Follow-up Required
                </label>
              </div>
              <Button variant="primary" size="md">
                <Plus size={14} /> Add Note
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <NoteItem
              author="Sarah Admin"
              time="2 hours ago"
              priority="High Priority"
              text="Payment overdue by 30 days. Driver not responding to calls or emails. Consider agreement suspension."
              status="Follow-up Required"
              bgColor="#FEF2F2"
            />
            <NoteItem
              author="John Manager"
              time="1 day ago"
              text="Driver called regarding payment delay. Promised to pay by end of week. Setting reminder for Friday."
            />
            <NoteItem
              author="Sarah Admin"
              time="3 days ago"
              text="KYC documents reviewed and approved. Driver licence verified with state authorities."
            />
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
                Activity Log
              </h3>
              <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                Immutable audit trail of all system events
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ position: "relative" }}>
                <SelectField
                  options={[
                    { label: "All Activities", value: "all" },
                    { label: "Status Change", value: "status" },
                    { label: "Payment Event", value: "payment" },
                  ]}
                />
              </div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  background: "white",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              position: "relative",
            }}
          >
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: "20px",
                top: "20px",
                bottom: "20px",
                width: "2px",
                background: "#F3F4F6",
                zIndex: 0,
              }}
            />

            <TimelineItem
              icon={<AlertTriangle size={18} />}
              bgColor="#FEE2E2"
              iconColor="#DC2626"
              title="Account Status Changed"
              desc="Changed from Active to Suspended due to overdue payment"
              tags={[
                { label: "Status Change", color: "#DC2626", bg: "#FEF2F2" },
              ]}
              eventId="EVT-2024-001892"
              time="2 hours ago"
              user="Sarah Admin"
            />

            <TimelineItem
              icon={<CreditCard size={18} />}
              bgColor="#FEE2E2"
              iconColor="#DC2626"
              title="Payment Failed"
              desc="Automatic charge of $450.00 failed - Insufficient funds"
              tags={[
                { label: "Payment Event", color: "#DC2626", bg: "#FEF2F2" },
              ]}
              eventId="EVT-2024-001891"
              time="Dec 15, 2024 9:00 AM"
              user="System"
            />
            <TimelineItem
              icon={<CreditCard size={18} />}
              bgColor="#DBEAFE"
              iconColor="#2563EB"
              title="Payment Method Updated"
              desc="Credit card ending in 4242 updated by driver"
              tags={[
                { label: "Account Change", color: "#2563EB", bg: "#EFF6FF" },
              ]}
              eventId="EVT-2024-001890"
              time="Dec 10, 2024 3:30 PM"
              user="Michael Johnson"
            />
            <TimelineItem
              icon={<CheckCircle size={18} />}
              bgColor="#D1FAE5"
              iconColor="#059669"
              title="Payment Successful"
              desc="Monthly payment of $450.00 processed successfully"
              tags={[
                { label: "Payment Event", color: "#059669", bg: "#ECFDF5" },
              ]}
              eventId="EVT-2024-001889"
              time="Nov 15, 2024 9:00 AM"
              user="System"
            />
            <TimelineItem
              icon={<FileText size={18} />}
              bgColor="#F3E8FF"
              iconColor="#9333EA"
              title="Document Approved"
              desc="Driver licence document approved by admin review"
              tags={[
                { label: "Document Action", color: "#9333EA", bg: "#F5F3FF" },
              ]}
              eventId="EVT-2024-001888"
              time="Nov 8, 2024 2:15 PM"
              user="Sarah Admin"
            />
            <TimelineItem
              icon={<ShieldCheck size={18} />}
              bgColor="#D1FAE5"
              iconColor="#059669"
              title="KYC Verification Approved"
              desc="All KYC documents verified and approved"
              tags={[{ label: "KYC Event", color: "#059669", bg: "#ECFDF5" }]}
              eventId="EVT-2024-001887"
              time="Nov 8, 2024 2:20 PM"
              user="Sarah Admin"
            />
            <TimelineItem
              icon={<FileText size={18} />}
              bgColor="#DBEAFE"
              iconColor="#2563EB"
              title="Agreement Created"
              desc="New rental agreement AGR-2024-0156 created for Toyota Camry"
              tags={[
                { label: "Agreement Change", color: "#2563EB", bg: "#EFF6FF" },
              ]}
              eventId="EVT-2024-001886"
              time="Nov 5, 2024 10:00 AM"
              user="John Manager"
            />
            <TimelineItem
              icon={<User size={18} />}
              bgColor="#F3F4F6"
              iconColor={COLORS.TEXT_SECONDARY}
              title="Account Created"
              desc="Driver account created and activated"
              tags={[
                {
                  label: "Account Change",
                  color: COLORS.TEXT_SECONDARY,
                  bg: "#F3F4F6",
                },
              ]}
              eventId="EVT-2024-001885"
              time="Nov 1, 2024 9:30 AM"
              user="System"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NoteItem = ({
  author,
  time,
  priority,
  text,
  status,
  bgColor = "white",
}: any) => (
  <div
    style={{
      padding: "1rem",
      borderRadius: "12px",
      border: `1px solid ${COLORS.BORDER_MAIN}`,
      background: bgColor,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img
          src={
            author === "Sarah Admin"
              ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50"
              : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=50"
          }
          alt={author}
          style={{ width: "24px", height: "24px", borderRadius: "50%" }}
        />
        <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{author}</span>
        {priority && (
          <span
            style={{ fontSize: "0.65rem", color: "#DC2626", fontWeight: 700 }}
          >
            ! {priority}
          </span>
        )}
      </div>
      <span style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>
        {time}
      </span>
    </div>
    <p
      style={{
        fontSize: "0.85rem",
        color: COLORS.TEXT_MAIN,
        lineHeight: 1.5,
        marginBottom: status ? "0.75rem" : 0,
      }}
    >
      {text}
    </p>
    {status && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          color: "#B45309",
          fontSize: "0.7rem",
          fontWeight: 700,
        }}
      >
        <Clock size={12} /> {status}
      </div>
    )}
  </div>
);

const TimelineItem = ({
  icon,
  bgColor,
  iconColor,
  title,
  desc,
  tags,
  eventId,
  time,
  user,
}: any) => (
  <div
    style={{ display: "flex", gap: "1rem", position: "relative", zIndex: 1 }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: bgColor,
        color: iconColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        border: "4px solid white",
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}
      >
        <h4 style={{ fontSize: "0.9rem", fontWeight: 700 }}>{title}</h4>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>{time}</div>
          <div style={{ fontSize: "0.7rem", color: COLORS.TEXT_SECONDARY }}>
            by {user}
          </div>
        </div>
      </div>
      <p
        style={{
          fontSize: "0.85rem",
          color: COLORS.TEXT_SECONDARY,
          marginBottom: "0.75rem",
        }}
      >
        {desc}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {tags.map((tag: any, i: number) => (
          <span
            key={i}
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: tag.color,
              background: tag.bg,
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {tag.label}
          </span>
        ))}
        <span style={{ fontSize: "0.7rem", color: COLORS.TEXT_SECONDARY }}>
          Event ID: {eventId}
        </span>
      </div>
    </div>
  </div>
);

export default DriverAuditActivity;
