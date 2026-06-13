// Centralized API client for the Flask backend (mental_health_journal, port 8001).
// Keeps the base URL in one place and attaches the JWT to every authenticated call.

export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:8001";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user"; // JSON: { userId, username }

export interface StoredUser {
  userId: number;
  username: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * fetch wrapper that prepends API_BASE, attaches the JWT (if present),
 * and defaults to JSON. Pass a path like "/chat" or "/api/diet/log".
 */
export async function authedFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // Flask session cookie (chat memory) + CORS
  });
}
