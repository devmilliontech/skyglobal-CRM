"use client";

import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  CheckCircle2,
  Car,
  AlertTriangle,
  Download,
  Filter,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit2,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import StatusBadge from "@/components/StatusBadge";
import {
  ownersApi,
  type Owner,
  type OwnerReview,
  type OwnerStats,
  type OwnerUpdateRequest,
} from "@/services/api/owners";

const OWNERS_PAGE_LIMIT = 10;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const safeTotalPages = Math.max(1, totalPages);
  const maxVisible = 5;
  const halfWindow = Math.floor(maxVisible / 2);
  const start = Math.max(
    1,
    Math.min(currentPage - halfWindow, safeTotalPages - maxVisible + 1),
  );
  const end = Math.min(safeTotalPages, start + maxVisible - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export default function OwnersManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [vehicleCountFilter, setVehicleCountFilter] = useState("Vehicle Count");
  const [complianceFilter, setComplianceFilter] = useState("Compliance");
  const [dateJoined, setDateJoined] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<OwnerStats | null>(null);
  const [ownersData, setOwnersData] = useState<Owner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [reviewOwner, setReviewOwner] = useState<OwnerReview | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [editOwner, setEditOwner] = useState<Owner | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    complianceStatus: "Compliant",
  });
  const [isSavingOwner, setIsSavingOwner] = useState(false);
  const [deletingOwnerId, setDeletingOwnerId] = useState<string | null>(null);

  const fetchOwners = useCallback(async (currentPage = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ownersApi.getOwnersDashboard({
        page: currentPage,
        limit: OWNERS_PAGE_LIMIT,
        search: search.trim() || undefined,
        status: statusFilter,
        vehicleCount: vehicleCountFilter,
        compliance: complianceFilter,
        dateJoined: dateJoined || undefined,
      });

      if (response?.data) {
        const pagination = response.data.pagination || {};
        setStatsData(response.data.stats);
        setOwnersData(response.data.owners || []);
        setTotal(pagination.total ?? 0);
        setPage(pagination.page ?? currentPage);
        setPages(Math.max(1, pagination.pages ?? 1));
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load owners data"));
      setStatsData(null);
      setOwnersData([]);
      setTotal(0);
      setPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, vehicleCountFilter, complianceFilter, dateJoined]);

  useEffect(() => {
    fetchOwners(1);
  }, [fetchOwners]);

  const handleApplyFilters = () => fetchOwners(1);

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setVehicleCountFilter("Vehicle Count");
    setComplianceFilter("Compliance");
    setDateJoined("");
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pages || nextPage === page) return;
    fetchOwners(nextPage);
  };

  const getOwnerActionId = (owner: Owner) => owner._id || owner.id || "";

  const handleReviewOwner = async (owner: Owner) => {
    const ownerId = getOwnerActionId(owner);
    if (!ownerId) {
      setActionError("Owner id is missing. Unable to review this owner.");
      return;
    }

    setIsReviewOpen(true);
    setReviewOwner(null);
    setActionError(null);
    setIsReviewLoading(true);

    try {
      const response = await ownersApi.reviewOwner(ownerId);
      setReviewOwner(response.data);
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to load owner review"));
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleEditOwner = async (owner: Owner) => {
    const ownerId = getOwnerActionId(owner);
    if (!ownerId) {
      setActionError("Owner id is missing. Unable to edit this owner.");
      return;
    }

    setActionError(null);

    try {
      const response = await ownersApi.reviewOwner(ownerId);
      const latestOwner = response.data;
      setEditOwner(latestOwner);
      setEditForm({
        name: latestOwner.name || "",
        email: latestOwner.email || "",
        phone: latestOwner.phone || "",
        status: latestOwner.status || "Active",
        complianceStatus: latestOwner.compliance || "Compliant",
      });
    } catch {
      setEditOwner(owner);
      setEditForm({
        name: owner.name || "",
        email: owner.email || "",
        phone: owner.phone || "",
        status: owner.status || "Active",
        complianceStatus: owner.compliance || "Compliant",
      });
    }
  };

  const handleUpdateOwner = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editOwner || isSavingOwner) return;

    const ownerId = getOwnerActionId(editOwner);
    if (!ownerId) {
      setActionError("Owner id is missing. Unable to save changes.");
      return;
    }

    const payload: OwnerUpdateRequest = {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      status: editForm.status,
      complianceStatus: editForm.complianceStatus,
    };

    try {
      setIsSavingOwner(true);
      setActionError(null);
      await ownersApi.updateOwner(ownerId, payload);
      setEditOwner(null);
      await fetchOwners(page);
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to update owner"));
    } finally {
      setIsSavingOwner(false);
    }
  };

  const handleDeleteOwner = async (owner: Owner) => {
    const ownerId = getOwnerActionId(owner);
    if (!ownerId) {
      setActionError("Owner id is missing. Unable to delete this owner.");
      return;
    }

    const ownerName = owner.name || owner.email || owner.id || "this owner";
    const confirmed = window.confirm(
      `Delete ${ownerName}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingOwnerId(ownerId);
      setActionError(null);
      await ownersApi.deleteOwner(ownerId);
      const nextPage = ownersData.length === 1 && page > 1 ? page - 1 : page;
      await fetchOwners(nextPage);
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to delete owner"));
    } finally {
      setDeletingOwnerId(null);
    }
  };

  const visiblePages = getVisiblePages(page, pages);

  const stats = [
    {
      title: "Total Owners",
      value: statsData?.totalOwners?.toLocaleString() ?? "—",
      icon: <Users size={20} />,
      iconBg: "#EEF2FF",
      iconColor: "#4F46E5",
    },
    {
      title: "Active Owners",
      value: statsData?.activeOwners?.toLocaleString() ?? "—",
      icon: <CheckCircle2 size={20} />,
      iconBg: "#F0FDF4",
      iconColor: COLORS.SUCCESS_MAIN,
    },
    {
      title: "Vehicles Owned",
      value: statsData?.totalVehicles?.toLocaleString() ?? "—",
      icon: <Car size={20} />,
      iconBg: COLORS.INFO_LIGHT,
      iconColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "Compliance Issues",
      value: statsData?.complianceIssues?.toLocaleString() ?? "—",
      icon: <AlertTriangle size={20} />,
      iconBg: "#FEF2F2",
      iconColor: COLORS.ERROR_MAIN,
    },
  ];

  const inputStyle = {
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
    background: "#F9FAFB",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Owners Management"
        notificationCount={5}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search owners by name or email..."
        createLabel="Add Owner"
      />

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: COLORS.SECONDARY_MAIN,
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          Dashboard
        </p>
        <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
        <p
          style={{
            fontSize: "0.75rem",
            color: COLORS.SECONDARY_MAIN,
            fontWeight: 700,
          }}
        >
          Owners
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
        }}
      >
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Filters Card */}
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "180px" }}>
            <SelectField
              options={[
                { label: "All Status", value: "All Status" },
                { label: "Active", value: "Active" },
                { label: "Suspended", value: "Suspended" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div style={{ width: "180px" }}>
            <SelectField
              options={[
                { label: "Vehicle Count", value: "Vehicle Count" },
                { label: "1-5", value: "1-5" },
                { label: "6-15", value: "6-15" },
                { label: "16+", value: "16+" },
              ]}
              value={vehicleCountFilter}
              onChange={(e) => setVehicleCountFilter(e.target.value)}
            />
          </div>
          <div style={{ width: "180px" }}>
            <SelectField
              options={[
                { label: "Compliance", value: "Compliance" },
                { label: "All Compliant", value: "All Compliant" },
                { label: "Has Issues", value: "Has Issues" },
                { label: "Expiring Soon", value: "Expiring Soon" },
              ]}
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
            />
          </div>
          <div style={{ width: "180px" }}>
            <input
              type="date"
              value={dateJoined}
              onChange={(e) => setDateJoined(e.target.value)}
              style={inputStyle}
              placeholder="mm/dd/yyyy"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleApplyFilters}
            disabled={isLoading}
            style={{ padding: "0.6rem 1.5rem" }}
          >
            Apply Filters
          </Button>
          <button
            onClick={handleResetFilters}
            style={{
              fontSize: "0.85rem",
              color: COLORS.SECONDARY_MAIN,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              borderWidth: "1px",
              borderColor: COLORS.BORDER_MAIN,
              borderStyle: "solid",
              borderRadius: "8px",
              padding: "0.6rem 1.5rem",
              background: COLORS.BG_CARD,
            }}
          >
            Reset
          </button>
        </div>
      </Card>

      {/* Table Card */}
      <Card padding="0">
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Owners Directory
          </h3>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="outline" size="sm">
              <Download size={16} />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter size={16} />
              Filter
            </Button>
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
              onClick={() => fetchOwners(page)}
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

        {actionError && (
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
            {actionError}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#F9FAFB",
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                }}
              >
                {[
                  "OWNER",
                  "CONTACT",
                  "VEHICLES",
                  "ACTIVE LISTINGS",
                  "COMPLIANCE",
                  "REVENUE",
                  "STATUS",
                  "ACTIONS",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_SECONDARY,
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: COLORS.TEXT_MUTED,
                      fontSize: "0.85rem",
                    }}
                  >
                    Loading owners...
                  </td>
                </tr>
              ) : ownersData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: COLORS.TEXT_MUTED,
                      fontSize: "0.85rem",
                    }}
                  >
                    No owners found. Try adjusting your filters.
                  </td>
                </tr>
              ) : ownersData.map((owner, i) => (
                <tr
                  key={owner._id || owner.id || i}
                  style={{
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F9FAFB")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <img
                        src={owner.avatar}
                        alt={owner.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: COLORS.TEXT_MAIN,
                          }}
                        >
                          {owner.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: COLORS.TEXT_MUTED,
                          }}
                        >
                          ID: {owner.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <p
                        style={{ fontSize: "0.85rem", color: COLORS.TEXT_MAIN }}
                      >
                        {owner.email}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {owner.phone}
                      </p>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {owner.vehicles}
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {owner.activeListings}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <StatusBadge status={owner.compliance || "--"} />
                  </td>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                    }}
                  >
                    {owner.revenue}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <StatusBadge status={owner.status || "--"} />
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleReviewOwner(owner)}
                        style={{
                          ...actionButtonStyle,
                          color: COLORS.PRIMARY_MAIN,
                        }}
                        aria-label={`Review ${owner.name || "owner"}`}
                        title="Review"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditOwner(owner)}
                        style={{
                          ...actionButtonStyle,
                          color: COLORS.PRIMARY_MAIN,
                        }}
                        aria-label={`Edit ${owner.name || "owner"}`}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        disabled={deletingOwnerId === getOwnerActionId(owner)}
                        onClick={() => handleDeleteOwner(owner)}
                        style={{
                          ...actionButtonStyle,
                          color:
                            deletingOwnerId === getOwnerActionId(owner)
                              ? COLORS.GRAY_400
                              : COLORS.ERROR_MAIN,
                          cursor:
                            deletingOwnerId === getOwnerActionId(owner)
                              ? "not-allowed"
                              : "pointer",
                        }}
                        aria-label={`Delete ${owner.name || "owner"}`}
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            Showing {total ? Math.min((page - 1) * OWNERS_PAGE_LIMIT + 1, total) : 0}
            -{Math.min(page * OWNERS_PAGE_LIMIT, total)} of {total.toLocaleString()} owners
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => handlePageChange(page - 1)}
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
                disabled={isLoading}
                onClick={() => handlePageChange(pageNumber)}
                style={{
                  ...paginationButtonStyle,
                  background: pageNumber === page ? COLORS.PRIMARY_MAIN : COLORS.BG_CARD,
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
              onClick={() => handlePageChange(page + 1)}
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
      </Card>

      {isReviewOpen && (
        <OwnerActionModal
          title="Review Owner"
          subtitle="Owner profile, account status, and platform summary"
          onClose={() => {
            setIsReviewOpen(false);
            setReviewOwner(null);
          }}
        >
          {isReviewLoading ? (
            <p style={modalMutedTextStyle}>Loading owner review...</p>
          ) : reviewOwner ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <img
                  src={reviewOwner.avatar}
                  alt={reviewOwner.name || "Owner"}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ fontWeight: 800, color: COLORS.TEXT_MAIN }}>
                    {reviewOwner.name || "Owner"}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                    ID: {reviewOwner.id || reviewOwner._id}
                  </p>
                </div>
              </div>

              <div style={modalGridStyle}>
                <InfoItem label="Email" value={reviewOwner.email || "--"} />
                <InfoItem label="Phone" value={reviewOwner.phone || "--"} />
                <InfoItem label="Status" value={reviewOwner.status || "--"} />
                <InfoItem
                  label="Compliance"
                  value={reviewOwner.compliance || "--"}
                />
                <InfoItem
                  label="Vehicles"
                  value={String(reviewOwner.vehicles ?? 0)}
                />
                <InfoItem
                  label="Active Listings"
                  value={String(reviewOwner.activeListings ?? 0)}
                />
                <InfoItem label="Revenue" value={reviewOwner.revenue || "--"} />
                <InfoItem label="Joined" value={reviewOwner.joinDate || "--"} />
              </div>
            </div>
          ) : (
            <p style={modalMutedTextStyle}>
              No owner details were returned for review.
            </p>
          )}
        </OwnerActionModal>
      )}

      {editOwner && (
        <OwnerActionModal
          title="Edit Owner"
          subtitle={editOwner.id ? `ID: ${editOwner.id}` : undefined}
          onClose={() => setEditOwner(null)}
        >
          <form
            onSubmit={handleUpdateOwner}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextInput
              label="Owner Name"
              value={editForm.name}
              onChange={(value) =>
                setEditForm((current) => ({ ...current, name: value }))
              }
              required
            />
            <TextInput
              label="Email"
              value={editForm.email}
              onChange={(value) =>
                setEditForm((current) => ({ ...current, email: value }))
              }
              type="email"
              required
            />
            <TextInput
              label="Phone"
              value={editForm.phone}
              onChange={(value) =>
                setEditForm((current) => ({ ...current, phone: value }))
              }
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <SelectInput
                label="Status"
                value={editForm.status}
                onChange={(value) =>
                  setEditForm((current) => ({ ...current, status: value }))
                }
                options={["Active", "Suspended"]}
              />
              <SelectInput
                label="Compliance"
                value={editForm.complianceStatus}
                onChange={(value) =>
                  setEditForm((current) => ({
                    ...current,
                    complianceStatus: value,
                  }))
                }
                options={["Compliant", "Has Issues", "Expiring Soon"]}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
              }}
            >
              <Button
                variant="secondary"
                type="button"
                onClick={() => setEditOwner(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingOwner}>
                {isSavingOwner ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </OwnerActionModal>
      )}
    </div>
  );
}

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

const actionButtonStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  border: "none",
  background: "transparent",
  borderRadius: "6px",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.35)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 1000,
};

const modalPanelStyle: React.CSSProperties = {
  width: "460px",
  maxWidth: "100vw",
  height: "100vh",
  background: COLORS.BG_CARD,
  boxShadow: "-12px 0 32px rgba(15, 23, 42, 0.16)",
  display: "flex",
  flexDirection: "column",
};

const modalHeaderStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
};

const modalBodyStyle: React.CSSProperties = {
  padding: "1.5rem",
  overflowY: "auto",
  flex: 1,
};

const modalGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.85rem",
};

const modalMutedTextStyle: React.CSSProperties = {
  color: COLORS.TEXT_SECONDARY,
  fontSize: "0.9rem",
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: COLORS.TEXT_SECONDARY,
  marginBottom: "0.35rem",
};

const fieldControlStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  borderRadius: "8px",
  padding: "0.65rem 0.75rem",
  fontSize: "0.9rem",
  color: COLORS.TEXT_MAIN,
  background: COLORS.BG_CARD,
  outline: "none",
};

function OwnerActionModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={modalOverlayStyle}>
      <section style={modalPanelStyle} aria-modal="true" role="dialog">
        <div style={modalHeaderStyle}>
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.25rem",
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: "0.8rem", color: COLORS.TEXT_SECONDARY }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...actionButtonStyle,
              color: COLORS.TEXT_SECONDARY,
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div style={modalBodyStyle}>{children}</div>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: `1px solid ${COLORS.BORDER_MAIN}`,
        borderRadius: "8px",
        padding: "0.75rem",
        background: "#F9FAFB",
      }}
    >
      <p style={{ fontSize: "0.72rem", color: COLORS.TEXT_SECONDARY }}>
        {label}
      </p>
      <p
        style={{
          fontSize: "0.86rem",
          fontWeight: 700,
          color: COLORS.TEXT_MAIN,
          marginTop: "0.2rem",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span style={fieldLabelStyle}>{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={fieldControlStyle}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span style={fieldLabelStyle}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={fieldControlStyle}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
