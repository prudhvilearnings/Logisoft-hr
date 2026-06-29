import { create } from 'zustand';
import type { AuthState, User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthActions {
  login: (user: User, token: string, refreshToken: string, rememberMe: boolean) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshSession: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions & { isLoading: boolean; error: string | null };

const getInitialState = () => {
  const token = localStorage.getItem('hrms_auth_token') || sessionStorage.getItem('hrms_auth_token');
  const userJson = localStorage.getItem('hrms_auth_user') || sessionStorage.getItem('hrms_auth_user');
  let user: User | null = null;
  
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      // Ignored
    }
  }

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    rememberMe: !!localStorage.getItem('hrms_auth_token'),
    isLoading: false,
    error: null as string | null,
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...getInitialState(),

  login: (user, token, refreshToken, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('hrms_auth_token', token);
    storage.setItem('hrms_auth_user', JSON.stringify(user));
    storage.setItem('hrms_refresh_token', refreshToken);
    
    // Fallback indicator for storage configurations
    localStorage.setItem('hrms_token_raw', token);

    set({
      user,
      token,
      isAuthenticated: true,
      rememberMe,
      error: null,
    });
  },

  logout: () => {
    localStorage.removeItem('hrms_auth_token');
    localStorage.removeItem('hrms_auth_user');
    localStorage.removeItem('hrms_refresh_token');
    localStorage.removeItem('hrms_token_raw');
    
    sessionStorage.removeItem('hrms_auth_token');
    sessionStorage.removeItem('hrms_auth_user');
    sessionStorage.removeItem('hrms_refresh_token');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      rememberMe: false,
      error: null,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  refreshSession: async () => {
    const currentRefreshToken = localStorage.getItem('hrms_refresh_token') || sessionStorage.getItem('hrms_refresh_token');
    if (!currentRefreshToken) {
      get().logout();
      return;
    }

    try {
      const response = await authService.refreshToken(currentRefreshToken);
      const currentUser = get().user;
      if (currentUser) {
        get().login(currentUser, response.token, response.refreshToken, get().rememberMe);
      }
    } catch (e) {
      console.error('Session refresh failed:', e);
      get().logout();
    }
  },
}));

export default useAuthStore;
