import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface NotificationRecord {
  _id: string;
  title?: string;
  message?: string;
  recipientName?: string;
  recipientRole?: string;
  channels?: string[];
  trigger?: string;
  status?: string;
  sentAt?: string;
  createdAt?: string;
}

export interface NotificationStats {
  totalSent: number;
  unread: number;
  failed: number;
  scheduled: number;
  manual: number;
  highPriority: number;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  channel?: string;
  recipient?: string;
  startDate?: string;
  endDate?: string;
}

export const notificationsApi = {
  getNotifications: async (filters: NotificationFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== "all") {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ notifications: NotificationRecord[]; total: number; page: number }>>(
      `/notifications${qs ? `?${qs}` : ""}`,
    );
  },

  getAdminNotificationLog: async (filters: NotificationFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== "all") {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ notifications: NotificationRecord[]; total: number; stats: NotificationStats }>>(
      `/admin/notifications/log${qs ? `?${qs}` : ""}`,
    );
  },

  createNotification: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<NotificationRecord>>("/notifications/create", {
      method: "POST",
      body: data,
    }),

  deleteNotifications: async (ids: string[]) =>
    apiFetch<ApiResponse<{ deleted: number }>>("/notifications/delete", {
      method: "DELETE",
      body: { ids },
    }),

  getNotificationSettings: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/notifications/settings"),

  updateNotificationSettings: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Record<string, unknown>>>("/notifications/settings", {
      method: "PUT",
      body: data,
    }),
};
