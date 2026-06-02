import { apiDownload, apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface ComplianceRecord {
  id: string;
  registration: string;
  vehicle: string;
  color?: string;
  owner: string;
  insuranceStatus: string;
  registrationExpiry: string;
  complianceStatus: string;
}

export interface ComplianceDashboard {
  stats: {
    compliant: number;
    expiringSoon: number;
    overdue: number;
    missingDocs: number;
  };
  banners: { title: string; message: string; type: string }[];
  vehicles: ComplianceRecord[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface ComplianceFilters {
  page?: number;
  limit?: number;
  search?: string;
  quickFilter?: string;
  status?: string;
  ownerId?: string;
  make?: string;
}

export interface VehicleComplianceRecord {
  alerts: { title: string; message: string; type: string }[];
  vehicleInformation: {
    registration: string;
    makeModel: string;
    color: string;
    owner: string;
    overallStatus: string;
  };
  complianceStatusOverview: Record<string, string>;
  documents: { title: string; status: string; details: string }[];
  activeReminders: { title: string; message: string; createdAt?: string }[];
  missingItemsChecklist: { name: string; status: string }[];
  complianceProgress: { completed: number; total: number; text: string };
}

const toQueryString = (filters: ComplianceFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
};

export const complianceApi = {
  getDashboard: async (filters: ComplianceFilters = {}) => {
    const qs = toQueryString(filters);
    return apiFetch<ApiResponse<ComplianceDashboard>>(
      `/admin/compliance/dashboard${qs ? `?${qs}` : ""}`,
    );
  },

  getVehicleRecord: async (vehicleId: string) =>
    apiFetch<ApiResponse<VehicleComplianceRecord>>(
      `/admin/compliance/vehicles/${vehicleId}`,
    ),

  exportCsv: async (filters: ComplianceFilters = {}) => {
    const qs = toQueryString(filters);
    return apiDownload(`/admin/compliance/export/csv${qs ? `?${qs}` : ""}`);
  },
};
