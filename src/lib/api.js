
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
export class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
const ACCESS_KEY = 'mr_access_token';
const REFRESH_KEY = 'mr_refresh_token';
const hasWindow = () => typeof window !== 'undefined';
export function getAccessToken() {
    if (!hasWindow())
        return null;
    return localStorage.getItem(ACCESS_KEY);
}
export function getRefreshToken() {
    if (!hasWindow())
        return null;
    return localStorage.getItem(REFRESH_KEY);
}
export function setTokens(tokens) {
    if (!hasWindow())
        return;
    localStorage.setItem(ACCESS_KEY, tokens.access.token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh.token);
}
export function clearTokens() {
    if (!hasWindow())
        return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}
let refreshPromise = null;
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken)
        return null;
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
            return json.data.tokens.access.token;
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
async function doFetch(url, opts, token) {
    const headers = {};
    if (token)
        headers.Authorization = `Bearer ${token}`;
    let body;
    if (opts.formData) {
        body = opts.formData;
    }
    else if (opts.body !== undefined) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(opts.body);
    }
    return fetch(url, { method: opts.method || 'GET', headers, body });
}
export async function apiFetch(path, opts = {}) {
    const url = new URL(`${API_BASE}${path}`);
    if (opts.params) {
        Object.entries(opts.params).forEach(([key, value]) => {
            if (value !== undefined && value !== '')
                url.searchParams.set(key, String(value));
        });
    }
    let token = opts.auth ? getAccessToken() : null;
    let res = await doFetch(url.toString(), opts, token);
    if (res.status === 401 && opts.auth) {
        token = await refreshAccessToken();
        if (token)
            res = await doFetch(url.toString(), opts, token);
    }
    let json = null;
    try {
        json = await res.json();
    }
    catch {
        // no/invalid JSON body
    }
    if (!res.ok || (json && json.success === false)) {
        const message = (json && (typeof json.data === 'string' ? json.data : json.data?.message)) ||
            `Request failed (${res.status})`;
        throw new ApiError(res.status, message);
    }
    return (json ? json.data : undefined);
}
