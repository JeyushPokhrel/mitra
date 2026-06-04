// Centralized API service layer for MITRA SaaS application

const API_BASE_URL = "http://localhost:5000/api";

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("mitra_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let errMsg = "Something went wrong";
    try {
      const errJson = await res.json();
      errMsg = errJson.message || errMsg;
    } catch (e) {
      // ignore
    }
    throw new Error(errMsg);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });
  return handleResponse(response);
};

// API Modules
export const authApi = {
  login: (credentials: any) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (data: any) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getProfile: () => apiRequest("/auth/profile"),
};

export const visitorApi = {
  getAll: () => apiRequest("/visitors"),
  getById: (id: string) => apiRequest(`/visitors/${id}`),
  upsert: (data: any) =>
    apiRequest("/visitors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, patch: any) =>
    apiRequest(`/visitors/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  delete: (id: string) =>
    apiRequest(`/visitors/${id}`, {
      method: "DELETE",
    }),
};

export const activityApi = {
  getAll: (visitorId?: string) =>
    apiRequest(`/activity${visitorId ? `?visitorId=${visitorId}` : ""}`),
  create: (data: any) =>
    apiRequest("/activity", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const ticketApi = {
  getAll: () => apiRequest("/tickets"),
  getById: (id: string) => apiRequest(`/tickets/${id}`),
  create: (data: any) =>
    apiRequest("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, patch: any) =>
    apiRequest(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  delete: (id: string) =>
    apiRequest(`/tickets/${id}`, {
      method: "DELETE",
    }),
  bulkDelete: (ids: string[]) =>
    apiRequest("/tickets/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
  bulkAssign: (ids: string[], assignee: string | null) =>
    apiRequest("/tickets/bulk-assign", {
      method: "POST",
      body: JSON.stringify({ ids, assignee }),
    }),
  merge: (ids: string[]) =>
    apiRequest("/tickets/merge", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
};

export const campaignApi = {
  getAll: () => apiRequest("/campaigns"),
  create: (data: any) =>
    apiRequest("/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const workforceApi = {
  getOrg: () => apiRequest("/workforce/organization"),
  updateOrg: (patch: any) =>
    apiRequest("/workforce/organization", {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  getTeams: () => apiRequest("/workforce/teams"),
  createTeam: (data: any) =>
    apiRequest("/workforce/teams", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTeam: (id: string, patch: any) =>
    apiRequest(`/workforce/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  deleteTeam: (id: string) =>
    apiRequest(`/workforce/teams/${id}`, {
      method: "DELETE",
    }),
  getAgents: () => apiRequest("/workforce/agents"),
  inviteAgent: (data: any) =>
    apiRequest("/workforce/agents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAgent: (id: string, patch: any) =>
    apiRequest(`/workforce/agents/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  deleteAgent: (id: string) =>
    apiRequest(`/workforce/agents/${id}`, {
      method: "DELETE",
    }),
  getShifts: () => apiRequest("/workforce/shifts"),
  createShift: (data: any) =>
    apiRequest("/workforce/shifts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteShift: (id: string) =>
    apiRequest(`/workforce/shifts/${id}`, {
      method: "DELETE",
    }),
  getPermissions: () => apiRequest("/workforce/permissions"),
  updatePermission: (data: any) =>
    apiRequest("/workforce/permissions", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const integrationApi = {
  getAll: () => apiRequest("/integrations"),
  toggle: (name: string) =>
    apiRequest("/integrations", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
};

export const billingApi = {
  getAll: () => apiRequest("/billing"),
};

export const notificationApi = {
  getAll: () => apiRequest("/notifications"),
  markRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, {
      method: "PUT",
    }),
  markAllRead: () =>
    apiRequest("/notifications/read-all", {
      method: "PUT",
    }),
};

export const aiApi = {
  runAction: (action: string, text?: string) =>
    apiRequest("/ai", {
      method: "POST",
      body: JSON.stringify({ action, text }),
    }),
};

export const crmApi = {
  getContacts: () => apiRequest("/crm/contacts"),
  createContact: (data: any) =>
    apiRequest("/crm/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateContact: (id: string, patch: any) =>
    apiRequest(`/crm/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  deleteContact: (id: string) =>
    apiRequest(`/crm/contacts/${id}`, {
      method: "DELETE",
    }),
  bulkDeleteContacts: (ids: string[]) =>
    apiRequest("/crm/contacts/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
  bulkAssignContacts: (ids: string[], owner: string) =>
    apiRequest("/crm/contacts/bulk-assign", {
      method: "POST",
      body: JSON.stringify({ ids, owner }),
    }),
  getCompanies: () => apiRequest("/crm/companies"),
  getDeals: () => apiRequest("/crm/deals"),
  createDeal: (data: any) =>
    apiRequest("/crm/deals", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDeal: (id: string, patch: any) =>
    apiRequest(`/crm/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
};

export const conversationApi = {
  getAll: () => apiRequest("/conversations"),
  update: (id: string, patch: any) =>
    apiRequest(`/conversations/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  getMessages: (id: string) => apiRequest(`/conversations/${id}/messages`),
  sendMessage: (id: string, data: any) =>
    apiRequest(`/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  editMessage: (id: string, msgId: string, body: string) =>
    apiRequest(`/conversations/${id}/messages/${msgId}`, {
      method: "PUT",
      body: JSON.stringify({ body }),
    }),
  deleteMessage: (id: string, msgId: string) =>
    apiRequest(`/conversations/${id}/messages/${msgId}`, {
      method: "DELETE",
    }),
};
