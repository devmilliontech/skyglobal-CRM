import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  lastActive?: string;
  createdAt?: string;
  avatar?: string;
  profileImage?: string;
  driverProfile?: {
    avatar?: string | null;
    profileImage?: string | null;
  } | null;
  ownerProfile?: {
    avatar?: string | null;
    profileImage?: string | null;
  } | null;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  roleDistribution: {
    superAdmin: number;
    admin: number;
    user: number;
  };
}

type RawUserStats = {
  totalUsers?: number;
  activeUsers?: number;
  suspendedUsers?: number;
  roleDistribution?: Record<string, number>;
};

type RawUserRecord = Partial<User> & Record<string, unknown>;

type UsersApiPayload = {
  stats?: RawUserStats;
  users?: RawUserRecord[];
  data?: RawUserRecord[];
  pagination?: unknown;
} & Record<string, unknown>;

const mapRoleDistribution = (
  roleDistribution: Record<string, number> = {},
) => ({
  superAdmin: roleDistribution.SUPER_ADMIN ?? 0,
  admin: roleDistribution.ADMIN ?? 0,
  user: (roleDistribution.OWNER ?? 0) + (roleDistribution.CUSTOMER ?? 0),
});

export interface UsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

const getUserAvatar = (user: RawUserRecord) =>
  user.avatar ||
  user.profileImage ||
  user.driverProfile?.avatar ||
  user.driverProfile?.profileImage ||
  user.ownerProfile?.avatar ||
  user.ownerProfile?.profileImage ||
  "";

const mapUser = (user: RawUserRecord): User => {
  const avatar = getUserAvatar(user);

  return {
    ...user,
    _id: user._id || "",
    avatar,
    profileImage: user.profileImage || avatar,
  };
};

export const usersApi = {
  /**
   * GET /admin/users
   * Fetch users list with pagination and filters
   */
  getUsers: async (filters: UsersFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<UsersApiPayload>>(
      `/admin/users${qs ? `?${qs}` : ""}`,
    );

    const stats: RawUserStats = res.data?.stats || {};
    const mappedStats: UserStats = {
      totalUsers: stats.totalUsers ?? 0,
      activeUsers: stats.activeUsers ?? 0,
      suspendedUsers: stats.suspendedUsers ?? 0,
      roleDistribution: mapRoleDistribution(stats.roleDistribution),
    };
    const dataRows = Array.isArray(res.data?.data)
      ? res.data.data.map(mapUser)
      : undefined;
    const users =
      dataRows ??
      (Array.isArray(res.data?.users) ? res.data.users.map(mapUser) : []);

    return {
      ...res,
      data: {
        ...res.data,
        stats: mappedStats,
        users,
        ...(dataRows ? { data: dataRows } : {}),
      },
    } as ApiResponse<{ stats: UserStats; users: User[]; pagination: unknown }>;
  },

  /**
   * GET /admin/users/stats
   * Fetch user statistics only
   */
  getUserStats: async () => {
    const res = await apiFetch<ApiResponse<RawUserStats>>(`/admin/users/stats`);
    const stats: RawUserStats = res.data || {};
    return {
      ...res,
      data: {
        totalUsers: stats.totalUsers ?? 0,
        activeUsers: stats.activeUsers ?? 0,
        suspendedUsers: stats.suspendedUsers ?? 0,
        roleDistribution: mapRoleDistribution(stats.roleDistribution),
      },
    } as ApiResponse<UserStats>;
  },

  /**
   * GET /admin/users/:userId
   * Fetch a single user by ID
   */
  getUserById: async (userId: string) => {
    const res = await apiFetch<ApiResponse<RawUserRecord>>(
      `/admin/users/${userId}`,
    );
    return {
      ...res,
      data: mapUser(res.data || {}),
    } as ApiResponse<User>;
  },

  /**
   * POST /admin/users
   * Create a new user
   */
  createUser: async (data: {
    email: string;
    password?: string;
    role?: string;
    status?: string;
  }) =>
    apiFetch<ApiResponse<User>>(`/admin/users`, {
      method: "POST",
      body: data,
    }),

  /**
   * PUT /admin/users/:userId
   * Update a user
   */
  updateUser: async (
    userId: string,
    data: { email?: string; role?: string; status?: string },
  ) =>
    apiFetch<ApiResponse<User>>(`/admin/users/${userId}`, {
      method: "PUT",
      body: data,
    }),
};
