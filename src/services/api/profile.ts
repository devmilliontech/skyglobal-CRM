import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface ProfileData {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  jobTitle?: string;
  department?: string;
  avatar?: string;
  status?: string;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  ipAddress?: string;
  createdAt?: string;
}

export interface Session {
  _id: string;
  device?: string;
  browser?: string;
  location?: string;
  ip?: string;
  status?: string;
  lastActive?: string;
}

export const profileApi = {
  /**
   * GET /admin/profile
   * Fetch current admin profile
   */
  getProfile: async () => apiFetch<ApiResponse<ProfileData>>("/admin/profile"),

  /**
   * PUT /admin/profile
   * Update profile information
   */
  updateProfile: async (data: Partial<ProfileData>) =>
    apiFetch<ApiResponse<ProfileData>>("/admin/profile", {
      method: "PUT",
      body: data,
    }),

  /**
   * PATCH /admin/profile/2fa
   * Toggle two-factor authentication
   */
  toggle2FA: async (enabled: boolean) =>
    apiFetch<ApiResponse<{ twoFactorEnabled: boolean }>>("/admin/profile/2fa", {
      method: "PATCH",
      body: { enabled },
    }),

  /**
   * GET /admin/profile/sessions
   * Fetch active sessions
   */
  getSessions: async () =>
    apiFetch<ApiResponse<Session[]>>("/admin/profile/sessions"),

  /**
   * DELETE /admin/profile/sessions/:sessionId
   * Revoke a specific session
   */
  revokeSession: async (sessionId: string) =>
    apiFetch<ApiResponse<null>>(`/admin/profile/sessions/${sessionId}`, {
      method: "DELETE",
    }),

  /**
   * DELETE /admin/profile/sessions
   * Revoke all sessions (logout all devices)
   */
  revokeAllSessions: async () =>
    apiFetch<ApiResponse<null>>("/admin/profile/sessions", {
      method: "DELETE",
    }),
};
