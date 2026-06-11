import { apiFetch, apiDownloadPost } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };
type ApiRecord = Record<string, unknown>;

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

export type DriverDocumentDetails = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface DriverDocument {
  id?: string;
  _id?: string;
  type?: string;
  status?: string;
  imageUrl?: string | null;
  fileUrl?: string | null;
  url?: string | null;
  documentUrl?: string | null;
  secondaryImageUrl?: string | null;
  secondaryFileUrl?: string | null;
  secondaryUrl?: string | null;
  imageUrls?: string[];
  details?: DriverDocumentDetails;
  editableDetails?: DriverDocumentDetails;
  extractedData?: DriverDocumentDetails;
  verifiedData?: DriverDocumentDetails;
  detailsSource?: "OCR" | "Admin Verified" | "Not Provided" | string;
  ocr?: {
    status?: string;
    extractedData?: DriverDocumentDetails;
    confidence?: string | number | null;
  };
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface DriverDocumentNote {
  id?: string;
  author?: string;
  timestamp?: string;
  text?: string;
}

export interface DriverDocumentSummary {
  approved?: number;
  pendingReview?: number;
  rejected?: number;
  totalDocuments?: number;
}

export interface DriverDocumentsResponse {
  documents?: DriverDocument[];
  internalNotes?: DriverDocumentNote[];
  summary?: DriverDocumentSummary | null;
}

export interface DriverDocumentMutationResponse {
  document?: DriverDocument;
}

export interface DriverDocumentStatusPayload {
  status: string;
  reason?: string;
  documentDetails?: DriverDocumentDetails;
}

const asRecord = (value: unknown): ApiRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : {};

const asNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }
  return 0;
};

const mapDriverStats = (stats: ApiRecord = {}): DriverStats => ({
  total: asNumber(stats.totalDrivers),
  active: asNumber(stats.activeDrivers),
  suspended: asNumber(stats.suspended),
  pendingVerification: asNumber(stats.pendingVerification),
  overduePayments: asNumber(stats.overduePayments),
  expiringLicence: asNumber(stats.expiringLicence),
  expiringVisa: asNumber(stats.expiringVisa),
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
    const res = await apiFetch<ApiResponse<ApiRecord>>(
      `/admin/drivers${qs ? `?${qs}` : ""}`,
    );

    const payload = asRecord(res.data);
    const pagination = asRecord(payload.pagination);

    return {
      ...res,
      data: {
        drivers: Array.isArray(payload.drivers) ? payload.drivers : [],
        total: asNumber(pagination.totalDocuments),
        page: asNumber(pagination.currentPage) || 1,
        pages: asNumber(pagination.totalPages) || 1,
        stats: mapDriverStats(asRecord(payload.stats)),
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
    const res = await apiFetch<ApiResponse<ApiRecord>>("/admin/drivers?limit=1");
    const stats = mapDriverStats(asRecord(asRecord(res.data).stats));
    return { ...res, data: stats } as ApiResponse<DriverStats>;
  },

  exportDrivers: async (payload: Record<string, unknown>) =>
    apiDownloadPost("/admin/export/drivers", payload),

  getExportHistory: async () =>
    apiFetch<ApiResponse<ApiRecord[]>>("/admin/export/history"),

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
    apiFetch<ApiResponse<DriverDocumentsResponse>>(
      `/admin/drivers/${driverId}/documents`,
      { cache: "no-store" },
    ),

  updateDriverDocumentDetails: async (
    driverId: string,
    docId: string,
    documentDetails: DriverDocumentDetails,
  ) =>
    apiFetch<ApiResponse<DriverDocumentMutationResponse>>(
      `/admin/drivers/${driverId}/documents/${docId}/details`,
      {
        method: "PATCH",
        body: { documentDetails },
      },
    ),

  updateDriverDocumentStatus: async (
    driverId: string,
    docId: string,
    payload: DriverDocumentStatusPayload,
  ) =>
    apiFetch<ApiResponse<DriverDocumentMutationResponse>>(`/admin/drivers/${driverId}/documents/${docId}/status`, {
      method: "PATCH",
      body: payload
    }),

  retryDriverDocumentOcr: async (driverId: string, docId: string) =>
    apiFetch<ApiResponse<DriverDocumentMutationResponse>>(
      `/admin/drivers/${driverId}/documents/${docId}/ocr/retry`,
      {
        method: "POST",
      },
    ),

  addDriverNote: async (driverId: string, payload: { text: string }) =>
    apiFetch<ApiResponse<DriverDocumentNote>>(`/admin/drivers/${driverId}/notes`, {
      method: "POST",
      body: payload
    })
};
