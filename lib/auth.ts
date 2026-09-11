import { api } from "./api";

export interface LoginUser {
  id: string;
  email: string;
  role: string;
  profile?: {
    nama_lengkap?: string | null;
    nik?: string | null;
  } | null;
}

export interface LoginResponse {
  user: LoginUser;
  token: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role?: string;
  nama_lengkap?: string;
  nik?: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  profile: LoginUser["profile"];
}

export { ApiError } from "./api";

const TOKEN_KEY = "lsp_token";
const REFRESH_KEY = "lsp_refresh_token";
const USER_KEY = "lsp_user";

export const auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): LoginUser | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LoginUser;
    } catch {
      return null;
    }
  },

  saveSession(data: LoginResponse): void {
    window.localStorage.setItem(TOKEN_KEY, data.token);
    window.localStorage.setItem(REFRESH_KEY, data.refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },

  clearSession(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    this.saveSession(res);
    return res;
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    return api.post<LoginResponse>("/auth/register", payload);
  },

  async getProfile(): Promise<ProfileResponse> {
    return api.get<ProfileResponse>("/auth/profile");
  },

  logout(): void {
    this.clearSession();
  },
};

export default auth;