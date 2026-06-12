import { apiFetch } from "./client";

export interface AuditLogStat {
  totalEntries: number;
  last24Hours: number;
  manualNotes: number;
  systemEvents: number;
}

export interface AuditLogEntry {
  timestamp: string;
  entityType: string;
  entityId: string;
  actionType: string;
  adminUser: string;
  description: string;
  outcome: string;
}

export interface AuditLogResponse {
  stats: AuditLogStat;
  logs: AuditLogEntry[];
}

export interface AddManualNotePayload {
  entityType: string;
  entityId: string;
  noteContent: string;
}

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const auditApi = {
  getAuditLogs: async (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<AuditLogResponse>>(
      `/admin/audit${qs ? `?${qs}` : ""}`
    );
  },

  addManualNote: async (data: AddManualNotePayload) =>
    apiFetch<ApiResponse<{ note: Record<string, unknown> }>>(
      `/admin/audit/notes`,
      {
        method: "POST",
        body: data,
      }
    ),
};
