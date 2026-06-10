import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface Rental {
  _id: string;
  bookingId?: string;
  rentalId?: string;
  source?: string;
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

export interface RentalDetail extends Rental {
  rentalAmount?: number;
  deposit?: number;
  deliveryFee?: number;
  totalPaid?: number;
  outstandingBalance?: number;
  lateReturnFee?: number;
  pricing?: Record<string, any>;
  fareBreakdown?: {
    totalDays?: number;
    regularDays?: number;
    weekendDays?: number;
    holidayDays?: number;
    weekendPricingIncluded?: boolean;
    holidayPricingIncluded?: boolean;
    lines?: Array<{
      key?: string;
      type?: string;
      label?: string;
      quantity?: number;
      days?: number;
      rate?: number;
      amount?: number;
      dates?: string[];
    }>;
    days?: Array<Record<string, any>>;
    rates?: Record<string, number>;
  } | null;
  durationDays?: number;
  mileageStart?: number;
  returnStatus?: string;
  checkInCondition?: { date?: string | null; notes?: string };
  checkOutCondition?: { date?: string | null; notes?: string };
  vehicleInfo?: {
    id?: string;
    name?: string;
    make?: string;
    model?: string;
    year?: string;
    registration?: string;
    vin?: string;
    odometer?: string | number;
    insuranceStatus?: string;
    insuranceProvider?: string;
    insuranceExpiry?: string;
    registrationExpiry?: string;
    dailyRate?: number;
    weeklyRate?: number;
    lateFee?: number;
  };
  driverInfo?: {
    id?: string;
    driverId?: string;
    name?: string;
    phone?: string;
    email?: string;
    license?: string;
    kycStatus?: string;
    avatar?: string;
  };
  ownerInfo?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    businessName?: string;
    status?: string;
  };
  agreement?: {
    id?: string;
    agreementId?: string;
    title?: string;
    type?: string;
    status?: string;
  } | null;
  booking?: Record<string, any>;
}

export interface RentalTimelineItem {
  id?: string;
  label?: string;
  amount?: number;
  status?: string;
  dueDate?: string;
  paidDate?: string | null;
  transactionId?: string;
}

export interface RentalHistoryItem {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  actorName?: string;
  type?: string;
}

export interface RentalDetailResponse {
  rental: RentalDetail;
  paymentTimeline: RentalTimelineItem[];
  adminHistory: RentalHistoryItem[];
  disputeLog: RentalHistoryItem[];
}

export type RentalAction =
  | "mark-returned"
  | "request-extension"
  | "send-reminder"
  | "add-note"
  | "initiate-refund"
  | "escalate-dispute"
  | "add-dispute";

export interface RentalActionResponse {
  action: {
    type: RentalAction;
    status: string;
    message: string;
  };
  detail: RentalDetailResponse;
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
    const rentals = (payload.rentals || payload.data || []).map((r: any) => {
      const vehicleName =
        r.vehicleName || r.vehicle?.name || r.vehicle?.make || r.vehicle;
      const driverName =
        r.driverName || r.driver?.name || r.currentDriver?.name || r.driver;
      const ownerName =
        r.ownerName ||
        r.owner?.name ||
        r.owner?.fullName ||
        r.owner?.businessName ||
        r.owner?.email ||
        r.owner;

      return {
        _id: r._id || r.id || r.bookingId || r.rentalId,
        bookingId: r.bookingId,
        rentalId: r.rentalId || r.rentalIdDisplay || r.bookingId || r.id,
        source: r.source || r.sourceType,
        vehicleName: typeof vehicleName === "string" ? vehicleName : undefined,
        vehicleRegistration:
          r.vehicleRegistration || r.registration || r.vehicle?.registration,
        driverName: typeof driverName === "string" ? driverName : undefined,
        ownerName: typeof ownerName === "string" ? ownerName : undefined,
        agreementType: r.agreementType || r.currentAgreement?.type,
        startDate: r.startDate || r.startDateTime,
        endDate: r.endDate || r.endDateTime,
        rentalStatus: r.rentalStatus || r.status,
        paymentStatus: r.paymentStatus,
        createdAt: r.createdAt,
      };
    });

    return {
      ...res,
      data: {
        rentals,
        total: pagination.total ?? pagination.totalDocuments ?? payload.total ?? 0,
        page: pagination.page ?? pagination.currentPage ?? payload.page ?? 1,
        pages: pagination.pages ?? pagination.totalPages ?? payload.pages ?? 1,
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
    apiFetch<ApiResponse<RentalDetailResponse>>(`/admin/rentals/${id}`),

  updateRentalStatus: async (
    id: string,
    data: { status: string; actionNote?: string },
  ) =>
    apiFetch<ApiResponse<Rental>>(`/admin/rentals/${id}/status`, {
      method: "PATCH",
      body: data,
    }),

  performRentalAction: async (
    id: string,
    action: RentalAction,
    data: Record<string, unknown> = {},
  ) =>
    apiFetch<ApiResponse<RentalActionResponse>>(
      `/admin/rentals/${id}/actions/${action}`,
      {
        method: "POST",
        body: data,
      },
    ),

  addRentalDisputeEntry: async (id: string, content: string) =>
    apiFetch<ApiResponse<RentalHistoryItem>>(`/admin/rentals/${id}/disputes`, {
      method: "POST",
      body: { content },
    }),

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
