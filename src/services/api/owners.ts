import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface Owner {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  vehicles?: number;
  activeRentals?: number;
  revenue?: string;
  status?: string;
  compliance?: string;
  joinDate?: string;
  avatar?: string;
}

export interface OwnerStats {
  totalOwners: number;
  activeOwners: number;
  totalVehicles: number;
  complianceIssues: number;
}

export interface OwnersFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  compliance?: string;
}

export const ownersApi = {
  /**
   * GET /admin/owners
   * Fetch owners dashboard with KPIs and paginated list
   */
  getOwnersDashboard: async (filters: OwnersFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<any>>(
      `/admin/owners${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const stats = payload.stats || {};
    const owners = (payload.owners || []).map((owner: Record<string, any>) => ({
      _id: owner.id || owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      vehicles: owner.vehiclesCount ?? owner.vehicles,
      activeRentals: owner.activeListings,
      revenue: owner.revenue,
      status: owner.status,
      compliance: owner.complianceStatus,
      joinDate: owner.joinDate,
      avatar: owner.avatar,
      id: owner.ownerIdDisplay || owner.id,
      activeListings: owner.activeListings,
    }));

    return {
      ...res,
      data: {
        stats: {
          totalOwners: stats.totalOwners ?? 0,
          activeOwners: stats.activeOwners ?? 0,
          totalVehicles: stats.totalVehicles ?? stats.vehiclesOwned ?? 0,
          complianceIssues: stats.complianceIssues ?? 0,
        },
        owners,
        pagination: payload.pagination,
      },
    } as ApiResponse<{ stats: OwnerStats; owners: Owner[]; pagination: any }>;
  },

  /**
   * GET /admin/owners/stats
   * Fetch owner statistics only
   */
  getOwnerStats: async () =>
    apiFetch<ApiResponse<OwnerStats>>(`/admin/owners/stats`),

  /**
   * GET /admin/owners/:ownerId
   * Fetch a single owner by ID
   */
  getOwnerById: async (ownerId: string) =>
    apiFetch<ApiResponse<Owner & { vehicles: any[]; profile: any }>>(
      `/admin/owners/${ownerId}`,
    ),

  /**
   * POST /admin/owners/export
   * Export owners list
   */
  exportOwners: async (
    options: { format?: string; status?: string; search?: string } = {},
  ) =>
    apiFetch<
      ApiResponse<{
        exportedAt: string;
        format: string;
        totalRecords: number;
        owners: Owner[];
      }>
    >(`/admin/owners/export`, { method: "POST", body: options }),
};
