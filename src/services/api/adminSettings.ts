import { apiDownload, apiFetch } from "./client";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};



export const adminSettingsApi = {
  // General Settings
  getGeneralSettings: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/general-settings"),
  updateGeneralSettings: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/general-settings", {
      method: "PUT",
      body: payload,
    }),
  toggleGeneralSetting: async (feature: string, enabled: boolean) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/general-settings/toggle/${feature}`,
      { method: "POST", body: { enabled } },
    ),

  // Vehicle Approval Rules
  getVehicleApprovalRules: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/vehicle-approval-rules",
    ),
  updateVehicleApprovalRules: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/vehicle-approval-rules",
      {
        method: "PUT",
        body: payload,
      },
    ),

  // Agreement Rules
  getAgreementRules: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/agreement-rules"),
  updateAgreementRules: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/agreement-rules", {
      method: "PUT",
      body: payload,
    }),

  // Notification Settings
  getNotificationSettings: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/notifications/settings"),
  updateNotificationSettings: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/notifications/settings", {
      method: "PUT",
      body: payload,
    }),
  listNotificationTemplates: async (channel?: string) =>
    apiFetch<ApiResponse<{ templates: Record<string, unknown>[] }>>(
      `/admin/notifications/templates${channel ? `?channel=${channel}` : ""}`,
    ),
  createNotificationTemplate: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/notifications/templates",
      {
        method: "POST",
        body: payload,
      },
    ),
  updateNotificationTemplate: async (
    templateId: string,
    payload: Record<string, unknown>,
  ) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/notifications/templates/${templateId}`,
      {
        method: "PUT",
        body: payload,
      },
    ),
  deleteNotificationTemplate: async (templateId: string) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/notifications/templates/${templateId}`,
      {
        method: "DELETE",
      },
    ),
  getNotificationChannels: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/notifications/channels",
    ),
  toggleNotificationChannel: async (channel: string, enabled: boolean) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/notifications/channels/${channel}/toggle`,
      {
        method: "PUT",
        body: { enabled },
      },
    ),

  // Export Settings
  getExportSettings: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/export-settings"),
  updateExportSettings: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/export-settings", {
      method: "PUT",
      body: payload,
    }),

  // Data Retention Policies
  getDataRetentionPolicies: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/data-retention-policies",
    ),
  updateDataRetentionPolicies: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/data-retention-policies",
      {
        method: "PUT",
        body: payload,
      },
    ),

  // Report Schedules
  getReportSchedules: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/report-schedules"),
  updateReportSchedule: async (reportName: string, schedule: string) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/report-schedules/${encodeURIComponent(reportName)}`,
      {
        method: "PUT",
        body: { schedule },
      },
    ),

  // Integrations
  listIntegrations: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/integrations"),
  getIntegration: async (provider: string) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/integrations/${provider}`,
    ),
  upsertIntegration: async (
    provider: string,
    payload: Record<string, unknown>,
  ) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/integrations/${provider}`,
      {
        method: "PUT",
        body: { provider, ...payload },
      },
    ),
  testIntegration: async (
    provider: string,
    credentials?: Record<string, unknown>,
  ) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/integrations/${provider}/test-connection`,
      {
        method: "POST",
        body: { provider, credentials },
      },
    ),

  // Audit Logs & Exports
  getAuditLogs: async (query = "") =>
    apiFetch<ApiResponse<Record<string, unknown>>>(`/admin/audit${query}`),
  exportAuditLogs: async () => apiDownload("/admin/audit/export"),

  // System Backup
  createSystemBackup: async (notes?: string) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/system/backup", {
      method: "POST",
      body: { notes },
    }),
  getSystemBackupHistory: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/system/backup/history",
    ),

  // Driver Export
  exportDrivers: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/export/drivers", {
      method: "POST",
      body: payload,
    }),
  getExportHistory: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/admin/export/history"),

  // Roles & Permissions
  getRoles: async () =>
    apiFetch<ApiResponse<{ roles: Record<string, unknown>[] }>>("/admin/roles"),
  getRole: async (roleName: string) =>
    apiFetch<ApiResponse<{ role: Record<string, unknown> }>>(
      `/admin/roles/${encodeURIComponent(roleName)}`,
    ),
  upsertRole: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<{ role: Record<string, unknown> }>>("/admin/roles", {
      method: "PUT",
      body: payload,
    }),
  deleteRole: async (roleName: string) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/roles/${encodeURIComponent(roleName)}`,
      {
        method: "DELETE",
      },
    ),


  // Payments & Finance
  getPaymentsAndFinance: async () =>
    apiFetch<ApiResponse<{ financialRules: Record<string, unknown> }>>(
      "/admin/payments-finance",
    ),
  updatePaymentsAndFinance: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<{ financialRules: Record<string, unknown> }>>(
      "/admin/payments-finance",
      {
        method: "PUT",
        body: payload,
      },
    ),

  // System Config
  getSystemConfig: async () =>
    apiFetch<ApiResponse<{ config: Record<string, unknown> }>>(
      "/admin/system/config",
    ),
  updateSystemConfig: async (payload: Record<string, unknown>) =>
    apiFetch<ApiResponse<{ config: Record<string, unknown> }>>(
      "/admin/system/config",
      {
        method: "PUT",
        body: payload,
      },
    ),
};
