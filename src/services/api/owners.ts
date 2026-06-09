import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

type RawOwnerProfile = {
  avatar?: string | null;
  profileImage?: string | null;
};

type RawOwner = {
  _id?: string;
  id?: string;
  ownerId?: string;
  ownerIdDisplay?: string;
  name?: string;
  email?: string;
  phone?: string;
  vehiclesCount?: number | string;
  vehicles?: number | string;
  activeListings?: number | string;
  activeRentals?: number | string;
  revenue?: number | string;
  status?: string;
  compliance?: string;
  complianceStatus?: string;
  joinDate?: string;
  avatar?: string | null;
  profileImage?: string | null;
  ownerProfile?: RawOwnerProfile | null;
};

type PaginationPayload = {
  total?: number;
  totalDocuments?: number;
  page?: number;
  currentPage?: number;
  limit?: number;
  pages?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

type OwnersDashboardPayload = {
  stats?: Partial<OwnerStats> & { vehiclesOwned?: number };
  owners?: RawOwner[];
  pagination?: PaginationPayload;
};

type OwnerDetailPayload = RawOwner & {
  owner?: RawOwner;
  profile?: unknown;
  vehiclesList?: unknown[];
  vehiclesData?: unknown[];
  documents?: unknown[];
  activityLog?: unknown[];
};

export interface Owner {
  _id: string;
  id?: string;
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
  activeListings?: number;
}

export interface OwnerReview extends Owner {
  profile?: unknown;
  vehiclesList?: unknown[];
  documents?: unknown[];
  activityLog?: unknown[];
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

export interface OwnerUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  complianceStatus?: string;
  notes?: string;
}

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const normalizeOwner = (owner: RawOwner): Owner => {
  const name = owner.name || "Owner";
  const backendId = owner._id || owner.id || owner.ownerId || "";
  const displayId = owner.ownerIdDisplay || owner.ownerId || owner.id || backendId;
  const avatar =
    owner.avatar ||
    owner.profileImage ||
    owner.ownerProfile?.avatar ||
    owner.ownerProfile?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F3F4F6&color=4B5563`;

  return {
    _id: backendId,
    id: displayId,
    name,
    email: owner.email,
    phone: owner.phone,
    vehicles: toNumber(owner.vehiclesCount ?? owner.vehicles),
    activeRentals: toNumber(owner.activeRentals ?? owner.activeListings),
    activeListings: toNumber(owner.activeListings ?? owner.activeRentals),
    revenue:
      owner.revenue === undefined || owner.revenue === null
        ? undefined
        : String(owner.revenue),
    status: owner.status,
    compliance: owner.complianceStatus || owner.compliance,
    joinDate: owner.joinDate,
    avatar,
    profileImage: owner.profileImage || avatar,
  };
};

const normalizeOwnerReview = (payload: OwnerDetailPayload): OwnerReview => {
  const rawOwner = payload.owner || payload;

  return {
    ...normalizeOwner(rawOwner),
    profile: payload.profile,
    vehiclesList: payload.vehiclesList || payload.vehiclesData,
    documents: payload.documents,
    activityLog: payload.activityLog,
  };
};

const ownerPath = (ownerId: string) =>
  `/admin/owners/${encodeURIComponent(ownerId)}`;

export const ownersApi = {
  /**
   * GET /admin/owners
   * Fetch owners dashboard with KPIs and paginated list.
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
    const res = await apiFetch<ApiResponse<OwnersDashboardPayload>>(
      `/admin/owners${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const stats = payload.stats || {};
    const owners = Array.isArray(payload.owners)
      ? payload.owners.map(normalizeOwner)
      : [];

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
          total:
            payload.pagination?.total ??
            payload.pagination?.totalDocuments ??
            0,
          page:
            payload.pagination?.page ??
            payload.pagination?.currentPage ??
            1,
          limit: payload.pagination?.limit ?? filters.limit ?? 10,
          pages:
            payload.pagination?.pages ??
            payload.pagination?.totalPages ??
            1,
          hasNext: payload.pagination?.hasNext ?? false,
          hasPrev: payload.pagination?.hasPrev ?? false,
        },
      },
    } as ApiResponse<{
      stats: OwnerStats;
      owners: Owner[];
      pagination: Required<PaginationPayload>;
    }>;
  },

  /**
   * GET /admin/owners/stats
   * Fetch owner statistics only.
   */
  getOwnerStats: async () =>
    apiFetch<ApiResponse<OwnerStats>>(`/admin/owners/stats`),

  /**
   * GET /admin/owners/:ownerId
   * Fetch a single owner by ID.
   */
  getOwnerById: async (ownerId: string) => {
    const res = await apiFetch<ApiResponse<OwnerDetailPayload>>(
      ownerPath(ownerId),
    );

    return {
      ...res,
      data: normalizeOwnerReview(res.data || {}),
    } as ApiResponse<OwnerReview>;
  },

  /**
   * GET /admin/owners/:ownerId
   * Action endpoint used by the table review button.
   */
  reviewOwner: async (ownerId: string) => ownersApi.getOwnerById(ownerId),

  /**
   * PUT /admin/owners/:ownerId
   * Action endpoint used by the table edit button.
   */
  updateOwner: async (ownerId: string, data: OwnerUpdateRequest) => {
    const res = await apiFetch<ApiResponse<OwnerDetailPayload>>(
      ownerPath(ownerId),
      {
        method: "PUT",
        body: data,
      },
    );

    return {
      ...res,
      data: normalizeOwnerReview(res.data || {}),
    } as ApiResponse<OwnerReview>;
  },

  /**
   * DELETE /admin/owners/:ownerId
   * Action endpoint used by the table delete button.
   */
  deleteOwner: async (ownerId: string) =>
    apiFetch<
      ApiResponse<{
        ownerId: string;
        deletedAt?: string;
      }>
    >(ownerPath(ownerId), { method: "DELETE" }),

  /**
   * POST /admin/owners/export
   * Export owners list.
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
