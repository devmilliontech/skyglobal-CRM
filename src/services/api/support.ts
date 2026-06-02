import { apiFetch } from "./client";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export interface Ticket {
  _id: string;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  category?: string;
  assignedTo?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lastResponse?: string;
}

export interface TicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  avgResponseTime: string;
  satisfactionRate: string;
  chartData: { day: string; tickets: number }[];
}

export interface SystemService {
  name: string;
  status: string;
  uptime: string;
  responseTime: string;
}

export interface TicketsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}

export const supportApi = {
  /**
   * GET /admin/support/tickets
   */
  getTickets: async (filters: TicketsFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const qs = params.toString();
    return apiFetch<ApiResponse<{ tickets: Ticket[]; pagination: any }>>(
      `/admin/support/tickets${qs ? `?${qs}` : ""}`,
    );
  },

  /**
   * GET /admin/support/tickets/stats
   */
  getTicketStats: async () =>
    apiFetch<ApiResponse<TicketStats>>("/admin/support/tickets/stats"),

  /**
   * POST /admin/support/tickets
   */
  createTicket: async (data: Partial<Ticket>) =>
    apiFetch<ApiResponse<Ticket>>("/admin/support/tickets", {
      method: "POST",
      body: data,
    }),

  /**
   * PUT /admin/support/tickets/:ticketId
   */
  updateTicket: async (ticketId: string, data: Partial<Ticket>) =>
    apiFetch<ApiResponse<Ticket>>(`/admin/support/tickets/${ticketId}`, {
      method: "PUT",
      body: data,
    }),

  /**
   * GET /admin/support/system-status
   */
  getSystemStatus: async () =>
    apiFetch<ApiResponse<{ overall: string; services: SystemService[] }>>(
      "/admin/support/system-status",
    ),
};
