"use client";
import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Home,
  Calendar,
  Shield,
  Eye,
  MoreVertical,
  Download,
  Filter,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import SelectField from "@/components/SelectField";
import { rentalsApi } from "@/services/api/rentals";

// Reusable Stat Card
const StatCard = ({ stat }: any) => (
  <div
    className="card"
    style={{
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      backgroundColor: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#6B7280",
            marginBottom: "0.5rem",
          }}
        >
          {stat.title}
        </p>
        <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          {stat.value}
        </p>
      </div>
      <div
        style={{
          color: stat.iconColor,
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {stat.icon}
      </div>
    </div>
  </div>
);

export default function AgreementsManagement() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreementStats, setAgreementStats] = useState<any>(null);
  const [agreementsData, setAgreementsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await rentalsApi.getAgreements({ search });
        if (response?.data) {
           setAgreementStats(response.data.stats);
           if (response.data.agreements) {
              const mapped = response.data.agreements.map((a: any) => ({
                id: a.agreementId || a._id,
                idSubtext: a.status === "Expired" ? "Expired" : a.endDate ? `Expires ${new Date(a.endDate).toLocaleDateString()}` : "",
                type: a.type || "Monthly Rental",
                typeColor: a.type === "Rent-to-Own" ? COLORS.PRIMARY_MAIN : COLORS.SUCCESS_MAIN,
                vehicle: a.vehicle || "—",
                vehicleSubtext: a.vehicleRegistration || "",
                owner: a.ownerEmail || "—",
                ownerSubtext: "",
                driver: a.driverName || "—",
                driverSubtext: "",
                driverAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.driverName || "U")}&background=E2E8F0&color=475569`,
                startDate: a.startDate ? new Date(a.startDate).toLocaleDateString() : "—",
                expiryDate: a.endDate ? new Date(a.endDate).toLocaleDateString() : "—",
                expiryColor: a.status === "Expired" ? COLORS.ERROR_MAIN : a.status === "Expiring Soon" ? COLORS.WARNING_MAIN : COLORS.TEXT_SECONDARY,
                status: a.status || "Active",
                alert: a.status === "Expired" ? "Contract Expired" : a.status === "Expiring Soon" ? "Renewal Due" : "",
                alertColor: a.status === "Expired" ? COLORS.ERROR_MAIN : COLORS.WARNING_MAIN,
              }));
              setAgreementsData(mapped);
           }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load agreements");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgreements();
  }, [search]);

  const stats = [
    {
      title: "Total Agreements",
      value: agreementStats?.totalAgreements?.toLocaleString() ?? "1,245",
      icon: <FileText size={24} />,
      iconColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "Active",
      value: agreementStats?.activeAgreements?.toLocaleString() ?? "342",
      icon: <CheckCircle size={24} />,
      iconColor: COLORS.SUCCESS_MAIN,
    },
    {
      title: "Expiring Soon",
      value: agreementStats?.expiringSoon?.toLocaleString() ?? "15",
      icon: <Clock size={24} />,
      iconColor: COLORS.WARNING_MAIN,
    },
    {
      title: "Suspended",
      value: agreementStats?.suspendedAgreements?.toLocaleString() ?? "3",
      icon: <AlertTriangle size={24} />,
      iconColor: COLORS.ERROR_MAIN,
    },
    {
      title: "Pending Approval",
      value: agreementStats?.pendingApproval?.toLocaleString() ?? "28",
      icon: <RefreshCw size={24} />,
      iconColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "Rent-to-Own",
      value: agreementStats?.rentToOwn?.toLocaleString() ?? "156",
      icon: <Home size={24} />,
      iconColor: COLORS.SUCCESS_MAIN,
    },
    {
      title: "Rental Only",
      value: agreementStats?.rentalOnly?.toLocaleString() ?? "186",
      icon: <Calendar size={24} />,
      iconColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "Compliance Issues",
      value: "7",
      icon: <Shield size={24} />,
      iconColor: COLORS.WARNING_MAIN,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <PageHeader
        title="Agreements Management"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search agreements, vehicles, owners, drivers..."
        notificationCount={8}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem",
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
          Agreements Management
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {showAlert && (
          <div
            style={{
              background: "#FEF3C7",
              borderLeft: `4px solid ${COLORS.WARNING_MAIN}`,
              borderRadius: "8px",
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <AlertTriangle
                size={20}
                color={COLORS.WARNING_MAIN}
                style={{ marginTop: "2px" }}
              />
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#92400E",
                  }}
                >
                  Contract Expiry Alerts
                </h4>
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    fontSize: "0.85rem",
                    color: "#B45309",
                  }}
                >
                  15 agreements expiring within the next 30 days. 3 contracts
                  expired and require immediate action.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#92400E",
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "1rem",
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} />
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            background: "#fff",
            padding: "1rem",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ flex: 1, display: "flex", gap: "1rem" }}>
            <select
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.85rem",
                background: "#fff",
              }}
            >
              <option>All Status</option>
            </select>
            <select
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.85rem",
                background: "#fff",
              }}
            >
              <option>Agreement Type</option>
            </select>
            <select
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.85rem",
                background: "#fff",
              }}
            >
              <option>All Vehicles</option>
            </select>
            <select
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.85rem",
                background: "#fff",
              }}
            >
              <option>All Owners</option>
            </select>
            <select
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "0.85rem",
                background: "#fff",
              }}
            >
              <option>All Drivers</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              style={{
                background: COLORS.PRIMARY_MAIN,
                color: "#fff",
                padding: "0.6rem 1.5rem",
              }}
            >
              Apply Filters
            </Button>
            <Button
              style={{
                background: "#fff",
                color: "#374151",
                border: "1px solid #E5E7EB",
                padding: "0.6rem 1.5rem",
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card padding="0" style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Agreements Overview
            </h3>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  color: "#374151",
                }}
              >
                <Download size={16} /> Export
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  color: "#374151",
                }}
              >
                <Filter size={16} /> Advanced Filter
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6B7280",
                  }}
                >
                  <th style={{ padding: "1rem 1.5rem" }}>Agreement ID</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Type</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Vehicle</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Owner</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Driver</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Start Date</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Expiry Date</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Alerts</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agreementsData.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "#111827",
                        }}
                      >
                        {row.id}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6B7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        {row.idSubtext}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: row.typeColor,
                      }}
                    >
                      {row.type}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#111827",
                          fontWeight: 500,
                        }}
                      >
                        {row.vehicle}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6B7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        {row.vehicleSubtext}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: COLORS.PRIMARY_MAIN,
                          fontWeight: 500,
                        }}
                      >
                        {row.owner}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6B7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        {row.ownerSubtext}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <img
                          src={row.driverAvatar}
                          alt="driver"
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: COLORS.PRIMARY_MAIN,
                              fontWeight: 500,
                            }}
                          >
                            {row.driver}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#6B7280",
                              marginTop: "0.1rem",
                            }}
                          >
                            {row.driverSubtext}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        fontSize: "0.875rem",
                        color: "#111827",
                      }}
                    >
                      {row.startDate}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: row.expiryColor,
                      }}
                    >
                      {row.expiryDate}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: row.alertColor,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: row.alertColor,
                        }}
                      >
                        {row.alert}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          color: COLORS.PRIMARY_MAIN,
                          cursor: "pointer",
                        }}
                      >
                        <Eye size={18} />
                        <RefreshCw size={18} />
                        <MoreVertical size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
