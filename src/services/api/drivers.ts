import { apiFetch, apiDownloadPost } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  driverId?: string;
  kycStatus?: string;
  accountStatus?: string;
  activeAgreement?: string;
  paymentStatus?: string;
  licenseExpiry?: string;
  visaExpiry?: string;
  avatar?: string;
  createdAt?: string;
}

export interface DriverStats {
  total: number;
  active: number;
  suspended: number;
  pendingVerification: number;
  overduePayments: number;
  expiringLicence: number;
  expiringVisa: number;
}

export interface DriversFilters {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  kycStatus?: string;
  agreementStatus?: string;
  paymentStatus?: string;
  dateFrom?: string;
  search?: string;
}

const mapDriverStats = (stats: Record<string, any> = {}): DriverStats => ({
  total: stats.totalDrivers ?? 0,
  active: stats.activeDrivers ?? 0,
  suspended: stats.suspended ?? 0,
  pendingVerification: stats.pendingVerification ?? 0,
  overduePayments: stats.overduePayments ?? 0,
  expiringLicence: stats.expiringLicence ?? 0,
  expiringVisa: stats.expiringVisa ?? 0,
});

export const driversApi = {
  getDrivers: async (filters: DriversFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (
        v !== undefined &&
        v !== "" &&
        v !== "All Status" &&
        v !== "All KYC" &&
        v !== "All Agreements" &&
        v !== "All Payments"
      ) {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<any>>(
      `/admin/drivers${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const pagination = payload.pagination || {};

    return {
      ...res,
      data: {
        drivers: payload.drivers || [],
        total: pagination.totalDocuments ?? 0,
        page: pagination.currentPage ?? 1,
        pages: pagination.totalPages ?? 1,
        stats: mapDriverStats(payload.stats),
      },
    } as ApiResponse<{
      drivers: Driver[];
      total: number;
      page: number;
      pages: number;
      stats: DriverStats;
    }>;
  },

  getDriverById: async (id: string) =>
    apiFetch<ApiResponse<Driver>>(`/admin/drivers/${id}`),

  createDriver: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Driver>>("/admin/drivers", {
      method: "POST",
      body: data,
    }),

  updateDriver: async (id: string, data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Driver>>(`/admin/drivers/${id}`, {
      method: "PUT",
      body: data,
    }),

  getDriverStats: async () => {
    const res = await apiFetch<ApiResponse<any>>("/admin/drivers?limit=1");
    const stats = mapDriverStats(res.data?.stats);
    return { ...res, data: stats } as ApiResponse<DriverStats>;
  },

  exportDrivers: async (payload: Record<string, unknown>) =>
    apiDownloadPost("/admin/export/drivers", payload),

  getExportHistory: async () =>
    apiFetch<ApiResponse<any[]>>("/admin/export/history"),

  getKycQueue: async (
    filters: { page?: number; limit?: number; status?: string } = {},
  ) => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.status) params.set("status", filters.status);
    const qs = params.toString();
    return apiFetch<ApiResponse<{ documents: Record<string, unknown>[] }>>(
      `/admin/kyc/queue${qs ? `?${qs}` : ""}`,
    );
  },

  getDriverDocuments: async (driverId: string) => 
    apiFetch<ApiResponse<any>>(`/admin/drivers/${driverId}/documents`),

  updateDriverDocumentStatus: async (driverId: string, docId: string, payload: { status: string; reason?: string }) =>
    apiFetch<ApiResponse<any>>(`/admin/drivers/${driverId}/documents/${docId}/status`, {
      method: "PATCH",
      body: payload
    }),

  addDriverNote: async (driverId: string, payload: { text: string }) =>
    apiFetch<ApiResponse<any>>(`/admin/drivers/${driverId}/notes`, {
      method: "POST",
      body: payload
    })
};

