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
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import StatusBadge from "@/components/StatusBadge";
import { ownersApi } from "@/services/api/owners";

const OWNERS_PAGE_LIMIT = 10;

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
  const [statsData, setStatsData] = useState<any>(null);
  const [ownersData, setOwnersData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

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
    } catch (err: any) {
      setError(err.message || "Failed to load owners data");
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
                  key={i}
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
                    <StatusBadge status={owner.compliance} />
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
                    <StatusBadge status={owner.status} />
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        color: COLORS.PRIMARY_MAIN,
                      }}
                    >
                      <Eye size={18} style={{ cursor: "pointer" }} />
                      <Edit2 size={18} style={{ cursor: "pointer" }} />
                      <MoreHorizontal
                        size={18}
                        style={{ cursor: "pointer", color: COLORS.TEXT_MUTED }}
                      />
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
