"use client";
import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Plus,
  Bell,
  ArrowLeft,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { profileApi } from "@/services/api/profile";

interface PageHeaderProps {
  title?: string | React.ReactNode;
  description?: string;
  showBack?: boolean;

  // Search
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  debounceTime?: number;

  // Actions
  onCreateClick?: () => void;
  createLabel?: string;
  customActions?: React.ReactNode;

  // Filters & Icons
  onFilterClick?: () => void;
  showFilter?: boolean;
  extraRightActions?: React.ReactNode;

  // Notifications
  showNotifications?: boolean;
  onNotificationClick?: () => void;
  hasNotification?: boolean;
  notificationCount?: number;

  // User
  userName?: string;
  userAvatar?: string;
  onProfileClick?: () => void;

  // Styling
  variant?: "light" | "dark";
}

export default function PageHeader({
  title,
  description,
  showBack = false,

  enableSearch = true,
  searchPlaceholder = "Search drivers, vehicles, agreements...",
  searchValue = "",
  onSearchChange,
  debounceTime = 300,

  onCreateClick,
  createLabel = "Create",
  customActions,

  onFilterClick,
  showFilter = false,
  extraRightActions,

  showNotifications = true,
  onNotificationClick,
  hasNotification = false,
  notificationCount,

  userName: initialUserName,
  userAvatar: initialUserAvatar,
  onProfileClick,

  variant = "light",
}: PageHeaderProps) {
  const router = useRouter();
  const [internalSearch, setInternalSearch] = useState(searchValue);

  // Dynamic user data states derived from API call
  const [liveUserName, setLiveUserName] = useState(initialUserName || "Admin");
  const [liveUserAvatar, setLiveUserAvatar] = useState(
    initialUserAvatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  );

  // Fetch real-time profile image and data exactly like the profile screen
  useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const response = await profileApi.getProfile();
        if (response?.data) {
          const data = response.data;

          // Construct Full Name if present
          if (data.firstName) {
            setLiveUserName(`${data.firstName} ${data.lastName || ""}`.trim());
          }

          // Set dynamic avatar url fallback sequence
          const avatarUrl = data.profileImage || data.avatar;
          if (avatarUrl) {
            setLiveUserAvatar(avatarUrl);
          }
        }
      } catch (error) {
        console.error("Failed to sync profile status to header:", error);
      }
    };

    fetchHeaderProfile();
  }, []);

  useEffect(() => {
    setInternalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange?.(internalSearch);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [internalSearch]);

  const isDark = variant === "dark";

  return (
    <div
      style={{
        ...container,
        background: isDark ? "#1F2937" : COLORS.BG_CARD,
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {showBack && (
          <button
            onClick={() => router.back()}
            style={{ ...backBtn, color: isDark ? "white" : "#6B7280" }}
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div>
          <h2 style={{ ...titleStyle, color: isDark ? "white" : "#111827" }}>
            {title}
          </h2>

          {description && (
            <p
              style={{
                fontSize: "0.76rem",
                color: isDark ? "rgba(255,255,255,0.6)" : "#6B7280",
                marginTop: "2px",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* SEARCH BAR */}
        {enableSearch && (
          <div
            style={{
              ...searchBox,
              background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6",
            }}
          >
            <SearchIcon size={18} style={{ color: "#9CA3AF" }} />

            <input
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                ...searchInput,
                color: isDark ? "white" : "#111827",
              }}
            />
          </div>
        )}

        {/* CUSTOM ACTIONS */}
        {customActions}

        {/* FILTER */}
        {showFilter && (
          <button onClick={onFilterClick} style={iconBtn}>
            <Filter size={18} />
          </button>
        )}

        {extraRightActions}

        {/* NOTIFICATION */}
        {showNotifications && (
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Bell
              size={20}
              onClick={
                onNotificationClick || (() => router.push("/notifications"))
              }
              style={{ color: isDark ? "white" : "#6B7280" }}
            />
          </div>
        )}

        {/* USER PROFILE WRAPPER */}
        <div
          onClick={onProfileClick || (() => router.push("/settings/profile"))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            cursor: "pointer",
          }}
          title={liveUserName}
        >
          <img src={liveUserAvatar} style={avatar} alt={liveUserName} />
        </div>
      </div>
    </div>
  );
}

/* Styles unchanged */
const container = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  margin: "0 -2rem",
  borderBottom: "1px solid #E5E7EB",
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
};

const titleStyle = {
  fontSize: "1.25rem",
  fontWeight: 700,
};

const backBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.55rem 1rem",
  width: "320px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
};

const searchInput = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: "0.85rem",
};

const iconBtn = {
  border: "1px solid #E5E7EB",
  background: "transparent",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
};

const avatar = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover" as const,
};
