import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface FinanceOverview {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  outstanding: number;
  incomeChange?: number;
  expenseChange?: number;
  monthlyData?: { month: string; income: number; expense: number }[];
}

export interface Transaction {
  _id: string;
  transactionTitle?: string;
  amount: number;
  transactionType?: string;
  description?: string;
  driverName?: string;
  agreementId?: string;
  createdAt?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface LoanRecord {
  _id: string;
  vehicleName?: string;
  lenderName?: string;
  loanAmount?: number;
  interestRate?: number;
  status?: string;
  monthlyRepayment?: number;
  remainingBalance?: number;
  startDate?: string;
  endDate?: string;
}

export interface PurchaseRecord {
  _id: string;
  vehicleName?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  status?: string;
  supplierId?: string;
  supplierName?: string;
  notes?: string;
}

export interface InvoiceRecord {
  _id: string;
  invoiceNumber?: string;
  clientName?: string;
  amount?: number;
  status?: string;
  dueDate?: string;
  createdAt?: string;
}

export interface RefundRecord {
  _id: string;
  refundId?: string;
  driverName?: string;
  amount?: number;
  reason?: string;
  status?: string;
  createdAt?: string;
}

export interface PlOverviewData {
  period?: string;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  categories?: Record<string, number>;
  monthlyBreakdown?: Record<string, unknown>[];
  trendData?: { name: string; income: number; expenses: number }[];
  expenseBreakdown?: { name: string; value: number; color: string }[];
}

export const financeApi = {
  getOverview: async (timePeriod = "monthly") =>
    apiFetch<ApiResponse<FinanceOverview>>(
      `/admin/finance/overview?timePeriod=${timePeriod}`,
    ),

  getTransactions: async (filters: TransactionFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && !String(v).startsWith("All")) {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ transactions: Transaction[]; total: number; page: number; pages: number }>>(
      `/admin/finance/transactions${qs ? `?${qs}` : ""}`,
    );
  },

  createTransaction: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<Transaction>>("/admin/finance/transactions", {
      method: "POST",
      body: data,
    }),

  checkDuplicate: async (payload: { amount: number; title: string; type: string }) =>
    apiFetch<ApiResponse<{ isDuplicate: boolean }>>("/admin/finance/transactions/check-duplicate", {
      method: "POST",
      body: payload,
    }),

  // Vehicle Finance (Loans)
  getVehicleFinanceDashboard: async (filters: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ loans: LoanRecord[]; kpis: Record<string, unknown>; total: number }>>(
      `/admin/finance/loans/dashboard${qs ? `?${qs}` : ""}`,
    );
  },

  createVehicleFinance: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<LoanRecord>>("/admin/finance/loans", {
      method: "POST",
      body: data,
    }),

  getVehicleFinanceDetail: async (financeId: string) =>
    apiFetch<ApiResponse<LoanRecord>>(`/admin/finance/loans/${financeId}`),

  // Vehicle Purchase
  getVehiclePurchaseDashboard: async (filters: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ purchases: PurchaseRecord[]; kpis: Record<string, unknown>; total: number }>>(
      `/admin/finance/purchases/dashboard${qs ? `?${qs}` : ""}`,
    );
  },

  getVehiclePurchaseDetail: async (purchaseId: string) =>
    apiFetch<ApiResponse<PurchaseRecord>>(`/admin/finance/purchases/${purchaseId}`),

  updateVehiclePurchase: async (purchaseId: string, data: Record<string, unknown>) =>
    apiFetch<ApiResponse<PurchaseRecord>>(`/admin/finance/purchases/${purchaseId}`, {
      method: "PUT",
      body: data,
    }),

  // Invoices
  getInvoiceDashboard: async (filters: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ invoices: InvoiceRecord[]; kpis: Record<string, unknown>; total: number }>>(
      `/admin/finance/invoices/dashboard${qs ? `?${qs}` : ""}`,
    );
  },

  createInvoice: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<InvoiceRecord>>("/admin/finance/invoices", {
      method: "POST",
      body: data,
    }),

  // Refunds
  getRefundDashboard: async (filters: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ refunds: RefundRecord[]; kpis: Record<string, unknown>; total: number }>>(
      `/admin/finance/refunds/dashboard${qs ? `?${qs}` : ""}`,
    );
  },

  createRefund: async (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<RefundRecord>>("/admin/finance/refunds", {
      method: "POST",
      body: data,
    }),

  // P&L Overview
  getPlOverview: async (filters: { timePeriod?: string; year?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<PlOverviewData>>(
      `/admin/finance/pl-overview${qs ? `?${qs}` : ""}`,
    );
  },
};
