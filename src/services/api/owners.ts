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
  profileImage?: string;
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
  vehicleCount?: string;
  dateJoined?: string;
}

export const ownersApi = {
  /**
   * GET /admin/owners
   * Fetch owners dashboard with KPIs and paginated list
   */
  getOwnersDashboard: async (filters: OwnersFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (
        v !== undefined &&
        v !== "" &&
        v !== "All Status" &&
        v !== "Vehicle Count" &&
        v !== "Compliance"
      ) {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<any>>(
      `/admin/owners${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const stats = payload.stats || {};
    const owners = (payload.owners || []).map((owner: Record<string, any>) => {
      const name = owner.name || "Owner";
      const avatar =
        owner.avatar ||
        owner.profileImage ||
        owner.ownerProfile?.avatar ||
        owner.ownerProfile?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F3F4F6&color=4B5563`;

      return {
        _id: owner.id || owner._id,
        name,
        email: owner.email,
        phone: owner.phone,
        vehicles: owner.vehiclesCount ?? owner.vehicles,
        activeRentals: owner.activeListings,
        revenue: owner.revenue,
        status: owner.status,
        compliance: owner.complianceStatus,
        joinDate: owner.joinDate,
        avatar,
        profileImage: owner.profileImage || avatar,
        id: owner.ownerIdDisplay || owner.id,
        activeListings: owner.activeListings,
      };
    });

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
        pagination: {
          total: payload.pagination?.total ?? payload.pagination?.totalDocuments ?? 0,
          page: payload.pagination?.page ?? payload.pagination?.currentPage ?? 1,
          limit: payload.pagination?.limit ?? filters.limit ?? 10,
          pages: payload.pagination?.pages ?? payload.pagination?.totalPages ?? 1,
          hasNext: payload.pagination?.hasNext ?? false,
          hasPrev: payload.pagination?.hasPrev ?? false,
        },
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
