"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Plus,
  AlertTriangle,
  ExternalLink,
  Flag,
  FileText,
  Eye,
  PlusCircle,
  MessageCircle,
  Image,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import {
  InfoItem,
  StatusBadge,
  DetailCard,
  TimelineItem,
  ExposureItem,
  PaymentTimelineItem,
  EvidenceItem,
  NoteItem,
  StatementBox,
  ActionButton,
} from "./components/CaseDetailsComponents";

export default function CaseDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Disputes & Refunds");

  const tabs = [
    { name: "Rentals Management", path: "/rentals" },
    { name: "Agreements", path: "/rentals/agreements" },
    { name: "Disputes & Refunds", path: "/rentals/disputes" },
    { name: "Admin Notes & Audit", path: "/rentals/audit" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title="Case Details - DSP-2024-018" showBack={true} />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Disputes & Refunds", path: "/rentals/disputes" },
          { label: "Case Details" },
        ]}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Main Title Card */}
        <DetailCard
          style={{ padding: "1.5rem" }}
          headerStyle={{ marginBottom: "1.5rem", alignItems: "flex-start" }}
          title={
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: COLORS.ERROR_LIGHT,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.ERROR_MAIN,
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "0.25rem",
                  }}
                >
                  Dispute Case DSP-2024-018
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                  Late return fee dispute - Escalated to senior admin
                </p>
              </div>
            </div>
          }
          rightElement={
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
              }}
            >
              <StatusBadge
                text="Escalated"
                color={COLORS.ERROR_MAIN}
                background={COLORS.ERROR_LIGHT}
              />
              <StatusBadge
                text="52 hrs (Critical SLA)"
                color="#D97706"
                background="#FEF3C7"
              />
            </div>
          }
        >
          <div
            style={{
              height: "1px",
              background: "#F3F4F6",
              margin: "0 1.5rem 1.5rem -1.5rem",
              width: "calc(100% + 3rem)",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "2rem",
            }}
          >
            <InfoItem label="Rental ID" value="RNT-2024-145" isLink={true} />
            <InfoItem label="Agreement ID" value="AGR-2024-089" isLink={true} />
            <InfoItem label="Submitted By" value="John Doe (Driver)" />
            <InfoItem label="Submitted On" value="Jan 12, 2024 09:30 AM" />
            <InfoItem
              label="Disputed Amount"
              value="$1,250.00"
              color={COLORS.ERROR_MAIN}
            />
          </div>
        </DetailCard>

        {/* Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Linked Rental and Agreement Row */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              {/* Linked Rental Box */}
              <DetailCard
                title="Linked Rental"
                rightElement={
                  <ExternalLink
                    size={16}
                    color={COLORS.PRIMARY_MAIN}
                    style={{ cursor: "pointer" }}
                  />
                }
                gap="1rem"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <InfoItem label="Rental ID" value="RNT-2024-145" />
                  <InfoItem label="Vehicle" value="ABC-1234 (Toyota Camry)" />
                  <InfoItem label="Rental Period" value="Jan 1 - Jan 8, 2024" />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Return Status
                    </p>
                    <StatusBadge
                      text="Late (3 days)"
                      color={COLORS.ERROR_MAIN}
                      background={COLORS.ERROR_LIGHT}
                      style={{
                        alignSelf: "flex-start",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>
              </DetailCard>

              {/* Linked Agreement Box */}
              <DetailCard
                title="Linked Agreement"
                rightElement={
                  <ExternalLink
                    size={16}
                    color={COLORS.PRIMARY_MAIN}
                    style={{ cursor: "pointer" }}
                  />
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <InfoItem label="Agreement ID" value="AGR-2024-089" />
                  <InfoItem label="Agreement Type" value="Short-Term Rental" />
                  <InfoItem label="Driver" value="John Doe" />
                  <InfoItem label="Owner" value="Fleet Owner A" />
                </div>
              </DetailCard>
            </div>

            {/* Timeline of Events */}
            <DetailCard title="Timeline of Events">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <TimelineItem
                  icon={Flag}
                  iconBg={COLORS.ERROR_LIGHT}
                  iconColor={COLORS.ERROR_MAIN}
                  title="Case Escalated to Senior Admin"
                  time="Jan 14, 2024 11:00 AM"
                  description="Escalated by Admin Sarah Wilson due to high amount and SLA breach"
                />
                <TimelineItem
                  icon={FileText}
                  iconBg="#FEF3C7"
                  iconColor="#D97706"
                  title="Evidence Submitted by Driver"
                  time="Jan 13, 2024 03:45 PM"
                  description="GPS logs and communication screenshots uploaded"
                />
                <TimelineItem
                  icon={Eye}
                  iconBg={COLORS.INFO_LIGHT}
                  iconColor={COLORS.PRIMARY_MAIN}
                  title="Case Under Review"
                  time="Jan 12, 2024 02:15 PM"
                  description="Admin Mark Johnson assigned to review the case"
                />
                <TimelineItem
                  icon={PlusCircle}
                  iconBg="#F3F4F6"
                  iconColor="#6B7280"
                  title="Dispute Case Opened"
                  time="Jan 12, 2024 09:30 AM"
                  description="Driver John Doe submitted dispute for late return fees"
                />
              </div>
            </DetailCard>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Calculated Exposure Box */}
            <DetailCard title="Calculated Exposure">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <ExposureItem
                  label="Late Return Fee (3 days)"
                  value="$900.00"
                />
                <ExposureItem label="Outstanding Balance" value="$350.00" />
                <div
                  style={{
                    height: "1px",
                    background: "#F3F4F6",
                    margin: "0.5rem 0",
                  }}
                />
                <ExposureItem
                  label="Total Exposure"
                  value="$1,250.00"
                  isTotal={true}
                />
                <ExposureItem
                  label="Driver Disputed"
                  value="$1,250.00"
                  color="#D97706"
                />
              </div>
            </DetailCard>

            {/* Payment Timeline Box */}
            <DetailCard title="Payment Timeline">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <PaymentTimelineItem
                  label="Initial Deposit"
                  time="Jan 1, 2024"
                  statusText="Paid $500"
                  statusColor={COLORS.SUCCESS_MAIN}
                  statusBg="#D1FAE5"
                />
                <PaymentTimelineItem
                  label="Rental Fee (7 days)"
                  time="Jan 8, 2024"
                  statusText="Paid $700"
                  statusColor={COLORS.SUCCESS_MAIN}
                  statusBg="#D1FAE5"
                />
                <PaymentTimelineItem
                  label="Late Fee Invoice"
                  time="Jan 11, 2024"
                  statusText="Unpaid $900"
                  statusColor={COLORS.ERROR_MAIN}
                  statusBg={COLORS.ERROR_LIGHT}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        marginBottom: "0.15rem",
                      }}
                    >
                      Outstanding Balance
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                      Due immediately
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: COLORS.ERROR_MAIN,
                      background: COLORS.ERROR_LIGHT,
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    $350
                  </span>
                </div>
              </div>
            </DetailCard>
          </div>
        </div>

        {/* Evidence & Communications Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Evidence Attachments */}
          <DetailCard
            title="Evidence Attachments"
            rightElement={
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.PRIMARY_MAIN,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} /> Request More
              </span>
            }
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <EvidenceItem
                icon={FileText}
                iconBg="#E0F2FE"
                iconColor={COLORS.PRIMARY_MAIN}
                fileName="GPS_Tracking_Log.pdf"
                meta="Uploaded by Driver - 2.4 MB"
              />
              <EvidenceItem
                icon={Image}
                iconBg={COLORS.SUCCESS_LIGHT}
                iconColor={COLORS.SUCCESS_MAIN}
                fileName="Communication_Screenshots.zip"
                meta="Uploaded by Driver - 8.7 MB"
              />
              <EvidenceItem
                icon={FileText}
                iconBg="#FEF3C7"
                iconColor={COLORS.WARNING_MAIN}
                fileName="Vehicle_Condition_Report.pdf"
                meta="Uploaded by Owner - 1.2 MB"
              />
            </div>
          </DetailCard>

          {/* Internal Communications */}
          <DetailCard
            title="Internal Communications"
            rightElement={
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.PRIMARY_MAIN,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  cursor: "pointer",
                }}
              >
                <MessageCircle size={16} /> Add Note
              </span>
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <NoteItem
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                name="Sarah Wilson (Senior Admin)"
                note="This case needs immediate attention. The driver has provided solid evidence showing they attempted to return on time but the owner was unavailable."
                time="Jan 14, 2024 11:05 AM"
              />
              <NoteItem
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                name="Mark Johnson (Admin)"
                note="Reviewed GPS logs. Driver was at return location 30 minutes before agreed time. Will recommend partial refund."
                time="Jan 13, 2024 04:20 PM"
              />

              {/* Input for Note 3 */}
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                  alt="usr"
                />
                <div
                  style={{
                    background: "#F9FAFB",
                    padding: "0.85rem 1rem",
                    borderRadius: "8px",
                    flex: 1,
                    color: "#9CA3AF",
                    fontSize: "0.85rem",
                  }}
                >
                  Type your note...
                </div>
              </div>
            </div>
          </DetailCard>
        </div>

        {/* Statements Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <StatementBox
            title="Driver Statement"
            content='"I arrived at the agreed return location 30 minutes early on January 8th. I called the owner multiple times but received no answer. I waited for over 2 hours and sent several messages. I have GPS logs and call records to prove this. The late fee is unfair as I made every effort to return on time."'
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
            author="John Doe"
            time="Jan 12, 2024 09:30 AM"
          />

          <StatementBox
            title="Owner Statement"
            content='"The agreement clearly stated the return time. The driver did not coordinate properly and returned 3 days late. The vehicle was needed for another rental which I had to cancel. I expect full late fees to be paid as per the agreement terms."'
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
            author="Fleet Owner A"
            time="Jan 12, 2024 01:45 PM"
          />
        </div>

        {/* Resolution Actions Row */}
        <DetailCard title="Resolution Actions">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            <ActionButton
              icon={CheckCircle2}
              text="Approve Full Refund"
              background={COLORS.SUCCESS_MAIN}
            />
            <ActionButton
              icon={AlertCircle}
              text="Partial Refund"
              background={COLORS.WARNING_MAIN}
            />
            <ActionButton
              icon={XCircle}
              text="Reject Dispute"
              background={COLORS.ERROR_MAIN}
            />
            <ActionButton
              icon={Users}
              text="Request Mediation"
              background="#0EA5E9"
            />
          </div>
          <div
            style={{
              backgroundColor: "#f0f2f4",
              height: "1px",
              width: "100%",
              margin: "1.5rem 0",
            }}
          />
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "0.75rem",
            }}
          >
            Admin Resolution Notes
          </p>
          <div>
            <textarea
              placeholder="Enter detailed resolution notes, reasoning, and next steps"
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.8rem",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                background: "#F9FAFB",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1.5rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input type="checkbox" />
              <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                Notify parties
              </p>
              <span style={{ width: "1rem" }} />
              <input type="checkbox" />
              <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                Close case after action
              </p>
            </div>
            <button
              style={{
                background: COLORS.PRIMARY_MAIN,
                color: COLORS.BG_CARD,
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Submit Resolution
            </button>
          </div>
        </DetailCard>
      </div>
    </div>
  );
}
