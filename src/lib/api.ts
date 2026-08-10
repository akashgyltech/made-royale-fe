// Thin fetch wrapper around the made-royale-be REST API. Every response is the
// backend's `{ success, data }` envelope (errors: `{ success: false, data: "message" }`,
// see src/middlewares/error.js) — this unwraps that envelope so callers just get `data`
// or a thrown ApiError. Handles Bearer auth + a single silent refresh-and-retry on 401.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface AuthTokens {
  access: { token: string; expires: string };
  refresh: { token: string; expires: string };
}

const ACCESS_KEY = 'mr_access_token';
const REFRESH_KEY = 'mr_refresh_token';

const hasWindow = () => typeof window !== 'undefined';

export function getAccessToken(): string | null {
  if (!hasWindow()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!hasWindow()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens) {
  if (!hasWindow()) return;
  localStorage.setItem(ACCESS_KEY, tokens.access.token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh.token);
}

export function clearTokens() {
  if (!hasWindow()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/store/auth/refresh-tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          clearTokens();
          return null;
        }
        const json = await res.json();
        setTokens(json.data.tokens);
        return json.data.tokens.access.token as string;
      })
      .catch(() => {
        clearTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

async function doFetch(url: string, opts: RequestOptions, token: string | null): Promise<Response> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  return fetch(url, { method: opts.method || 'GET', headers, body });
}

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (opts.params) {
    Object.entries(opts.params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
  }

  let token = opts.auth ? getAccessToken() : null;
  let res = await doFetch(url.toString(), opts, token);

  if (res.status === 401 && opts.auth) {
    token = await refreshAccessToken();
    if (token) res = await doFetch(url.toString(), opts, token);
  }

  let json: { success: boolean; data: unknown } | null = null;
  try {
    json = await res.json();
  } catch {
    // no/invalid JSON body
  }

  if (!res.ok || (json && json.success === false)) {
    const message =
      (json && (typeof json.data === 'string' ? json.data : (json.data as { message?: string })?.message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return (json ? json.data : undefined) as T;
}
