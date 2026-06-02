import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface DashboardKpi {
  value: number;
  trendPercent: number;
  isPositive: boolean;
}

export interface DashboardData {
  kpis: {
    totalRevenue: DashboardKpi;
    activeRentals: DashboardKpi;
    outstandingPayments: DashboardKpi;
    openDisputes: DashboardKpi;
  };
  revenueOverview: { month: string; revenue: number; rentals: number; year: number }[];
  recentRentals: { vehicle: string; status: string; amount: number }[];
  recentAgreements: { driverType: string; date: string }[];
  actionRequired: { pendingApprovals: number; failedPayments: number; kycReviews: number };
  activityStream: { title: string; timestamp: string; description: string }[];
  meta: { timeframe: string; year: number; rangeStart: string; rangeEnd: string };
}

export const dashboardApi = {
  /** Main dashboard - returns KPIs, revenue chart, recent items, action required, activity stream */
  getDashboardData: async (timeframe = "30d", year?: string) => {
    const params = new URLSearchParams({ timeframe });
    if (year) params.set("year", year);
    return apiFetch<ApiResponse<DashboardData>>(`/admin/dashboard?${params.toString()}`);
  },
};
