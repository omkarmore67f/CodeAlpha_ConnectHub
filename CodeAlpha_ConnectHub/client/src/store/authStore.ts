import { create } from 'zustand';
import type { User } from '../types';

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setSession: (user: User, token?: string | null) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('connecthub_token'),
  hydrated: false,
  setSession: (user, token) => {
    if (token) localStorage.setItem('connecthub_token', token);
    set({ user, token: token || localStorage.getItem('connecthub_token') });
  },
  clearSession: () => {
    localStorage.removeItem('connecthub_token');
    set({ user: null, token: null });
  },
  setHydrated: (hydrated) => set({ hydrated })
}));
