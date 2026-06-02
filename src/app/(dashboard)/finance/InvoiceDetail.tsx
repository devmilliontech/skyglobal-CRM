"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  Printer,
  FileText,
  Clock,
  CreditCard,
  User,
  History,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

interface InvoiceDetailProps {
  invoice: any;
  onBack: () => void;
}

export default function InvoiceDetail({ invoice, onBack }: InvoiceDetailProps) {
  const lineItems = [
    {
      description: "Weekly Vehicle Rental - Toyota Camry (ABC-123)",
      qty: 1,
      rate: 450.0,
      total: 450.0,
    },
    {
      description: "Insurance Premium - Standard Coverage",
      qty: 1,
      rate: 50.0,
      total: 50.0,
    },
    { description: "Late Payment Fee", qty: 1, rate: 25.0, total: 25.0 },
  ];

  const total = lineItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header with Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button variant="outline" size="md" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Invoices
          </Button>
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Invoice {invoice.id}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "2px",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: COLORS.TEXT_MUTED }}>
                Issued on {invoice.issueDate}
              </span>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: COLORS.BORDER_MAIN,
                }}
              />
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            variant="outline"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Download size={16} />
            <span>Download PDF</span>
          </Button>
          <Button
            variant="outline"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Mail size={16} />
            <span>Send to Email</span>
          </Button>
          <Button
            variant="primary"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <CheckCircle2 size={16} />
            <span>Register Payment</span>
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Customer & Info Card */}
          <Card style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "1rem",
                    color: COLORS.TEXT_MUTED,
                  }}
                >
                  <User size={16} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Customer Details
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                  }}
                >
                  {invoice.customer}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginTop: "4px",
                  }}
                >
                  {invoice.email}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: COLORS.TEXT_SECONDARY,
                    marginTop: "4px",
                  }}
                >
                  123 Queen Street, Auckland CBD
                  <br />
                  New Zealand, 1010
                </p>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "1rem",
                    color: COLORS.TEXT_MUTED,
                  }}
                >
                  <FileText size={16} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Invoice Information
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <InfoRow label="Due Date" value={invoice.dueDate} />
                  <InfoRow
                    label="Payment Method"
                    value="Bank Transfer / Card"
                  />
                  <InfoRow
                    label="Agreement Reference"
                    value={invoice.agreement}
                    color={COLORS.PRIMARY_MAIN}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Line Items Card */}
          <Card style={{ padding: "0" }}>
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                Invoice Items
              </h3>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.BG_PAGE }}>
                  <th style={tableHeaderStyle}>Description</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>
                    Qty
                  </th>
                  <th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                    Rate
                  </th>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      textAlign: "right",
                      paddingRight: "1.5rem",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
                  >
                    <td style={tableCellStyle}>{item.description}</td>
                    <td style={{ ...tableCellStyle, textAlign: "center" }}>
                      {item.qty}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: "right" }}>
                      ${item.rate.toFixed(2)}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign: "right",
                        paddingRight: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "240px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: COLORS.TEXT_SECONDARY }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>
                    ${(total * 0.85).toFixed(2)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: COLORS.TEXT_SECONDARY }}>
                    GST (15%)
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    ${(total * 0.15).toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    Total Amount
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: COLORS.TEXT_MAIN,
                    }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Quick Actions Card */}
          <Card style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
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
              <Button
                variant="outline"
                style={{ justifyContent: "flex-start", gap: "10px" }}
              >
                <Edit size={16} /> Edit Invoice Details
              </Button>
              <Button
                variant="outline"
                style={{ justifyContent: "flex-start", gap: "10px" }}
              >
                <Printer size={16} /> Print Invoice
              </Button>
              <Button
                variant="outline"
                style={{
                  justifyContent: "flex-start",
                  gap: "10px",
                  color: COLORS.ERROR_MAIN,
                }}
              >
                <Trash2 size={16} /> Void Invoice
              </Button>
            </div>
          </Card>

          {/* Activity Log Card */}
          <Card style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1.25rem",
              }}
            >
              <History size={18} color={COLORS.TEXT_MUTED} />
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
                Activity Log
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <ActivityItem
                date="Apr 05, 2024"
                time="14:30"
                user="Admin"
                action="Invoice was created"
              />
              <ActivityItem
                date="Apr 05, 2024"
                time="14:35"
                user="System"
                action="Sent to customer via email"
              />
              <ActivityItem
                date="Apr 06, 2024"
                time="09:12"
                user="Customer"
                action="Viewed invoice via link"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
      {label}
    </span>
    <span
      style={{
        fontSize: "0.85rem",
        fontWeight: 600,
        color: color || COLORS.TEXT_MAIN,
      }}
    >
      {value}
    </span>
  </div>
);

const ActivityItem = ({
  date,
  time,
  user,
  action,
}: {
  date: string;
  time: string;
  user: string;
  action: string;
}) => (
  <div style={{ display: "flex", gap: "12px" }}>
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: COLORS.PRIMARY_MAIN,
        }}
      />
      <div
        style={{
          width: "2px",
          flex: 1,
          background: COLORS.BORDER_MAIN,
          margin: "4px 0",
        }}
      />
    </div>
    <div style={{ paddingBottom: "4px" }}>
      <p
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: COLORS.TEXT_MAIN,
        }}
      >
        {action}
      </p>
      <p style={{ fontSize: "0.75rem", color: COLORS.TEXT_MUTED }}>
        {date} at {time} by {user}
      </p>
    </div>
  </div>
);

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  textAlign: "left",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  fontSize: "0.9rem",
  color: COLORS.TEXT_MAIN,
};
