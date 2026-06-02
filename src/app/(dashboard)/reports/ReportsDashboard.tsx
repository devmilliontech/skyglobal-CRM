"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  FileBarChart,
  AlertTriangle,
  ShieldAlert,
  Car,
  DollarSign,
  Wallet,
  Activity,
  AlertCircle,
  FileText,
  Users,
  Search,
  Download,
  Calendar,
  ChevronDown,
  Link,
  Plus,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import ReportCategoryCard from "./ReportCategoryCard";
import OverdueReportsDetail from "./OverdueReportsDetail";
import OperationalReportsDetail from "./OperationalReportsDetail";
import FinancialReportsDetail from "./FinancialReportsDetail";
import AgreementReportsDetail from "./AgreementReportsDetail";
import DriverActivityReportsDetail from "./DriverActivityReportsDetail";
import VehicleUtilisationReportsDetail from "./VehicleUtilisationReportsDetail";
import ReportBuilder from "./ReportBuilder";
import ScheduledReports from "./ScheduledReports";
import SavedPresets from "./SavedPresets";
import { useRouter } from "next/navigation";
import { reportsApi } from "@/services/api/reports";

const TABS = [
  "Reports Home",
  "Report Builder",
  "Scheduled Reports",
  "Saved Presets",
  "Admin Settings",
];

interface Category {
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  reports: string[];
  availableCountText: string;
}

const CATEGORIES: Category[] = [
  {
    title: "Operational Reports",
    subtitle: "Fleet performance & utilization",
    icon: Activity,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    reports: [
      "Vehicle utilization tracking",
      "Driver activity summaries",
      "Maintenance schedules",
      "Booking patterns analysis",
    ],
    availableCountText: "15 available reports",
  },
  {
    title: "Overdue Reports",
    subtitle: "Payment & compliance tracking",
    icon: AlertCircle,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    reports: [
      "Rent & rent-to-own overdue",
      "Insurance payment delays",
      "Document expiration alerts",
      "Compliance violations",
    ],
    availableCountText: "8 urgent items",
  },
  {
    title: "Financial Reports",
    subtitle: "Revenue & expense analysis",
    icon: DollarSign,
    iconColor: "#10B981",
    iconBg: "#DCFCE7",
    reports: [
      "Revenue breakdown by vehicle",
      "Payment collection status",
      "Expense tracking",
      "Profit margin analysis",
    ],
    availableCountText: "12 financial reports",
  },
  {
    title: "Agreement Reports",
    subtitle: "Contract & lease management",
    icon: FileText,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    reports: [
      "Active agreement status",
      "Contract renewal tracking",
      "Terms compliance check",
      "Agreement performance metrics",
    ],
    availableCountText: "10 active templates",
  },
  {
    title: "Driver Activity Reports",
    subtitle: "Driver behavior & performance",
    icon: Users,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    reports: [
      "Driver usage patterns",
      "Safety incident tracking",
      "License verification status",
      "Driver rating summaries",
    ],
    availableCountText: "6 activity logs",
  },
  {
    title: "Vehicle Utilisation Reports",
    subtitle: "Fleet optimization insights",
    icon: Car,
    iconColor: "#10B981",
    iconBg: "#DCFCE7",
    reports: [
      "Vehicle availability tracking",
      "Maintenance cost analysis",
      "Usage efficiency metrics",
      "Fleet performance benchmarks",
    ],
    availableCountText: "14 insight reports",
  },
];

export default function ReportsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Reports Home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const fetchReportsDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await reportsApi.getReportsDashboard();
        if (response?.data) {
          setDashboardStats(response.data);
        }
      } catch (err) {
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportsDashboard();
  }, []);

  const isAdminSettings = activeTab === "Admin Settings";
  const isOperationalReports = selectedCategory === "Operational Reports";
  const isFinancialReports = selectedCategory === "Financial Reports";
  const isAgreementReports = selectedCategory === "Agreement Reports";
  const isDriverActivityReports =
    selectedCategory === "Driver Activity Reports";
  const isVehicleUtilisationReports =
    selectedCategory === "Vehicle Utilisation Reports";
  const isReportBuilder = activeTab === "Report Builder";
  const isScheduledReports = activeTab === "Scheduled Reports";
  const isSavedPresets = activeTab === "Saved Presets";

  const getPageTitle = () => {
    if (isAdminSettings) return "Overdue Reports";
    if (isOperationalReports) return "Operational Reports";
    if (isFinancialReports) return "Financial Reports";
    if (isAgreementReports) return "Agreement Reports";
    if (isDriverActivityReports) return "Driver Activity Reports";
    if (isVehicleUtilisationReports) return "Vehicle Utilisation Reports";
    if (isReportBuilder) return "Report Builder";
    if (isScheduledReports) return "Scheduled Reports";
    if (isSavedPresets) return "Saved Presets";
    return "Reports";
  };

  const getPageDescription = () => {
    if (isAdminSettings)
      return "Monitor overdue payments and compliance issues";
    if (isOperationalReports)
      return "Generate comprehensive operational insights and analytics";
    if (isFinancialReports)
      return "Revenue performance and outstanding balance analytics";
    if (isAgreementReports)
      return "Detailed agreement-level performance and status analytics";
    if (isDriverActivityReports)
      return "Track driver performance, activity logs, and behavioral analytics";
    if (isVehicleUtilisationReports)
      return "Track vehicle usage patterns, identify low/high utilisation outliers";
    if (isReportBuilder)
      return "Configure custom reports with advanced filters and metrics";
    if (isScheduledReports) return "Manage automated report email deliveries";
    if (isSavedPresets)
      return "Manage and organize your saved report configurations";
    return "Generate and manage platform reports";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title={getPageTitle()}
        description={getPageDescription()}
        searchPlaceholder="Search drivers, vehicles, agreements..."
        notificationCount={3}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "-10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
            Reports
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedCategory(null); // Reset category when switching main tabs
            }}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid transparent",
              transition: "all 0.2s",
              backgroundColor:
                activeTab === tab ? COLORS.PRIMARY_MAIN : "#F3F4F6",
              color: activeTab === tab ? "#fff" : COLORS.TEXT_SECONDARY,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {isAdminSettings ? (
        <OverdueReportsDetail hideHeader={true} />
      ) : isReportBuilder ? (
        <ReportBuilder hideHeader={true} />
      ) : isScheduledReports ? (
        <ScheduledReports hideHeader={true} />
      ) : isSavedPresets ? (
        <SavedPresets hideHeader={true} />
      ) : isOperationalReports ? (
        <OperationalReportsDetail hideHeader={true} />
      ) : isFinancialReports ? (
        <FinancialReportsDetail hideHeader={true} />
      ) : isAgreementReports ? (
        <AgreementReportsDetail hideHeader={true} />
      ) : isDriverActivityReports ? (
        <DriverActivityReportsDetail hideHeader={true} />
      ) : isVehicleUtilisationReports ? (
        <VehicleUtilisationReportsDetail hideHeader={true} />
      ) : (
        <>
          {/* Filters & Actions */}
          <Card padding="1.25rem">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: "1.5rem", flex: 1 }}>
                <SelectField
                  label="Report Type"
                  options={[
                    { label: "All Reports", value: "all" },
                    { label: "Financial", value: "financial" },
                    { label: "Operational", value: "operational" },
                    { label: "Compliance", value: "compliance" },
                  ]}
                  placeholder="All Reports"
                  wrapperStyle={{ maxWidth: "300px" }}
                />
                <SelectField
                  label="Date Range"
                  options={[
                    { label: "This Month", value: "this_month" },
                    { label: "Last Month", value: "last_month" },
                    { label: "Last 3 Months", value: "last_3_months" },
                    { label: "Custom Range", value: "custom_range" },
                  ]}
                  placeholder="This Month"
                  wrapperStyle={{ maxWidth: "300px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Button
                  variant="secondary"
                  size="lg"
                  style={{
                    backgroundColor: "#10B981",
                    color: "#fff",
                    borderColor: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Download size={18} /> Export
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Calendar size={18} /> Schedule Report
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <StatCard
              title="Generated This Period"
              value={dashboardStats?.generatedThisPeriod?.toString() ?? "247"}
              badge="+12% from last period"
              icon={<FileBarChart size={20} />}
              iconBg="#EFF6FF"
              iconColor="#3B82F6"
            />
            <StatCard
              title="Overdue Accounts"
              value={dashboardStats?.overdueAccounts?.toString() ?? "32"}
              badge="+5 from yesterday"
              badgeColor="#F59E0B"
              badgeBg="#FFFBEB"
              icon={<AlertTriangle size={20} />}
              iconBg="#FFFBEB"
              iconColor="#F59E0B"
            />
            <StatCard
              title="Insurance Overdue"
              value={dashboardStats?.insuranceOverdue?.toString() ?? "8"}
              badge="Needs attention"
              badgeColor="#EF4444"
              badgeBg="#FEE2E2"
              icon={<ShieldAlert size={20} />}
              iconBg="#FEE2E2"
              iconColor="#EF4444"
            />
            <StatCard
              title="Fleet Utilisation"
              value={dashboardStats?.fleetUtilisation ?? "87%"}
              badge="+3% this week"
              icon={<Car size={20} />}
              iconBg="#EFF6FF"
              iconColor="#3B82F6"
            />
            <StatCard
              title="Revenue Performance"
              value={dashboardStats?.revenuePerformance ?? "£124K"}
              badge="+8% vs target"
              icon={<DollarSign size={20} />}
              iconBg="#DCFCE7"
              iconColor="#10B981"
            />
            <StatCard
              title="Outstanding Balance"
              value={dashboardStats?.outstandingBalance ?? "£45K"}
              badge="Requires follow-up"
              badgeColor="#F59E0B"
              badgeBg="#FFFBEB"
              icon={<Wallet size={20} />}
              iconBg="#FFFBEB"
              iconColor="#F59E0B"
            />
          </div>

          {/* Categories Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {CATEGORIES.map((cat, idx) => (
              <ReportCategoryCard
                key={idx}
                {...cat}
                onClick={() => setSelectedCategory(cat.title)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
