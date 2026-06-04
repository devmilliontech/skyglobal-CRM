"use client";
import { COLORS } from "@/constants/Constant";

import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Filter,
  MoreVertical,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SideModal, { CreateUserFormData } from "@/components/SideModal";
import SelectField from "@/components/SelectField";
import { User, UserStats, usersApi } from "@/services/api/users";

type UserLastLogin = {
  date: string;
  time: string;
  ip?: string;
};

type RawUser = User & {
  id?: string | number;
  initials?: string;
  location?: string;
  security?: string;
  lastLogin?: UserLastLogin;
  isBlocked?: boolean;
};

type UserRow = RawUser & {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  location: string;
  security: string;
  lastLogin: UserLastLogin;
  status: "Active" | "Suspended";
};

type UsersPaginationPayload = {
  stats?: UserStats;
  users?: RawUser[];
  data?: RawUser[];
  pagination?: {
    total?: number;
    totalDocuments?: number;
    totalUsers?: number;
    page?: number;
    currentPage?: number;
    pages?: number;
    totalPages?: number;
  };
  total?: number;
  page?: number;
  pages?: number;
};

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trendColor?: string;
};

const usersDataFallback = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.j@irent.com",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=F3F4F6&color=4B5563",
    role: "Manager",
    location: "NY Branch (HQ)",
    security: "2FA Enabled",
    lastLogin: {
      date: "Oct 24, 2023",
      time: "10:42 AM",
      ip: "192.168.1.1",
    },
    status: "Active",
  },
  {
    id: 2,
    name: "Marcus Reed",
    email: "m.reed@irent.com",
    avatar:
      "https://ui-avatars.com/api/?name=Marcus+Reed&background=EBF5FF&color=3B82F6",
    initials: "MR",
    role: "Staff",
    location: "Chicago, IL",
    security: "2FA Pending",
    lastLogin: {
      date: "Oct 23, 2023",
      time: "04:15 PM",
      ip: "10.0.0.45",
    },
    status: "Active",
  },
  {
    id: 3,
    name: "David Chen",
    email: "d.chen@irent.com",
    avatar:
      "https://ui-avatars.com/api/?name=David+Chen&background=F3F4F6&color=4B5563",
    role: "Support",
    location: "Global Remote",
    security: "Disabled",
    lastLogin: {
      date: "Sep 12, 2023",
      time: "System Auto-logout",
      ip: "",
    },
    status: "Suspended",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    email: "e.rodriguez@irent.com",
    avatar:
      "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random",
    role: "Admin",
    location: "Miami Branch",
    security: "2FA Enabled",
    lastLogin: { date: "Oct 25, 2023", time: "09:00 AM", ip: "192.168.1.10" },
    status: "Active",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "j.wilson@irent.com",
    avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=random",
    role: "Staff",
    location: "Chicago, IL",
    security: "Disabled",
    lastLogin: { date: "Oct 24, 2023", time: "02:30 PM", ip: "10.0.0.50" },
    status: "Active",
  },
  {
    id: 6,
    name: "Aisha Patel",
    email: "a.patel@irent.com",
    avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=random",
    role: "Manager",
    location: "NY Branch (HQ)",
    security: "2FA Enabled",
    lastLogin: { date: "Oct 25, 2023", time: "11:15 AM", ip: "192.168.1.5" },
    status: "Active",
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "r.taylor@irent.com",
    avatar: "https://ui-avatars.com/api/?name=Robert+Taylor&background=random",
    role: "Support",
    location: "Global Remote",
    security: "2FA Pending",
    lastLogin: { date: "Oct 22, 2023", time: "05:45 PM", ip: "172.16.0.21" },
    status: "Suspended",
  },
  {
    id: 8,
    name: "Sophie Bennett",
    email: "s.bennett@irent.com",
    avatar: "https://ui-avatars.com/api/?name=Sophie+Bennett&background=random",
    role: "Staff",
    location: "Miami Branch",
    security: "Enabled",
    lastLogin: { date: "Oct 25, 2023", time: "10:05 AM", ip: "192.168.5.12" },
    status: "Active",
  },
  {
    id: 9,
    name: "Lucas Meyer",
    email: "l.meyer@irent.com",
    avatar: "https://ui-avatars.com/api/?name=Lucas+Meyer&background=random",
    role: "Manager",
    location: "Chicago, IL",
    security: "Disabled",
    lastLogin: { date: "Oct 24, 2023", time: "08:20 AM", ip: "10.0.0.33" },
    status: "Active",
  },
  {
    id: 10,
    name: "Chloe Dupont",
    email: "c.dupont@irent.com",
    avatar: "https://ui-avatars.com/api/?name=Chloe+Dupont&background=random",
    role: "Support",
    location: "Global Remote",
    security: "2FA Enabled",
    lastLogin: { date: "Oct 21, 2023", time: "12:00 PM", ip: "192.168.1.100" },
    status: "Active",
  },
];

const USERS_PAGE_LIMIT = 10;

const normalizePagination = (
  payload: UsersPaginationPayload,
  fallbackPage: number,
) => {
  const pagination = payload?.pagination || {};
  const total =
    pagination.total ??
    pagination.totalDocuments ??
    pagination.totalUsers ??
    payload?.total ??
    0;
  const page =
    pagination.page ??
    pagination.currentPage ??
    payload?.page ??
    fallbackPage;
  const pages =
    pagination.pages ??
    pagination.totalPages ??
    payload?.pages ??
    Math.max(1, Math.ceil(total / USERS_PAGE_LIMIT));

  return {
    total,
    page,
    pages: Math.max(1, pages || 1),
  };
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const maxVisible = 5;
  const safeTotalPages = Math.max(1, totalPages);
  const halfWindow = Math.floor(maxVisible / 2);
  const start = Math.max(
    1,
    Math.min(currentPage - halfWindow, safeTotalPages - maxVisible + 1),
  );
  const end = Math.min(safeTotalPages, start + maxVisible - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const normalizeUser = (user: RawUser, index: number): UserRow => {
  const email = user.email || "";
  const name =
    user.name ||
    (email.includes("@") ? email.split("@")[0] : email) ||
    "Unknown User";
  const role = user.role || "CUSTOMER";
  const rawStatus = String(user.status || "").toLowerCase();
  const isSuspended = rawStatus === "suspended" || user.isBlocked === true;

  return {
    ...user,
    id: user.id || user._id || index,
    name,
    email,
    avatar:
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F3F4F6&color=4B5563`,
    role,
    location: user.location || "N/A",
    security: user.security || "2FA Pending",
    lastLogin: user.lastLogin || { date: "Never logged in", time: "--", ip: "" },
    status: isSuspended ? "Suspended" : "Active",
  };
};

export default function UserManagementPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [accessEnabled, setAccessEnabled] = useState(false);
  const [accountStatus, setAccountStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<UserRow[]>([]);
  const [statsData, setStatsData] = useState<UserStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const fetchUsers = useCallback(async (currentPage = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await usersApi.getUsers({
        page: currentPage,
        limit: USERS_PAGE_LIMIT,
        search: search.trim() || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      if (response?.data) {
        const payload = response.data as UsersPaginationPayload;
        const users = payload.users ?? payload.data ?? [];
        const pagination = normalizePagination(payload, currentPage);
        setStatsData(payload.stats ?? null);
        setUsersData(users.map(normalizeUser));
        setTotal(pagination.total);
        setPage(pagination.page);
        setPages(pagination.pages);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users data");
      setUsersData((current) => current.length ? current : (usersDataFallback as unknown as UserRow[]));
      setTotal((current) => current || usersDataFallback.length);
      setPages((current) => current || 1);
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleCreateUser = async (formData: CreateUserFormData) => {
    await usersApi.createUser({
      email: formData.email,
      role: formData.role,
      status: formData.status,
    });
    await fetchUsers(page);
  };

  const router = useRouter();
  const visiblePages = getVisiblePages(page, pages);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <PageHeader
        title="User Management"
        searchPlaceholder="Search users by name or email..."
        searchValue={search}
        onSearchChange={setSearch}
        notificationCount={3}
      />

      <SideModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        accessEnabled={accessEnabled}
        setAccessEnabled={setAccessEnabled}
        accountStatus={accountStatus}
        setAccountStatus={setAccountStatus}
        onCreateUser={handleCreateUser}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "-0.5rem",
          marginBottom: "-1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6B7280",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Dashboard
          </p>
          <ChevronRight size={14} style={{ color: "#6B7280" }} />
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6B7280",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Users
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.75rem 1.5rem",
            background: COLORS.PRIMARY_MAIN,
            color: COLORS.BG_CARD,
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(13, 110, 253, 0.2)",
            transition: "all 0.2s",
            width: "fit-content",
          }}
        >
          <Plus size={18} />
          <span>Create User</span>
        </button>
      </div>

      {/* Stats Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
        }}
      >
        <StatCard
          label="Total Users"
          value={statsData?.totalUsers?.toLocaleString() ?? "1,248"}
          trend="+12% vs last month"
          icon={<Users size={20} />}
          iconBg="#EBF5FF"
          iconColor={COLORS.PRIMARY_MAIN}
        />
        <StatCard
          label="Active Users"
          value={statsData?.activeUsers?.toLocaleString() ?? "1,180"}
          trend="+8% vs last month"
          icon={<UserCheck size={20} />}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          trendColor="#16A34A"
        />
        <StatCard
          label="Suspended"
          value={statsData?.suspendedUsers?.toLocaleString() ?? "24"}
          trend="+2% vs last month"
          icon={<UserX size={20} />}
          iconBg="#FEF2F2"
          iconColor={COLORS.ERROR_MAIN}
          trendColor={COLORS.ERROR_MAIN}
        />
        <div className="card" style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: COLORS.TEXT_SECONDARY,
                fontWeight: 500,
              }}
            >
              Role Distribution
            </span>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            <RoleDistItem label="Super Admin" value={statsData?.roleDistribution?.superAdmin?.toString() ?? "4"} />
            <RoleDistItem label="Manager" value={statsData?.roleDistribution?.admin?.toString() ?? "32"} />
            <RoleDistItem label="Staff" value={statsData?.roleDistribution?.user?.toLocaleString() ?? "1,144"} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: "0" }}>
        {/* Table Header/Toolbar */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Platform Users
            </h2>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: COLORS.TEXT_MUTED,
                  }}
                />
                <input
                  type="text"
                  placeholder="Search name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "0.5rem 0.75rem 0.5rem 2.25rem",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.BORDER_MAIN}`,
                    fontSize: "0.85rem",
                    width: "240px",
                    outline: "none",
                    height: "36px",
                  }}
                />
              </div>

              {/* Role Filter */}
              <SelectField
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { label: "All Roles", value: "all" },
                  { label: "Admin", value: "ADMIN" },
                  { label: "Customer", value: "CUSTOMER" },
                  { label: "Driver", value: "DRIVER" },
                  { label: "Owner", value: "OWNER" },
                ]}
              />

              {/* Status Filter */}
              <SelectField
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Suspended", value: "suspended" },
                ]}
              />
              {/* Button */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0 1.25rem",
                  height: "36px",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  background: COLORS.BG_CARD,
                  color: COLORS.TEXT_MAIN,
                }}
              >
                More Filters
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: "1rem 1.5rem 0",
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              border: "1px solid #FECACA",
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: "0.85rem",
            }}
          >
            {error}{" "}
            <button
              onClick={() => fetchUsers(page)}
              style={{
                border: "none",
                background: "transparent",
                color: "#DC2626",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Table Body */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#F9FAFB" }}>
                <th style={tableHeaderStyle}>
                  <input type="checkbox" style={{ borderRadius: "4px" }} />
                </th>
                <th style={tableHeaderStyle}>User</th>
                <th style={tableHeaderStyle}>Role & Location</th>
                {/* <th style={tableHeaderStyle}>Security</th> */}
                <th style={tableHeaderStyle}>Last Login</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: COLORS.TEXT_MUTED,
                      fontSize: "0.85rem",
                    }}
                  >
                    Loading users...
                  </td>
                </tr>
              ) : usersData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: COLORS.TEXT_MUTED,
                      fontSize: "0.85rem",
                    }}
                  >
                    No users found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                usersData.map((user, index) => (
                  <tr
                    key={user.id || user._id || index}
                    style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
                  >
                    <td style={tableCellStyle}>
                      <input type="checkbox" style={{ borderRadius: "4px" }} />
                    </td>
                    <td style={tableCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "#F3F4F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#4B5563",
                          }}
                        >
                          {user.initials ? (
                            user.initials
                          ) : (
                            <img
                              src={user.avatar}
                              alt=""
                              style={{ width: "100%", height: "100%" }}
                            />
                          )}
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: COLORS.TEXT_MAIN,
                            }}
                          >
                            {user.name}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: COLORS.TEXT_MUTED,
                            }}
                          >
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: COLORS.TEXT_MAIN,
                          }}
                        >
                          {user.role}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            color: COLORS.TEXT_MUTED,
                          }}
                        >
                          <MapPin size={12} /> {user.location}
                        </div>
                      </div>
                    </td>
                    {/* <td style={tableCellStyle}>
                      <SecurityBadge status={user.security} />
                    </td> */}
                    <td style={tableCellStyle}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: COLORS.TEXT_MAIN,
                          }}
                        >
                          {user.lastLogin?.date ?? "Never logged in"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: COLORS.TEXT_MUTED,
                          }}
                        >
                          {user.lastLogin?.time ?? "--"}{" "}
                          {user.lastLogin?.ip && `• ${user.lastLogin.ip}`}
                        </span>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <StatusBadge status={user.status} />
                    </td>
                    <td style={tableCellStyle}>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: COLORS.TEXT_MUTED,
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
            Showing {total ? Math.min((page - 1) * USERS_PAGE_LIMIT + 1, total) : 0}
            -{Math.min(page * USERS_PAGE_LIMIT, total)} of {total.toLocaleString()} entries
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => fetchUsers(page - 1)}
              style={{
                ...paginationButtonStyle,
                cursor: page <= 1 || isLoading ? "not-allowed" : "pointer",
                opacity: page <= 1 || isLoading ? 0.5 : 1,
              }}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => fetchUsers(pageNumber)}
                disabled={isLoading}
                style={{
                  ...paginationButtonStyle,
                  background:
                    pageNumber === page ? COLORS.PRIMARY_MAIN : COLORS.BG_CARD,
                  color: pageNumber === page ? COLORS.BG_CARD : COLORS.TEXT_SECONDARY,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {pageNumber}
              </button>
            ))}
            <button
              disabled={page >= pages || isLoading}
              onClick={() => fetchUsers(page + 1)}
              style={{
                ...paginationButtonStyle,
                cursor: page >= pages || isLoading ? "not-allowed" : "pointer",
                opacity: page >= pages || isLoading ? 0.5 : 1,
              }}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon,
  iconBg,
  iconColor,
  trendColor,
}: StatCardProps) {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: iconBg,
            color: iconColor,
          }}
        >
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: trendColor || "#16A34A",
            fontWeight: 500,
          }}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}

function RoleDistItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.8rem",
      }}
    >
      <span style={{ color: COLORS.TEXT_MUTED }}>{label}</span>
      <span style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>{value}</span>
    </div>
  );
}

// function SecurityBadge({ status }: { status: string }) {
//   let bg = "#F3F4F6";
//   let color = "#4B5563";
//   let icon = null;

//   if (status === "2FA Enabled") {
//     bg = "#F0FDF4";
//     color = "#16A34A";
//   } else if (status === "2FA Pending") {
//     bg = "#FFF7ED";
//     color = "#D97706";
//   } else if (status === "Disabled") {
//     bg = "#F3F4F6";
//     color = "#9CA3AF";
//     icon = <ShieldCheck size={12} style={{ opacity: 0.5 }} />;
//   }

//   return (
//     <div
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: "0.4rem",
//         padding: "0.25rem 0.75rem",
//         borderRadius: "9999px",
//         backgroundColor: bg,
//         color: color,
//         fontSize: "0.7rem",
//         fontWeight: 600,
//       }}
//     >
//       {icon}
//       {status}
//     </div>
//   );
// }

function StatusBadge({ status }: { status: string }) {
  let dotColor = COLORS.SUCCESS_MAIN;
  let textColor = COLORS.SUCCESS_MAIN;

  if (status === "Active") {
    dotColor = COLORS.SUCCESS_MAIN;
    textColor = "#059669";
  } else if (status === "Suspended") {
    dotColor = COLORS.ERROR_MAIN;
    textColor = "#DC2626";
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: textColor,
      }}
    >
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotColor,
        }}
      />
      {status}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: COLORS.TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.025em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  verticalAlign: "middle",
};

const paginationButtonStyle: React.CSSProperties = {
  minWidth: "32px",
  height: "32px",
  padding: "0 10px",
  borderRadius: "6px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  background: COLORS.BG_CARD,
  color: COLORS.TEXT_SECONDARY,
  fontSize: "0.85rem",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
