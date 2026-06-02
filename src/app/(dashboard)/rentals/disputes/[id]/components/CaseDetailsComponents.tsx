import { COLORS } from "@/constants/Constant";
import React from "react";
import { LucideIcon, Download } from "lucide-react";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  isLink?: boolean;
  color?: string;
  valueStyle?: React.CSSProperties;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  isLink = false,
  color = "#111827",
  valueStyle = {},
}) => (
  <div>
    <p
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#6B7280",
        marginBottom: "0.25rem",
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: "0.85rem",
        fontWeight: 600,
        color: isLink ? "#2563EB" : color,
        cursor: isLink ? "pointer" : "default",
        ...valueStyle,
      }}
    >
      {value}
    </p>
  </div>
);

interface StatusBadgeProps {
  text: string;
  color: string;
  background: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  color,
  background,
  style = {},
}) => (
  <span
    style={{
      background,
      color,
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      ...style,
    }}
  >
    {text}
  </span>
);

interface DetailCardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  gap?: string;
}

export const DetailCard: React.FC<DetailCardProps> = ({
  title,
  children,
  rightElement,
  style = {},
  headerStyle = {},
  gap,
}) => (
  <div
    style={{
      background: COLORS.BG_CARD,
      padding: "1.5rem",
      borderRadius: "12px",
      border: "1px solid #E5E7EB",
      display: "flex",
      flexDirection: "column",
      gap: gap,
      ...style,
    }}
  >
    {(title || rightElement) && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          ...headerStyle,
        }}
      >
        {title &&
          (typeof title === "string" ? (
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {title}
            </h4>
          ) : (
            title
          ))}
        {rightElement}
      </div>
    )}
    {children}
  </div>
);

interface TimelineItemProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
  description: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  time,
  description,
}) => (
  <div style={{ display: "flex", gap: "1rem" }}>
    <div
      style={{
        background: iconBg,
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: iconColor,
        flexShrink: 0,
      }}
    >
      <Icon size={16} />
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.25rem",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {title}
        </p>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{time}</span>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>{description}</p>
    </div>
  </div>
);

interface ExposureItemProps {
  label: string;
  value: string;
  isTotal?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

export const ExposureItem: React.FC<ExposureItemProps> = ({
  label,
  value,
  isTotal = false,
  color = "#111827",
  style = {},
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", ...style }}>
    <p
      style={{
        fontSize: "0.85rem",
        fontWeight: isTotal ? 700 : 400,
        color: isTotal ? "#111827" : "#6B7280",
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: "0.85rem",
        fontWeight: isTotal ? 700 : 600,
        color: isTotal ? "#EF4444" : color,
      }}
    >
      {value}
    </p>
  </div>
);

interface PaymentTimelineItemProps {
  label: string;
  time: string;
  statusText: string;
  statusColor: string;
  statusBg: string;
}

export const PaymentTimelineItem: React.FC<PaymentTimelineItemProps> = ({
  label,
  time,
  statusText,
  statusColor,
  statusBg,
}) => (
  <>
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
          {label}
        </p>
        <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{time}</p>
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: statusColor,
          background: statusBg,
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        {statusText}
      </span>
    </div>
  </>
);

interface EvidenceItemProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  fileName: string;
  meta: string;
  onDownload?: () => void;
}

export const EvidenceItem: React.FC<EvidenceItemProps> = ({
  icon: Icon,
  iconBg,
  iconColor,
  fileName,
  meta,
  onDownload,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#F9FAFB",
      padding: "1rem",
      borderRadius: "8px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div
        style={{
          background: iconBg,
          color: iconColor,
          padding: "0.5rem",
          borderRadius: "6px",
        }}
      >
        <Icon size={20} />
      </div>
      <div>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {fileName}
        </p>
        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{meta}</p>
      </div>
    </div>
    <Download
      size={18}
      color={COLORS.PRIMARY_MAIN}
      style={{ cursor: "pointer" }}
      onClick={onDownload}
    />
  </div>
);

interface NoteItemProps {
  avatar: string;
  name: string;
  note: string;
  time: string;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  avatar,
  name,
  note,
  time,
}) => (
  <div style={{ display: "flex", gap: "1rem" }}>
    <img
      src={avatar}
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
        padding: "1rem",
        borderRadius: "8px",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {name}
        </p>
      </div>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#4B5563",
          marginBottom: "0.5rem",
        }}
      >
        {note}
      </p>
      <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{time}</p>
    </div>
  </div>
);

interface StatementBoxProps {
  title: string;
  content: string;
  avatar: string;
  author: string;
  time: string;
}

export const StatementBox: React.FC<StatementBoxProps> = ({
  title,
  content,
  avatar,
  author,
  time,
}) => (
  <div
    style={{
      background: COLORS.BG_CARD,
      padding: "1.5rem",
      borderRadius: "12px",
      border: "1px solid #E5E7EB",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    }}
  >
    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
      {title}
    </h4>
    <div
      style={{
        background: "#F9FAFB",
        padding: "1.25rem",
        borderRadius: "8px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          color: "#4B5563",
          lineHeight: "1.5",
        }}
      >
        {content}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "1.5rem",
        }}
      >
        <img
          src={avatar}
          style={{ width: "24px", height: "24px", borderRadius: "50%" }}
          alt="usr"
        />
        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
          {author} - {time}
        </p>
      </div>
    </div>
  </div>
);

interface ActionButtonProps {
  icon: LucideIcon;
  text: string;
  background: string;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  text,
  background,
  onClick,
}) => (
  <button
    style={{
      background,
      color: COLORS.BG_CARD,
      padding: "0.85rem",
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
    onClick={onClick}
  >
    <Icon size={18} /> {text}
  </button>
);
