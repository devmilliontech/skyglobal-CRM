const resolveBaseUrl = () => {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBase && envBase.trim()) {
    return envBase.replace(/\/$/, "");
  }
  return "http://localhost:5000/api/v1";
};

const API_BASE_URL = resolveBaseUrl();

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Retrieve the admin JWT token from localStorage (client-side only).
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    null
  );
};

/**
 * Core API fetch wrapper.
 * - Automatically attaches the Bearer token from localStorage.
 * - On 401/403, redirects to the login screen.
 * - On non-OK responses, throws with the server message.
 */
export const apiFetch = async <T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(options.headers || {});

  // Attach Bearer token
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const requestBody: BodyInit | undefined = options.body
    ? isFormData
      ? (options.body as FormData)
      : JSON.stringify(options.body)
    : undefined;

  // Set Content-Type for JSON bodies
  if (options.body && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: requestBody,
    credentials: "include",
  });

  // Handle 401/403 — redirect to login
  if (response.status === 401 || response.status === 403) {
    console.error(`[API] ${response.status} — redirecting to login`);
    if (typeof window !== "undefined") {
      // Clear stale tokens
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
      window.location.href = "/signin";
    }
    throw new Error(
      response.status === 401 ? "Unauthorized — please log in" : "Forbidden",
    );
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload as T;
};

export const apiDownload = async (path: string): Promise<Blob> => {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers();

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { credentials: "include", headers });

  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
      window.location.href = "/signin";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error("Download failed");
  }
  return response.blob();
};

/* ────────────────────────────────────────────
 * Utility helpers for QA / data mapping
 * ──────────────────────────────────────────── */

/**
 * Format a number as currency (USD). Returns "$0.00" if value is NaN/null/undefined.
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currency = "USD",
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num == null || isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format an ISO date string (from Mongoose) into a human-readable string.
 * Returns "--" for null/undefined/invalid dates.
 */
export const formatDate = (
  isoString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!isoString) return "--";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
};
