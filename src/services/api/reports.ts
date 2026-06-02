import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface ReportFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
  groupBy?: string;
  format?: string;
}

export const reportsApi = {
  // Summary dashboard for all reports
  getReportsDashboard: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/reports"),

  // Overdue reports
  getOverdueReports: async (filters: ReportFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/OverdueReportsDetail${qs ? `?${qs}` : ""}`,
    );
  },

  // Operational reports
  getOperationalReports: async (filters: ReportFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/OperationalReportsDetail${qs ? `?${qs}` : ""}`,
    );
  },

  // Financial reports (Detail04)
  getFinancialReports: async (filters: ReportFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/FinancialReportsDetail04${qs ? `?${qs}` : ""}`,
    );
  },

  // Agreement reports (Detail05)
  getAgreementReports: async (filters: ReportFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/AgreementReportsDetail05${qs ? `?${qs}` : ""}`,
    );
  },

  // Driver Activity reports (Detail06)
  getDriverActivityReports: async (filters: ReportFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/DriverActivityReportsDetail06${qs ? `?${qs}` : ""}`,
    );
  },

  // Vehicle Utilisation reports (Detail07)
  getVehicleUtilisationReports: async (filters: ReportFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/VehicleUtilisationReportsDetail07${qs ? `?${qs}` : ""}`,
    );
  },

  // Export settings
  getExportSettings: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/export-settings"),

  // Data retention policies
  getDataRetentionPolicies: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/data-retention-policies"),

  // Report schedules
  getReportSchedules: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/report-schedules"),
};
