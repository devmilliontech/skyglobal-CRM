"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  FileText,
  PlayCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Home,
  Calendar,
  XCircle,
  Search as SearchIcon,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  CheckIcon,
  XIcon,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import Breadcrumb from "@/components/Breadcrumb";
import SelectField from "@/components/SelectField";

export default function AgreementsManagement() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Agreements");
  const [search, setSearch] = useState("");

  const tabs = [
    { name: "Rentals Management", path: "/rentals" },
    { name: "Agreements", path: "/rentals/agreements" },
    { name: "Disputes & Refunds", path: "/rentals/disputes" },
    { name: "Admin Notes & Audit", path: "/rentals/audit" },
  ];

  const topStats = [
    {
      title: "Total Agreements",
      value: "247",
      badge: "+12% from last month",
      badgeColor: COLORS.SUCCESS_MAIN,
      icon: <FileText size={20} />,
      iconColor: "#4B5563",
    },
    {
      title: "Active Agreements",
      value: "89",
      badge: "+5% from last week",
      badgeColor: COLORS.SUCCESS_MAIN,
      icon: <PlayCircle size={20} />,
      iconColor: COLORS.SUCCESS_MAIN,
    },
    {
      title: "Upcoming Agreements",
      value: "23",
      badge: "Starting this week",
      badgeColor: COLORS.WARNING_MAIN,
      icon: <Clock size={20} />,
      iconColor: COLORS.WARNING_MAIN,
    },
    {
      title: "Overdue Agreements",
      value: "7",
      badge: "Requires attention",
      badgeColor: COLORS.ERROR_MAIN,
      icon: <AlertTriangle size={20} />,
      iconColor: COLORS.ERROR_MAIN,
    },
  ];

  const bottomStats = [
    {
      title: "Completed Agreements",
      value: "128",
      badge: "This month",
      badgeColor: "#6B7280",
      icon: <CheckCircle2 size={20} />,
      iconColor: "#4B5563",
    },
    {
      title: "Rent-to-Own",
      value: "34",
      badge: "Active contracts",
      badgeColor: "#6B7280",
      icon: <Home size={20} />,
      iconColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "Short-Term",
      value: "55",
      badge: "Active rentals",
      badgeColor: "#6B7280",
      icon: <Calendar size={20} />,
      iconColor: COLORS.PRIMARY_MAIN,
    },
    {
      title: "Cancelled Agreements",
      value: "15",
      badge: "This month",
      badgeColor: "#6B7280",
      icon: <XCircle size={20} />,
      iconColor: "#4B5563",
    },
  ];

  const agreementsData = [
    {
      id: "AGR-2024-001",
      title: "AGR-2024-001",
      type: "Short-Term",
      driverImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      driver: "John Doe",
      ownerImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      owner: "Sarah Johnson",
      vehicle: "Toyota Corolla",
      startDate: "Oct 24, 2023",
      endDate: "Oct 31, 2023",
      duration: "7 Days",
      amount: "$350.00",
      status: "Active",
      actions: "Actions",
    },
    {
      id: "AGR-2024-002",
      title: "AGR-2024-002",
      type: "Rent to Own",
      driverImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      driver: "Mike Willson",
      ownerImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      owner: "Mike Brown",
      vehicle: "Honda Civic",
      startDate: "Oct 28, 2023",
      endDate: "Nov 28, 2023",
      duration: "1 Month",
      amount: "$1,200.00",
      status: "Pending",
    },
    {
      id: "AGR-2024-003",
      title: "AGR-2024-003",
      type: "Short-Term",
      driverImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      driver: "Robert Brown",
      ownerImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      owner: "Global Auto",
      vehicle: "Nissan Altima",
      startDate: "Jan 01, 2023",
      endDate: "Dec 31, 2025",
      duration: "36 Months",
      amount: "$15,000.00",
      status: "Overdue",
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

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: "0.4rem",
    display: "block",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <PageHeader
        title="Agreement Management"
        searchValue={search}
        onSearchChange={setSearch}
        notificationCount={3}
      />
      <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Rentals", path: "/rentals" },
          { label: "Agreements" },
        ]}
      />

      <div
        style={{
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {topStats.map((stat, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
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
                      color: "#4B5563",
                      fontWeight: 500,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {stat.title}
                  </p>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#111827",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div style={{ color: stat.iconColor }}>{stat.icon}</div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: stat.badgeColor,
                    fontWeight: 500,
                  }}
                >
                  {stat.badge}
                </p>
              </div>
            </div>
          ))}
          {bottomStats.map((stat, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
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
                      color: "#4B5563",
                      fontWeight: 500,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {stat.title}
                  </p>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#111827",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div style={{ color: stat.iconColor }}>{stat.icon}</div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: stat.badgeColor,
                    fontWeight: 500,
                  }}
                >
                  {stat.badge}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Filters</h3>
            <button
              style={{
                fontSize: "0.85rem",
                color: COLORS.PRIMARY_MAIN,
                fontWeight: 600,
              }}
            >
              Clear All
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "1rem",
            }}
          >
            <div>
              <label style={labelStyle}>Agreement Title</label>
              <input
                type="text"
                placeholder="Search title..."
                style={inputStyle}
              />
            </div>
            <div>
              <SelectField
                label="Agreement Type"
                options={[
                  { label: "All Types", value: "All Types" },
                  { label: "Short-Term", value: "Short-Term" },
                  { label: "Rent-to-Own", value: "Rent-to-Own" },
                ]}
              />
            </div>
            <div>
              <label style={labelStyle}>Driver</label>
              <input
                type="text"
                placeholder="Driver name..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Owner</label>
              <input
                type="text"
                placeholder="Owner name..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Vehicle</label>
              <input
                type="text"
                placeholder="Registration..."
                style={inputStyle}
              />
            </div>

            <div>
              <SelectField
                label="All Status"
                options={[
                  { label: "All Status", value: "All Status" },
                  { label: "Active", value: "Active" },
                  { label: "Pending", value: "Pending" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" },
                  { label: "Overdue", value: "Overdue" },
                ]}
              />
            </div>
            <div>
              <SelectField
                label="Payment Method"
                options={[
                  { label: "All Methods", value: "All Methods" },
                  { label: "Credit Card", value: "Credit Card" },
                  { label: "Bank Transfer", value: "Bank Transfer" },
                  { label: "Cash", value: "Cash" },
                ]}
              />
            </div>
            <div>
              <SelectField
                label="Insurance Type"
                options={[
                  { label: "All Insurance", value: "All Insurance" },
                  { label: "Basic", value: "Basic" },
                  { label: "Comprehensive", value: "Comprehensive" },
                  { label: "Premium", value: "Premium" },
                ]}
              />
            </div>
            <div>
              <label style={labelStyle}>Date Range</label>
              <input type="date" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>&nbsp;</label>
              <input type="date" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="card" style={{ padding: "0" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              All Agreements
            </h3>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => router.push("/rentals/agreements/create")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  background: COLORS.PRIMARY_MAIN,
                  color: COLORS.BG_CARD,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                <span>Create Agreement</span>
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {[
                    "AGREEMENT TITLE",
                    "TYPE",
                    "DRIVER",
                    "OWNER",
                    "VEHICLE",
                    "START DATE",
                    "END DATE",
                    "DURATION",
                    "AMOUNT",
                    "STATUS",
                    "ACTIONS",
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "center",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6B7280",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agreementsData
                  .filter(
                    (agr) =>
                      agr.title.toLowerCase().includes(search.toLowerCase()) ||
                      agr.driver.toLowerCase().includes(search.toLowerCase()) ||
                      agr.type.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((agr, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #E5E7EB",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#F9FAFB")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {agr.title}
                      </td>
                      <td
                        style={{
                          padding: "0.25rem 0.15rem",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            padding: "2px",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                          }}
                        >
                          {agr.type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <img
                          src={agr.driverImage}
                          alt="john doe"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            marginRight: "0.5rem",
                          }}
                        />
                        {agr.driver}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={agr.ownerImage}
                          alt="john doe"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            marginRight: "0.5rem",
                          }}
                        />
                        {agr.owner}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          textAlign: "center",
                        }}
                      >
                        {agr.vehicle}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          color: "#6B7280",
                          textAlign: "center",
                        }}
                      >
                        {agr.startDate}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          color: "#6B7280",
                          textAlign: "center",
                        }}
                      >
                        {agr.endDate}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          textAlign: "center",
                        }}
                      >
                        {agr.duration}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {agr.amount}
                      </td>
                      <td
                        style={{
                          padding: "1.25rem 1.5rem",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            background:
                              agr.status === "Active" ||
                              agr.status === "Completed"
                                ? "#DCFCE7"
                                : agr.status === "Upcoming"
                                  ? "#DBEAFE"
                                  : COLORS.ERROR_LIGHT,
                            color:
                              agr.status === "Active" ||
                              agr.status === "Completed"
                                ? "#10B981"
                                : agr.status === "Upcoming"
                                  ? "#3B82F6"
                                  : COLORS.ERROR_MAIN,
                          }}
                        >
                          {agr.status}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          style={{
                            color: "#9CA3AF",
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          <Eye size={15} color="#2563eb" />
                          <Edit size={15} color="#6b7280" />
                          <CheckIcon size={15} color="#3db268" />
                          <XIcon size={15} color="#dc2626" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
