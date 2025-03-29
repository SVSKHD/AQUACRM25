import { create } from "zustand";
import { authService } from "@/services/api";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      // For demo purposes, we'll simulate a successful login
      // In production, this would make an actual API call
      if (email === "demo@aquakart.com" && password === "demo123") {
        set({
          isAuthenticated: true,
          user: { id: "1", email },
          loading: false,
          error: null,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const data = await authService.signUp(email, password);
      set({ isAuthenticated: true, user: data.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isAuthenticated: false, user: null, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      // For demo purposes, we'll check local storage
      // In production, this would verify with the backend
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
