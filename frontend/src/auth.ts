/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_URL = process.env.API_URL || 'http://localhost:8000';

const ACCESS_KEY = 'petone_access_token';
const REFRESH_KEY = 'petone_refresh_token';

export const tokens = {
  getAccess: (): string | null => localStorage.getItem(ACCESS_KEY),
  getRefresh: (): string | null => localStorage.getItem(REFRESH_KEY),
  set: (pair: { access_token: string; refresh_token: string }): void => {
    localStorage.setItem(ACCESS_KEY, pair.access_token);
    localStorage.setItem(REFRESH_KEY, pair.refresh_token);
  },
  clear: (): void => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export interface User {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface ApiUser {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    phone: u.phone,
    fullName: u.full_name,
    isActive: u.is_active,
    isAdmin: u.is_admin,
    createdAt: u.created_at,
  };
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.detail === 'string') return body.detail;
    if (Array.isArray(body?.detail) && body.detail[0]?.msg) return body.detail[0].msg;
  } catch {
    /* fall through */
  }
  return `Request failed (${response.status})`;
}

export async function register(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      full_name: input.fullName,
      phone: input.phone,
    }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  return mapUser(await response.json());
}

// --- OTP-based phone login ---

export async function requestLoginOtp(mobile: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/login/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
}

export async function verifyLoginOtp(mobile: string, code: string): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, code }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  tokens.set(await response.json());
  return getMe();
}

// --- OTP-based phone signup ---

export async function requestSignupOtp(mobile: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/signup/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
}

export async function verifySignupOtp(input: {
  mobile: string;
  code: string;
  email: string;
  password: string;
  fullName: string;
}): Promise<User> {
  const response = await fetch(`${API_URL}/auth/signup/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile: input.mobile,
      code: input.code,
      email: input.email,
      password: input.password,
      full_name: input.fullName,
    }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  tokens.set(await response.json());
  return getMe();
}

// --- OTP-based password reset ---

export async function requestPasswordReset(mobile: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/password-reset/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
}

export async function completePasswordReset(
  mobile: string,
  code: string,
  newPassword: string,
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/password-reset/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, code, new_password: newPassword }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  tokens.set(await response.json());
  return getMe();
}

export async function login(identifier: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  const pair = await response.json();
  tokens.set(pair);
  return getMe();
}

export async function logout(): Promise<void> {
  const refresh = tokens.getRefresh();
  tokens.clear();
  if (!refresh) return;
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });
  } catch {
    /* network failure while logging out is non-fatal — tokens already cleared */
  }
}

export async function getMe(): Promise<User> {
  const response = await authFetch('/auth/me');
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  return mapUser(await response.json());
}

// --- Orders (server-side per user) ---

export interface Order {
  id: number;
  status: string;
  totalCents: number;
  createdAt: string;
  itemsCount: number;
}

interface ApiOrderItem { product_id: number; quantity: number; unit_price_cents: number }
interface ApiOrder {
  id: number;
  status: string;
  total_cents: number;
  created_at: string;
  items: ApiOrderItem[];
}

export async function listMyOrders(): Promise<Order[]> {
  const response = await authFetch('/orders');
  if (!response.ok) throw new ApiError(response.status, await parseError(response));
  const data: ApiOrder[] = await response.json();
  return data.map((o) => ({
    id: o.id,
    status: o.status,
    totalCents: o.total_cents,
    createdAt: o.created_at,
    itemsCount: o.items.reduce((s, i) => s + i.quantity, 0),
  }));
}

let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refresh = tokens.getRefresh();
    if (!refresh) return false;
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (!response.ok) {
        tokens.clear();
        return false;
      }
      tokens.set(await response.json());
      return true;
    } catch {
      tokens.clear();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/** fetch wrapper that attaches the access token and transparently refreshes on 401. */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const buildHeaders = (token: string | null): Headers => {
    const headers = new Headers(init.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  };

  const access = tokens.getAccess();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: buildHeaders(access),
  });
  if (response.status !== 401) return response;

  const refreshed = await attemptRefresh();
  if (!refreshed) {
    window.dispatchEvent(new Event('petone:auth-expired'));
    return response;
  }
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: buildHeaders(tokens.getAccess()),
  });
}
