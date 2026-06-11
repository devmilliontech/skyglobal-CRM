import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };
type ApiRecord = Record<string, unknown>;

export type PromoDiscountType = "percentage" | "fixed";

export interface PromoCode {
  _id: string;
  code: string;
  discountType: PromoDiscountType;
  discountValue: number;
  minBookingDays: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromoCodePayload {
  code: string;
  discountType: PromoDiscountType;
  discountValue: number;
  minBookingDays: number;
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface PromoCodeFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | "";
}

export interface PromoCodesListData {
  promoCodes: PromoCode[];
  total: number;
  page: number;
  pages: number;
}

const asRecord = (value: unknown): ApiRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : {};

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const asString = (value: unknown, fallback = ""): string =>
  value === undefined || value === null ? fallback : String(value);

const asBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
};

const normalizeDiscountType = (value: unknown): PromoDiscountType =>
  String(value).toLowerCase() === "fixed" ? "fixed" : "percentage";

const mapPromoCode = (item: unknown): PromoCode => {
  const record = asRecord(item);
  return {
    _id: asString(record._id || record.id),
    code: asString(record.code).toUpperCase(),
    discountType: normalizeDiscountType(record.discountType),
    discountValue: asNumber(record.discountValue),
    minBookingDays: asNumber(record.minBookingDays, 1),
    maxUses: asNumber(record.maxUses, 1),
    usedCount: asNumber(
      record.usedCount ??
        record.currentUses ??
        record.usageCount ??
        record.used,
    ),
    expiresAt: asString(record.expiresAt),
    isActive: asBoolean(record.isActive, true),
    createdAt: record.createdAt ? asString(record.createdAt) : undefined,
    updatedAt: record.updatedAt ? asString(record.updatedAt) : undefined,
  };
};

const normalizeListResponse = (
  res: ApiResponse<ApiRecord>,
): ApiResponse<PromoCodesListData> => {
  const payload = asRecord(res.data);
  const pagination = asRecord(payload.pagination);
  const rawList =
    payload.promoCodes ||
    payload.promos ||
    payload.items ||
    payload.data ||
    [];

  return {
    ...res,
    data: {
      promoCodes: Array.isArray(rawList) ? rawList.map(mapPromoCode) : [],
      total: asNumber(pagination.total ?? payload.total),
      page: asNumber(pagination.page ?? payload.page, 1),
      pages: asNumber(pagination.pages ?? payload.pages ?? payload.totalPages, 1),
    },
  };
};

export const promoCodesApi = {
  getPromoCodes: async (filters: PromoCodeFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === "") return;
      params.set(key, String(value));
    });

    const qs = params.toString();
    const res = await apiFetch<ApiResponse<ApiRecord>>(
      `/admin/promo-codes${qs ? `?${qs}` : ""}`,
      { cache: "no-store" },
    );

    return normalizeListResponse(res);
  },

  createPromoCode: async (payload: PromoCodePayload) =>
    apiFetch<ApiResponse<PromoCode>>("/admin/promo-codes", {
      method: "POST",
      body: payload,
    }),

  updatePromoCode: async (
    promoCodeId: string,
    payload: Partial<PromoCodePayload>,
  ) =>
    apiFetch<ApiResponse<PromoCode>>(`/admin/promo-codes/${promoCodeId}`, {
      method: "PATCH",
      body: payload,
    }),

  deletePromoCode: async (promoCodeId: string) =>
    apiFetch<ApiResponse<{ deleted?: boolean }>>(
      `/admin/promo-codes/${promoCodeId}`,
      { method: "DELETE" },
    ),
};
