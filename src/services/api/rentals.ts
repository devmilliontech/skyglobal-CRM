import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface Rental {
  _id: string;
  rentalId?: string;
  vehicleName?: string;
  vehicleRegistration?: string;
  driverName?: string;
  ownerName?: string;
  agreementType?: string;
  startDate?: string;
  endDate?: string;
  rentalStatus?: string;
  paymentStatus?: string;
  createdAt?: string;
}

export interface RentalStats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  overdueReturns: number;
  refundCases: number;
  disputed: number;
}

export interface RentalsFilters {
  page?: number;
  limit?: number;
  search?: string;
  rentalId?: string;
  driverName?: string;
  vehicleRegistration?: string;
  ownerName?: string;
  rentalStatus?: string;
  agreementType?: string;
  paymentStatus?: string;
  returnStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface Agreement {
  _id: string;
  agreementId?: string;
  driverName?: string;
  vehicleName?: string;
  agreementType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  weeklyRate?: number;
  createdAt?: string;
}

export interface AgreementStats {
  total: number;
  active: number;
  pending: number;
  expired: number;
  terminated: number;
}

export interface Dispute {
  _id: string;
  disputeId?: string;
  type?: string;
  status?: string;
  driverName?: string;
  vehicleName?: string;
  amount?: number;
  description?: string;
  createdAt?: string;
}

const mapRentalStats = (stats: Record<string, any> = {}): RentalStats => ({
  total: stats.totalRentals ?? stats.total ?? 0,
  active: stats.activeRentals ?? stats.active ?? 0,
  upcoming: stats.upcomingRentals ?? stats.upcoming ?? 0,
  completed: stats.completedRentals ?? stats.completed ?? 0,
  cancelled: stats.cancelledRentals ?? stats.cancelled ?? 0,
  overdueReturns: stats.overdueReturns ?? 0,
  refundCases: stats.refundCases ?? 0,
  disputed: stats.disputedRentals ?? stats.disputed ?? 0,
});

export const rentalsApi = {
  getRentals: async (filters: RentalsFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && !String(v).startsWith("All")) {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<any>>(
      `/admin/rentals${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const pagination = payload.pagination || {};
    const rentals = (payload.rentals || payload.data || []).map((r: any) => ({
      _id: r._id || r.id || r.rentalId,
      rentalId: r.rentalId || r.rentalIdDisplay || r.id,
      vehicleName: r.vehicleName || r.vehicle || r.vehicle?.name,
      vehicleRegistration:
        r.vehicleRegistration || r.registration || r.vehicle?.registration,
      driverName: r.driverName || r.driver || r.currentDriver?.name,
      ownerName: r.ownerName || r.owner || r.owner?.name,
      agreementType: r.agreementType || r.currentAgreement?.type,
      startDate: r.startDate || r.startDateTime,
      endDate: r.endDate || r.endDateTime,
      rentalStatus: r.rentalStatus || r.status,
      paymentStatus: r.paymentStatus,
      createdAt: r.createdAt,
    }));

    return {
      ...res,
      data: {
        rentals,
        total: pagination.total ?? payload.total ?? 0,
        page: pagination.page ?? payload.page ?? 1,
        pages: pagination.pages ?? payload.pages ?? 1,
        stats: mapRentalStats(payload.stats),
      },
    } as ApiResponse<{
      rentals: Rental[];
      total: number;
      page: number;
      pages: number;
      stats: RentalStats;
    }>;
  },

  getRentalById: async (id: string) =>
    apiFetch<ApiResponse<Rental>>(`/admin/rentals/${id}`),

  getRentalStats: async () => {
    const res = await apiFetch<ApiResponse<any>>("/admin/rentals?limit=1");
    return {
      ...res,
      data: mapRentalStats(res.data?.stats),
    } as ApiResponse<RentalStats>;
  },

  getAgreements: async (
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      agreementType?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && !String(v).startsWith("All")) {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<any>>(
      `/admin/agreements${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const pagination = payload.pagination || {};

    return {
      ...res,
      data: {
        agreements: payload.agreements || [],
        total: pagination.totalDocuments ?? payload.total ?? 0,
        page: pagination.currentPage ?? payload.page ?? 1,
        pages: pagination.totalPages ?? payload.pages ?? 1,
        stats: payload.stats,
      },
    } as ApiResponse<{
      agreements: Agreement[];
      total: number;
      page: number;
      pages: number;
      stats: Record<string, unknown>;
    }>;
  },

  getAgreementById: async (id: string) =>
    apiFetch<ApiResponse<Agreement>>(`/admin/agreements/${id}`),

  getAgreementStats: async () => {
    const res = await apiFetch<ApiResponse<any>>("/admin/agreements?limit=1");
    return {
      ...res,
      data: res.data?.stats as AgreementStats,
    } as ApiResponse<AgreementStats>;
  },

  createDraftAgreement: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Agreement>>("/admin/agreements", {
      method: "POST",
      body: { status: "Draft", ...data },
    }),

  approveAgreement: async (agreementId: string) =>
    apiFetch<ApiResponse<Agreement>>(
      `/admin/agreements/${agreementId}/status`,
      { method: "PATCH", body: { status: "Active" } },
    ),

  getDisputes: async (
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ disputes: Dispute[]; total: number }>>(
      `/admin/disputes${qs ? `?${qs}` : ""}`,
    );
  },

  getAuditLogs: async (
    filters: { page?: number; limit?: number; search?: string } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<
      ApiResponse<{ logs: Record<string, unknown>[]; total: number }>
    >(`/admin/audit${qs ? `?${qs}` : ""}`);
  },
};
