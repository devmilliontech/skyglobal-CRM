import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface DisputeListCase {
  _id: string;
  caseId: string;
  type: "Dispute" | "Refund" | string;
  status: string;
  disputedAmount: number;
  slaDeadline?: string | null;
  isSlaCritical?: boolean;
  createdAt?: string;
  driver?: { _id?: string | null; driverId?: string; name?: string };
  owner?: { _id?: string | null; email?: string; role?: string };
  rental?: {
    _id?: string | null;
    rentalId?: string;
    returnStatus?: string;
    vehicleRegistration?: string;
    vehicleName?: string;
  };
  agreement?: { _id?: string | null; agreementId?: string; status?: string };
}

export interface DisputeStats {
  totalCases: number;
  activeDisputes: number;
  refundRequests: number;
  slaCritical: number;
}

export interface DisputeListResponse {
  stats: DisputeStats;
  cases: DisputeListCase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DisputeDetailsResponse {
  caseDetails: Record<string, unknown>;
  calculatedExposure: {
    lateReturnFee: number;
    outstandingBalance: number;
    totalExposure: number;
  };
  timelineOfEvents: Array<Record<string, unknown>>;
  paymentTimeline: Array<Record<string, unknown>>;
}

export interface DisputeFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  rentalId?: string;
  agreementId?: string;
  driverName?: string;
  ownerName?: string;
  vehicleReg?: string;
  startDate?: string;
  endDate?: string;
}

const buildQuery = (filters: Partial<DisputeFilters>) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

export const disputesApi = {
  getDisputes: async (filters: DisputeFilters = {}) => {
    const qs = buildQuery(filters);
    return apiFetch<ApiResponse<DisputeListResponse>>(
      `/admin/disputes${qs ? `?${qs}` : ""}`,
    );
  },

  getDispute: async (disputeId: string) =>
    apiFetch<ApiResponse<DisputeDetailsResponse>>(`/admin/disputes/${disputeId}`),

  addNote: async (disputeId: string, note: string) =>
    apiFetch<ApiResponse<{ dispute: Record<string, unknown> }>>(
      `/admin/disputes/${disputeId}/notes`,
      {
        method: "POST",
        body: { note },
      },
    ),

  escalate: async (disputeId: string, reason: string) =>
    apiFetch<ApiResponse<{ dispute: Record<string, unknown> }>>(
      `/admin/disputes/${disputeId}/escalate`,
      {
        method: "PATCH",
        body: { reason },
      },
    ),

  resolve: async (
    disputeId: string,
    data: {
      action: "Full Refund" | "Partial Refund" | "Reject" | "Mediate";
      amount?: number;
      notes?: string;
      notifyParties?: boolean;
      closeCase?: boolean;
    },
  ) =>
    apiFetch<ApiResponse<{ dispute: Record<string, unknown> }>>(
      `/admin/disputes/${disputeId}/resolve`,
      {
        method: "PATCH",
        body: data,
      },
    ),
};
