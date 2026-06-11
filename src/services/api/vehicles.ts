import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface VehicleStats {
  totalVehicles?: number;
  activeVehicles?: number;
  pendingApproval?: number;
  inRental?: number;
  underMaintenance?: number;
  complianceExpiring?: number;
  rejectedListings?: number;
  inactiveVehicles?: number;
}

export interface VehicleAlerts {
  summary?: string;
  expiringInsurances?: number;
  expiringRegistrations?: number;
  missingDocuments?: number;
}

export interface Vehicle {
  _id: string;
  make?: string;
  model?: string;
  year?: number;
  registration?: string;
  status?: string;
  listingStatus?: string;
  availability?: string;
  rentalStatus?: string;
  category?: string;
  isAvailable?: boolean;
  ownerId?: string;
  ownerName?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  complianceStatus?: string;
  insuranceStatus?: string;
  currentDriver?: string;
  createdAt?: string;
}

export interface AdminVehicleDetail {
  vehicleOverview: {
    _id: string;
    registration: string;
    makeModel: string;
    make?: string;
    model?: string;
    year?: string | number;
    category?: string;
    mainPhoto?: string | null;
    additionalPhotos?: string[];
    images?: string[];
    engine?: string;
    transmission?: string;
    fuelType?: string;
    mileage?: string;
    vin?: string;
    listingStatus?: string;
    rentalStatus?: string;
    isAvailable?: boolean;
    seatingCapacity?: string;
    features?: string[];
    registrationExpiryDisplay?: string | null;
    registrationExpiryStatus?: string | null;
    insuranceExpiryDisplay?: string | null;
    insuranceExpiryStatus?: string | null;
  };
  complianceExpiry?: {
    registration?: {
      expiryDate?: string | null;
      displayDate?: string | null;
      status?: string | null;
      documentUrl?: string | null;
    };
    insurance?: {
      expiryDate?: string | null;
      displayDate?: string | null;
      status?: string | null;
      documentUrl?: string | null;
    };
  };
  listingDetails: {
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    securityDeposit?: number;
    listingCreated?: string;
    lastUpdated?: string;
    description?: string;
  };
  currentRentalAgreement?: {
    driver?: string;
    agreementId?: string;
    startDate?: string;
    endDate?: string;
    rentalType?: string;
    status?: string;
  } | null;
  maintenanceHistory: {
    id: string;
    event: string;
    date?: string;
    reading?: string;
    status?: string;
    cost?: string;
    description?: string;
  }[];
  ownerInformation: {
    id?: string;
    fullName?: string;
    businessName?: string;
    email?: string;
    phone?: string;
    avatar?: string | null;
    memberSince?: string | null;
    totalVehicles?: string;
  };
  complianceDocuments: Record<
    string,
    { title: string; expiry?: string; status?: string; url?: string | null }
  >;
  utilizationMetrics: {
    thisMonth?: string;
    last3Months?: string;
    allTime?: string;
    totalRentals?: number;
    totalRevenue?: string;
  };
  alerts: { type?: string; severity?: string; title: string; message: string }[];
  auditTrail: {
    _id: string;
    title: string;
    description?: string;
    status?: string;
    createdAt?: string;
  }[];
}

export interface ApprovalReview {
  listingDetails: {
    registration?: string;
    vin?: string;
    makeModel?: string;
    dailyRate?: number | string;
    securityDeposit?: number | string;
    mileage?: string;
    fuelType?: string;
    description?: string;
    status?: string;
    submittedAt?: string;
  };
  photos: { primary?: string | null; gallery?: string[] };
  complianceDocuments: Record<string, { status: string; expiry?: string }>;
  ownerSnapshot: {
    name?: string;
    ownerId?: string;
    email?: string;
    phone?: string;
    kycStatus?: string;
    accountStatus?: string;
    totalVehicles?: number;
    memberSince?: string;
  };
  complianceChecklist: Record<string, boolean | string>;
  riskFlags: Record<string, boolean>;
  activityLog: { action: string; date?: string; status?: string }[];
}

export interface VehicleFilters {
  page?: number;
  limit?: number;
  registration?: string;
  makeModel?: string;
  adminListingStatus?: string;
  availability?: boolean;
  rentalStatus?: string;
  ownerId?: string;
  dateFromAdded?: string;
  dateToAdded?: string;
}

interface AdminVehicleListItem {
  _id?: string;
  id?: string;
  make?: string;
  model?: string;
  year?: number;
  registration?: string;
  status?: string;
  rentalStatus?: string;
  listingStatus?: string;
  adminListingStatus?: string;
  availability?: string;
  category?: string;
  isAvailable?: boolean;
  ownerId?: string;
  ownerName?: string;
  owner?: {
    _id?: string;
    businessName?: string;
    fullName?: string;
    email?: string;
  };
  insuranceExpiry?: string;
  registrationExpiry?: string;
  complianceStatus?: string;
  insuranceStatus?: string;
  currentDriver?: string;
  dateAdded?: string;
  createdAt?: string;
  makeModel?: string;
}

interface VehiclesApiPayload {
  vehicles?: AdminVehicleListItem[];
  data?: AdminVehicleListItem[];
  pagination?: {
    total?: number;
    page?: number;
    pages?: number;
  };
  total?: number;
  page?: number;
  pages?: number;
  stats?: VehicleStats;
  alerts?: VehicleAlerts;
}

export interface VehiclesDashboardData {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pages: number;
  stats?: VehicleStats;
  alerts?: VehicleAlerts;
}

const mapVehicle = (item: AdminVehicleListItem): Vehicle => {
  const owner = item.owner || {};
  const makeModel = item.makeModel || "";
  const [make, ...modelParts] = String(makeModel).split(" ");

  return {
    _id: item._id || item.id || "",
    make: item.make || make || undefined,
    model: item.model || (modelParts.length ? modelParts.join(" ") : undefined),
    year: item.year,
    registration: item.registration,
    status: item.rentalStatus || item.status,
    listingStatus: item.listingStatus || item.adminListingStatus,
    availability: item.availability,
    rentalStatus: item.rentalStatus || item.status,
    category: item.category,
    isAvailable: item.isAvailable,
    ownerId: owner._id || item.ownerId,
    ownerName:
      owner.businessName || owner.fullName || owner.email || item.ownerName,
    insuranceExpiry: item.insuranceExpiry,
    registrationExpiry: item.registrationExpiry,
    complianceStatus: item.complianceStatus || item.insuranceStatus,
    insuranceStatus: item.insuranceStatus,
    currentDriver: item.currentDriver,
    createdAt: item.dateAdded || item.createdAt,
  };
};

export const vehiclesApi = {
  getVehicles: async (filters: VehicleFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === "") return;
      if (k === "adminListingStatus" && v === "All Status") return;
      params.set(k, String(v));
    });
    const qs = params.toString();
    const res = await apiFetch<ApiResponse<VehiclesApiPayload>>(
      `/admin/vehicles${qs ? `?${qs}` : ""}`,
    );

    const payload = res.data || {};
    const pagination = payload.pagination || {};
    const vehicles = (payload.vehicles || payload.data || []).map(mapVehicle);

    return {
      ...res,
      data: {
        vehicles,
        total: pagination.total ?? payload.total ?? 0,
        page: pagination.page ?? payload.page ?? 1,
        pages: pagination.pages ?? payload.pages ?? 1,
        stats: payload.stats,
        alerts: payload.alerts,
      },
    } as ApiResponse<VehiclesDashboardData>;
  },

  getVehicleById: async (id: string) =>
    apiFetch<ApiResponse<AdminVehicleDetail>>(`/admin/vehicles/${id}`),

  getApprovalReview: async (id: string) =>
    apiFetch<ApiResponse<ApprovalReview>>(
      `/admin/vehicles/${id}/approval-review`,
    ),

  createVehicle: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Vehicle>>("/admin/vehicles", {
      method: "POST",
      body: data,
    }),

  updateVehicle: async (id: string, data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Vehicle>>(`/admin/vehicles/${id}`, {
      method: "PUT",
      body: data,
    }),

  updateListingStatus: async (
    id: string,
    newStatus: "Approved" | "Pending" | "Rejected" | "Inactive",
    reason?: string,
  ) =>
    apiFetch<ApiResponse<Vehicle>>(`/admin/vehicles/${id}/status`, {
      method: "PATCH",
      body: { newStatus, reason },
    }),

  getComplianceDashboard: async () =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      "/admin/compliance/dashboard",
    ),

  getVehicleCompliance: async (vehicleId: string) =>
    apiFetch<ApiResponse<Record<string, unknown>>>(
      `/admin/compliance/vehicles/${vehicleId}`,
    ),

  getPendingApprovals: async (
    filters: { page?: number; limit?: number } = {},
  ) =>
    vehiclesApi.getVehicles({
      page: filters.page,
      limit: filters.limit,
      adminListingStatus: "Pending",
    }),
};
